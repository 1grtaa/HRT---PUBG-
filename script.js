const ownerId = "7056010314";
let userId = localStorage.getItem("userId");

if (!userId) {
  userId = prompt("ادخل ID الخاص بك:");
  localStorage.setItem("userId", userId);
}

let isPro = userId === ownerId;

window.onload = function () {
  if (isPro) {
    document.getElementById("proTools").classList.remove("hidden");
  }
  goTo("home");
};

function goTo(page) {
  const content = document.getElementById("content");
  if (!content) return;

  if (page === "home") {
    content.innerHTML = "<h1>☑️ القائمة الرئيسية</h1><p>🔥 مرحباً بك في موقع الوحش. استمتع بأقوى الأدوات.</p>";
  } else if (page === "chat") {
    content.innerHTML = "<h1>📊 دردشة عامة</h1><p>هنا ستكون دردشة الأعضاء النخبة.</p>";
  } else if (page === "profile") {
    content.innerHTML = `<h1>👤 حسابي</h1>
      <p><strong>ID:</strong> ${userId}</p>
      <p><strong>الاشتراك:</strong> ${isPro ? "✅ PRO مفعل" : "❌ مجاني فقط"}</p>
      ${isPro ? "<p>🎁 لديك صلاحية استخدام كل الأدوات.</p>" : "<p>🚀 اشترك في PRO للتفعيل الكامل.</p>"}`;
  }
}

function searchId() {
  const id = document.getElementById("searchInput").value.trim();
  if (id) {
    alert("🔍 تم البحث عن ID: " + id);
  } else {
    alert("يرجى إدخال ID للبحث ✍️");
  }
}

function showToolsPopup() {
  document.getElementById("tools-popup").classList.remove("hidden");
}

function closeToolsPopup() {
  document.getElementById("tools-popup").classList.add("hidden");
}

function openTool(tool) {
  if (!isPro && ["offset", "protect", "decrypt", "encrypt"].includes(tool)) {
    alert("❌ هذه الأداة متوفرة فقط للمشتركين PRO.");
    return;
  }
  alert("✅ تم فتح الأداة: " + tool);
}
