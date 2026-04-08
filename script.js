let running = false;

async function getData() {
async function getData() {
  let url = "https://api.allorigins.win/raw?url=" + encodeURIComponent(
    "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=50"
  );

  let res = await fetch(url);
  let data = await res.json();

  let closes = data.map(c => parseFloat(c[4]));

  let gains = 0, losses = 0;
  for (let i = 1; i < closes.length; i++) {
    let diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  let rs = losses === 0 ? 100 : gains / losses;
  let rsi = 100 - (100 / (1 + rs));

  let price = closes[closes.length - 1];

  return { price, rsi };
}

function analyze(rsi) {
  if (rsi < 30) return "BUY 🟢";
  if (rsi > 70) return "SELL 🔴";
  return "WAIT ⏳";
}

async function runBot() {
  if (!running) return;

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
