// Ifjúsági eredmények és tabellák a Hírek és a Csapat oldalhoz (U21, U16, U13).
// Ezt a fájlt kell frissíteni, ha új eredmény van – az oldal percenként újra beolvassa, és ha változott, újratölt.
//
// ===== window.IFJ – meccsek korosztályonként =====
// Soronként egy meccs. Mezők:
//   datum      – a meccs napja (ÉÉÉÉ.HH.NN)
//   ido        – kezdés (ÓÓ:PP), a jövőbeli meccsek visszaszámlálójához és a sorsoláshoz
//   fordulo    – a forduló száma (üresen hagyható)
//   ellenfel   – az ellenfél neve
//   hazai      – true, ha a Lőrinci otthon játszott (a hazai csapat áll elöl az eredményben); false, ha idegenben
//   eredmeny   – a végeredmény a mérkőzés sorrendjében, pl. "3-1" (hazai gól - vendég gól). Üresen hagyva a meccs "jövőbeli".
//   helyszin   – a pálya neve
//   gollovok   – (nem kötelező) lőrinci gólszerzők, szabad szöveg
//   megjegyzes – (nem kötelező) rövid kiegészítés a Hírek kártyához
// Forrás: MLSZ adatbank – U21: https://adatbank.mlsz.hu/league/67/10/33866/9.html
//                          U16 Nyugat: https://adatbank.mlsz.hu/league/67/10/34159/8.html
//                          U13 Nyugat: https://adatbank.mlsz.hu/league/67/10/34162/8.html
window.IFJ = {
 u21: [
  { datum: "2026.08.30", ido: "11:00", fordulo: 1,  ellenfel: "FC Hatvan",              hazai: true,  eredmeny: "1-5",  helyszin: "Lőrinci Sporttelep",             gollovok: "", megjegyzes: "" },
  { datum: "2026.09.06", ido: "10:00", fordulo: 2,  ellenfel: "NEO24-Hevesi LSC",       hazai: false, eredmeny: "8-0",  helyszin: "Hevesi LSC Sporttelep",          gollovok: "", megjegyzes: "" },
  { datum: "2026.09.13", ido: "11:00", fordulo: 3,  ellenfel: "Heréd LC - Kistigrisek", hazai: true,  eredmeny: "3-7",  helyszin: "Lőrinci Sporttelep",             gollovok: "", megjegyzes: "" },
  { datum: "2026.09.20", ido: "11:00", fordulo: 4,  ellenfel: "Maklár SE",              hazai: false, eredmeny: "1-4",  helyszin: "Maklár, Adler Sándor Sporttelep", gollovok: "Vig-Peterke Zoltán, Belák Bertold (2), Szécsényi Ádám, Áll Dávid", megjegyzes: "fordítás idegenben, 3 pont" },
  { datum: "2026.09.27", ido: "11:00", fordulo: 5,  ellenfel: "Andornaktálya SE",       hazai: true,  eredmeny: "2-2",  helyszin: "Lőrinci Sporttelep",             gollovok: "", megjegyzes: "" },
  { datum: "2026.10.04", ido: "11:00", fordulo: 6,  ellenfel: "Felsőtárkány SC",        hazai: false, eredmeny: "4-2",  helyszin: "Felsőtárkány SC Sporttelep",     gollovok: "", megjegyzes: "" },
  { datum: "2026.10.11", ido: "11:00", fordulo: 7,  ellenfel: "Füzesabonyi SC",         hazai: true,  eredmeny: "2-3",  helyszin: "Lőrinci Sporttelep",             gollovok: "", megjegyzes: "" },
  { datum: "2026.10.18", ido: "11:00", fordulo: 8,  ellenfel: "Energia SC Gyöngyös",    hazai: true,  eredmeny: "15-2", helyszin: "Lőrinci Sporttelep",             gollovok: "Vig-Peterke Zoltán (4), Nótár Nikolasz Dominik (4), Belák Bertold (2), Szundi Szabolcs (2), Krizsán Regő, Nagy Erik, Tóth Levente", megjegyzes: "gólzápor" },
  { datum: "2026.10.25", ido: "10:00", fordulo: 9,  ellenfel: "Bélkő SE-Bélapátfalva",  hazai: false, eredmeny: "5-3",  helyszin: "Bélapátfalvai Sporttelep",       gollovok: "", megjegyzes: "" },
  { datum: "2026.11.01", ido: "11:00", fordulo: 10, ellenfel: "Gyöngyöshalász SE",      hazai: true,  eredmeny: "",     helyszin: "Lőrinci Sporttelep",             gollovok: "", megjegyzes: "" }
 ],
 u16: [
  { datum: "2026.09.05", ido: "10:00", fordulo: 1,  ellenfel: "Gyöngyöstarjáni RE",     hazai: true,  eredmeny: "15-2", helyszin: "Lőrinci Sporttelep",             gollovok: "", megjegyzes: "" },
  { datum: "2026.09.10", ido: "17:00", fordulo: 2,  ellenfel: "Heréd LC",               hazai: false, eredmeny: "2-1",  helyszin: "Markó Ferenc Sporttelep",        gollovok: "", megjegyzes: "" },
  { datum: "2026.09.19", ido: "10:00", fordulo: 3,  ellenfel: "Apci TE",                hazai: true,  eredmeny: "25-0", helyszin: "Lőrinci Sporttelep",             gollovok: "Berki R. (11), Hévíz H. (6) és társaik", megjegyzes: "" },
  { datum: "2026.10.03", ido: "10:00", fordulo: 5,  ellenfel: "FC Hatvan",              hazai: true,  eredmeny: "2-1",  helyszin: "Lőrinci Sporttelep",             gollovok: "", megjegyzes: "" },
  { datum: "2026.10.17", ido: "10:00", fordulo: 7,  ellenfel: "Zagyvaszántó SE",        hazai: true,  eredmeny: "23-0", helyszin: "Lőrinci Sporttelep",             gollovok: "", megjegyzes: "" },
  { datum: "2026.10.24", ido: "10:00", fordulo: 8,  ellenfel: "Gyöngyössolymosi SE",    hazai: true,  eredmeny: "9-0",  helyszin: "Lőrinci Sporttelep",             gollovok: "Hévíz Hunor (4), Berki Roland Lajos (2), Kis Bendegúz, Bíró Roland Gábor, Vakli Ramón", megjegyzes: "" },
  { datum: "2026.10.27", ido: "14:00", fordulo: 9,  ellenfel: "Tarnamente SSZE",        hazai: false, eredmeny: "4-0",  helyszin: "Kompolti Sportpálya",            gollovok: "", megjegyzes: "" },
  { datum: "2026.10.29", ido: "17:00", fordulo: 6,  ellenfel: "Domoszló SK",            hazai: true,  eredmeny: "",     helyszin: "Lőrinci Sporttelep",             gollovok: "", megjegyzes: "elhalasztott meccs" },
  { datum: "2026.11.07", ido: "09:00", fordulo: 10, ellenfel: "Gyöngyöstarjáni RE",     hazai: false, eredmeny: "",     helyszin: "Gyöngyöstarján, Sportpálya",     gollovok: "", megjegyzes: "" },
  { datum: "2026.11.12", ido: "17:00", fordulo: 11, ellenfel: "Heréd LC",               hazai: true,  eredmeny: "",     helyszin: "Lőrinci Sporttelep",             gollovok: "", megjegyzes: "" },
  { datum: "2026.11.19", ido: "17:00", fordulo: 12, ellenfel: "Apci TE",                hazai: true,  eredmeny: "",     helyszin: "Lőrinci Sporttelep",             gollovok: "", megjegyzes: "" }
 ],
 u13: [
  { datum: "2026.09.04", ido: "", fordulo: 1, ellenfel: "Gyöngyösi AK U12",     hazai: true,  eredmeny: "0-16", helyszin: "Lőrinci Sporttelep",        gollovok: "", megjegyzes: "" },
  { datum: "2026.09.11", ido: "", fordulo: 2, ellenfel: "Tarnamente SSZE",      hazai: false, eredmeny: "3-7",  helyszin: "Kompolti Sportpálya",       gollovok: "", megjegyzes: "" },
  { datum: "2026.09.17", ido: "", fordulo: 3, ellenfel: "Kistigrisek USE",      hazai: false, eredmeny: "10-0", helyszin: "Markó Ferenc Sporttelep",   gollovok: "", megjegyzes: "" },
  { datum: "2026.09.25", ido: "", fordulo: 4, ellenfel: "Energia SC Gyöngyös",  hazai: true,  eredmeny: "1-10", helyszin: "Lőrinci Sporttelep",        gollovok: "", megjegyzes: "" },
  { datum: "2026.10.02", ido: "", fordulo: 5, ellenfel: "Detki SK",             hazai: false, eredmeny: "8-2",  helyszin: "Detk Sportpálya",           gollovok: "", megjegyzes: "" },
  { datum: "2026.10.09", ido: "", fordulo: 6, ellenfel: "Gyöngyösi AK U13",     hazai: true,  eredmeny: "0-26", helyszin: "Lőrinci Sporttelep",        gollovok: "", megjegyzes: "" },
  { datum: "2026.10.16", ido: "", fordulo: 7, ellenfel: "Szőlőskert Nagyréde SC", hazai: true, eredmeny: "2-1",  helyszin: "Lőrinci Sporttelep",        gollovok: "", megjegyzes: "" },
  { datum: "2026.10.20", ido: "14:30", fordulo: 8, ellenfel: "Petőfibányai SK", hazai: true,  eredmeny: "7-0",  helyszin: "Lőrinci Sporttelep",        gollovok: "Braun Milán (4), Danó Lajos (3)", megjegyzes: "két győzelem egymás után" },
  { datum: "2026.11.04", ido: "14:00", fordulo: 9, ellenfel: "Hort SK",              hazai: true,  eredmeny: "",     helyszin: "Lőrinci Sporttelep",        gollovok: "", megjegyzes: "" }
 ]
};

