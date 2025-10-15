/* app.js
   يعرّف الأدوات ويعرض الواجهة، البحث، الفلاتر، المودال، والتحميل.
   هذا الملف مستقل ويعمل مباشرة في المتصفح.
*/

(function(){
  // ---- توليد بيانات الأدوات (200 بايثون + 200 تريمكس) ----
  function genPython(i){
    const name = `py_tool_${String(i).padStart(3,'0')}`;
    const purposes = [
      "تحليل pcap محلي", "تحليل سجلات", "أتمتة SSH داخل مختبر",
      "فحص شهادات TLS/SSL", "تحليل ثنائيات للتعلم", "نمذجة بيانات سجلات"
    ];
    const usecases = [
      "استخراج رؤى من سجلات الشبكة المحلية", "تحليل ملفات pcap في بيئة اختبار",
      "تجربة خوارزميات كشف التهديدات محليًا", "تعلم كيفية معالجة السجلات"
    ];
    const purpose = purposes[Math.floor(Math.random()*purposes.length)];
    const usecase = usecases[Math.floor(Math.random()*usecases.length)];
    const detailed = `أداة بايثون ${i} (${name})\n\nالغرض: ${purpose}.\nاستخدام نموذجي: ${usecase}.\nالقيود: لا توجه هذه الأداة لشبكات أو أجهزة بدون إذن. هذه نسخة تعليمية.`;
    const how = [
      "انشئ بيئة افتراضية: python -m venv venv && source venv/bin/activate",
      "ثبت الحزم المطلوبة داخل المختبر فقط (مثال: pip install ipwhois)",
      "حمّل المقتطف بواسطة زر التحميل، ثم نفّذه محليًا: python <snippet>.py",
      "عدّل بيانات الإدخال في السكربت لاختبار الحالات المحلية"
    ];
    const example = `# ${name}.py — مثال آمن\n\ndef main():\n    print("تشغيل آمن لمقتطف ${name}")\n\nif __name__ == '__main__':\n    main()\n`;
    return {
      id: `py_${String(i).padStart(3,'0')}`,
      name,
      category: "بايثون",
      desc: `مكتبة/أداة بايثون تعليمية — ${purpose}.`,
      detailed,
      how,
      install: `# pip install ${name}  (مثال افتراضي)`,
      example,
      snippet_ext: ".py"
    };
  }

  function genTermux(i){
    const name = `tx_tool_${String(i).padStart(3,'0')}`;
    const purposes = [
      "ماسح منافذ داخلي", "التقاط حزم للتشخيص", "تحليل واي-فاي تعليمية",
      "أداة CLI لتحليل DNS", "مراقبة الاتصالات المحلية"
    ];
    const usecases = [
      "شغّلها داخل Termux على جهازك فقط", "ابدأ بـ --help ثم جرّب خيارات آمنة",
      "استخدمها على localhost أو شبكات لديك إذن بها"
    ];
    const purpose = purposes[Math.floor(Math.random()*purposes.length)];
    const usecase = usecases[Math.floor(Math.random()*usecases.length)];
    const detailed = `أداة Termux ${i} (${name})\n\nالغرض: ${purpose}.\nاستخدام نموذجي: ${usecase}.\nالقيود: مثال تعليمي لا يقوم بفحص شبكات خارجية افتراضيًا.`;
    const how = [
      "افتح Termux أو شيل محلي على جهازك",
      `ثبت الحزمة إن رغبت: pkg install ${name} (تحقق من اسم الحزمة)`,
      `ابدأ بـ ${name} --help لمراجعة الخيارات ثم جرِّب خيارات آمنة`,
      "حلل النتائج محليًا داخل البيئة الآمنة"
    ];
    const example = `#!/usr/bin/env bash\n# ${name}.sh — مثال آمن\n\necho "تشغيل آمن: ${name} --version"\n`;
    return {
      id: `tx_${String(i).padStart(3,'0')}`,
      name,
      category: "تريمكس",
      desc: `أداة CLI/Termux تعليمية — ${purpose}.`,
      detailed,
      how,
      install: `# pkg install ${name}  (تحقق من الاسم في مستودعك)`,
      example,
      snippet_ext: ".sh"
    };
  }

  const ALL_TOOLS = [];
  for(let i=1;i<=200;i++){ ALL_TOOLS.push(genPython(i)); }
  for(let i=1;i<=200;i++){ ALL_TOOLS.push(genTermux(i)); }

  // ---- عناصر DOM ----
  const grid = document.getElementById('grid');
  const searchInput = document.getElementById('search');
  const btnAll = document.getElementById('btnAll');
  const btnPy = document.getElementById('btnPy');
  const btnTx = document.getElementById('btnTx');
  const modalBack = document.getElementById('modalBack');
  const modal = document.getElementById('modal');
  const mTitle = document.getElementById('mTitle');
  const mMeta = document.getElementById('mMeta');
  const mDetailed = document.getElementById('mDetailed');
  const mInstall = document.getElementById('mInstall');
  const mExample = document.getElementById('mExample');
  const mHow = document.getElementById('mHow');
  const downloadBtn = document.getElementById('downloadBtn');
  const copyInstall = document.getElementById('copyInstall');
  const copyExample = document.getElementById('copyExample');
  const closeModalBtn = document.getElementById('closeModal');

  let currentFilter = 'all';
  let debounce = null;

  // ---- Build cards once (performance) ----
  function buildCards(){
    const frag = document.createDocumentFragment();
    ALL_TOOLS.forEach(t=>{
      const el = document.createElement('div');
      el.className = 'card';
      el.setAttribute('data-id', t.id);
      el.setAttribute('data-cat', t.category);
      el.setAttribute('data-name', (t.name||'').toLowerCase());
      el.setAttribute('data-desc', (t.desc||'').toLowerCase());
      el.innerHTML = `
        <div class="cat">${t.category}</div>
        <div class="name">${t.name}</div>
        <div class="desc">${t.desc}</div>
        <div class="actions">
          <button class="btn primary" data-action="details" data-id="${t.id}">تفاصيل</button>
          <button class="btn" data-action="download" data-id="${t.id}">تحميل</button>
        </div>
      `;
      frag.appendChild(el);
    });
    grid.appendChild(frag);

    // delegate clicks
    grid.addEventListener('click', function(e){
      const det = e.target.closest('button[data-action="details"]');
      const dl = e.target.closest('button[data-action="download"]');
      if(det){
        openModalById(det.getAttribute('data-id'));
      } else if(dl){
        const id = dl.getAttribute('data-id');
        downloadSnippetById(id);
      }
    });
  }

  // ---- filtering & search ----
  function applyFilters(){
    const q = (searchInput.value||'').toLowerCase().trim();
    const cards = grid.querySelectorAll('.card');
    let visible = 0;
    cards.forEach(c=>{
      const name = c.getAttribute('data-name') || '';
      const desc = c.getAttribute('data-desc') || '';
      const cat = c.getAttribute('data-cat') || '';
      const inFilter = (currentFilter === 'all' || currentFilter === cat);
      const matches = (!q || name.includes(q) || desc.includes(q));
      if(inFilter && matches){
        c.style.display = 'block';
        visible++;
      } else c.style.display = 'none';
    });
    // عرض عدد الأدوات في مكان مناسب (footer) إن أردت
    return visible;
  }

  // ---- modal functions ----
  function openModalById(id){
    const t = ALL_TOOLS.find(x=>x.id===id);
    if(!t) return;
    mTitle.innerText = t.name;
    mMeta.innerText = `الفئة: ${t.category}`;
    mDetailed.innerText = t.detailed || t.desc || '';
    mInstall.innerText = t.install || '—';
    mExample.innerText = t.example || '—';
    mHow.innerHTML = '';
    if(Array.isArray(t.how)) t.how.forEach((s,i)=>{
      const div = document.createElement('div');
      div.className = 'step';
      div.innerText = `${i+1}. ${s}`;
      mHow.appendChild(div);
    });
    // download setup
    downloadBtn.onclick = ()=> downloadSnippet(t);
    copyInstall.onclick = ()=> copyToClipboard(t.install || '');
    copyExample.onclick = ()=> copyToClipboard(t.example || '');
    // show modal
    modalBack.style.display = 'flex';
    setTimeout(()=> modal.classList.add('show'), 20);
  }

  function closeModal(){
    modal.classList.remove('show');
    setTimeout(()=> modalBack.style.display = 'none', 180);
  }

  // ---- download snippet (client-side blob) ----
  function downloadSnippet(tool){
    const filename = tool.name + (tool.snippet_ext || '.txt');
    const content = (tool.example || '# example\nprint("example")') + '\n';
    const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadSnippetById(id){
    const t = ALL_TOOLS.find(x=>x.id===id);
    if(!t) return;
    downloadSnippet(t);
  }

  // ---- clipboard helper ----
  function copyToClipboard(text){
    if(!text){ alert('لا يوجد نص للنسخ'); return; }
    navigator.clipboard.writeText(text).then(()=> alert('تم النسخ إلى الحافظة')).catch(()=> alert('فشل النسخ — انسخ يدوياً'));
  }

  // ---- keyboard shortcuts ----
  document.addEventListener('keydown', (e)=>{
    if(e.key === '1'){ btnAll.click(); }
    if(e.key === '2'){ btnPy.click(); }
    if(e.key === '3'){ btnTx.click(); }
    if(e.key === '/'){ e.preventDefault(); searchInput.focus(); }
    if(e.key === 'Escape'){ closeModal(); searchInput.blur(); }
  });

  // ---- init UI ----
  document.addEventListener('DOMContentLoaded', function(){
    buildCards();
    applyFilters();

    // filter buttons
    btnAll.addEventListener('click', ()=>{ currentFilter='all'; setActive(btnAll); applyFilters(); });
    btnPy.addEventListener('click', ()=>{ currentFilter='بايثون'; setActive(btnPy); applyFilters(); });
    btnTx.addEventListener('click', ()=>{ currentFilter='تريمكس'; setActive(btnTx); applyFilters(); });

    function setActive(el){
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      el.classList.add('active');
    }

    // search with debounce
    searchInput.addEventListener('input', function(){
      if(debounce) clearTimeout(debounce);
      debounce = setTimeout(()=> applyFilters(), 120);
    });

    // modal close handlers
    closeModalBtn.addEventListener('click', closeModal);
    modalBack.addEventListener('click', function(e){ if(e.target === modalBack) closeModal(); });

    // small accessibility: announce count in console
    console.log('Tools loaded:', ALL_TOOLS.length);
  });

})();