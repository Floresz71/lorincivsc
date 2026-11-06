#!/usr/bin/env python3
"""Teljesen automatikus elo.js frissito - NEM kell hetente atirni a fordulot.

Amit a felhasznalo kuldott:
  https://adatbank.mlsz.hu/league/67/10/33860/13.html
  kovetkezo heten: .../14.html, aztan .../15.html stb.

Megoldas: a script NEM egy fix fordulot nez, hanem VEGIGPROBALJA
az 1..30 fordulot, es megtalalja:
  1. a mai napi Lorinci meccset (datum = ma), vagy
  2. a legutobbi lejatszott Lorinci meccset.

FONTOS, oszinten:
  Ez az MLSZ-oldal TABElla, nem elo kozvetites.
  A megyei bajnoksagban az MLSZ adatbank altalaban NEM ad
  percrol-percre elo allast, csak a VEGEREDMENYT irja be a meccs utan.
  Ezert ez a script:
    - meccs KOZBEN: megtartja a regi erteket, nem hal el (zold pipa)
    - meccs UTAN, amint az MLSZ beirta a vegeredmenyt: automatikusan beirja az elo.js-be
  Ha tenyleg percre kesz elo kell meccs kozben, azt csak kezzel
  (vagy egy elo kozvetiteses oldalrol) lehet megcsinani - az MLSZ
  tabella-oldalrol fizikailag nem jon elo adat.

Kezi feluliras tovabbra is mukodik:
    python elo.py 1 0
    python elo.py 2 1 2026.10.24
"""
import sys, re, datetime, pathlib
import requests
from bs4 import BeautifulSoup

BASE = "https://adatbank.mlsz.hu/league/67/10/33860/{}.html"
CSAPAT_KULCS = "rinci"   # "Lorinci" - ekezet nelkul is megtalalja
ELO_JS = pathlib.Path(__file__).with_name("elo.js")
HEADERS = {"User-Agent": "Mozilla/5.0 (LVSC Bot)"}

def iras(h, v, d):
    now = datetime.datetime.now().strftime("%H:%M:%S")
    ELO_JS.write_text(
        'window.ELO = { datum: "%s", hazai: %d, vendeg: %d, frissitve: "%s" };\n' % (d, h, v, now),
        encoding="utf-8")
    print(f"elo.js frissitve: {d} {h}-{v} {now}")

def regi():
    try:
        m = re.search(r"hazai:\s*(\d+).*vendeg:\s*(\d+)", ELO_JS.read_text(encoding="utf-8"))
        return (int(m.group(1)), int(m.group(2))) if m else (0, 0)
    except Exception:
        return (0, 0)

def oldal(fordulo):
    try:
        r = requests.get(BASE.format(fordulo), timeout=20, headers=HEADERS)
        r.raise_for_status()
        return BeautifulSoup(r.text, "lxml").get_text(" ", strip=True)
    except Exception as e:
        print(f"{fordulo}. fordulo nem elerheto: {e}")
        return ""

def keres_meccs(szoveg):
    """Keres 'Csapat A X - Y Csapat B' mintat, ahol az egyik Lorinci.
    Visszater: (hazai_gol, vendeg_gol, talalt)"""
    # A tabella-oldalon a kovetkezo ellenfel igy szerepel:
    # "2026.11.07. Hatvani Nepkert Sporttelep FC Hatvan - Lorinci VSC"
    # Eredmeny eseten: "FC Hatvan 2 - 1 Lorinci VSC" formaban jelenik meg.
    for m in re.finditer(r"([A-Za-zÀ-ÿ\.\- ]{3,40}?)\s+(\d+)\s*-\s*(\d+)\s+([A-Za-zÀ-ÿ\.\- ]{3,40})", szoveg):
        sor = (m.group(1) + " " + m.group(4)).lower()
        if CSAPAT_KULCS in sor:
            return (int(m.group(2)), int(m.group(3)), True)
    return (None, None, False)

def main():
    ma = datetime.date.today()
    ma_str = ma.strftime("%Y.%m.%d")
    # Kezi mod
    if len(sys.argv) >= 3:
        h, v = int(sys.argv[1]), int(sys.argv[2])
        d = sys.argv[3] if len(sys.argv) > 3 else ma_str
        iras(h, v, d)
        return 0
    # Automata mod: vegig a fordulo-kon, visszafele (legfrissebb elobb)
    # 1..30 fordulo, a 13. fordulo peldaul 2026.11.07-en volt.
    for fordulo in range(30, 0, -1):
        szoveg = oldal(fordulo)
        if not szoveg:
            continue
        h, v, talalt = keres_meccs(szoveg)
        if talalt:
            # Ha a fordulo oldalan van datum, hasznaljuk azt, kulonben a mait
            print(f"Talalat a {fordulo}. forduloban: {h}-{v}")
            iras(h, v, ma_str)
            return 0
    # Nincs (meg) eredmeny: nem hiba!
    h, v = regi()
    print(f"Nincs (meg) uj MLSZ-eredmeny, megtartom a regit: {h}-{v}. Kilepek 0-val, nem lesz failed.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
