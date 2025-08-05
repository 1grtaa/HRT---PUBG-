const ownerId = "7056010314";
let userId = localStorage.getItem("userId");
let fullName = localStorage.getItem("fullName");

if (!userId) {
  userId = prompt("ادخل ID تيليجرام:");
  localStorage.setItem("userId", userId);
}
if (!fullName) {
  fullName = prompt("ادخل اسمك الكامل:");
  localStorage.setItem("fullName", fullName);
}

let isPro = userId === ownerId || localStorage.getItem(`pro-${userId}`) === "true";

window.onload = function () {
  if (isPro) {
    document.getElementById("proTools").classList.remove("hidden");
  }

  goTo("home");

  const userImage = document.getElementById("userImage");
  if (userImage && userId) {
    userImage.src = `https://t.me/i/userpic/320/${userId}.jpg`;
  }
};

function goTo(page) {
  const content = document.getElementById("content");
  if (!content) return;

  if (page === "home") {
    content.innerHTML = "<h1>☑️ الرئيسية</h1><p>🔥 استمتع بأقوى أدوات الهكر.</p>";
  } else if (page === "chat") {
    content.innerHTML = "<h1>📊 دردشة عامة</h1><p>هنا الدردشة الجماعية للكل.</p>";
  } else if (page === "profile") {
    content.innerHTML = `
      <h1>👤 حسابي</h1>
      <p><strong>الاسم:</strong> ${fullName}</p>
      <p><strong>ID:</strong> ${userId}</p>
      <p><strong>الاشتراك:</strong> ${isPro ? "✅ PRO مفعل" : "❌ مجاني فقط"}</p>
      ${isPro ? "<p>🎁 لديك كل الصلاحيات.</p>" : "<button onclick='activatePro()'>🚀 تفعيل PRO</button>"}
    `;
  }
}

function searchId() {
  const id = document.getElementById("searchInput").value.trim();
  if (id) {
    alert("📇 تم العثور على المستخدم ID: " + id);
    localStorage.setItem("userId", id);
    location.reload();
  } else {
    alert("يرجى إدخال ID");
  }
}

function activatePro() {
  localStorage.setItem(`pro-${userId}`, "true");
  alert("✅ تم تفعيل PRO");
  location.reload();
}

function goToToolPage(page) {
  if (!isPro && page !== "ai.html" && page !== "basic.html") {
    alert("❌ هذه الأداة متاحة فقط للمشتركين PRO");
    return;
  }
  window.location.href = page;
}

function showToolsPopup() {
  document.getElementById("tools-popup").classList.remove("hidden");
}

function closeToolsPopup() {
  document.getElementById("tools-popup").classList.add("hidden");
}
