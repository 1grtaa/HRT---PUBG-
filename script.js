let messages = [];

function showPage(id) {
  document.querySelectorAll('.page, .tool').forEach(p => p.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function openLink(url) {
  window.open(url, "_blank");
}

function openTool(id) {
  showPage(id);
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (text) {
    const count = text.split(' ').length;
    messages.push(`📩 ${text} (${count} كلمة)`);
    updateChat();
    input.value = '';
  }
}

function updateChat() {
  const box = document.getElementById('chatBox');
  box.innerHTML = messages.map(m => `<div>${m}</div>`).join('');
}

function searchUser() {
  const q = document.getElementById('searchInput').value.trim();
  if (q === '7056010314' || q.toLowerCase() === '@hrt_amn') {
    alert('🔍 تم العثور على المستخدم!\nالاسم: @HRT_AMN\nID: 7056010314');
  } else {
    alert('❌ المستخدم غير موجود');
  }
}

function extractOffsets() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) return alert("يرجى اختيار ملف");
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    const lines = content.split('\\n').slice(0, 5).map((line, i) => `0x${(1000+i*4).toString(16)}: ${line}`);
    document.getElementById('offsetResult').textContent = lines.join('\\n');
  };
  reader.readAsText(file);
}

function copyOffsets() {
  const text = document.getElementById('offsetResult').textContent;
  navigator.clipboard.writeText(text).then(() => alert("✅ تم نسخ الأوفستات"));
}

function decrypt() {
  const input = document.getElementById('decryptInput').value;
  try {
    document.getElementById('decryptResult').textContent = atob(input);
  } catch {
    alert("⚠️ النص غير صالح");
  }
}

function encrypt() {
  const input = document.getElementById('encryptInput').value;
  document.getElementById('encryptResult').textContent = btoa(input);
}
