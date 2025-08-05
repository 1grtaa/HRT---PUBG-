let isPro = true; // ← غيرها حسب حالة الاشتراك

function searchId() {
  const id = document.getElementById("searchInput").value;
  if (id === "7056010314") {
    alert("✔️ تم العثور على المالك: @HRT_AMN");
    window.location.href = "profile.html";
  } else {
    alert("تم العثور على المستخدم: " + id);
    // هنا يمكن توجيهه إلى صفحة المستخدم
  }
}

function showToolsPopup() {
  document.getElementById("tools-popup").classList.remove("hidden");
}

function closeToolsPopup() {
  document.getElementById("tools-popup").classList.add("hidden");
}

function goToToolPage(page) {
  if (!isPro && !["ai.html", "basic.html"].includes(page)) {
    alert("❌ هذه الأداة للمستخدمين PRO فقط.");
    return;
  }
  window.location.href = page;
}

function goTo(section) {
  alert("🚧 الانتقال إلى قسم: " + section + " (قيد التطوير)");
}
