let running = false;

let wins = 0;
let losses = 0;
let aiBoost = 0;

async function getData(symbol) {
  let res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=100`);
  let data = await res.json();
  return data.map(c => parseFloat(c[4]));
}

// RSI
function calcRSI(data) {
  let gains = 0, losses = 0;
  for (let i = 1; i < data.length; i++) {
    let d = data[i] - data[i - 1];
    if (d > 0) gains += d;
    else losses -= d;
  }
  let rs = gains / losses;
  return 100 - (100 / (1 + rs));
}

// EMA
function calcEMA(data, p) {
  let k = 2 / (p + 1);
  let ema = data[0];
  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }
  return ema;
}

// تحليل
function analyze(data) {
  let rsi = calcRSI(data);
  let ema9 = calcEMA(data, 9);
  let ema21 = calcEMA(data, 21);
  let last = data[data.length - 1];

  let buy = 0, sell = 0;

  if (rsi < 30) buy++;
  if (rsi > 70) sell++;

  if (ema9 > ema21) buy++;
  if (ema9 < ema21) sell++;

  if (last > data[data.length - 2]) buy++;
  else sell++;

  let total = Math.max(buy, sell);

  let signal = "انتظار";
  if (buy > sell) signal = "شراء 🚀";
  else if (sell > buy) signal = "بيع 🔻";

  let confidence = 60 + total * 10 + aiBoost;

  let strength = "ضعيف";
  if (total == 2) strength = "متوسط";
  if (total == 3) strength = "قوي جداً";

  return { signal, confidence, strength, agree: total };
}

// تشغيل
async function startBot() {
  running = true;
  document.getElementById("status").innerText = "يحلل السوق...";

  while (running) {
    let symbol = document.getElementById("symbol").value;

    let data = await getData(symbol);
    let result = analyze(data);

    document.getElementById("signal").innerText = result.signal;
    document.getElementById("confidence").innerText = Math.floor(result.confidence) + "%";
    document.getElementById("strength").innerText = result.strength;
    document.getElementById("agree").innerText = result.agree;
    document.getElementById("time").innerText = "60 ثانية";

    // انتظار انتهاء الصفقة
    await new Promise(r => setTimeout(r, 60000));
  }
}

// إيقاف
function stopBot() {
  running = false;
  document.getElementById("status").innerText = "متوقف";
}

// AI تعلم
function recordWin() {
  wins++;
  aiBoost += 2;
  document.getElementById("wins").innerText = wins;
}

function recordLoss() {
  losses++;
  aiBoost -= 2;
  document.getElementById("losses").innerText = losses;
 rn                                   }rnif (rsi > 70) return "SELL 🔴";
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
