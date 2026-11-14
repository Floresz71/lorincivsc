async function loadLineups(){
  try{
    const r = await fetch('data/lineups.json?v='+Date.now());
    if(!r.ok) return;
    const d = await r.json();
    if(!d.has_lineups || !d.home || !d.away) return;
    const box = document.getElementById('lineups-box');
    if(!box) return;
    box.hidden = false;
    const set = (id, arr) => {
      const el = document.getElementById(id);
      if(el) el.innerHTML = arr.map(p=>`<li><b>${p.number ?? ''}</b> ${p.name}</li>`).join('') || '<li>-</li>';
    };
    document.getElementById('lu-home-name').textContent = d.home.team;
    document.getElementById('lu-away-name').textContent = d.away.team;
    set('lu-home-starters', d.home.starters);
    set('lu-home-bench', d.home.bench);
    set('lu-away-starters', d.away.starters);
    set('lu-away-bench', d.away.bench);
  }catch(e){}
}
loadLineups();
setInterval(loadLineups, 180000);
