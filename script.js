let running = false;

async function fetchData() {
  try {
    // المصدر الأول
    let res = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=50");
    let data = await res.json();
    if (Array.isArray(data)) return data;
    throw "fail";
  } catch {
    try {
      // fallback
      let res = await fetch("https://api.binance.us/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=50");
      let data = await res.json();
      return data;
    } catch {
      return null;
    }
  }
}

function calculateRSI(closes) {
  let gains = 0, losses = 0;

  for (let i = 1; i < closes.length; i++) {
    let diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  let rs = losses === 0 ? 100 : gains / losses;
  return 100 - (100 / (1 + rs));
}

function getSignal(rsi) {
  if (rsi < 30) return "BUY 🟢";
  if (rsi > 70) return "SELL 🔴";
  return "WAIT ⏳";
}

async function runBot() {
  if (!running) return;

  let data = await fetchData();

  if (!data) {
    document.getElementById("signal").innerText = "API ERROR ❌";
    setTimeout(runBot, 5000);
    return;
  }

  let closes = data.map(c => parseFloat(c[4]));
  let price = closes[closes.length - 1];
  let rsi = calculateRSI(closes);
  let signal = getSignal(rsi);

  document.getElementById("price").innerText = price.toFixed(2);
  document.getElementById("rsi").innerText = rsi.toFixed(2);
  document.getElementById("signal").innerText = signal;

  setTimeout(runBot, 4000);
}

function startBot() {
  running = true;
  runBot();
}

function stopBot() {
  running = false;
}
  try {
    let { price, rsi } = await getData();

    document.getElementById("price").innerText = price.toFixed(2);
    document.getElementById("rsi").innerText = rsi.toFixed(2);

    let signal = analyze(rsi);
    document.getElementById("signal").innerText = signal;

  } catch (e) {
    console.log("Error", e);
  }

  setTimeout(runBot, 5000);
}

function startBot() {
  running = true;
  runBot();
}

function stopBot() {
  running = false;
}
