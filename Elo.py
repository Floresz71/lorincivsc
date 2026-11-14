# elo.py - Eredmény + gólszerzők + HÍREK (utolsó 2 meccs) MLSZ-ről
# Futtatás: GitHub Actions, 3 percenként meccsnapon.
# - Az aktuális meccs URL-jét a data/current_match.json-ból veszi.
# - Az elo.js-t csak a <title>-ből lévő eredménnyel írja át.
# - A data/hirek.json-t (utolsó 2 lejátszott meccs) history alapon építi:
#   minden lefutáskor, ha van végeredmény, beleteszi a data/history.json-ba,
#   és onnan veszi az utolsó 2-t. Így nem kell a "Meccsek" táblát parse-olni.
import json, re, requests
from pathlib import Path
from datetime import datetime, timezone, timedelta

ROOT = Path(__file__).resolve().parent
CURRENT = ROOT / "data" / "current_match.json"
HISTORY = ROOT / "data" / "history.json"
TABELLA = ROOT / "data" / "tabella.json"
HIREK = ROOT / "data" / "hirek.json"
OUT = ROOT / "elo.js"
HEADERS = {"User-Agent": "Mozilla/5.0 (LorinCiVSC-elo-bot)"}
MARKER = "// ===== EREDMÉNY + GÓLSZERZŐK KIÍRÁSA ====="
CUP_FILE = ROOT / "data" / "cup.json"
# KUPAMECCS - MLSZ: MOL Magyar Kupa 1. forduló, 2026.08.01, FC Hatvan 3-2 Lőrinci
# Ez itt van az elo.py-ban is, hogy az elo.py minden futáskor újra tudja generálni,
# akkor is, ha az elo.js alját valaki kitörli.
CUP_MATCH = {
    "datum": "2026.08.01", "ido": "16:00",
    "hazai": "FC Hatvan", "vendeg": "Lőrinci VSC", "eredmeny": "3-2",
    "helyszin": "Hatvani Népkert Sporttelep",
    "kiir": "MOL Magyar Kupa - 1. forduló",
    "mlsz_url": "https://adatbank.mlsz.hu/match/67/0/33589/1/2187164.html",
    "golok": "4' Szeles Patrik (0-1), 7' Királyházi Márton (1-1), 22' Kitl Krisztián (2-1), 65' Belák Bertold (2-2), 82' Királyházi Márton (3-2)"
}

def load_json(p, default):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return default

