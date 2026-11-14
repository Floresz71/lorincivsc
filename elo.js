// Élő állás - automatikusan frissül MLSZ-ről (lásd elo.py).
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
  function updateScore(){
    if(!window.ELO) return;
    var scoreText = window.ELO.hazai + ' - ' + window.ELO.vendeg;

    // 1. Eredmény átírása: "0 - 0" -> "0 - 1"
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    var done = false;
    var scoreNode = null;
    while(node = walker.nextNode()){
      if(!done && node.nodeValue && (node.nodeValue.trim() === '0 - 0' || node.nodeValue.trim() === '0-0')){
        node.nodeValue = scoreText;
        scoreNode = node;
        done = true;
      }
    }

    // 2. Gólszerzők doboza - JAVÍTVA
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

      if(anchor){
        // Felmegyünk a dobozig: addig, amíg olyan szülőt nem találunk,
        // amiben már benne van az eredményjelző szövege is
        var container = anchor.parentElement;
        // A "VÉGEREDMÉNY" szülője a sötét doboz, annak a szülője a kék kártya
        // Ezért 2 szintet megyünk fel
        if(container && container.parentElement) container = container.parentElement;
        container.insertAdjacentElement('afterend', box);
      } else if(scoreNode){
        // Tartalék: a pontszám szülője után
        scoreNode.parentElement.insertAdjacentElement('afterend', box);
      } else {
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
    console.log('Gólszerző doboz kirakva:', g);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', updateScore);
  } else {
    updateScore();
  }
  setTimeout(updateScore, 1000);
  setTimeout(updateScore, 2500);
})();