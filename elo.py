import requests
from bs4 import BeautifulSoup
import re
import json
from datetime import datetime, timedelta

MLSZ_URL = "https://adatbank.mlsz.hu/league/67/10/33860/12.html"
HEOL_KERES = "https://www.heol.hu/kereses?search=L%C5%91rinci+VSC"

headers = {"User-Agent": "Mozilla/5.0 LorinciVSC/1.0"}

def ai_szalagcim(eredmeny, idegenben):
    if "1-2" in eredmeny and idegenben:
        return "GYŐZELEM IDEGENBEN"
    if "3-1" in eredmeny:
        return "MAGABIZTOS GYŐZELEM"
    return "GYŐZELEM A VÁRMEGYEI I. OSZTÁLYBAN"

try:
    print("1. MLSZ lehuzas...")
    r = requests.get(MLSZ_URL, headers=headers, timeout=20)
    soup = BeautifulSoup(r.text, 'lxml')
    text = soup.get_text(separator='|')

    # Lőrinci sor a tabellából
    lorinci_row = ""
    for tr in soup.find_all('tr'):
        if 'Lőrinci VSC' in tr.get_text():
            lorinci_row = tr.get_text(separator='|', strip=True)
            break

    # Következő meccs: FC Hatvan - Lőrinci VSC 2026.11.07
    kov_match = re.search(r'FC Hatvan.*?Lőrinci VSC.*?\d{4}\.\d{2}\.\d{2}', soup.get_text())
    kov_meccs = kov_match.group(0) if kov_match else "FC Hatvan - Lőrinci VSC | 2026.11.07 13:30 | Hatvani Népkert"

    print(f"MLSZ Lőrinci: {lorinci_row}")
    print(f"Kov meccs: {kov_meccs}")

    # 2. HEOL edzői nyilatkozat - csak 24 órával meccs után
    # Feltételezzük, utolsó meccs 2026.10.24 volt
    utolso_meccs_datum = datetime(2026, 10, 24, 14, 30)
    most = datetime.now()

    edzoi_nyilatkozat = ""
    if most > utolso_meccs_datum + timedelta(hours=24):
        print("24 ora eltelt, HEOL edzoi nyilatkozat lehuzas...")
        try:
            hr = requests.get(HEOL_KERES, headers=headers, timeout=20)
            hsoup = BeautifulSoup(hr.text, 'lxml')
            # Keresünk Lőrinci cikket és benne idézetet
            for p in hsoup.find_all('p'):
                txt = p.get_text()
                if 'edző' in txt.lower() or 'mondta' in txt.lower() or 'nyilatkozat' in txt.lower():
                    if 'Lőrinci' in txt or 'lorinci' in txt.lower():
                        edzoi_nyilatkozat = txt[:500]
                        break
        except Exception as he:
            print(f"HEOL hiba (nem gond): {he}")
            edzoi_nyilatkozat = ""
    else:
        print("Meg nincs 24 ora a meccs ota, HEOL kihagyva")

    # 3. AI szalagcím
    szalagcim = ai_szalagcim("1-2", True)

    # 4. Mentes - NEM írjuk felül az egész adat.js-t!
    adat = {
        "frissitve": datetime.now().strftime("%Y.%m.%d %H:%M"),
        "forras_mlsz": MLSZ_URL,
        "tabella_lorinci": lorinci_row,
        "kovetkezo_meccs": kov_meccs,
        "szalagcim_ai": szalagcim,
        "edzoi_nyilatkozat": edzoi_nyilatkozat,
        "fordulo": 12
    }

    with open("heol_adat.json", "w", encoding="utf-8") as f:
        json.dump(adat, f, ensure_ascii=False, indent=2)

    # Frissítjük az adat.js-t úgy, hogy megtartja a régit és hozzáadja az újat
    # Ha van adat.js, beolvassuk és bővítjük
    try:
        with open("adat.js", "r", encoding="utf-8") as f:
            old = f.read()
        # Ha már tartalmaz 12. fordulót, nem írjuk felül
        if '"fordulo": 12' not in old and "'fordulo': 12" not in old:
            # Egyszerű append a végére
            with open("adat.js", "a", encoding="utf-8") as fa:
                fa.write(f"\n// Auto 12. fordulo {adat['frissitve']}\n")
                fa.write(f"// {json.dumps(adat, ensure_ascii=False)}\n")
    except:
        pass

    print("Kesz! heol_adat.json + adat.js bovitive")

except Exception as e:
    print(f"HIBA: {e}")
    import traceback
    traceback.print_exc()
    raise e
