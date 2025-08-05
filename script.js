function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.tool').forEach(t => t.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function openTool(id) {
  document.querySelectorAll('.tool').forEach(t => t.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function openLink(url) {
  window.open(url, '_blank');
}

function searchUser() {
  const val = document.getElementById('searchInput').value;
  alert(`🔎 تم البحث عن: ${val}`);
}

function sendMessage() {
  const txt = document.getElementById('chatInput').value;
  const box = document.getElementById('chatBox');
  const msg = document.createElement('p');
  msg.textContent = `💬 ${txt} (${txt.split(' ').length} كلمة)`;
  box.appendChild(msg);
  document.getElementById('chatInput').value = '';
}

function sendPrivateMessage() {
  const txt = document.getElementById('privateInput').value;
  const box = document.getElementById('privateBox');
  const msg = document.createElement('p');
  msg.textContent = `🔐 ${txt}`;
  box.appendChild(msg);
  document.getElementById('privateInput').value = '';
}

function extractOffsets() {
  const result = document.getElementById('offsetResult');
  result.textContent = "🧠 جارٍ تحليل الملف... (وهمي)\n[0xABC123] -> MemoryPatch::create(...)";
}

function copyOffsets() {
  const result = document.getElementById('offsetResult').textContent;
  navigator.clipboard.writeText(result);
  alert("✅ تم نسخ الأوفستات!");
}

function decrypt() {
  const input = document.getElementById('decryptInput').value;
  try {
    const decoded = atob(input);
    document.getElementById('decryptResult').textContent = decoded;
  } catch {
    document.getElementById('decryptResult').textContent = "❌ خطأ في فك التشفير";
  }
}

function encrypt() {
  const input = document.getElementById('encryptInput').value;
  try {
    const encoded = btoa(input);
    document.getElementById('encryptResult').textContent = encoded;
  } catch {
    document.getElementById('encryptResult').textContent = "❌ خطأ في التشفير";
  }
}
