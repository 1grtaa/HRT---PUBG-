// third.js  — جميع تفاعلات الواجهة + شاشة الدخول + تأثير ماطرس
const TOOLS = window.TOOLS || [];
const SNIPPETS = window.SNIPPETS || {};

// ---------- AUTH / ENTRY ----------
const PASSWORD = 'f16pro'; // كلمة السر الافتراضية (محليّة فقط) — غيّرها إن تريد

function showAuthMessage(msg){
  const el = document.getElementById('authMsg');
  if(el) el.innerText = msg;
}

function enterApp(){
  // إظهار شاشة الدخول المتحركة
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('enterScreen').setAttribute('aria-hidden', 'false');
  document.getElementById('appRoot').setAttribute('aria-hidden', 'true');
  let t = 10;
  const cd = document.getElementById('enterCountdown');
  cd.innerText = t;
  document.getElementById('enterScreen').style.pointerEvents = 'auto';
  const iv = setInterval(()=>{
    t -= 1; cd.innerText = t;
    if(t<=0){
      clearInterval(iv);
      // اخفاء شاشة الدخول
      document.getElementById('enterScreen').setAttribute('aria-hidden','true');
      document.getElementById('appRoot').setAttribute('aria-hidden','false');
      document.getElementById('enterScreen').style.pointerEvents = 'none';
    }
  }, 1000);
}

function tryLogin(){
  const pw = document.getElementById('pwInput').value || '';
  if(pw === PASSWORD){
    showAuthMessage('✔️ تم التحقق — جارٍ الدخول...');
    // تأخير قصير ثم دخول
    setTimeout(()=>{
      enterApp();
    }, 700);
  } else if(pw === ''){
    showAuthMessage('أدخل كلمة السر أو اختر زائر');
  } else {
    showAuthMessage('✖️ كلمة السر خاطئة');
  }
}

// زر زائر — يتخطى مع تحذير
function guestEntry(){
  showAuthMessage('متصل كزائر — بعض الخصائص قد تكون مخفية');
  setTimeout(()=>{ enterApp(); }, 900);
}

// ---------- MATRIX EFFECT ----------
function startMatrix(){
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const cols = Math.floor(w/20)+1;
  const ypos = Array(cols).fill(0);
  const letters = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%*&+-=[]{}<>/\|'.split('');
  function draw(){
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = 'rgba(0,255,150,0.75)';
    ctx.font = '14px monospace';
    for(let i=0;i<ypos.length;i++){
      const text = letters[Math.floor(Math.random()*letters.length)];
      const x = i*20;
      ctx.fillText(text, x, ypos[i]*20);
      if(ypos[i]*20 > h && Math.random() > 0.975) ypos[i]=0;
      ypos[i]++;
    }
  }
  let raf;
  function loop(){ draw(); raf = requestAnimationFrame(loop); }
  loop();
  window.addEventListener('resize', ()=>{ cancelAnimationFrame(raf); w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });
}

// ---------- UI: cards rendering and modal ----------
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

// ---------- init ----------
document.addEventListener('DOMContentLoaded', ()=>{
  // matrix effect
  startMatrix();

  // auth buttons
  document.getElementById('pwBtn').addEventListener('click', tryLogin);
  document.getElementById('pwGuest').addEventListener('click', guestEntry);
  document.getElementById('pwInput').addEventListener('keydown', function(e){ if(e.key==='Enter') tryLogin(); });

  // render ui after login (appRoot hidden until entry)
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