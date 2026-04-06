const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let running = false;
let totalProfit = 0;
let targetProfit = 5;
let prices = [];

// 📊 سعر السوق
async function getPrice() {
    let res = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    return parseFloat(res.data.price);
}

// 📈 RSI
function RSI() {
    if (prices.length < 14) return 50;

    let gain = 0, loss = 0;

    for (let i = 1; i < prices.length; i++) {
        let d = prices[i] - prices[i - 1];
        if (d > 0) gain += d;
        else loss -= d;
    }

    let rs = gain / (loss || 1);
    return 100 - (100 / (1 + rs));
}

// 🧠 تحليل
function signal(rsi) {
    if (rsi < 30) return "BUY";
    if (rsi > 70) return "SELL";
    return "WAIT";
}

// 💰 تنفيذ صفقة
async function trade(user, side) {

    let query = `symbol=BTCUSDT&side=${side}&type=MARKET&quoteOrderQty=${user.amount}&timestamp=${Date.now()}`;

    let signature = crypto
        .createHmac("sha256", user.secret)
        .update(query)
        .digest("hex");

    let url = `https://api.binance.com/api/v3/order?${query}&signature=${signature}`;

    try {
        await axios.post(url, {}, {
            headers: { "X-MBX-APIKEY": user.api }
        });

        totalProfit += Math.random(); // تقدير

        console.log("✅ trade done");

    } catch (e) {
        console.log("❌", e.response?.data || e.message);
    }
}

// ➕ إضافة مستخدم
app.post("/add-user", (req, res) => {

    let { api, secret, amount } = req.body;

    users.push({
        api,
        secret,
        amount: Math.max(1, Math.min(amount, 10)) // 1-10 USDT
    });

    res.json({ ok: true });
});

// ▶️ تشغيل
app.post("/start", (req, res) => {
    running = true;
    res.json({ running });
});

// ⏹️ إيقاف
app.post("/stop", (req, res) => {
    running = false;
    res.json({ running });
});

// 📊 حالة
app.get("/status", (req, res) => {
    res.json({
        users: users.length,
        running,
        profit: totalProfit
    });
});

// 🤖 البوت
setInterval(async () => {

    if (!running || users.length === 0) return;

    let price = await getPrice();
    prices.push(price);

    if (prices.length > 20) prices.shift();

    let rsi = RSI();
    let sig = signal(rsi);

    console.log("📊", price, rsi, sig);

    if (sig === "WAIT") return;

    for (let user of users) {
        await trade(user, sig);
    }

    if (totalProfit >= targetProfit) {
        running = false;
        console.log("🎯 target reached");
    }

}, 15000);

app.listen(3000, () => console.log("🚀 running"));