def main():
    cur = load_json(CURRENT, {})
    url = cur.get("match_url")
    if not url:
        print("Nincs match_url")
        return
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    html = r.text

    tm = re.search(r"<title>(.*?)</title>", html, re.S | re.I)
    title = tm.group(1) if tm else ""
    m = re.search(r"(\d+)\s*-\s*(\d+)\s*-\s*MLSZ", title)
    if not m:
        print(f"Nincs eredmény a title-ben: {title[:120]}")
        return
    hazai, vendeg = int(m.group(1)), int(m.group(2))

    # Védelem: ne írjunk vissza 0-0-ra
    if OUT.exists():
        old = OUT.read_text(encoding="utf-8")
        om = re.search(r"hazai:\s*(\d+),\s*vendeg:\s*(\d+)", old)
        if om and hazai == 0 and vendeg == 0 and (int(om.group(1)) != 0 or int(om.group(2)) != 0):
            print("Védelem: nem írom vissza 0-0-ra")
            return

    dm = re.search(r"(\d{4}\.\d{2}\.\d{2})\s*-\s*(\d{2}:\d{2})", html)
    datum = dm.group(1) if dm else datetime.now().strftime("%Y.%m.%d")
    frissitve = datetime.now(timezone(timedelta(hours=1))).strftime("%Y.%m.%d %H:%M")

    # Csapatnevek a title-ből: "Heréd-Kistigrisek LC - Lőrinci VSC 0 - 1"
    nm = re.search(r"^(.*?)\s*-\s*(.*?)\s+\d+\s*-\s*\d+\s*-\s*MLSZ", title)
    hazai_nev = nm.group(1).strip() if nm else "Hazai"
    vendeg_nev = nm.group(2).strip() if nm else "Vendég"

    golok = []
    gsec = re.search(r"Gólok(.*?)Csapatok", html, re.S)
    if gsec:
        for perc, nev in re.findall(r"(\d+)'\s*([A-ZÁÉÍÓÖŐÚÜŰ][A-ZÁÉÍÓÖŐÚÜŰ \.\-]+?)(?:<|\n|$)", gsec.group(1)):
            nev = re.sub(r"<.*?>", "", nev).strip()
            if len(nev) > 2:
                golok.append({"perc": int(perc), "nev": nev, "csapat": "vendeg"})

    # --- HISTORY: utolsó meccsek gyűjtése ---
    history = load_json(HISTORY, [])
    # Csak akkor vesszük be, ha van dátum + eredmény, és még nincs benne ez a meccs
    key = f"{datum}|{hazai_nev}-{vendeg_nev}"
    if not any(h.get("key") == key for h in history):
        # Lőrinci szempontjából: győz / vereség / döntetlen
        lorinci_hazai = "Lőrinci" in hazai_nev
        lg = hazai if lorinci_hazai else vendeg
        kg = vendeg if lorinci_hazai else hazai
        tipus = "GYŐZELEM" if lg > kg else ("VERESÉG" if lg < kg else "DÖNTETLEN")
        history.append({
            "key": key, "datum": datum, "hazai": hazai_nev, "vendeg": vendeg_nev,
            "hazai_gol": hazai, "vendeg_gol": vendeg, "tipus": tipus,
            "golok": golok, "mlsz_url": url
        })
        # Dátum szerint rendezzük, csak az utolsót tartjuk meg bőven
        history = sorted(history, key=lambda x: x["datum"])[-10:]
        HISTORY.write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"History +1: {key} {hazai}-{vendeg}")

    # HÍREK = utolsó 2, legfrissebb elöl
    hirek = list(reversed(history[-2:]))
    HIREK.write_text(json.dumps(hirek, ensure_ascii=False, indent=2), encoding="utf-8")

    # --- TABELLA: az MLSZ meccsoldal "TABELLA" részéből ---
    try:
        # A meccsoldal HTML-jében a tabella <table>-ben van: H. | Csapat | M | Gy | D | V | LG | KG | GK | P
        # Sorokat <tr> alapján szedjük, cellákat <td> alapján
        tabella = []
        # Csak a TABELLA szó utáni részt nézzük, hogy ne keverjük a Meccsek táblával
        tstart = html.find("TABELLA")
        thtml = html[tstart:] if tstart != -1 else html
        for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", thtml, re.S | re.I):
            cells = [re.sub(r"<[^>]+>", "", c).strip() for c in re.findall(r"<td[^>]*>(.*?)</td>", tr, re.S | re.I)]
            # cells: [helyezés, (kép), csapat, M, Gy, D, V, LG, KG, GK, P, ...]
            # A csapatnév a 2. vagy 3. cellában van a képek miatt
            if len(cells) < 9:
                continue
            # Helyezés: első numerikus cella
            try:
                h = int(cells[0])
            except Exception:
                continue
            # Csapat: az első olyan cella, ami betűt tartalmaz és nem szám
            csapat = ""
            nums = []
            for c in cells[1:]:
                cc = c.replace("\u00a0", " ").strip()
                if cc and not re.fullmatch(r"[\d\-\+\.]+", cc) and len(cc) > 2 and "Csapat" not in cc:
                    if not csapat:
                        csapat = cc
                    continue
                # számok a csapat után
                if csapat:
                    try:
                        nums.append(int(cc))
                    except Exception:
                        pass
            if not csapat or len(nums) < 7:
                continue
            # nums: M, Gy, D, V, LG, KG, GK, P  (GK lehet negatív)
            tabella.append({"h": h, "csapat": csapat, "m": nums[0], "gy": nums[1], "d": nums[2], "v": nums[3], "lg": nums[4], "kg": nums[5], "gk": nums[6], "p": nums[7] if len(nums) > 7 else 0})
        # Duplikáció szűrés (a meccsoldalon 3x szerepel a tabella: összes / hazai / idegen / forma)
        # Csak az első 12 egyedi csapatot tartjuk meg, helyezés szerint
        seen = {}
        for r in tabella:
            if r["csapat"] not in seen:
                seen[r["csapat"]] = r
        tabella = sorted(seen.values(), key=lambda x: x["h"])[:14]
        if len(tabella) >= 8:
            TABELLA.write_text(json.dumps(tabella, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"Tabella OK: {len(tabella)} csapat")
        else:
            print(f"Tabella: csak {len(tabella)} sor, nem írom felül")
    except Exception as e:
        print(f"Tabella hiba: {e}")

    # --- CUP.JSON: mindig legyen meg, akkor is ha kitörölték ---
    CUP_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not CUP_FILE.exists():
        CUP_FILE.write_text(json.dumps(CUP_MATCH, ensure_ascii=False, indent=2), encoding="utf-8")
        print("cup.json létrehozva")

    # --- ELO.JS ---
    old_code = ""
    if OUT.exists():
        old = OUT.read_text(encoding="utf-8")
        if MARKER in old:
            old_code = old[old.index(MARKER):]
    OUT.write_text(
        '// Élő állás - automatikusan frissül MLSZ-ről (lásd elo.py).\n'
        f'window.ELO = {{ datum: "{datum}", hazai: {hazai}, vendeg: {vendeg}, '
        f'frissitve: "{frissitve}", golok: {json.dumps(golok, ensure_ascii=False)} }};\n\n'
        + old_code,
        encoding="utf-8"
    )
    print(f"OK: {hazai}-{vendeg}, hirek: {len(hirek)}")

if __name__ == "__main__":
    main()
