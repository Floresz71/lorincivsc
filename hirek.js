// hirek.js - Bal oldal: utolsó 2 meccs + automatikus szalagcím
// Javítás: megpróbálja a kis- és nagybetűs fájlnevet is, mert a GitHub
// case-sensitive: Hirek.json != hirek.json
(function(){
  if(window.__HIREK_RUNNING){ console.log("[hirek] már fut"); return; }
  window.__HIREK_RUNNING = true;
  console.log("[hirek] betöltve");
  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  function makeHeadline(m){
    var lorinciHazai = (m.hazai||"").indexOf("Lőrinci") !== -1;
    var hely = lorinciHazai ? "HAZAI PÁLYÁN" : "IDEGENBEN";
    var lg = lorinciHazai ? m.hazai_gol : m.vendeg_gol;
    var kg = lorinciHazai ? m.vendeg_gol : m.hazai_gol;
    var kul = lg - kg;
    var cim = "";
    if(kul > 0){
      if(lg === 1 && kg === 0) cim = "SZŰK GYŐZELEM, KAPOTT GÓL NÉLKÜL";
      else if(kul === 1) cim = "SZŰK GYŐZELEM";
      else if(kul === 2) cim = "MAGABIZTOS GYŐZELEM";
      else cim = "KIÜTÉSES GYŐZELEM";
      if(kg === 0 && kul >= 2) cim += " - NULLÁRA";
    } else if(kul < 0){
      var veszt = -kul;
      if(veszt === 1) cim = "SZŰK VERESÉG";
      else if(veszt === 2) cim = "VERESÉG";
      else if(veszt === 3) cim = "SÚLYOS VERESÉG";
      else cim = "KIÜTÉSES VERESÉG";
      if(lg === 0) cim += " - GÓL NÉLKÜL";
    } else {
      if(lg === 0) cim = "GÓL NÉLKÜLI DÖNTETLEN";
      else if(lg >= 3) cim = "GÓLZÁPOROS DÖNTETLEN";
      else cim = "PONTOSZTOSZKODÁS";
    }
    var counts = {};
    (m.golok||[]).forEach(function(g){ counts[g.nev] = (counts[g.nev]||0)+1; });
    var extra = "";
    for(var nev in counts){ if(counts[nev] >= 3) extra = " - MESTERHÁRMAS: " + nev; }
    if(kul === 1 && !extra && (m.golok||[]).length){
      var last = m.golok[m.golok.length - 1];
      extra = " - Döntő gól: " + last.perc + "' " + last.nev;
    }
    return cim + " " + hely + extra;
  }

  function renderCard(m, idx){
    var felirat = (idx===0 ? "LEGFRISEBB - " : "ELŐZŐ FORDULÓ - ") + esc(m.datum);
    var golok = (m.golok||[]).map(function(g){ return '<div>' + g.perc + "' " + esc(g.nev) + '</div>'; }).join('');
    return ''
      + '<div class="hirek-card" style="background:#0a1a4a;border:1px solid #ffd400;border-radius:12px;padding:16px;color:#fff;margin-bottom:16px;">'
      + '<div style="background:#ffd400;color:#0a1a4a;font-weight:800;font-size:12px;padding:6px 10px;border-radius:6px;display:inline-block;margin-bottom:12px;">' + felirat + '</div>'
      + '<h2 style="font-size:26px;line-height:1.15;margin:0 0 8px;color:#fff;">' + esc(makeHeadline(m)) + '<br>' + esc(m.hazai) + ' ' + m.hazai_gol + '-' + m.vendeg_gol + ' ' + esc(m.vendeg) + '</h2>'
      + (golok ? '<div style="font-size:13px;line-height:1.6;opacity:.9;margin:10px 0;">' + golok + '</div>' : '')
      + '<a href="' + esc(m.mlsz_url||"#") + '" target="_blank" rel="noopener" style="display:inline-block;background:#fff;color:#0a1a4a;font-weight:800;padding:10px 14px;border-radius:8px;text-decoration:none;font-size:13px;">MECCSJEGYZŐKÖNYV &gt;</a>'
      + '<div style="font-size:12px;opacity:.7;margin-top:10px;">' + esc(m.datum) + '</div>'
      + '</div>';
  }

  async function loadHirek(){
    console.log("[hirek] loadHirek indul");
    try{
      // MINDEN lehetséges helyen megpróbáljuk - ezért működik akkor is,
      // ha a fájl Hirek.json néven a gyökérben van
      var urls = ['data/hirek.json', 'data/Hirek.json', 'hirek.json', 'Hirek.json'];
      var data = null;
      for(var u=0; u<urls.length; u++){
        try{
          var r = await fetch(urls[u] + '?v=' + Date.now());
          console.log("[hirek] próba:", urls[u], "->", r.status);
          if(r.ok){ data = await r.json(); console.log("[hirek] megtalálva:", urls[u]); break; }
        }catch(e){}
      }
      if(!data){ console.log("[hirek] HIBA: sehol nincs hirek.json"); return; }
      if(!Array.isArray(data) || !data.length) return;
      console.log("[hirek] meccsek:", data.length);
      var html = data.map(renderCard).join('');
      var links = document.querySelectorAll('a');
      var anchor = null;
      for(var i=0;i<links.length;i++){
        if(links[i].textContent && links[i].textContent.indexOf('MECCSJEGYZŐKÖNYV') !== -1){ anchor = links[i]; break; }
      }
      if(anchor){
        var container = anchor.parentElement;
        for(var k=0;k<2;k++){
          if(!container || !container.parentElement) break;
          if(container.parentElement === document.body || container.parentElement === document.documentElement) break;
          container = container.parentElement;
        }
        if(container && container.textContent.indexOf('MECCSJEGYZŐKÖNYV') !== -1){
          console.log("[hirek] cserélem a régi kártyákat");
          container.innerHTML = html;
          return;
        }
      }
      console.log("[hirek] HIBA: nem találtam hova tenni a kártyákat");
    }catch(e){ console.log("[hirek] HIBA:", e); }
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', loadHirek); } else { loadHirek(); }
  setTimeout(loadHirek, 1500);
})();
