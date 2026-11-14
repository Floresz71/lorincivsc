
"""
Lőrinci VSC - automatikus összeállítás lehúzó MLSZ Adatbankból.
Használat:  python scripts/fetch_lineups.py --match-url "https://adatbank.mlsz.hu/match/...html"
            python scripts/fetch_lineups.py --match-id 2191326
            python scripts/fetch_lineups.py --auto   (a data/current_match.json-ból olvassa az URL-t)

Logika (a 2026.11.14-i Heréd-Lőrinci oldal alapján ellenőrizve):
- Az oldal "Csapatok" szekciójában csapatonként először a 11 kezdő jön
  (mezszám + név linkkel), utána a cserék.
- A stáb sorok ("NÉV - Edző / Masszőr / Technikai vezető") nem játékosok,
  azokat külön kezeljük, csak az Edző/Vezetőedző sort tesszük ki.
- Ha az MLSZ még nem töltötte fel a névsort, üres listát írunk,
  a frontend ilyenkor elrejti a dobozt.
"""
import argparse, json, re, sys
from pathlib import Path
import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "lineups.json"
CURRENT = ROOT / "data" / "current_match.json"
HEADERS = {"User-Agent": "Mozilla/5.0 (LorinCiVSC-lineups-bot; +https://floresz71.github.io/lorincivsc/)"}

def parse_team(section):
    players, staff = [], []
    # Minden sor: mezszám + név. A BeautifulSoup a táblázat celláiból szedi ki.
    for row in section.find_all("tr"):
        cells = [c.get_text(" ", strip=True) for c in row.find_all(["td", "th"])]
        cells = [c for c in cells if c]
        if not cells:
            continue
        text = " ".join(cells)
        # Stáb: "NÉV - Beosztás"
        if " - " in text and not re.match(r"^\d+\s", text):
            staff.append(text)
            continue
        m = re.match(r"^(\d+)\s+(.+)$", text)
        if m:
            players.append({"number": int(m.group(1)), "name": m.group(2).strip()})
    # Első 11 = kezdő, többi = csere (az MLSZ oldalán ez a sorrend)
    return {
        "starters": players[:11],
        "bench": players[11:],
        "staff": staff,
        "coach": next((s.split(" - ")[0].title() for s in staff
                       if "edző" in s.lower()), None),
    }

def fetch(url):
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    # Csapatnevek: az oldal tetején a "Heréd - Lőrinci" címsor, ill. a Csapatok szekció h2/h3 címei
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    m = re.match(r"(.+?)\s*-\s*(.+?)\s*-", title)
    home_name, away_name = (m.group(1).strip(), m.group(2).strip()) if m else ("Hazai", "Vendég")
    # A két csapat blokkja: a "Csapatok" utáni két táblázat-csoport.
    # Robusztus megközelítés: keressük meg az összes olyan táblázatot, ami mezszám+név sorokat tartalmaz,
    # és sorrendben az első kettő a két csapat.
    tables = []
    for tbl in soup.find_all("table"):
        rows = []
        for tr in tbl.find_all("tr"):
            cells = [c.get_text(" ", strip=True) for c in tr.find_all(["td", "th"])]
            cells = [c for c in cells if c]
            if cells:
                rows.append(" ".join(cells))
        if rows and sum(1 for x in rows if re.match(r"^\d+\s+\S", x)) >= 5:
            tables.append(tbl)
    if len(tables) < 2:
        return {"match": title, "match_url": url, "home": None, "away": None, "has_lineups": False}
    home = parse_team(tables[0]); away = parse_team(tables[1])
    home["team"], away["team"] = home_name, away_name
    return {"match": f"{home_name} - {away_name}", "match_url": url,
            "home": home, "away": away,
            "has_lineups": bool(home["starters"] and away["starters"])}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--match-url"); ap.add_argument("--match-id")
    ap.add_argument("--auto", action="store_true")
    args = ap.parse_args()
    url = args.match_url
    if args.match_id:
        # A meccs-azonosító az URL utolsó szegmense: .../2191326.html
        # A teljes URL-t a current_match.json-ból vesszük, csak az ID-t cseréljük.
        cur = json.loads(CURRENT.read_text(encoding="utf-8")) if CURRENT.exists() else {}
        base = cur.get("match_url", "")
        url = re.sub(r"/\d+\.html$", f"/{args.match_id}.html", base) if base else None
    if args.auto or not url:
        cur = json.loads(CURRENT.read_text(encoding="utf-8")) if CURRENT.exists() else {}
        url = cur.get("match_url")
    if not url:
        print("Nincs meccs-URL. Add meg: --match-url ... vagy töltsd ki data/current_match.json-t", file=sys.stderr)
        return 2
    data = fetch(url)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK: {data['match']} | kezdők: {len(data['home']['starters']) if data['home'] else 0} - {len(data['away']['starters']) if data['away'] else 0}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
