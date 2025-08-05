// بيانات الاشتراك PRO
const ownerId = "7056010314"; // مالك الموقع
const userId = prompt("ادخل ID الخاص بك:");

// تحقق إذا المستخدم هو صاحب الموقع أو مشترك PRO
let isPro = (userId === ownerId);

// عند تشغيل الموقع
window.onload = function () {
  if (isPro) {
    document.getElementById("proTools").classList.remove("hidden");
  }
};

function goTo(page) {
  const content = document.getElementById("content");
  if (!content) return;

  if (page === "home") {
    content.innerHTML = "<h1>☑️ القائمة الرئيسية</h1><p>مرحباً بك من جديد يا وحش 😈</p>";
  } else if (page === "chat") {
    content.innerHTML = "<h1>📊 دردشة عامة</h1><p>هنا راح تكون دردشة الأعضاء.</p>";
  } else if (page === "profile") {
    content.innerHTML = `<h1>👤 حسابي</h1>
    <p><strong>ID:</strong> ${userId}</p>
    <p><strong>الاشتراك:</strong> ${isPro ? "✅ PRO مفعل" : "❌ مجاني فقط"}</p>`;
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
    alert("❌ هذه الأداة مخصصة لمشتركي PRO فقط.");
    return;
  }

  alert("🚀 تم فتح الأداة: " + tool);
}
