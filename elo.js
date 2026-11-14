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

// ===== GÓLSZERZŐK KIÍRÁSA AZ EREDMÉNYJELZŐ ALÁ =====
(function(){
  function render(){
    var box = document.getElementById('elo-golok');
    if(!box){
      box = document.createElement('div');
      box.id = 'elo-golok';
      box.style.cssText = 'margin-top:10px;padding:10px 12px;background:rgba(0,0,0,.35);border-radius:10px;color:#fff;font-size:14px;line-height:1.6;';
      // Megkeressük az eredményjelző dobozát
      var all = document.querySelectorAll('*');
      var anchor = null;
      for(var i=0;i<all.length;i++){
        if(all[i].textContent && all[i].textContent.indexOf('VÉGEREDMÉNY') !== -1){
          anchor = all[i];
          break;
        }
      }
      if(anchor){
        var p = anchor;
        for(var k=0;k<3;k++){ if(p.parentElement) p = p.parentElement; }
        p.insertAdjacentElement('afterend', box);
      } else {
        document.body.appendChild(box);
      }
    }
    var g = (window.ELO && window.ELO.golok) || [];
    if(!g.length){
      box.style.display = 'none';
      return;
    }
    box.style.display = 'block';
    box.innerHTML = '<div style="color:#ffd400;font-weight:700;margin-bottom:4px;">GÓLSZERZŐK</div>'
      + g.map(function(x){
          return '<div>' + x.perc + "' " + x.nev + '</div>';
        }).join('');
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  setTimeout(render, 1500);
})();