// Részletes MLSZ jegyzőkönyv-adatok forduló szerint (az adatbank.mlsz.hu meccsoldalak alapján).
// Az adat.js-t az update.py felülírhatja, ezért a részletek külön fájlban vannak.
// Új forduló hozzáadása: másold le az egyik blokkot, és írd át a forduló számát (kulcs) meg az adatokat.
// adat: a forduló meccsadatai (az adat.js "utolso" blokkjának másolata) – így a forduló híre és meccse megmarad akkor is, ha az adat.js már újabb fordulókat tartalmaz.
// lorGolok: a Lőrinci gólszerzői az adott fordulóban (név gólonként) – ebből számolódik a góllövőlista, így a gólok nem vesznek el, amikor a forduló kiesik az adat.js utolsó két fordulójából.
// Edzői értékelések: "edzoiLor" (a Lőrinci edzője) és "edzoiEll" (az ellenfél edzője). Értékük null, vagy { idezet: "szó szerinti idézet" } (idézőjelben jelenik meg),
// vagy { osszefoglalo: "saját szavakkal összefoglalva" }. Ha legalább az egyik megvan, mindkét edző megjelenik (a Lőrinci edzője elöl); a hiányzónál "Nyilatkozata még nem került fel." áll.
// Ha mindkettő null, a tényszerű meccsösszefoglaló látszik. Forrás: "edzoiForras" (link) és "edzoiForrasCim" (a cikk címe) – ez a Forrás részben jelenik meg.
// idézőjelben; ha üres, a doboz a tényszerű "osszefoglalo" szöveget mutatja.
// Játékosposztok a pályarajzhoz (K = kapus, V = védő, KP = középpályás, T = csatár).
// Az MLSZ jegyzőkönyv nem tartalmaz posztot, ezért a klub keretlistájából vannak (Oláh Norbert posztja becsült).
// Pontosabb elhelyezéshez egy csapat blokkjába írhatsz "felallas": "4-3-3" vagy "sorok": [["védők..."],["középpályások..."],["csatárok..."]] mezőt.
window.JKV_POSZT = {
 "Áll Martin Bence":"K",
 "Oláh Norbert":"V","Oláh Ádám":"V","Ács Ádám":"V","Szécsényi Ádám":"V","Tóth Gábor Bálint":"V",
 "Stark János":"KP","Zöldi Dániel":"KP","Sőregi Zoltán":"KP","Panyi Attila":"KP","Fellner Krisztofer Ferenc":"KP","Áll Dávid":"KP","Molnár Erik József":"KP",
 "Nagy Bence Gergő":"T","Szeles Patrik":"T","Belák Bertold":"T","Fodor Flórián":"T"
};

