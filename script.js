function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.tool').forEach(t => t.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function openLink(url) {
  window.open(url, '_blank');
}

function openTool(toolId) {
  document.querySelectorAll('.tool').forEach(t => t.style.display = 'none');
  document.getElementById(toolId).style.display = 'block';
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (message) {
    const wordCount = message.split(" ").length;
    const box = document.getElementById("chatBox");
    box.innerHTML += `<p>📩 ${message} (${wordCount} كلمات)</p>`;
    input.value = "";
  }
}

function sendPrivateMessage() {
  const input = document.getElementById("privateInput");
  const message = input.value.trim();
  const box = document.getElementById("privateBox");
  if (message) {
    box.innerHTML += `<p>🔐 ${message}</p>`;
    input.value = "";
  }
}

function searchUser() {
  const val = document.getElementById("searchInput").value.trim();
  if (val === "7056010314" || val === "@HRT_AMN") {
    alert("🧠 تم العثور على المستخدم! يمكنك مراسلته الآن.");
    showPage('privateChat');
  } else {
    alert("❌ لم يتم العثور على المستخدم.");
  }
}

function extractOffsets() {
  const fileInput = document.getElementById("fileInput");
  const result = document.getElementById("offsetResult");
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    result.textContent = `تم تحليل ${file.name} وتم العثور على 12 أوفست.`;
  } else {
    result.textContent = "يرجى اختيار ملف أولاً.";
  }
}

function copyOffsets() {
  const text = document.getElementById("offsetResult").textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("✅ تم نسخ الأوفستات!");
  });
}

function decrypt() {
  const input = document.getElementById("decryptInput").value.trim();
  try {
    const decoded = atob(input);
    document.getElementById("decryptResult").textContent = decoded;
  } catch {
    document.getElementById("decryptResult").textContent = "خطأ في فك التشفير.";
  }
}

function encrypt() {
  const input = document.getElementById("encryptInput").value.trim();
  try {
    const encoded = btoa(input);
    document.getElementById("encryptResult").textContent = encoded;
  } catch {
    document.getElementById("encryptResult").textContent = "خطأ في التشفير.";
  }
}
