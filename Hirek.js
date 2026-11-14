// hirek.js - Bal oldali kártyák: mindig az utolsó 2 lejátszott meccs
// + AUTOMATIKUS SZALAGCÍM a mérkőzés lefolyása alapján
// Adat: data/hirek.json (az elo.py írja)
(function(){
  if(window.__HIREK_RUNNING) return;
  window.__HIREK_RUNNING = true;
  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  // ===== SZALAGCÍM GENERÁTOR =====
  // Bemenet: egy meccs a hirek.json-ból. Kimenet: pl. "SZŰK GYŐZELEM IDEGENBEN"
  function makeHeadline(m){
    var lorinciHazai = (m.hazai||"").indexOf("Lőrinci") !== -1;
    var hely = lorinciHazai ? "HAZAI PÁLYÁN" : "IDEGENBEN";
    var lg = lorinciHazai ? m.hazai_gol : m.vendeg_gol;
    var kg = lorinciHazai ? m.vendeg_gol : m.hazai_gol;
    var kul = lg - kg;
    var cim = "";
    if(kul > 0){
      // GYŐZELEM
      if(lg === 1 && kg === 0) cim = "SZŰK GYŐZELEM, KAPOTT GÓL NÉLKÜL";
      else if(kul === 1) cim = "SZŰK GYŐZELEM";
      else if(kul === 2) cim = "MAGABIZTOS GYŐZELEM";
      else if(kul >= 3) cim = "KIÜTÉSES GYŐZELEM";
      if(kg === 0 && kul >= 2) cim += " - NULLÁRA";
    } else if(kul < 0){
      // VERESÉG
      var veszt = -kul;
      if(veszt === 1) cim = "SZŰK VERESÉG";
      else if(veszt === 2) cim = "VERESÉG";
      else if(veszt === 3) cim = "SÚLYOS VERESÉG";
      else cim = "KIÜTÉSES VERESÉG";
      if(lg === 0) cim += " - GÓL NÉLKÜL";
    } else {
      // DÖNTETLEN
      if(lg === 0) cim = "GÓL NÉLKÜLI DÖNTETLEN";
      else if(lg >= 3) cim = "GÓLZÁPOROS DÖNTETLEN";
      else cim = "PONTOSZTOSZKODÁS";
    }
    // Mesterhármas? Ha egy játékos 3+ gólt lőtt, külön kiemeljük
    var counts = {};
    (m.golok||[]).forEach(function(g){ counts[g.nev] = (counts[g.nev]||0)+1; });
    var hatter = "";
    for(var nev in counts){ if(counts[nev] >= 3) hatter = " - MESTERHÁRMAS: " + nev; }
    return cim + " " + hely + hatter;
  }

  function renderCard(m, idx){
    var felirat = (idx===0 ? "LEGFRISEBB - " : "ELŐZŐ FORDULÓ - ") + esc(m.datum);
    var golok = (m.golok||[]).map(function(g){
      return '<div>' + g.perc + "' " + esc(g.nev) + '</div>';
    }).join('');
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
    try{
      var r = await fetch('data/hirek.json?v=' + Date.now());
      if(!r.ok) return;
      var data = await r.json();
      if(!Array.isArray(data) || !data.length) return;
      var all = document.querySelectorAll('div, section, aside');
      var anchor = null;
      for(var i=0;i<all.length;i++){
        if(all[i].textContent && all[i].textContent.indexOf('MECCSJEGYZŐKÖNYV') !== -1){ anchor = all[i]; break; }
      }
      if(!anchor) return;
      var container = anchor;
      for(var k=0;k<4;k++){
        if(!container.parentElement) break;
        if(container.parentElement === document.body || container.parentElement === document.documentElement) break;
        container = container.parentElement;
        if(container.querySelectorAll('a').length >= 1 && container.textContent.length > 500) break;
      }
      if(container.textContent.indexOf('MECCSJEGYZŐKÖNYV') === -1) return;
      container.innerHTML = data.map(renderCard).join('');
    }catch(e){}
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', loadHirek); } else { loadHirek(); }
  setTimeout(loadHirek, 1500);
})();
