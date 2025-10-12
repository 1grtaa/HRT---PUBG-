// third.js  — جميع تفاعلات الواجهة
const TOOLS = window.TOOLS || [];
const SNIPPETS = window.SNIPPETS || {};

// render cards
function createCard(t){
  const div = document.createElement('div');
  div.className = 'card';
  div.setAttribute('data-cat', t.category);
  div.setAttribute('data-name', t.name.toLowerCase());
  div.innerHTML = `<div class="cat">${t.category}</div>
    <div class="toolname">${t.name}</div>
    <div class="desc">${t.desc}</div>
    <div style="margin-top:8px"><button class="smallbtn" onclick="openTool('${t.id}')">تفاصيل</button></div>`;
  return div;
}

function render(filter){
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  let count = 0;
  TOOLS.forEach(t=>{
    if(filter === 'all' || filter === t.category){
      grid.appendChild(createCard(t));
      count++;
    } else if (filter === 'بايثون' && t.category === 'بايثون'){ grid.appendChild(createCard(t)); count++; }
    else if (filter === 'كالي/لينكس' && t.category === 'كالي/لينكس'){ grid.appendChild(createCard(t)); count++; }
    else if (filter === 'Termux' && t.category === 'Termux'){ grid.appendChild(createCard(t)); count++; }
  });
  document.getElementById('count').innerText = count;
}

function openTool(id){
  const t = TOOLS.find(x=>x.id===id);
  if(!t) return;
  document.getElementById('mTitle').innerText = t.name;
  document.getElementById('mCat').innerText = 'الفئة: ' + t.category;
  document.getElementById('mDesc').innerText = t.desc;
  document.getElementById('mInstall').innerText = t.install || '—';
  document.getElementById('mExample').innerText = t.example || '—';
  if(t.snippet_key && SNIPPETS[t.snippet_key]){
    document.getElementById('mSnippetWrap').style.display = 'block';
    document.getElementById('mSnippet').innerText = SNIPPETS[t.snippet_key].content;
    document.getElementById('mDownload').onclick = ()=>{ window.location = '/download/' + t.snippet_key; };
  } else {
    document.getElementById('mSnippetWrap').style.display = 'none';
  }
  document.getElementById('modalBackdrop').style.display='flex';
  setTimeout(()=>{ document.getElementById('modal').classList.add('show'); },20);
}
function closeModal(){
  document.getElementById('modal').classList.remove('show');
  setTimeout(()=>{ document.getElementById('modalBackdrop').style.display='none'; },160);
}

document.addEventListener('DOMContentLoaded', ()=>{
  render('all');
  // tabs
  document.querySelectorAll('.top-tab').forEach(el=>{
    el.addEventListener('click', ()=>{
      document.querySelectorAll('.top-tab').forEach(x=>x.classList.remove('active'));
      el.classList.add('active');
      render(el.getAttribute('data-filter'));
    });
  });
  // search
  document.getElementById('searchInput').addEventListener('input', function(){
    const q = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll('#grid .card');
    let visible = 0;
    cards.forEach(c=>{
      const name = c.getAttribute('data-name');
      const desc = c.querySelector('.desc').innerText.toLowerCase();
      if(!q || name.includes(q) || desc.includes(q)){ c.style.display='block'; visible++; }
      else c.style.display='none';
    });
    document.getElementById('count').innerText = visible;
  });
});