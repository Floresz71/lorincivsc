#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Lőrinci VSC – automatikus adatfrissítő (MLSZ adatbank -> adat.js + jegyzokonyv.js)

Mit csinál:
  1. Lekéri a Lőrinci felnőtt csapat MLSZ-oldalát (tabella + sorsolás).
  2. Ha van új, lejátszott meccs, lekéri a meccsoldalát (gólok, kezdőcsapatok, cserék, lapok, játékvezető).
  3. Frissíti az adat.js-t (utolsó/előző meccs + tabella) és új blokkot ír a jegyzokonyv.js-be.

Használat:
  python frissit.py              # frissít (a fájlok ugyanabban a mappában legyenek, ahol a szkript)
  python frissit.py --dry-run    # csak kiírja, mit változtatna
  python frissit.py --kenyszer   # a tabellát és az utolsó meccset mindenképp újraírja

Szükséges: Python 3.8+, requests, beautifulsoup4, lxml   (pip install requests beautifulsoup4 lxml)
A kézzel írt részek (edzői nyilatkozatok, góllövő-poszt lista stb.) a jegyzokonyv.js-ben MEGMARADNAK,
a szkript csak új fordulóblokkokat szúr be, meglévőt nem ír felül.
"""
import argparse
import datetime
import json
import os
import re
import sys
import time

try:
    import requests
except ImportError:  # offline teszthez nem kell
    requests = None
from bs4 import BeautifulSoup

# ------------------------------------------------------------------ beállítások
LEAGUE = "67/10/33860"          # Heves Vármegyei I. osztály 2026/27
TEAM_ID = 329440                # Lőrinci VSC
OUR = "Lőrinci VSC"
BASE = "https://adatbank.mlsz.hu"
HERE = os.path.dirname(os.path.abspath(__file__))
UA = {"User-Agent": "Mozilla/5.0 (compatible; LorinciVSC-frissito/1.0)", "Accept-Language": "hu"}


def club_url(rnd):
    return f"{BASE}/club/{LEAGUE}/{rnd}/{TEAM_ID}.html"


# ------------------------------------------------------------------ letöltés
def fetch(url, tries=3):
    last = None
    for i in range(tries):
        try:
            r = requests.get(url, headers=UA, timeout=40)
            r.encoding = "utf-8"
            if r.status_code == 200 and len(r.text) > 5000:
                return r.text
            last = f"HTTP {r.status_code}"
        except Exception as e:  # noqa
            last = str(e)
        time.sleep(2 + 3 * i)
    raise RuntimeError(f"Nem sikerült letölteni: {url} ({last})")


# ------------------------------------------------------------------ segédek
def txt(el):
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)) if el else ""


def tname(s):
    """MLSZ nagybetűs név -> Szép Név (Ács Ádám, Nagy-György Bálint)."""
    s = re.sub(r"\s+", " ", s or "").strip()
    return s.title()


def to_min(s):
    m = re.search(r"(\d+)", s or "")
    return int(m.group(1)) if m else None


def icon_kind(style):
    m = re.search(r"event_([a-z_]+)\.png", style or "")
    return m.group(1) if m else ""


# ------------------------------------------------------------------ tabella
def parse_table(html):
    b = BeautifulSoup(html, "lxml")
    best = None
    for t in b.find_all("table"):
        head = txt(t.find("tr"))
        if head.startswith("Hazai"):            # hazai/idegenbeli bontású résztáblák
            continue
        n = len(t.find_all("td", class_="prow"))
        if n and (best is None or n > best[0]):
            best = (n, t)
    rows = []
    if not best:
        return rows
    for tr in best[1].find_all("tr"):
        if not tr.find("td", class_="prow"):
            continue
        c = tr.find_all("td", recursive=False)
        pos = c[0]
        team = txt(c[2])
        nums = [int(txt(x)) for x in c[3:7]]
        lg, kg = int(txt(c[7])), int(txt(c[8]))
        pt = int(txt(tr.find("td", class_="prow")))
        forma = []
        tf = tr.find(class_="team_form")
        if tf:
            for d in tf.find_all("div"):
                t_ = txt(d)
                if t_ in ("GY", "D", "V"):
                    forma.append(t_)
        forma = list(reversed(forma))[-5:]          # a régebbitől az újabbig
        note = ""
        for x in c[10:13]:
            tt = txt(x)
            if tt and not tt.isdigit() and "Következő" not in tt and "forduló" not in tt:
                note = tt
        rows.append({"pos": int(txt(pos)), "team": team, "m": nums[0], "gy": nums[1], "d": nums[2], "v": nums[3],
                     "g": f"{lg}-{kg}", "p": pt, "forma": forma, "note": note})
    return rows


# ------------------------------------------------------------------ sorsolás (Lőrinci meccsek)
def parse_schedule(html, league=None):
    b = BeautifulSoup(html, "lxml")
    lg = re.escape(league or LEAGUE)
    out, seen = [], set()
    for d in b.find_all("div", class_="schedule"):
        ht, at = d.find(class_="home_team"), d.find(class_="away_team")
        if not ht or not at:
            continue
        mid = d.get("rel")
        if not mid or mid in seen:
            continue
        seen.add(mid)
        pts = d.find(class_="schedule-points")
        res = txt(pts) if pts else ""
        played = bool(re.match(r"^\d+\s*-\s*\d+$", res))
        href, rnd = "", None
        m = re.search(r'href="([^"]*/match/' + lg + r'/(\d+)/(\d+)\.html)"', str(d))
        if m:
            href, rnd = m.group(1), int(m.group(2))
        else:
            m2 = re.search(r"/club/" + lg + r"/(\d+)/\d+\.html", str(d))
            rnd = int(m2.group(1)) if m2 else None
        out.append({"id": mid, "home": txt(ht), "away": txt(at), "played": played,
                    "result": re.sub(r"\s*-\s*", "-", res) if played else None,
                    "href": href, "round": rnd, "datetext": txt(d.find(class_="team_sorsolas_date")),
                    "venue": txt(d.find(class_="team_sorsolas_arena"))})
    return out


# ------------------------------------------------------------------ meccsoldal
def parse_players(table):
    """kezdők / cserék táblázat -> sorok"""
    rows = []
    for tr in table.find_all("tr"):
        nm = tr.find("td", class_="match_players_name")
        if not nm:
            continue
        anchors = [a for a in nm.find_all("a") if "match_players_changeup" not in (a.get("class") or [])]
        name = tname(txt(anchors[0])) if anchors else tname(txt(nm))
        numtd = tr.find("td", class_="match_players_num")
        num = None
        if numtd:
            first = numtd.find("a", class_=lambda c: not c or "match_players_changeup" not in c)
            sp = (first or numtd).find(class_="playerNum")
            num = int(txt(sp)) if sp and txt(sp).isdigit() else None
        out_player = None
        ch = nm.find("a", class_="match_players_changeup")
        if ch:
            out_player = tname(txt(ch))
        ev = []
        cards = tr.find("td", class_="match_players_cards")
        if cards:
            for sp in cards.find_all("span"):
                ev.append((icon_kind(sp.get("style")), to_min(txt(sp))))
        rows.append({"num": num, "name": name, "out": out_player, "ev": ev})
    return rows


def parse_group(tables):
    """[kezdők, cserék, vezetőedző, stáb] -> csapat dict"""
    starters = parse_players(tables[0])
    subs = parse_players(tables[1]) if len(tables) > 1 else []
    edzo, sarga, piros = "", [], []
    if len(tables) > 2:
        c = tables[2].find("td", class_="match_table_coach")
        edzo = tname(txt(c)) if c and txt(c) else ""
        cards = tables[2].find("td", class_="match_players_cards")
        if cards and edzo:
            for sp in cards.find_all("span"):
                k, mn = icon_kind(sp.get("style")), to_min(txt(sp))
                if k == "redcard":
                    piros.append([f"{edzo} (vezetőedző)", mn])
                elif k == "yellowcard":
                    sarga.append([f"{edzo} (vezetőedző)", mn])
    stab = []
    if len(tables) > 3:
        for td in tables[3].find_all("td", class_="match_players_name"):
            s = re.sub(r"\s+", " ", td.get_text(" ", strip=True))
            if s:
                nm, _, role = s.partition(" - ")
                stab.append(tname(nm) + (" - " + role if role else ""))
    kezdo = [[p["num"], p["name"]] for p in starters]
    pad = [[p["num"], p["name"]] for p in subs]
    cserek = []
    for p in subs:
        for k, mn in p["ev"]:
            if k == "swap" and p["out"]:
                cserek.append([mn, p["out"], p["name"]])
    cserek.sort(key=lambda x: x[0])
    for p in starters + subs:
        for k, mn in p["ev"]:
            if k == "yellowcard":
                sarga.append([p["name"], mn])
            elif k == "redcard":
                piros.append([p["name"], mn])
    # a játékos-lapok időrendben, a kézi kulcsok sorrendje: sárga lapok percre rendezve
    sarga.sort(key=lambda x: (x[1] is None, x[1]))
    piros.sort(key=lambda x: (x[1] is None, x[1]))
    return {"edzo": edzo, "stab": stab, "kezdo": kezdo, "pad": pad, "cserek": cserek, "sarga": sarga, "piros": piros}


def parse_match(html, our=OUR):
    b = BeautifulSoup(html, "lxml")
    title = txt(b.find("title"))
    m = re.match(r"^(.*?) - (.*?) (\d+) - (\d+) - MLSZ", title)
    if not m:
        raise RuntimeError("A meccs címe nem értelmezhető: " + title)
    home, away, gh, ga = m.group(1), m.group(2), int(m.group(3)), int(m.group(4))
    h1 = txt(b.find(id="headerText"))
    rnd = int(re.search(r"(\d+)\.\s*forduló", h1).group(1))
    dt = txt(b.find(class_="match_data_date"))
    dm = re.search(r"(\d{4})\.(\d{2})\.(\d{2})\s*-\s*(\d{1,2}):(\d{2})", dt)
    datum = f"{dm.group(1)}.{dm.group(2)}.{dm.group(3)}"
    ido = f"{int(dm.group(4)):02d}:{dm.group(5)}"
    loc = b.find("input", id="hiddenLocation")
    venue = (loc.get("value") if loc else "").strip()
    mr = b.find(class_="match-result")
    half = ""
    if mr and mr.find("p"):
        hm = re.search(r"(\d+)\s*-\s*(\d+)", txt(mr.find("p")))
        half = f"{hm.group(1)}-{hm.group(2)}" if hm else ""
    # játékvezető, asszisztensek
    jv, assz = "", []
    for dn in b.find_all("div", class_="dataname"):
        lab = txt(dn)
        val = dn.find_next_sibling(class_="datas")
        if not val:
            continue
        if lab == "Játékvezető":
            jv = tname(txt(val))
        elif lab == "Asszisztensek":
            assz = [tname(x) for x in re.split(r"[\n,]+", val.get_text("\n", strip=True)) if x.strip()]
    # táblázatok: események + két csapat (kezdők, cserék, vezetőedző, stáb)
    events = None
    groups, cur = [], None
    for t in b.find_all("table"):
        if events is None and t.find("td", class_="goals_intimes") is not None:
            events = t
            continue
        sh = t.find(class_="match_table_subhead")
        shtxt = txt(sh).upper() if sh else ""
        if shtxt.startswith(("CSERÉK", "VEZETŐEDZŐ", "STÁBTAGOK")):
            if cur is not None:
                cur.append(t)
        elif t.find("td", class_="match_players_name") is not None:
            cur = [t]                      # új csapat kezdőcsapata
            groups.append(cur)
    if len(groups) < 2:
        raise RuntimeError("Nem találom a két csapat összeállítását az oldalon.")
    gh_, ga_ = parse_group(groups[0]), parse_group(groups[1])
    # gólok
    golok = []
    if events is not None:
        for tr in events.find_all("tr"):
            sc = tr.find("td", class_="goals_intimes")
            if not sc:
                continue
            allas = re.sub(r"\s*-\s*", "-", txt(sc))
            for cls, side_is_home in (("left_team_player", True), ("right_team_player", False)):
                td = tr.find("td", class_=cls)
                if not td:
                    continue
                a = td.find("a")
                if not a:
                    continue
                mn = None
                for p in td.find_all("p"):
                    if re.search(r"\d+'", txt(p)):
                        mn = to_min(txt(p))
                kind = ""
                sp = td.find("span", style=True)
                if sp:
                    kind = icon_kind(sp.get("style"))
                team = home if side_is_home else away
                golok.append({"perc": mn, "jatekos": tname(txt(a)), "csapat": team, "allas": allas, "tipus": kind})
    we_home = (home == our)
    res = {
        "fordulo": rnd, "datum": datum, "ido": ido, "hazai": we_home, "eredmeny": f"{gh}-{ga}", "felido": half,
        "ellenfel_nev": away if we_home else home, "helyszin": venue, "jv": jv, "asszi": assz,
        "golok": golok, "home": home, "away": away,
        "lor": gh_ if we_home else ga_, "ell": ga_ if we_home else gh_,
    }
    return res


# ------------------------------------------------------------------ JS kimenet
def L(x):
    return json.dumps(x, ensure_ascii=False)


def phrase(r):
    haz = r["hazai"]
    a, b = map(int, r["eredmeny"].split("-"))
    l, e = (a, b) if haz else (b, a)
    opp = r["ellenfel_nev"]
    pre = "Hazai pályán" if haz else "Idegenben"
    if l > e:
        m = f"{l}-{e} arányban győzött a Lőrinci a {opp} ellen."
    elif l < e:
        m = f"{l}-{e} arányban kikapott a Lőrinci a {opp} ellen."
    else:
        m = f"{l}-{e} lett a végeredmény a {opp} ellen."
    return pre + " " + m


def osszefoglalo(r):
    t = [phrase(r)]
    if r["felido"]:
        t.append(f"A félidei állás {r['felido']} volt.")
    g = [f"{x['perc']}' {x['jatekos']}" for x in r["golok"]]
    if g:
        t.append("Gólok: " + ", ".join(g) + ".")
    for sd, nev in ((r["lor"], "Lőrinci"), (r["ell"], r["ellenfel_nev"])):
        if sd["piros"]:
            t.append(f"Piros lapot kapott a {nev}-nél: " + ", ".join(f"{n} ({p}')" for n, p in sd["piros"]) + ".")
    ls, es = len(r["lor"]["sarga"]), len(r["ell"]["sarga"])
    if ls or es:
        parts = []
        if ls:
            parts.append(f"a Lőrinci {ls}")
        if es:
            parts.append(f"a {r['ellenfel_nev']} {es}")
        t.append("Sárga lapot kapott " + ", ".join(parts) + " játékos.")
    t.append(f"A Lőrinci {len(r['lor']['cserek'])}, az ellenfél {len(r['ell']['cserek'])} cserét hajtott végre.")
    return " ".join(t)


def adat_obj(r, link):
    opp = r["ellenfel_nev"]
    home, away = (OUR, opp) if r["hazai"] else (opp, OUR)
    fejlec = f"{home} {r['eredmeny']} {away}"
    golok, gs = [], []
    for x in r["golok"]:
        lor = (x["csapat"] == OUR)
        golok.append({"perc": x["perc"], "jatekos": x["jatekos"], "csapat": x["csapat"], "allas": x["allas"]})
        gs.append(f"{x['perc']}' {x['jatekos']} ({x['allas']}" + (")" if lor else f", {opp})"))
    return {"fordulo": r["fordulo"], "datum": r["datum"], "hazai": r["hazai"], "eredmeny": r["eredmeny"],
            "ellenfel": opp.upper(), "ellenfel_nev": opp, "alcim": fejlec.upper(), "fejlec": fejlec,
            "helyszin": r["helyszin"], "golok": golok, "gollovok": ", ".join(gs), "link": link}


def block_text(r, link):
    adat = adat_obj(r, link)
    lorg = [x["jatekos"] for x in r["golok"] if x["csapat"] == OUR]

    def side(sd, nev):
        return {"nev": nev, "edzo": sd["edzo"], "stab": sd["stab"], "kezdo": sd["kezdo"], "pad": sd["pad"],
                "cserek": sd["cserek"], "sarga": sd["sarga"], "piros": sd["piros"]}
    return f""" {r['fordulo']}: {{
  adat: {L(adat)},
  lorGolok: {L(lorg)},
  ido: {L(r['ido'])}, felido: {L(r['felido'])},
  jv: {L(r['jv'])}, asszisztensek: {L(r['asszi'])},
  edzoiLor: null, edzoiEll: null,
  osszefoglalo: {L(osszefoglalo(r))},
  lor: {L(side(r['lor'], OUR))},
  ell: {L(side(r['ell'], r['ellenfel_nev']))}
 }}"""


# ------------------------------------------------------------------ fájlok
def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def write(path, s):
    with open(path, "w", encoding="utf-8") as f:
        f.write(s)


def load_adat(path):
    src = read(path)
    m = re.search(r"window\.ADAT\s*=\s*(\{.*\});", src, re.S)
    head = src[:m.start()]
    return json.loads(m.group(1)), head


def adat_src(d, head):
    return head + "window.ADAT = " + json.dumps(d, ensure_ascii=False, indent=1) + ";\n"


def known_match_ids(jkv_src, adat):
    ids = set(re.findall(r"/match/[\d/]+/(\d+)\.html", jkv_src))
    for k in ("utolso", "elozo"):
        if adat.get(k, {}).get("link"):
            ids |= set(re.findall(r"/(\d+)\.html", adat[k]["link"]))
    return ids


def known_rounds(jkv_src):
    return set(int(x) for x in re.findall(r"\n (\d+): \{", jkv_src))


def insert_block(jkv_src, block):
    marker = "window.JKV = {\n"
    i = jkv_src.index(marker) + len(marker)
    return jkv_src[:i] + block + ",\n" + jkv_src[i:]


def sorsolas_from(sched):
    """A hátralévő lőrinci meccsek (adat.js "sorsolas" mező) – a következő meccs és a menetrend ebből épül."""
    out = []
    for s in sched:
        if s["played"] or not s["round"]:
            continue
        m = re.match(r"(\d{4})\.\s*(\d{2})\.\s*(\d{2})\.\s*(\d{1,2}):(\d{2})", s["datetext"] or "")
        if not m:
            continue
        haz = (s["home"] == OUR)
        out.append({"fordulo": s["round"], "datum": f"{m.group(1)}.{m.group(2)}.{m.group(3)}",
                    "ido": f"{int(m.group(4)):02d}:{m.group(5)}", "hazai": haz,
                    "ellenfel_nev": s["away"] if haz else s["home"], "helyszin": s["venue"]})
    out.sort(key=lambda x: x["datum"])
    return out


def table_rows_for_adat(rows, old_rows):
    old = {r["team"]: r for r in old_rows}
    out = []
    for r in rows:
        o = dict(old.get(r["team"], {}))
        o.update({"pos": r["pos"], "team": r["team"], "m": r["m"], "gy": r["gy"], "d": r["d"], "v": r["v"],
                  "g": r["g"], "p": r["p"], "forma": r["forma"]})
        if re.search(r"lőrinci", r["team"], re.I):
            o["highlight"] = True
        if r.get("note"):
            o["megjegyzes"] = r["note"]
        out.append(o)
    return out


# ------------------------------------------------------------------ fő logika
def run(folder, dry=False, force=False, getter=None, log=print):
    getter = getter or fetch
    adat_p, jkv_p = os.path.join(folder, "adat.js"), os.path.join(folder, "jegyzokonyv.js")
    adat, head = load_adat(adat_p)
    jkv = read(jkv_p)
    last = int(adat["utolso"]["fordulo"])
    known = known_match_ids(jkv, adat)

    # 1) a legfrissebb csapatoldal (a tabella ott érvényes az adott fordulóig)
    best = None
    for rnd in range(max(1, last), last + 4):
        html = getter(club_url(rnd))
        rows = parse_table(html)
        if len(rows) < 6:
            raise RuntimeError(f"A tabella nem olvasható ({rnd}. forduló oldala).")
        tot = sum(r["m"] for r in rows)
        log(f"  {rnd}. forduló oldala: {len(rows)} csapat, {tot} lejátszott meccs a tabellán")
        if best is None or tot > best["tot"]:
            best = {"rnd": rnd, "html": html, "rows": rows, "tot": tot}
        else:
            break
    sched = [s for s in parse_schedule(best["html"]) if OUR in (s["home"], s["away"])]
    new = [s for s in sched if s["played"] and s["id"] not in known and s["href"]]
    new.sort(key=lambda s: (s["round"] or 0))
    log(f"  új, lejátszott lőrinci meccs: {len(new)}")

    changed = False
    blocks = []
    for s in new:
        html = getter(s["href"])
        r = parse_match(html)
        link = s["href"]
        if r["fordulo"] in known_rounds(jkv):
            log(f"  figyelem: a(z) {r['fordulo']}. forduló blokkja már létezik, kihagyom")
            continue
        blk = block_text(r, link)
        jkv = insert_block(jkv, blk)
        blocks.append((r, link))
        log(f"  + {r['fordulo']}. forduló: {r['home']} {r['eredmeny']} {r['away']} ({r['datum']})")
        changed = True

    # 2) adat.js: utolsó/előző meccs + tabella
    newest = None
    if blocks:
        newest = max(blocks, key=lambda x: x[0]["datum"])
        r, link = newest
        prev = adat["utolso"]
        if r["datum"] > prev["datum"]:
            adat["elozo"] = prev
            adat["utolso"] = adat_obj(r, link)
            # ha több új meccs volt, az "előző" a második legfrissebb
            if len(blocks) > 1:
                second = sorted(blocks, key=lambda x: x[0]["datum"])[-2]
                if second[0]["datum"] > prev["datum"]:
                    adat["elozo"] = adat_obj(second[0], second[1])
        changed = True
    sor = sorsolas_from(sched)
    if sor and sor != adat.get("sorsolas"):
        adat["sorsolas"] = sor
        changed = True
        log(f"  menetrend frissítve ({len(sor)} hátralévő meccs)")
    old_rows = adat["tabla"]["sorok"]
    new_rows = table_rows_for_adat(best["rows"], old_rows)
    sig = lambda rows: [(x["team"], x["m"], x["g"], x["p"], tuple(x.get("forma", []))) for x in rows]
    if force or sig(new_rows) != sig(old_rows):
        adat["tabla"] = {"fordulo": max(best["rnd"], int(adat["utolso"]["fordulo"])), "eredmeny": adat["utolso"]["eredmeny"], "sorok": new_rows}
        changed = True
        log("  tabella frissítve")
    if changed:
        adat["frissitve"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M") + " (automatikus frissítés az MLSZ adatbankból)"
        if dry:
            log("  (dry-run: nem írok fájlt)")
        else:
            write(adat_p, adat_src(adat, head))
            write(jkv_p, jkv)
            log("  adat.js és jegyzokonyv.js frissítve")
    else:
        log("  nincs új adat")
    return changed



# ================================================================== IFJÚSÁGI CSAPATOK (U21, U16, U13) -> ifjusagi.js
YOUTH = {
    "u21": {"league": "67/10/33866", "team": 331297, "table": True},
    "u16": {"league": "67/10/34159", "team": 331503, "table": True},
    "u13": {"league": "67/10/34162", "team": 331589, "table": False},   # az U13 ligában nincs hivatalos tabella
}

IFJ_HEADER = """// Ifjúsági eredmények és tabellák a Hírek és a Csapat oldalhoz (U21, U16, U13).
// Ezt a fájlt a frissit.py automatikusan írja az MLSZ adatbankból (meccsek, eredmények, tabellák).
// KÉZZEL megadható, és a frissítés MEGTARTJA: a meccsek "gollovok" (lőrinci gólszerzők) és "megjegyzes" mezője
// (a meccset a "datum" azonosítja). Minden más mezőt a szkript felülír.
// Mezők: datum (ÉÉÉÉ.HH.NN), ido, fordulo, ellenfel, hazai (true = otthon), eredmeny ("3-1", a mérkőzés sorrendjében; üres = még nincs),
//        helyszin, gollovok, megjegyzes.
// Forrás: MLSZ adatbank – U21: https://adatbank.mlsz.hu/league/67/10/33866/1.html
//                          U16 Nyugat: https://adatbank.mlsz.hu/league/67/10/34159/1.html
//                          U13 Nyugat: https://adatbank.mlsz.hu/league/67/10/34162/1.html
"""


def ifj_club_url(cfg, rnd):
    return f"{BASE}/club/{cfg['league']}/{rnd}/{cfg['team']}.html"


def load_ifj(path):
    """Beolvassa a meglévő ifjusagi.js-t (JSON-stílus; régi JS-stílusnál node-dal alakítja át, ha van)."""
    if not os.path.exists(path):
        return {}, {}
    src = read(path)

    def after(marker):
        i = src.find(marker)
        if i < 0:
            return None
        try:
            obj, _ = json.JSONDecoder().raw_decode(src[i + len(marker):].lstrip())
            return obj
        except Exception:
            return None
    ifj, tab = after("window.IFJ ="), after("window.IFJ_TABLA =")
    if ifj is None or tab is None:
        try:   # régi (JS-objektum) formátum
            import subprocess
            code = "global.window={};eval(require('fs').readFileSync(process.argv[1],'utf8'));process.stdout.write(JSON.stringify({a:window.IFJ,b:window.IFJ_TABLA}))"
            out = subprocess.run(["node", "-e", code, path], capture_output=True, text=True, timeout=30).stdout
            d = json.loads(out)
            ifj, tab = d.get("a") or {}, d.get("b") or {}
        except Exception:
            ifj, tab = {}, {}
    return ifj or {}, tab or {}


def dump_tabla(tab):
    parts = []
    for k, v in tab.items():
        rows = ",\n   ".join(json.dumps(r, ensure_ascii=False) for r in v.get("rows", []))
        meta = {x: y for x, y in v.items() if x != "rows"}
        meta_s = ", ".join(f'{json.dumps(x)}: {json.dumps(y, ensure_ascii=False)}' for x, y in meta.items())
        parts.append(f' {json.dumps(k)}: {{ {meta_s}, "rows": [\n   {rows}\n ]}}')
    return "{\n" + ",\n".join(parts) + "\n}"


def dump_ifj(ifj):
    parts = []
    for k, lst in ifj.items():
        items = ",\n  ".join(json.dumps(e, ensure_ascii=False) for e in lst)
        parts.append(f' {json.dumps(k)}: [\n  {items}\n ]')
    return "{\n" + ",\n".join(parts) + "\n}"


def ifj_entries(sched, old):
    olds = {e.get("datum"): e for e in old}
    out = []
    for s in sched:
        m = re.match(r"(\d{4})\.\s*(\d{2})\.\s*(\d{2})\.\s*(\d{1,2}):(\d{2})", s["datetext"] or "")
        if not m:
            continue
        datum = f"{m.group(1)}.{m.group(2)}.{m.group(3)}"
        haz = (s["home"] == OUR)
        o = olds.get(datum, {})
        out.append({"datum": datum, "ido": f"{int(m.group(4)):02d}:{m.group(5)}", "fordulo": s["round"] if s["round"] else "",
                    "ellenfel": s["away"] if haz else s["home"], "hazai": haz, "eredmeny": s["result"] or "",
                    "helyszin": s["venue"], "gollovok": o.get("gollovok", ""), "megjegyzes": o.get("megjegyzes", "")})
    out.sort(key=lambda e: (e["datum"], e["ido"]))
    return out


def own_record(entries):
    """Az U13-hoz: a Lőrinci saját mérlege a lejátszott meccsekből."""
    m = gy = d = v = gf = ga = 0
    forma = []
    for e in entries:
        mm = re.match(r"^(\d+)-(\d+)$", e["eredmeny"] or "")
        if not mm:
            continue
        a, b = int(mm.group(1)), int(mm.group(2))
        l, k = (a, b) if e["hazai"] else (b, a)
        m += 1
        gf += l
        ga += k
        if l > k:
            gy += 1
            forma.append("GY")
        elif l < k:
            v += 1
            forma.append("V")
        else:
            d += 1
            forma.append("D")
    return [f"{OUR} U13", m, gy, d, v, f"{gf}-{ga}", gy * 3 + d, " ".join(forma[-5:])]


def run_ifj(folder, dry=False, getter=None, log=print, force=False):
    getter = getter or fetch
    path = os.path.join(folder, "ifjusagi.js")
    ifj, tab = load_ifj(path)
    new_ifj, new_tab, changed = {}, {}, False
    for key, cfg in YOUTH.items():
        log(f"[{key.upper()}]")
        start = max(1, int((tab.get(key) or {}).get("fordulo", 1) or 1))
        best = None
        for rnd in range(start, start + 4):
            html = getter(ifj_club_url(cfg, rnd))
            rows = parse_table(html) if cfg["table"] else []
            tot = sum(r["m"] for r in rows) if rows else len([s for s in parse_schedule(html, cfg["league"]) if s["played"]])
            log(f"  {rnd}. forduló oldala: {tot} lejátszott meccs")
            if best is None or tot > best["tot"]:
                best = {"rnd": rnd, "html": html, "rows": rows, "tot": tot}
            else:
                break
        sched = [s for s in parse_schedule(best["html"], cfg["league"]) if OUR in (s["home"], s["away"])]
        if not sched:
            raise RuntimeError(f"{key}: nem találom a menetrendet az oldalon")
        entries = ifj_entries(sched, ifj.get(key, []))
        new_ifj[key] = entries
        played_rounds = [e["fordulo"] for e in entries if e["eredmeny"] and isinstance(e["fordulo"], int)]
        fordulo = max([best["rnd"]] + played_rounds)
        if cfg["table"]:
            if len(best["rows"]) < 4:
                raise RuntimeError(f"{key}: a tabella nem olvasható")
            rows = [[r["team"], r["m"], r["gy"], r["d"], r["v"], r["g"], r["p"], " ".join(r["forma"])] for r in best["rows"]]
            new_tab[key] = {"fordulo": fordulo, "rows": rows}
        else:
            new_tab[key] = {"fordulo": fordulo, "nincsSorrend": True,
                            "felirat": "Hivatalos tabella nincs – a Lőrinci mérlege", "rows": [own_record(entries)]}
        n_played = len([e for e in entries if e["eredmeny"]])
        log(f"  {len(entries)} meccs, ebből {n_played} lejátszott; tabella: {fordulo}. forduló")
    if force or new_ifj != ifj or new_tab != tab:
        text = (IFJ_HEADER + "window.IFJ = " + dump_ifj(new_ifj) + ";\n\n"
                + "// ===== window.IFJ_TABLA – tabellák =====\n// Sor: [csapat, M, Gy, D, V, \"lőtt-kapott\", pont, \"forma (régebbitől az újabbig)\"]\n"
                + "window.IFJ_TABLA = " + dump_tabla(new_tab) + ";\n")
        changed = True
        if dry:
            log("  (dry-run: nem írok fájlt)")
        else:
            write(path, text)
            log("  ifjusagi.js frissítve")
    else:
        log("  nincs új ifjúsági adat")
    return changed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--kenyszer", action="store_true")
    ap.add_argument("--mappa", default=HERE)
    ap.add_argument("--csak", choices=["felnott", "ifjusagi"], help="csak az egyik részt frissítse")
    a = ap.parse_args()
    if requests is None:
        sys.exit("Hiányzik a 'requests' csomag: pip install requests beautifulsoup4 lxml")
    rc = 0
    if a.csak in (None, "felnott"):
        try:
            print("[FELNŐTT]")
            run(a.mappa, dry=a.dry_run, force=a.kenyszer)
        except Exception as e:  # noqa
            print("HIBA (felnőtt):", e)
            rc = 1
    if a.csak in (None, "ifjusagi"):
        try:
            run_ifj(a.mappa, dry=a.dry_run, force=a.kenyszer)
        except Exception as e:  # noqa
            print("HIBA (ifjúsági):", e)
            rc = 1
    sys.exit(rc)


if __name__ == "__main__":
    main()
