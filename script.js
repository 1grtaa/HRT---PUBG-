function hideAll() {
  document.querySelectorAll(".page, .tool").forEach(e => e.style.display = "none");
}

function goBack() {
  hideAll();
  document.getElementById("main").style.display = "block";
}

function openPage(id) {
  hideAll();
  document.getElementById(id).style.display = "block";
}

function showTool(id) {
  hideAll();
  document.getElementById(id).style.display = "block";
}

function encrypt() {
  const input = document.getElementById("encryptInput").value;
  try {
    document.getElementById("encryptResult").innerText = btoa(input);
  } catch {
    document.getElementById("encryptResult").innerText = "⚠️ خطأ في التشفير";
  }
}

function decrypt() {
  const input = document.getElementById("decryptInput").value;
  try {
    document.getElementById("decryptResult").innerText = atob(input);
  } catch {
    document.getElementById("decryptResult").innerText = "⚠️ خطأ في فك التشفير";
  }
}

function searchId() {
  const id = document.getElementById("searchInput").value;
  if (id === "7056010314") {
    alert("✅ هذا حساب المالك");
  } else {
    alert("❌ لم يتم العثور على ID");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const isProUser = true; // عدّل حسب نظام الاشتراك الفعلي لاحقاً
  if (!isProUser) {
    document.querySelectorAll(".tools-list button").forEach(btn => {
      btn.disabled = true;
      btn.innerText += " 🔒 Requires PRO";
    });
  }
});
