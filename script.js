let isPro = false;

function loadPage(page) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  const content = document.getElementById('main-content');

  switch (page) {
    case 'home':
      content.innerHTML = `
        <h2>أهلاً بك في موقع المطورين!</h2>
        <p>قم باستخدام الأدوات أو تفعيل اشتراك Pro للوصول إلى ميزات إضافية.</p>
        <button onclick="subscribePro()">🔓 اشتراك Pro</button>
      `;
      break;

    case 'tools':
      content.innerHTML = `
        <h2>الأدوات المجانية</h2>
        <div class="tool-section">
          <div class="tool">🖼️ أداة 1</div>
          <div class="tool">📁 أداة 2</div>
        </div>

        <h2>أدوات Pro</h2>
        ${isPro ? `
        <div class="tool-section">
          <div class="tool">🛠️ استخراج ID</div>
          <div class="tool">📊 تحليل بيانات</div>
          <div class="tool">📌 لصق معلومات</div>
        </div>
        ` : `<p>🔒 يجب الاشتراك للوصول إلى أدوات Pro.</p>`}
      `;
      break;

    case 'chat':
      content.innerHTML = `<h2>💬 الدردشة العامة</h2><p>عرض الرسائل العامة هنا.</p>`;
      break;

    case 'private':
      content.innerHTML = `<h2>🔒 الدردشة الخاصة</h2><p>ابدأ محادثة خاصة مع الأصدقاء.</p>`;
      break;

    case 'profile':
      content.innerHTML = `
        <h2>👤 حسابي</h2>
        <p>الاسم: المستخدم VIP ✅</p>
        <p>نوع الاشتراك: ${isPro ? 'Pro 🟢' : 'مجاني 🔴'}</p>
        <button onclick="subscribePro()">🔓 تفعيل اشتراك Pro</button>
      `;
      break;
  }
}

function subscribePro() {
  const confirmPay = confirm("هل تريد الدفع عبر آسيا سيل لتفعيل الاشتراك Pro؟");

  if (confirmPay) {
    alert("تم إرسال طلب الدفع للبوت، يرجى إتمام الدفع.");
    window.open("https://t.me/lllllllllIlllbot", "_blank");
    
    // لمحاكاة نجاح الدفع:
    setTimeout(() => {
      alert("✅ تم تفعيل الاشتراك Pro بنجاح!");
      isPro = true;
      loadPage('tools');
    }, 5000); // بعد 5 ثوانٍ من المحاكاة
  }
}
