// Élő állás - automatikusan frissül MLSZ-ről (lásd elo.py).
// Ezt a felső részt írja át az elo.py. Az alatta lévő kiíró kódot nem bántja.
window.ELO = {
  datum: "2026.11.14",
  hazai: 0,
  vendeg: 1,
  frissitve: "2026.11.14",
  golok: [
    { perc: 64, nev: "NAGY BENCE GERGŐ", csapat: "vendeg" }
  ]
};

// ===== EREDMÉNY + GÓLSZERZŐK KIÍRÁSA =====
(function(){
  // Ha véletlenül kétszer töltődik be az elo.js, ne fusson kétszer
  if (window.__ELO_RENDERER_RUNNING) return;
  window.__ELO_RENDERER_RUNNING = true;

  function updateScore(){
    if(!window.ELO) return;
    var scoreText = window.ELO.hazai + ' - ' + window.ELO.vendeg;

    // 1. Eredmény átírása: "0 - 0" -> "0 - 1"
    // Csak egyszer cserélünk, és csak azt, ami még nem a jó eredmény
    try{
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      var node;
      var scoreNode = null;
      while(node = walker.nextNode()){
        if(!node.nodeValue) continue;
        var t = node.nodeValue.trim();
        if(t === '0 - 0' || t === '0-0'){
          node.nodeValue = scoreText;
          scoreNode = node;
          break;
        }
      }

      // 2. Gólszerzők doboza
      var box = document.getElementById('elo-golok');
      if(!box){
        box = document.createElement('div');
        box.id = 'elo-golok';
        box.style.cssText = 'margin-top:10px;padding:10px 12px;background:rgba(0,0,0,.35);border-radius:10px;color:#fff;font-size:14px;line-height:1.6;';

        // Pontos keresés: az az elem, aminek a szövege PONTOSAN "VÉGEREDMÉNY"
        var anchor = null;
        var all = document.querySelectorAll('div, span, p, h3, h4');
        for(var i=0;i<all.length;i++){
          if(all[i].textContent && all[i].textContent.trim() === 'VÉGEREDMÉNY'){
            anchor = all[i];
            break;
          }
        }

        var placed = false;
        if(anchor){
          // Csak 1 szintet megyünk fel, és SOHA nem a <html>-ig
          var container = anchor.parentElement;
          if(!container || container === document.documentElement || container === document.body){
            container = anchor;
          }
          try{
            container.insertAdjacentElement('afterend', box);
            placed = true;
          }catch(e){
            // Ha az sem megy, a VÉGEREDMÉNY elem után tesszük
            try{ anchor.insertAdjacentElement('afterend', box); placed = true; }catch(e2){}
          }
        }
        if(!placed && scoreNode && scoreNode.parentElement){
          try{ scoreNode.parentElement.insertAdjacentElement('afterend', box); placed = true; }catch(e){}
        }
        if(!placed){
          document.body.appendChild(box);
        }
      }

      var g = window.ELO.golok || [];
      if(!g.length){
        box.style.display = 'none';
        return;
      }
      box.style.display = 'block';
      box.innerHTML = '<div style="color:#ffd400;font-weight:700;margin-bottom:4px;">GÓLSZERZŐK</div>'
        + g.map(function(x){ return '<div>' + x.perc + "' " + x.nev + '</div>'; }).join('');
    }catch(e){
      // Nem dobunk piros hibát a Console-ba, ha valami nem található
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', updateScore);
  } else {
    updateScore();
  }
  // Az oldal lassan tölti be az eredményjelzőt, ezért 2x újrapróbáljuk
  setTimeout(updateScore, 1000);
  setTimeout(updateScore, 2500);
})();

// ===== HÍREK - BAL OLDAL, UTOLSÓ 2 MECCS - ELO.JS-BEN, NEM KÜLÖN FÁJL =====
// Azért van itt, és nem külön hirek.js-ben, mert az elo.py minden futáskor
// újraírja az elo.js felső részét, de ezt a részt (a MARKER-től lefelé) megőrzi.
// Így nem kell betöltő, nem számít a kis/nagybetű, és nem törlődik.
(function(){
  if(window.__HIREK_RUNNING) return;
  window.__HIREK_RUNNING = true;

  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  // Tartalék adat: ha a data/hirek.json / Hirek.json sehol nincs meg,
  // akkor is legyen mit kirakni. Ugyanaz, mint ami a Hirek.json-ban van.
  var FALLBACK = [
    {"datum":"2026.11.14","hazai":"Heréd-Kistigrisek LC","vendeg":"Lőrinci VSC","hazai_gol":0,"vendeg_gol":1,"golok":[{"perc":64,"nev":"NAGY BENCE GERGŐ"}],"mlsz_url":"https://adatbank.mlsz.hu/match/67/10/33860/14/2191326.html"},
    {"datum":"2026.11.07","hazai":"FC Hatvan","vendeg":"Lőrinci VSC","hazai_gol":8,"vendeg_gol":1,"golok":[{"perc":83,"nev":"NAGY BENCE GERGŐ"}],"mlsz_url":"https://adatbank.mlsz.hu/match/67/10/33860/13/2191325.html"}
  ];

  function makeHeadline(m){
    var lorinciHazai = (m.hazai||"").indexOf("Lőrinci") !== -1;
    var hely = lorinciHazai ? "HAZAI PÁLYÁN" : "IDEGENBEN";
    var lg = lorinciHazai ? m.hazai_gol : m.vendeg_gol;
    var kg = lorinciHazai ? m.vendeg_gol : m.hazai_gol;
    var kul = lg - kg, cim = "";
    if(kul > 0){
      if(lg === 1 && kg === 0) cim = "SZŰK GYŐZELEM, KAPOTT GÓL NÉLKÜL";
      else if(kul === 1) cim = "SZŰK GYŐZELEM";
      else if(kul === 2) cim = "MAGABIZTOS GYŐZELEM";
      else cim = "KIÜTÉSES GYŐZELEM";
      if(kg === 0 && kul >= 2) cim += " - NULLÁRA";
    } else if(kul < 0){
      var v = -kul;
      if(v === 1) cim = "SZŰK VERESÉG";
      else if(v === 2) cim = "VERESÉG";
      else if(v === 3) cim = "SÚLYOS VERESÉG";
      else cim = "KIÜTÉSES VERESÉG";
      if(lg === 0) cim += " - GÓL NÉLKÜL";
    } else {
      if(lg === 0) cim = "GÓL NÉLKÜLI DÖNTETLEN";
      else if(lg >= 3) cim = "GÓLZÁPOROS DÖNTETLEN";
      else cim = "PONTOSZTOSZKODÁS";
    }
    var extra = "";
    if(kul === 1 && (m.golok||[]).length){
      var last = m.golok[m.golok.length-1];
      extra = " - Döntő gól: " + last.perc + "' " + last.nev;
    }
    return cim + " " + hely + extra;
  }

  function renderCard(m, idx){
    var felirat = (idx===0 ? "LEGFRISEBB - " : "ELŐZŐ FORDULÓ - ") + esc(m.datum);
    var golok = (m.golok||[]).map(function(g){ return '<div>' + g.perc + "' " + esc(g.nev) + '</div>'; }).join('');
    return '<div class="hirek-card" style="background:#0a1a4a;border:1px solid #ffd400;border-radius:12px;padding:16px;color:#fff;margin-bottom:16px;">'
      + '<div style="background:#ffd400;color:#0a1a4a;font-weight:800;font-size:12px;padding:6px 10px;border-radius:6px;display:inline-block;margin-bottom:12px;">' + felirat + '</div>'
      + '<h2 style="font-size:26px;line-height:1.15;margin:0 0 8px;color:#fff;">' + esc(makeHeadline(m)) + '<br>' + esc(m.hazai) + ' ' + m.hazai_gol + '-' + m.vendeg_gol + ' ' + esc(m.vendeg) + '</h2>'
      + (golok ? '<div style="font-size:13px;line-height:1.6;opacity:.9;margin:10px 0;">' + golok + '</div>' : '')
      + '<a href="' + esc(m.mlsz_url||"#") + '" target="_blank" rel="noopener" style="display:inline-block;background:#fff;color:#0a1a4a;font-weight:800;padding:10px 14px;border-radius:8px;text-decoration:none;font-size:13px;">MECCSJEGYZŐKÖNYV &gt;</a>'
      + '<div style="font-size:12px;opacity:.7;margin-top:10px;">' + esc(m.datum) + '</div></div>';
  }

  async function loadHirek(){
    console.log("[hirek] indul");
    var data = null;
    var urls = ['data/hirek.json','data/Hirek.json','hirek.json','Hirek.json'];
    for(var u=0; u<urls.length; u++){
      try{
        var r = await fetch(urls[u] + '?v=' + Date.now());
        console.log("[hirek] próba:", urls[u], "->", r.status);
        if(r.ok){ data = await r.json(); break; }
      }catch(e){}
    }
    if(!data || !data.length){
      console.log("[hirek] JSON nem található, tartalék adatot használok");
      data = FALLBACK;
    }
    // JAVÍTÁS: kártyánként cserélünk, nem az egész oszlopot!
    // Így nem tudjuk letörölni a középső + jobb oszlopot.
    var links = Array.prototype.filter.call(document.querySelectorAll('a'), function(a){
      return a.textContent && a.textContent.indexOf('MECCSJEGYZŐKÖNYV') !== -1;
    });
    console.log("[hirek] talált kártya-link:", links.length);
    if(!links.length){ console.log("[hirek] nincs MECCSJEGYZŐKÖNYV link"); return; }
    var cards = data.slice(0,2).map(renderCard);
    // Minden régi kártyát a saját helyén cserélünk
    links.forEach(function(link, idx){
      if(idx >= cards.length) return;
      // A kártya = a link legközelebbi olyan őse, amiben már benne van a "MECCSJEGYZŐKÖNYV" + egy dátum
      var card = link;
      for(var k=0;k<4;k++){
        if(!card.parentElement) break;
        card = card.parentElement;
        // A kártya az a doboz, amiben a link + a cím is benne van, de még nem az egész oldal
        if(card.textContent && card.textContent.indexOf('MECCSJEGYZŐKÖNYV') !== -1 && card.textContent.length < 3000) break;
      }
      if(!card) return;
      var tmp = document.createElement('div');
      tmp.innerHTML = cards[idx];
      var uj = tmp.firstChild;
      if(card.parentElement) card.parentElement.replaceChild(uj, card);
      console.log("[hirek] kártya cserélve:", idx);
    });
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', loadHirek); }
  else { loadHirek(); }
  setTimeout(loadHirek, 1500);
  setTimeout(loadHirek, 3000);
})();

// ===== MÉRKŐZÉSEK RENDEZÉS + KUPAMECCS =====
// 1. A "Forduló" legördülőt FORDULÓSZÁM szerint rendezi (22,21,20...1), nem dátum szerint
// 2. A mérkőzés-kártyákat is fordulószám szerint rendezi
// 3. Beszúrja a kupameccset, ha nincs bent
// KUPAMECCS SZERKESZTÉSE: írd át itt lent a CUP_MATCH-et, a többit a kód csinálja.
(function(){
  // ---- KUPAMECCS - KÉSZ ADAT AZ MLSZ-RŐL (2026.08.01) ----
  var CUP_MATCH = {
    datum: "2026.08.01",
    ido: "16:00",
    hazai: "FC Hatvan",
    vendeg: "Lőrinci VSC",
    eredmeny: "3-2",
    helyszin: "Hatvani Népkert Sporttelep",
    kiir: "MOL Magyar Kupa - 1. forduló",
    mlsz_url: "https://adatbank.mlsz.hu/match/67/0/33589/1/2187164.html",
    golok: "4' Szeles Patrik (0-1), 7' Királyházi Márton (1-1), 22' Kitl Krisztián (2-1), 65' Belák Bertold (2-2), 82' Királyházi Márton (3-2)"
  };
  // ----------------------------------

  // Kupameccs: először data/cup.json-ból (azt az elo.py írja), ha nincs, a beégetett CUP_MATCH-ből
  async function getCupMatch(){
    var urls = ['data/cup.json','cup.json'];
    for(var i=0;i<urls.length;i++){
      try{
        var r = await fetch(urls[i] + '?v=' + Date.now());
        if(r.ok) return await r.json();
      }catch(e){}
    }
    return CUP_MATCH;
  }

  function forduloSzam(szoveg){
    var m = String(szoveg||"").match(/(\d+)\s*\.\s*fordul[oó]/i);
    return m ? parseInt(m[1], 10) : -1;
  }

  async function rendezd(){
    try{
      // --- 1. LEGÖRDÜLŐ ---
      var selects = document.querySelectorAll('select');
      for(var s=0; s<selects.length; s++){
        var sel = selects[s];
        var opts = Array.prototype.slice.call(sel.options);
        // Csak az a select, amiben "Összes forduló" van
        var isFordulo = opts.some(function(o){ return (o.text||"").indexOf('Összes forduló') !== -1; });
        if(!isFordulo) continue;
        var elso = opts[0]; // "Összes forduló (22 meccs)" marad elöl
        var tobbi = opts.slice(1);
        tobbi.sort(function(a,b){ return forduloSzam(b.text) - forduloSzam(a.text); });
        // Újraépítjük: elso + rendezett
        sel.innerHTML = "";
        sel.appendChild(elso);
        tobbi.forEach(function(o){ sel.appendChild(o); });
        console.log("[merkozes] legördülő rendezve fordulószám szerint");
      }

      // --- 2. MÉRKŐZÉS-KÁRTYÁK ---
      // Minden "N. FORDULÓ" feliratot megkeresünk
      var headers = [];
      var all = document.querySelectorAll('div, h2, h3, h4, span, p');
      for(var i=0;i<all.length;i++){
        var t = (all[i].textContent||"").trim();
        // Csak az a kis elem, aminek PONTOSAN "N. FORDULÓ" az eleje, és rövid
        if(/^\d+\.\s*FORDULÓ/i.test(t) && t.length < 60 && forduloSzam(t) > 0){
          headers.push(all[i]);
        }
      }
      // Duplikáció szűrés: csak a legkülső ilyen elemet tartjuk meg
      // A kártya-blokk = a header szülője, amiben a dátum is benne van
      var blokkok = [];
      headers.forEach(function(h){
        var blokk = h.parentElement;
        // Felmegyünk max 2 szintet, amíg a blokkban van dátum is
        for(var k=0;k<2;k++){
          if(!blokk || !blokk.parentElement) break;
          if(/\d{4}\.\d{2}\.\d{2}/.test(blokk.textContent||"")) break;
          blokk = blokk.parentElement;
        }
        if(blokk && blokkok.indexOf(blokk) === -1) blokkok.push(blokk);
      });
      if(blokk.length > 1 && blokkok.length > 1){
        // Itt direkt nem rendezzük át a DOM-ot erőszakkal, mert az index.html
        // szerkezete oldalanként eltér - csak logolunk
        console.log("[merkozes] talált forduló-blokkok:", blokkok.length);
      }

      // --- 3. KUPAMECCS BESZÚRÁSA (data/cup.json-ból, amit az elo.py ír) ---
      CUP_MATCH = await getCupMatch();
      if(CUP_MATCH && CUP_MATCH.vendeg && CUP_MATCH.vendeg !== "Ellenfél neve"){
        if(!document.body.textContent.includes('KUPAMECCS') && !document.body.textContent.includes(CUP_MATCH.kiir)){
          // A 22 mérkőzés lista elé / az 1. forduló elé tesszük
          var lista = document.querySelector('main') || document.body;
          var div = document.createElement('div');
          div.setAttribute('data-kupameccs','1');
          div.style.cssText = 'margin:16px 0;padding:16px;border:2px solid #ffd400;border-radius:12px;background:#0a1a4a;color:#fff;';
          div.innerHTML = '<div style="background:#ffd400;color:#0a1a4a;font-weight:800;font-size:12px;padding:6px 10px;border-radius:6px;display:inline-block;margin-bottom:8px;">KUPA • ' + CUP_MATCH.kiir + '</div>'
            + '<div style="font-size:20px;font-weight:800;">' + CUP_MATCH.hazai + ' ' + (CUP_MATCH.eredmeny||' - ') + ' ' + CUP_MATCH.vendeg + '</div>'
            + '<div style="font-size:13px;line-height:1.6;opacity:.9;margin-top:8px;">' + (CUP_MATCH.golok||'') + '</div>'
            + '<div style="font-size:13px;opacity:.8;margin-top:6px;">' + CUP_MATCH.datum + ' • ' + CUP_MATCH.ido + ' • ' + CUP_MATCH.helyszin + '</div>'
            + '<a href="' + (CUP_MATCH.mlsz_url||"#") + '" target="_blank" rel="noopener" style="display:inline-block;margin-top:10px;background:#fff;color:#0a1a4a;font-weight:800;padding:8px 12px;border-radius:8px;text-decoration:none;font-size:13px;">MECCSJEGYZŐKÖNYV &gt;</a>';
          // Az első "1. FORDULÓ" elé tesszük, ha megvan, különben a lista elejére
          var inserted = false;
          var all2 = document.querySelectorAll('div, h2, h3');
          for(var j=0;j<all2.length;j++){
            if(/^1\.\s*FORDULÓ/i.test((all2[j].textContent||"").trim())){
              all2[j].parentElement.insertBefore(div, all2[j].parentElement.firstChild);
              inserted = true; break;
            }
          }
          if(!inserted) lista.insertBefore(div, lista.firstChild);
          console.log("[merkozes] kupameccs beszúrva");
        }
      } else {
        console.log("[merkozes] kupameccs nincs kitöltve (CUP_MATCH.vendeg) - írd át az elo.js-ben");
      }
    }catch(e){ console.log("[merkozes] hiba:", e); }
  }

  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', rendezd); }
  else { rendezd(); }
  setTimeout(rendezd, 1500);
  setTimeout(rendezd, 3000);
})();

// ===== TABELLA - JOBB OLDAL =====
// Adat: data/tabella.json (az elo.py írja az MLSZ meccsoldal TABELLA részéből)
// Ha nincs JSON, a beágyazott tartalékot használja.
(function(){
  if(window.__TABELLA_RUNNING) return;
  window.__TABELLA_RUNNING = true;
  var FALLBACK_TABELLA = [
    {"h":1,"csapat":"FC Hatvan","m":13,"gy":10,"d":1,"v":2,"lg":66,"kg":15,"gk":51,"p":31},
    {"h":2,"csapat":"Maklár SE","m":14,"gy":9,"d":3,"v":2,"lg":35,"kg":20,"gk":15,"p":30},
    {"h":3,"csapat":"Gyöngyöshalász SE","m":14,"gy":9,"d":2,"v":3,"lg":32,"kg":18,"gk":14,"p":29},
    {"h":4,"csapat":"Marshall-ASE","m":14,"gy":8,"d":3,"v":3,"lg":39,"kg":15,"gk":24,"p":27},
    {"h":5,"csapat":"Lőrinci VSC","m":14,"gy":8,"d":3,"v":3,"lg":29,"kg":26,"gk":3,"p":27},
    {"h":6,"csapat":"Gyöngyösi AK","m":14,"gy":7,"d":5,"v":2,"lg":22,"kg":11,"gk":11,"p":26},
    {"h":7,"csapat":"Egerszalók SE","m":14,"gy":5,"d":4,"v":5,"lg":26,"kg":29,"gk":-3,"p":19},
    {"h":8,"csapat":"Eger SE II.","m":14,"gy":3,"d":2,"v":9,"lg":15,"kg":34,"gk":-19,"p":11},
    {"h":9,"csapat":"Bélkő SE-Bélapátfalva","m":14,"gy":3,"d":2,"v":9,"lg":25,"kg":49,"gk":-24,"p":11},
    {"h":10,"csapat":"Heréd-Kistigrisek LC","m":14,"gy":3,"d":2,"v":9,"lg":20,"kg":45,"gk":-25,"p":11},
    {"h":11,"csapat":"Energia SC Gyöngyös","m":14,"gy":3,"d":1,"v":10,"lg":26,"kg":41,"gk":-15,"p":9},
    {"h":12,"csapat":"Besenyőtelek SC","m":13,"gy":1,"d":0,"v":12,"lg":12,"kg":44,"gk":-32,"p":3}
  ];
  async function loadTabella(){
    var data = null;
    var urls = ['data/tabella.json','tabella.json'];
    for(var i=0;i<urls.length;i++){
      try{ var r = await fetch(urls[i]+'?v='+Date.now()); if(r.ok){ data = await r.json(); break; } }catch(e){}
    }
    if(!data || !data.length){ console.log("[tabella] JSON nincs, tartalékot használok"); data = FALLBACK_TABELLA; }
    console.log("[tabella] sorok:", data.length);
    // Jobb oldal: az a doboz, amiben "VÁRMEGYEI I. O." van
    var all = document.querySelectorAll('div, section, aside, table');
    var doboz = null;
    for(var i=0;i<all.length;i++){
      var t = all[i].textContent||"";
      if(t.indexOf('VÁRMEGYEI I. O.') !== -1 && t.indexOf('Lőrinci VSC') !== -1 && t.length < 8000){
        doboz = all[i]; break;
      }
    }
    if(!doboz){ console.log("[tabella] nem találtam a jobb oldali dobozt"); return; }
    // Ha van benne <table>, annak a <tbody>-jét építjük újra
    var table = doboz.querySelector('table');
    if(table){
      var tbody = table.querySelector('tbody') || table;
      var html = data.map(function(r){
        var kiemelt = r.csapat.indexOf('Lőrinci') !== -1 ? 'background:#ffd400;color:#0a1a4a;font-weight:800;' : '';
        return '<tr style="'+kiemelt+'"><td>'+r.h+'</td><td>'+r.csapat+'</td><td>'+r.m+'</td><td>'+r.lg+'-'+r.kg+'</td><td>'+r.p+'p</td></tr>';
      }).join('');
      tbody.innerHTML = html;
      console.log("[tabella] táblázat frissítve");
      return;
    }
    // Ha nincs <table>, hanem div-es sorok vannak: soronként frissítjük a pontokat
    // Minden sorban megkeressük a csapatnevet, és a sor végén lévő pontot
    var sorok = doboz.querySelectorAll('div');
    data.forEach(function(r){
      for(var j=0;j<sorok.length;j++){
        if((sorok[j].textContent||"").indexOf(r.csapat) !== -1 && sorok[j].textContent.length < 200){
          // A sorban lévő utolsó "NNp" mintát cseréljük
          sorok[j].innerHTML = sorok[j].innerHTML.replace(/\d+p\b/, r.p+'p');
          break;
        }
      }
    });
    console.log("[tabella] div-es sorok frissítve");
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', loadTabella); }
  else { loadTabella(); }
  setTimeout(loadTabella, 1500);
  setTimeout(loadTabella, 3000);
  setTimeout(loadTabella, 6000);
})();
