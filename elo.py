import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime

HEOL_URL = "https://www.heol.hu/helyi-sport/2026/10/gyongyosi-ak-16-eves-golszerzoje-reven-vitt-pontot"
headers = {"User-Agent": "Mozilla/5.0 LorinciVSC/1.0"}

def ai_szalagcim(eredmeny, gollovok, idegenben=False):
    if "3-1" in eredmeny or "4-1" in eredmeny:
        return "MAGABIZTOS GYŐZELEM"
    if idegenben and "1-2" in eredmeny:
        return "GYŐZELEM IDEGENBEN"
    if "88'" in gollovok or "90'" in gollovok:
        return "DRÁMAI VÉGJÁTÉKKAL NYERT A LŐRINCI"
    return "GYŐZELEM A VÁRMEGYEI I. OSZTÁLYBAN"

try:
    print(f"HEOL: {HEOL_URL}")
    r = requests.get(HEOL_URL, headers=headers, timeout=20)
    soup = BeautifulSoup(r.text, 'lxml')
    text = soup.get_text(separator='\n')
    
    eredmeny = re.search(r'\d+\s*-\s*\d+', text)
    eredmeny = eredmeny.group(0) if eredmeny else ""
    
    gollovok = re.findall(r"\d+'\s+[A-ZÁÉÍÓÖŐÚÜŰa-záéíóöőúüű\s]+\(\d+-\d+\)", text)
    gollovok_text = ", ".join(gollovok)

    szalagcim = ai_szalagcim(eredmeny, gollovok_text, True)
    
    print(f"Eredmeny: {eredmeny} | Szalagcim AI: {szalagcim}")
    
    # Nem írjuk felül az egészet, csak logoljuk - a többit majd bővítjük
    with open("heol_adat.json", "w", encoding="utf-8") as f:
        import json
        json.dump({"szalagcim": szalagcim, "eredmeny": eredmeny, "gollovok": gollovok_text, "forras": HEOL_URL}, f, ensure_ascii=False, indent=2)

except Exception as e:
    print(f"HIBA: {e}")
    raise e
