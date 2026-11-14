// Ifjúsági eredmények és tabellák a Hírek és a Csapat oldalhoz (U21, U16, U13).
// Ezt a fájlt a frissit.py automatikusan írja az MLSZ adatbankból (meccsek, eredmények, tabellák).
// KÉZZEL megadható, és a frissítés MEGTARTJA: a meccsek "gollovok" (lőrinci gólszerzők) és "megjegyzes" mezője
// (a meccset a "datum" azonosítja). Minden más mezőt a szkript felülír.
// Mezők: datum (ÉÉÉÉ.HH.NN), ido, fordulo, ellenfel, hazai (true = otthon), eredmeny ("3-1", a mérkőzés sorrendjében; üres = még nincs),
//        helyszin, gollovok, megjegyzes.
// Forrás: MLSZ adatbank – U21: https://adatbank.mlsz.hu/league/67/10/33866/1.html
//                          U16 Nyugat: https://adatbank.mlsz.hu/league/67/10/34159/1.html
//                          U13 Nyugat: https://adatbank.mlsz.hu/league/67/10/34162/1.html
window.IFJ = {
 "u21": [
  {"datum": "2026.08.30", "ido": "11:00", "fordulo": 1, "ellenfel": "FC Hatvan", "hazai": true, "eredmeny": "1-5", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.09.06", "ido": "10:00", "fordulo": 2, "ellenfel": "NEO24-Hevesi LSC", "hazai": false, "eredmeny": "8-0", "helyszin": "Hevesi LSC Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.09.13", "ido": "11:00", "fordulo": 3, "ellenfel": "Heréd LC - Kistigrisek", "hazai": true, "eredmeny": "3-7", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.09.20", "ido": "11:00", "fordulo": 4, "ellenfel": "Maklár SE", "hazai": false, "eredmeny": "1-4", "helyszin": "Maklár, Adler Sándor Sporttelep - tartalékpálya", "gollovok": "Vig-Peterke Zoltán, Belák Bertold (2), Szécsényi Ádám, Áll Dávid", "megjegyzes": "fordítás idegenben, 3 pont"},
  {"datum": "2026.09.27", "ido": "11:00", "fordulo": 5, "ellenfel": "Andornaktálya SE.", "hazai": true, "eredmeny": "2-2", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.10.04", "ido": "11:00", "fordulo": 6, "ellenfel": "Felsőtárkány SC", "hazai": false, "eredmeny": "4-2", "helyszin": "Felsőtárkány SC Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.10.11", "ido": "11:00", "fordulo": 7, "ellenfel": "Füzesabonyi SC", "hazai": true, "eredmeny": "2-3", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.10.18", "ido": "11:00", "fordulo": 8, "ellenfel": "Energia SC Gyöngyös", "hazai": true, "eredmeny": "15-2", "helyszin": "Lőrinci Sporttelep", "gollovok": "Vig-Peterke Zoltán (4), Nótár Nikolasz Dominik (4), Belák Bertold (2), Szundi Szabolcs (2), Krizsán Regő, Nagy Erik, Tóth Levente", "megjegyzes": "gólzápor"},
  {"datum": "2026.10.25", "ido": "10:00", "fordulo": 9, "ellenfel": "Bélkő SE-Bélapátfalva", "hazai": false, "eredmeny": "5-3", "helyszin": "Bélapátfalvai Városi Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.11.01", "ido": "10:00", "fordulo": 10, "ellenfel": "Gyöngyöshalász SE", "hazai": true, "eredmeny": "9-1", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.11.08", "ido": "10:00", "fordulo": 11, "ellenfel": "Egerszalók SE", "hazai": false, "eredmeny": "4-0", "helyszin": "Egerszalók SE Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.11.15", "ido": "10:00", "fordulo": 12, "ellenfel": "Besenyőtelek SC", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.03.14", "ido": "11:00", "fordulo": 14, "ellenfel": "FC Hatvan", "hazai": false, "eredmeny": "", "helyszin": "Hatvani Népkert Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.03.21", "ido": "11:00", "fordulo": 15, "ellenfel": "NEO24-Hevesi LSC", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.03.28", "ido": "11:00", "fordulo": 16, "ellenfel": "Heréd LC - Kistigrisek", "hazai": false, "eredmeny": "", "helyszin": "Markó Ferenc Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.04", "ido": "11:00", "fordulo": 17, "ellenfel": "Maklár SE", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.11", "ido": "11:00", "fordulo": 18, "ellenfel": "Andornaktálya SE.", "hazai": false, "eredmeny": "", "helyszin": "Varga József Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.18", "ido": "11:00", "fordulo": 19, "ellenfel": "Felsőtárkány SC", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.25", "ido": "11:00", "fordulo": 20, "ellenfel": "Füzesabonyi SC", "hazai": false, "eredmeny": "", "helyszin": "Füzesabonyi Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.02", "ido": "11:00", "fordulo": 21, "ellenfel": "Energia SC Gyöngyös", "hazai": false, "eredmeny": "", "helyszin": "Gyöngyösi Energia SC Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.09", "ido": "11:00", "fordulo": 22, "ellenfel": "Bélkő SE-Bélapátfalva", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.16", "ido": "11:00", "fordulo": 23, "ellenfel": "Gyöngyöshalász SE", "hazai": false, "eredmeny": "", "helyszin": "Szabó Gyula sportpálya tartalékpálya", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.23", "ido": "11:00", "fordulo": 24, "ellenfel": "Egerszalók SE", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.30", "ido": "11:00", "fordulo": 25, "ellenfel": "Besenyőtelek SC", "hazai": false, "eredmeny": "", "helyszin": "Dr. Vass Géza Sporttelep", "gollovok": "", "megjegyzes": ""}
 ],
 "u16": [
  {"datum": "2026.09.05", "ido": "10:00", "fordulo": 1, "ellenfel": "Gyöngyöstarjáni RE", "hazai": true, "eredmeny": "15-2", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.09.10", "ido": "17:00", "fordulo": 2, "ellenfel": "Heréd LC", "hazai": false, "eredmeny": "2-1", "helyszin": "Markó Ferenc Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.09.19", "ido": "10:00", "fordulo": 3, "ellenfel": "Apci TE", "hazai": true, "eredmeny": "25-0", "helyszin": "Lőrinci Sporttelep", "gollovok": "Berki R. (11), Hévíz H. (6) és társaik", "megjegyzes": ""},
  {"datum": "2026.10.03", "ido": "10:00", "fordulo": 5, "ellenfel": "FC Hatvan", "hazai": true, "eredmeny": "2-1", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.10.17", "ido": "10:00", "fordulo": 7, "ellenfel": "Zagyvaszántó SE", "hazai": true, "eredmeny": "23-0", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.10.24", "ido": "10:00", "fordulo": 8, "ellenfel": "Gyöngyössolymosi SE", "hazai": true, "eredmeny": "9-0", "helyszin": "Lőrinci Sporttelep", "gollovok": "Hévíz Hunor (4), Berki Roland Lajos (2), Kis Bendegúz, Bíró Roland Gábor, Vakli Ramón", "megjegyzes": ""},
  {"datum": "2026.10.27", "ido": "14:00", "fordulo": 9, "ellenfel": "Tarnamente SSZE", "hazai": false, "eredmeny": "4-0", "helyszin": "Kompolti Sportpálya", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.10.29", "ido": "17:00", "fordulo": 6, "ellenfel": "Domoszló SK", "hazai": true, "eredmeny": "7-1", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": "elhalasztott meccs"},
  {"datum": "2026.11.07", "ido": "09:00", "fordulo": 10, "ellenfel": "Gyöngyöstarjáni RE", "hazai": false, "eredmeny": "1-5", "helyszin": "Gyöngyöstarjáni RE Sportpálya", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.11.12", "ido": "17:00", "fordulo": 11, "ellenfel": "Heréd LC", "hazai": true, "eredmeny": "3-2", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.11.19", "ido": "17:00", "fordulo": 12, "ellenfel": "Apci TE", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.03.13", "ido": "10:00", "fordulo": 14, "ellenfel": "FC Hatvan", "hazai": false, "eredmeny": "", "helyszin": "Hatvani Népkert Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.03.20", "ido": "10:00", "fordulo": 15, "ellenfel": "Domoszló SK", "hazai": false, "eredmeny": "", "helyszin": "Domoszló Sportpálya", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.03.27", "ido": "10:00", "fordulo": 16, "ellenfel": "Zagyvaszántó SE", "hazai": false, "eredmeny": "", "helyszin": "Zagyvaszántó Sportpálya", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.03", "ido": "10:00", "fordulo": 17, "ellenfel": "Gyöngyössolymosi SE", "hazai": false, "eredmeny": "", "helyszin": "Óvári Gyula Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.10", "ido": "10:00", "fordulo": 18, "ellenfel": "Tarnamente SSZE", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.17", "ido": "10:00", "fordulo": 19, "ellenfel": "Gyöngyöstarjáni RE", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.24", "ido": "10:00", "fordulo": 20, "ellenfel": "Heréd LC", "hazai": false, "eredmeny": "", "helyszin": "Markó Ferenc Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.01", "ido": "10:00", "fordulo": 21, "ellenfel": "Apci TE", "hazai": false, "eredmeny": "", "helyszin": "Apci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.15", "ido": "10:00", "fordulo": 23, "ellenfel": "FC Hatvan", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.22", "ido": "10:00", "fordulo": 24, "ellenfel": "Domoszló SK", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.29", "ido": "10:00", "fordulo": 25, "ellenfel": "Zagyvaszántó SE", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.06.05", "ido": "10:00", "fordulo": 26, "ellenfel": "Gyöngyössolymosi SE", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.06.12", "ido": "10:00", "fordulo": 27, "ellenfel": "Tarnamente SSZE", "hazai": false, "eredmeny": "", "helyszin": "Kompolti Sportpálya", "gollovok": "", "megjegyzes": ""}
 ],
 "u13": [
  {"datum": "2026.09.04", "ido": "17:00", "fordulo": 1, "ellenfel": "Gyöngyösi AK U12", "hazai": true, "eredmeny": "0-16", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.09.11", "ido": "16:30", "fordulo": 2, "ellenfel": "Tarnamente SSZE", "hazai": false, "eredmeny": "3-7", "helyszin": "Kompolti Sportpálya", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.09.17", "ido": "16:30", "fordulo": 3, "ellenfel": "Kistigrisek USE", "hazai": false, "eredmeny": "10-0", "helyszin": "Markó Ferenc Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.09.25", "ido": "16:30", "fordulo": 4, "ellenfel": "Energia Sc Gyöngyös", "hazai": true, "eredmeny": "1-10", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.10.02", "ido": "15:30", "fordulo": 5, "ellenfel": "Detki Sport Klub", "hazai": false, "eredmeny": "8-2", "helyszin": "Detk Sportpálya", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.10.09", "ido": "15:00", "fordulo": 6, "ellenfel": "Gyöngyösi AK U13", "hazai": true, "eredmeny": "0-26", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.10.16", "ido": "15:00", "fordulo": 7, "ellenfel": "Szőlőskert Nagyréde SC", "hazai": true, "eredmeny": "2-1", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2026.10.20", "ido": "14:30", "fordulo": 8, "ellenfel": "Petőfibányai Sk", "hazai": true, "eredmeny": "7-0", "helyszin": "Lőrinci Sporttelep", "gollovok": "Braun Milán (4), Danó Lajos (3)", "megjegyzes": "két győzelem egymás után"},
  {"datum": "2026.11.04", "ido": "14:00", "fordulo": 9, "ellenfel": "Hort SK", "hazai": true, "eredmeny": "0-5", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.02", "ido": "16:30", "fordulo": 10, "ellenfel": "Gyöngyösi AK U12", "hazai": false, "eredmeny": "", "helyszin": "Gyöngyösi Kömlei Károly Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.09", "ido": "16:30", "fordulo": 11, "ellenfel": "Tarnamente SSZE", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.16", "ido": "17:00", "fordulo": 12, "ellenfel": "Kistigrisek USE", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.23", "ido": "17:00", "fordulo": 13, "ellenfel": "Energia Sc Gyöngyös", "hazai": false, "eredmeny": "", "helyszin": "Gyöngyösi Energia SC Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.04.30", "ido": "17:30", "fordulo": 14, "ellenfel": "Detki Sport Klub", "hazai": true, "eredmeny": "", "helyszin": "Lőrinci Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.07", "ido": "17:30", "fordulo": 15, "ellenfel": "Gyöngyösi AK U13", "hazai": false, "eredmeny": "", "helyszin": "Gyöngyösi Kömlei Károly Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.14", "ido": "17:30", "fordulo": 16, "ellenfel": "Szőlőskert Nagyréde SC", "hazai": false, "eredmeny": "", "helyszin": "Nagyréde Sportpálya", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.21", "ido": "17:30", "fordulo": 17, "ellenfel": "Petőfibányai Sk", "hazai": false, "eredmeny": "", "helyszin": "Petőfibányai Sporttelep", "gollovok": "", "megjegyzes": ""},
  {"datum": "2027.05.28", "ido": "17:30", "fordulo": 18, "ellenfel": "Hort SK", "hazai": false, "eredmeny": "", "helyszin": "Hort Sportpálya", "gollovok": "", "megjegyzes": ""}
 ]
};

// ===== window.IFJ_TABLA – tabellák =====
// Sor: [csapat, M, Gy, D, V, "lőtt-kapott", pont, "forma (régebbitől az újabbig)"]
window.IFJ_TABLA = {
 "u21": { "fordulo": 11, "rows": [
   ["Bélkő SE-Bélapátfalva", 10, 9, 1, 0, "51-13", 28, "GY GY GY GY GY"],
   ["Egerszalók SE", 9, 7, 2, 0, "33-10", 23, "GY GY GY GY GY"],
   ["FC Hatvan", 9, 7, 1, 1, "55-12", 22, "GY GY GY GY GY"],
   ["NEO24-Hevesi LSC", 9, 7, 0, 2, "72-15", 21, "V GY GY GY GY"],
   ["Heréd LC - Kistigrisek", 10, 6, 1, 3, "41-28", 19, "V GY V V GY"],
   ["Besenyőtelek SC", 10, 5, 1, 4, "34-36", 16, "V GY GY GY V"],
   ["Felsőtárkány SC", 10, 4, 2, 4, "36-37", 14, "GY V GY V V"],
   ["Füzesabonyi SC", 10, 4, 1, 5, "48-35", 13, "GY GY V D GY"],
   ["Andornaktálya SE.", 10, 3, 2, 5, "30-29", 11, "V V V V V"],
   ["Lőrinci VSC", 11, 3, 1, 7, "41-42", 10, "V GY V GY V"],
   ["Maklár SE", 10, 1, 1, 8, "21-50", 4, "GY V V V V"],
   ["Gyöngyöshalász SE", 10, 1, 1, 8, "18-63", 4, "GY V D V V"],
   ["Energia SC Gyöngyös", 10, 0, 0, 10, "8-118", 0, "V V V V V"]
 ]},
 "u16": { "fordulo": 11, "rows": [
   ["Heréd LC", 10, 8, 1, 1, "83-10", 25, "GY GY GY GY V"],
   ["Lőrinci VSC", 10, 8, 0, 2, "90-13", 24, "GY GY V GY GY"],
   ["Tarnamente SSZE", 9, 7, 1, 1, "114-9", 22, "D GY V GY GY"],
   ["FC Hatvan", 9, 6, 0, 3, "59-14", 18, "GY GY GY GY V"],
   ["Domoszló SK", 8, 4, 0, 4, "27-45", 12, "GY V V GY GY"],
   ["Gyöngyössolymosi SE", 9, 3, 0, 6, "20-55", 9, "GY V V GY V"],
   ["Gyöngyöstarjáni RE", 9, 2, 0, 7, "23-71", 5, "V V GY V V"],
   ["Zagyvaszántó SE", 9, 1, 0, 8, "14-107", 3, "V V V V V"],
   ["Apci TE", 7, 0, 0, 7, "8-114", 0, "V V V V V"]
 ]},
 "u13": { "fordulo": 9, "nincsSorrend": true, "felirat": "Hivatalos tabella nincs – a Lőrinci mérlege", "rows": [
   ["Lőrinci VSC U13", 9, 3, 0, 6, "19-79", 9, "V V GY GY V"]
 ]}
};
