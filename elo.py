import requests
from bs4 import BeautifulSoup
from datetime import datetime

URL = "https://ada1bank.mlsz.hu/club?evad=52&szervezet=10&verseny=20871&teamId=195684"
headers = {"User-Agent": "Mozilla/5.0 LőrinciVSC/1.0"}

print(f"Lehuzas: {URL}")
r = requests.get(URL, headers=headers, timeout=20)
soup = BeautifulSoup(r.text, 'lxml')

lorinci_row = ""
for tr in soup.find_all('tr'):
    if 'Lőrinci VSC' in tr.get_text():
        lorinci_row = tr.get_text(separator='|', strip=True)
        break

now = datetime.now().strftime("%Y.%m.%d %H:%M")
js_content = f'// Auto frissitve MLSZ-rol: {now}\nconst csapatAdat = {{frissitve: "{now}", adat: "{lorinci_row}"}};\n'

with open("adat.js", "w", encoding="utf-8") as f:
    f.write(js_content)
print("adat.js OK")
