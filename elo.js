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