// ===== window.IFJ_TABLA – tabellák (Csapat oldal, jobb oldali tabella) =====
// Sor: [csapat, M, Gy, D, V, "lőtt-kapott", pont, "forma (régebbitől az újabbig)"]
// A "Lőrinci" nevű sor automatikusan sárgán kiemelt. fordulo: az MLSZ-forduló, ameddig az állás érvényes.
window.IFJ_TABLA = {
   u21: { fordulo: 10, rows: [
   ["Bélkő SE-Bélapátfalva",9,8,1,0,"42-12",25,"GY GY GY GY GY"],
   ["Egerszalók SE",8,6,2,0,"29-10",20,"GY GY GY GY GY"],
   ["FC Hatvan",8,6,1,1,"48-9",19,"GY GY GY GY D"],
   ["NEO24-Hevesi LSC",8,6,0,2,"63-13",18,"GY GY GY V GY"],
   ["Heréd LC - Kistigrisek",9,5,1,3,"32-28",16,"V V GY V GY"],
   ["Besenyőtelek SC",9,5,1,3,"34-33",16,"GY GY GY V V"],
   ["Felsőtárkány SC",10,4,2,4,"36-37",14,"V V GY V GY"],
   ["Andornaktálya SE.",9,3,2,4,"27-22",11,"V V V V D"],
   ["Füzesabonyi SC",9,3,1,5,"45-35",10,"D V GY GY V"],
   ["Lőrinci VSC",10,3,1,6,"41-38",10,"GY V GY V GY"],
   ["Maklár SE",9,1,1,7,"19-41",4,"V V V GY V"],
   ["Gyöngyöshalász SE",9,1,1,7,"17-54",4,"V D V GY V"],
   ["Energia SC Gyöngyös",9,0,0,9,"8-109",0,"V V V V V"]
 ]},
 u16: { fordulo: 9, megjegyzes: "A tabella az MLSZ 8. fordulós állása + a 10.27-i Tarnamente–Lőrinci (4-0) meccs.", rows: [
   ["Heréd LC",8,7,1,0,"76-7",22,"GY D GY GY GY"],
   ["Tarnamente SSZE",8,6,1,1,"90-9",19,"GY D GY V GY"],
   ["Lőrinci VSC",7,5,0,2,"75-9",15,"GY GY GY GY V"],
   ["FC Hatvan",7,5,0,2,"57-9",15,"GY V GY GY GY"],
   ["Domoszló SK",6,3,0,3,"20-36",9,"V V GY V GY"],
   ["Gyöngyössolymosi SE",7,2,0,5,"11-48",6,"GY V GY V V"],
   ["Gyöngyöstarjáni RE",7,2,0,5,"22-64",5,"V V V V GY"],
   ["Zagyvaszántó SE",7,1,0,6,"13-76",3,"V GY V V V"],
   ["Apci TE",7,0,0,7,"8-114",0,"V V V V V"]
 ]},
 // Az U13 ligában az MLSZ nem vezet hivatalos tabellát, ezért csak a Lőrinci saját mérlege látszik.
 u13: { fordulo: 8, nincsSorrend: true, felirat: "Hivatalos tabella nincs – a Lőrinci mérlege", rows: [
   ["Lőrinci VSC U13",8,3,0,5,"19-74",9,"V V V GY GY"]
 ]}
};
