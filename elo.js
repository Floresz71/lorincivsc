# elo.py - Eredmény + gólszerzők MLSZ-ről -> elo.js
import json, re, requests
from pathlib import Path
from datetime import datetime, timezone, timedelta

ROOT = Path(__file__).resolve().parent
CURRENT = ROOT / "data" / "current_match.json"
OUT = ROOT / "elo.js"
HEADERS = {"User-Agent": "Mozilla/5.0 (LorinCiVSC-elo-bot)"}

def main():
    cur = json.loads(CURRENT.read_text(encoding="utf-8"))
    url = cur.get("match_url")
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    html = r.text

    m = re.search(r"(\d+)\s*-\s*(\d+)\s*-\s*MLSZ", html)
    if not m:
        m = re.search(r"Gólok.*?(\d+)\s*-\s*(\d+)", html, re.S)
    if not m:
        print("MLSZ-en még nincs eredmény")
        return

    hazai, vendeg = int(m.group(1)), int(m.group(2))
    dm = re.search(r"(\d{4}\.\d{2}\.\d{2})\s*-\s*(\d{2}:\d{2})", html)
    datum = dm.group(1) if dm else datetime.now().strftime("%Y.%m.%d")
    frissitve = datetime.now(timezone(timedelta(hours=1))).strftime("%Y.%m.%d %H:%M")

    # Gólszerzők: a "Gólok" és a "Csapatok" közti részből
    # Pl.: "64' NAGY BENCE GERGŐ"
    golok = []
    gsec = re.search(r"Gólok(.*?)Csapatok", html, re.S)
    if gsec:
        for perc, nev in re.findall(r"(\d+)'\s*([A-ZÁÉÍÓÖŐÚÜŰ][A-ZÁÉÍÓÖŐÚÜŰ \.\-]+?)(?:<|\n|$)", gsec.group(1)):
            nev = re.sub(r"<.*?>", "", nev).strip()
            # A Lőrinci gólszerzőket külön jelöljük, ha a név a Lőrinci keretben van
            # Egyszerűsítés: egyelőre minden gólt listázunk, csapat nélkül
            if len(nev) > 2:
                golok.append({"perc": int(perc), "nev": nev, "csapat": "vendeg"})

    # Megtartjuk a kiíró kódot is az elo.js-ben
    # A kiíró kódot külön fájlból olvassuk, ha van, különben csak az adatot írjuk
    elo_js = (
        '// Élő állás - automatikusan frissül MLSZ-ről (lásd elo.py).\n'
        f'window.ELO = {{ datum: "{datum}", hazai: {hazai}, vendeg: {vendeg}, '
        f'frissitve: "{frissitve}", golok: {json.dumps(golok, ensure_ascii=False)} }};\n'
    )
    # Ha már van kiíró kód az elo.js-ben, megtartjuk
    if OUT.exists():
        old = OUT.read_text(encoding="utf-8")
        marker = "// ===== GÓLSZERZŐK KIÍRÁSA"
        if marker in old:
            elo_js += old[old.index(marker):]
    OUT.write_text(elo_js, encoding="utf-8")
    print(f"OK: {hazai}-{vendeg}, gólok: {golok}")

if __name__ == "__main__":
    main()