window.JKV = {
 9: {
  adat: {"fordulo": 9, "datum": "2026.10.10", "hazai": false, "eredmeny": "1-1", "ellenfel": "MAKLÁR SE", "ellenfel_nev": "Maklár SE", "alcim": "MAKLÁR SE 1-1 LŐRINCI VSC", "fejlec": "Maklár SE 1-1 Lőrinci VSC", "helyszin": "Maklár, Adler Sándor Sporttelep", "golok": [{"perc": 41, "jatekos": "Radócz Ákos", "csapat": "Maklár SE", "allas": "1-0"}, {"perc": 72, "jatekos": "Fodor Flórián", "csapat": "Lőrinci VSC", "allas": "1-1"}], "gollovok": "41' Radócz Ákos (1-0, Maklár SE), 72' Fodor Flórián (1-1)", "link": "https://adatbank.mlsz.hu/match/67/10/33860/9/2191295.html"},
  edzoiLor: { osszefoglalo: "Szerinte a csapat egy felesleges fegyelmezetlenség és egy megpattanó lövés után a második félidőben kiválóan futballozott, és úgy érzi, Makláron két pont maradt ott." },
  edzoiEll: null,
  edzoiForras: "https://www.heol.hu/helyi-sport/2026/10/lorinci-maklarrol-pontot-vitt-a-cimvedo",
  edzoiForrasCim: "Maklárról pontot vitt az egy órán át emberhátrányban futballozó Lőrinci",
  lorGolok: ["Fodor Flórián"],
  ido: "15:00", felido: "1-0",
  jv: "Erb Lajos", asszisztensek: ["Visnyei Barnabás", "Szabó Bence"],
  osszefoglalo: "Idegenben 1-1 lett a végeredmény. A 21. percben Fellner Krisztofer, a 32. percben Stark János kapott sárga lapot, ugyanekkor Zöldi Dánielt kiállították, így a Lőrinci a 32. perctől emberhátrányban játszott. A hazaiak a 41. percben Radócz Ákos góljával szereztek vezetést (félidő: 1-0), a Lőrinci a 72. percben Fodor Flórián találatával egyenlített. A Lőrinci két cserét hajtott végre (Sőregi Zoltán 80', Ács Ádám 82'). A Maklár négy sárga lapot kapott (Juhász Marcell 56', Szeles Attila 66', Bodnár Attila 77', Bacsó Dániel 94').",
  lor: {
   nev: "Lőrinci VSC", edzo: "Gulyka Zsolt", stab: ["Kerepesi Ferenc - Technikai vezető"],
   kezdo: [[87,"Áll Martin Bence"],[3,"Oláh Norbert"],[6,"Stark János"],[7,"Szeles Patrik"],[9,"Nagy Bence Gergő"],[10,"Fellner Krisztofer Ferenc"],[11,"Fodor Flórián"],[13,"Belák Bertold"],[14,"Oláh Ádám"],[18,"Zöldi Dániel"],[21,"Molnár Erik József"]],
   pad: [[19,"Tóth Gábor Bálint"],[4,"Ács Ádám"],[5,"Sőregi Zoltán"],[8,"Csaszlai Dávid Kevin"],[12,"Szécsényi Ádám"],[15,"Bíró Dáriusz Péter"],[20,"Áll Dávid"]],
   cserek: [[80,"Molnár Erik József","Sőregi Zoltán"],[82,"Nagy Bence Gergő","Ács Ádám"]],
   sarga: [["Fellner Krisztofer Ferenc",21],["Stark János",32]],
   piros: [["Zöldi Dániel",32]]
  },
  ell: {
   nev: "Maklár SE", edzo: "Szabó László", stab: ["Csomós János - Technikai vezető"],
   kezdo: [[99,"Matin Boldizsár"],[5,"Halász Máté"],[7,"Bodnár Attila"],[8,"Csoszánszki Dávid Antal"],[10,"Radócz Ákos"],[11,"Fügedi Tamás"],[17,"Nagy Bence János"],[20,"Csomós Zsolt"],[23,"Tarnóczi Roland"],[27,"Szabó Levente"],[97,"Juhász Marcell Gábor"]],
   pad: [[2,"Szeles Attila Bendegúz"],[3,"Polgár Szilárd"],[9,"Montvai Tibor"],[15,"Molnár András Máté"],[19,"Rónai Bálint"],[32,"György Kristóf"],[71,"Bacsó Dániel"]],
   cserek: [[58,"Juhász Marcell Gábor","Szeles Attila Bendegúz"],[72,"Nagy Bence János","Montvai Tibor"],[80,"Bodnár Attila","Bacsó Dániel"]],
   sarga: [["Juhász Marcell Gábor",56],["Szeles Attila Bendegúz",66],["Bodnár Attila",77],["Bacsó Dániel",94]],
   piros: []
  }
 },
 10: {
  adat: {"fordulo": 10, "datum": "2026.10.17", "hazai": true, "eredmeny": "3-1", "ellenfel": "GYÖNGYÖSI AK", "ellenfel_nev": "Gyöngyösi AK", "alcim": "LŐRINCI VSC 3-1 GYÖNGYÖSI AK", "fejlec": "Lőrinci VSC 3-1 Gyöngyösi AK", "helyszin": "Lőrinci Sporttelep", "golok": [{"perc": 55, "jatekos": "Molnár Erik József", "csapat": "Lőrinci VSC", "allas": "1-0"}, {"perc": 70, "jatekos": "Fodor Flórián", "csapat": "Lőrinci VSC", "allas": "2-0"}, {"perc": 71, "jatekos": "Szűcs Balázs", "csapat": "Gyöngyösi AK", "allas": "2-1"}, {"perc": 75, "jatekos": "Oláh Norbert", "csapat": "Lőrinci VSC", "allas": "3-1"}], "gollovok": "55' Molnár Erik József (1-0), 70' Fodor Flórián (2-0), 71' Szűcs Balázs (2-1, Gyöngyösi AK), 75' Oláh Norbert (3-1)", "link": "https://adatbank.mlsz.hu/match/67/10/33860/10/2191301.html"},
  lorGolok: ["Molnár Erik József", "Fodor Flórián", "Oláh Norbert"],
  ido: "16:30", felido: "0-0",
  jv: "Harnos Csaba", asszisztensek: ["Lovas Norbert", "Fabók Dániel"],
  edzoiLor: null, edzoiEll: null,
  osszefoglalo: "A 3-1-es hazai győzelem a második félidőben dőlt el: az első játékrész gól nélkül, 0-0-val zárult. Az 55. percben Molnár Erik József szerezte meg a vezetést, a 70. percben Fodor Flórián növelte az előnyt (2-0). A vendégek a 71. percben Szűcs Balázs góljával szépítettek, a 75. percben viszont Oláh Norbert beállította a 3-1-es végeredményt. A Lőrinci három cserét hajtott végre (Belák Bertold 72', Áll Dávid 74', Ács Ádám 88'), és öt sárga lapot kapott (Oláh Norbert 35', Sőregi Zoltán 60', Stark János 64', Nagy Bence Gergő 78', Szeles Patrik 93'). A Gyöngyösi AK hat cserét hajtott végre, sárga lapot nem kapott.",
  lor: {
   nev: "Lőrinci VSC", edzo: "Gulyka Zsolt", felallas: "4-3-3", stab: ["Kerepesi Ferenc - Technikai vezető"],
   kezdo: [[55,"Áll Martin Bence"],[3,"Oláh Norbert"],[7,"Szeles Patrik"],[9,"Nagy Bence Gergő"],[10,"Fellner Krisztofer Ferenc"],[11,"Fodor Flórián"],[14,"Oláh Ádám"],[15,"Panyi Attila"],[19,"Sőregi Zoltán"],[21,"Molnár Erik József"],[24,"Stark János"]],
   pad: [[90,"Tóth Gábor Bálint"],[4,"Bíró Dáriusz Péter"],[5,"Áll Dávid"],[12,"Szécsényi Ádám"],[16,"Csaszlai Dávid Kevin"],[18,"Belák Bertold"],[27,"Ács Ádám"]],
   cserek: [[72,"Oláh Ádám","Belák Bertold"],[74,"Molnár Erik József","Áll Dávid"],[88,"Nagy Bence Gergő","Ács Ádám"]],
   sarga: [["Oláh Norbert",35],["Sőregi Zoltán",60],["Stark János",64],["Nagy Bence Gergő",78],["Szeles Patrik",93]],
   piros: []
  },
  ell: {
   nev: "Gyöngyösi AK", edzo: "Papp Tamás",
   stab: ["Nagy-György Gábor József - Utánpótlás szakmai vezető", "Nagy Péter - Masszőr", "Tóth Zsolt - Technikai vezető"],
   kezdo: [[1,"Tóth Bálint Kristóf"],[5,"Czinkóczi Kristóf"],[6,"Tóth Zsombor Róbert"],[10,"Nádudvari Marcell Sámuel"],[11,"Bartha Csaba Balázs"],[13,"Eged Zalán"],[15,"Szűcs Balázs"],[16,"Nyilas Patrik"],[17,"Szénási Soma"],[21,"Nagy-György Bálint"],[77,"Bognár Botond"]],
   pad: [[90,"Vitovszki Martin"],[9,"Tasi Balázs"],[12,"Szegedi Csanád"],[14,"Tornai Csaba Dániel"],[19,"Kocsis Márk"],[22,"Nagy Barnabás"],[23,"Patkós Bence Hunor"]],
   cserek: [[77,"Nádudvari Marcell Sámuel","Nagy Barnabás"],[85,"Szűcs Balázs","Szegedi Csanád"],[85,"Eged Zalán","Kocsis Márk"],[85,"Tóth Zsombor Róbert","Tornai Csaba Dániel"],[85,"Bognár Botond","Tasi Balázs"],[88,"Nyilas Patrik","Patkós Bence Hunor"]],
   sarga: [], piros: []
  }
 },
 11: {
  adat: {"fordulo": 11, "datum": "2026.10.24", "hazai": false, "eredmeny": "1-2", "ellenfel": "BESENYŐTELEK SC", "ellenfel_nev": "Besenyőtelek SC", "alcim": "BESENYŐTELEK SC 1-2 LŐRINCI VSC", "fejlec": "Besenyőtelek SC 1-2 Lőrinci VSC", "helyszin": "Dr. Vass Géza Sporttelep", "golok": [{"perc": 82, "jatekos": "Szécsényi Ádám", "csapat": "Lőrinci VSC", "allas": "0-1"}, {"perc": 88, "jatekos": "Szeles Patrik", "csapat": "Lőrinci VSC", "allas": "0-2"}, {"perc": 90, "jatekos": "Szabó Tamás", "csapat": "Besenyőtelek SC", "allas": "1-2"}], "gollovok": "82' Szécsényi Ádám (0-1), 88' Szeles Patrik (0-2), 90' Szabó Tamás (1-2, Besenyőtelek SC)", "link": "https://adatbank.mlsz.hu/match/67/10/33860/11/2191310.html"},
  edzoiLor: { idezet: "Örülök, hogy „összetákolt” csapatom, ha nehezen is, de győzni tudott. További sok sikert a Besenyőteleknek!" },
  edzoiEll: { osszefoglalo: "Rutinosokból és fiatalokból összeálló kerettel is nagy küzdelemre kényszerítették a Lőrincit. A mérkőzés nagyobb részében védekeztek, de a vendégek nem tudtak nagy gólhelyzetet kialakítani, ezért szerinte a döntetlen lett volna a reálisabb eredmény." },
  edzoiForras: "https://heol.hu/helyi-sport/2026/10/gyongyosi-ak-maklar-se-veretlensegenek-megszakitasa",
  edzoiForrasCim: "A Gyöngyösi AK nevéhez fűződik a Maklár SE veretlenségének megszakítása",
  lorGolok: ["Szécsényi Ádám", "Szeles Patrik"],
  ido: "14:30", felido: "0-0",
  jv: "Derda József", asszisztensek: ["Horváth Dávid", "Titz Péter"],
  osszefoglalo: "Idegenben 2-1-re nyert a Lőrinci a Besenyőtelek ellen. Az első félidő gól nélkül, 0-0-val zárult. A Lőrinci a 82. percben Szécsényi Ádám góljával szerezte meg a vezetést (0-1): Szécsényi a 71. percben állt be Panyi Attila helyére. A 88. percben Szeles Patrik növelte az előnyt (0-2), a hazaiak pedig a 90. percben Szabó Tamással szépítettek (1-2). A Lőrinci három sárga lapot kapott (Áll Dávid 43', Molnár Erik József 49', Nagy Bence Gergő 65'), a Besenyőtelek hármat (Kovács Ábel 58', Kovács Róbert 76', Szabó Tamás 80'). A Lőrinci egy, a Besenyőtelek két cserét hajtott végre.",
  lor: {
   nev: "Lőrinci VSC", edzo: "Gulyka Zsolt", stab: ["Kerepesi Ferenc - Technikai vezető"],
   kezdo: [[55,"Áll Martin Bence"],[4,"Panyi Attila"],[5,"Áll Dávid"],[7,"Szeles Patrik"],[9,"Nagy Bence Gergő"],[10,"Fellner Krisztofer Ferenc"],[11,"Fodor Flórián"],[12,"Belák Bertold"],[19,"Sőregi Zoltán"],[21,"Molnár Erik József"],[22,"Stark János"]],
   pad: [[90,"Tóth Gábor Bálint"],[3,"Csaszlai Dávid Kevin"],[14,"Vig-Peterke Zoltán"],[20,"Bíró Dáriusz Péter"],[27,"Szécsényi Ádám"]],
   cserek: [[71,"Panyi Attila","Szécsényi Ádám"]],
   sarga: [["Áll Dávid",43],["Molnár Erik József",49],["Nagy Bence Gergő",65]],
   piros: []
  },
  ell: {
   nev: "Besenyőtelek SC", edzo: "Vass István", stab: [],
   kezdo: [[1,"Tuza Bálint Zoltán"],[9,"Kovács Ábel"],[10,"Szabó Tamás"],[11,"Varga Dániel"],[12,"Kovács Róbert"],[16,"Hajdu Zsolt"],[18,"Mikó Balázs"],[19,"Orosz Csaba Csanád"],[21,"Turó Zsolt"],[22,"Szakál Flórián"],[23,"Tarnóczi Viktor"]],
   pad: [[3,"Sráj Ádám"],[4,"Illés Szabolcs"],[6,"Csala Attila"],[8,"Kotta László Viktor"]],
   cserek: [[83,"Mikó Balázs","Csala Attila"],[83,"Szakál Flórián","Sráj Ádám"]],
   sarga: [["Kovács Ábel",58],["Kovács Róbert",76],["Szabó Tamás",80]],
   piros: []
  }
 }
};
