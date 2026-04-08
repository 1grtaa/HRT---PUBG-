let running = false;

function getSignal() {
  let rsi = Math.random() * 100;
  let trend = Math.random();

  if (rsi < 30 && trend > 0.5) return "BUY 🟢";
  if (rsi > 70 && trend < 0.5) return "SELL 🔴";
  return "WAIT ⏳";
}

function runBot() {
  if (!running) return;

  let signal = getSignal();
  document.getElementById("signal").innerText = signal;

  setTimeout(runBot, 3000);
}

function startBot() {
  running = true;
  document.getElementById("status").innerText = "يعمل";
  runBot();
}

function stopBot() {
  running = false;
  document.getElementById("status").innerText = "متوقف";
}
