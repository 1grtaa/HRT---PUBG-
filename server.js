const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const API_KEY = process.env.API_KEY;
const SECRET = process.env.SECRET_KEY;

// ⚙️ إعدادات
const SYMBOL = "BTCUSDT";
const RISK_PERCENT = 0.02; // 2%
const TRADE_INTERVAL = 10000;

let prices = [];
let lastTrade = null;

// 📊 جلب السعر
async function getPrice() {
    let res = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${SYMBOL}`);
    return parseFloat(res.data.price);
}

// 📈 RSI
function calculateRSI() {
    if (prices.length < 14) return 50;

    let gains = 0, losses = 0;

    for (let i = 1; i < prices.length; i++) {
        let diff = prices[i] - prices[i-1];
        if (diff > 0) gains += diff;
        else losses -= diff;
    }

    let rs = gains / (losses || 1);
    return 100 - (100 / (1 + rs));
}

// 📉 EMA
function calculateEMA(period) {
    if (prices.length < period) return prices[prices.length - 1];

    let k = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
        ema = prices[i] * k + ema * (1 - k);
    }

    return ema;
}

// 📊 الاتجاه
function getTrend() {
    let short = calculateEMA(5);
    let long = calculateEMA(15);
    return short > long ? "UP" : "DOWN";
}

// ⚡ فلترة السوق
function isMarketGood() {
    let volatility = Math.abs(prices[prices.length - 1] - prices[0]);
    return volatility > 5; // غير الرقم حسب العملة
}

// 💰 حساب الكمية
function getQuantity(balance, price) {
    return ((balance * RISK_PERCENT) / price).toFixed(6);
}

// 💰 تنفيذ صفقة
async function trade(side, quantity) {

    let timestamp = Date.now();

    let query = `symbol=${SYMBOL}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;

    let signature = crypto
        .createHmac("sha256", SECRET)
        .update(query)
        .digest("hex");

    let url = `https://api.binance.com/api/v3/order?${query}&signature=${signature}`;

    let res = await axios.post(url, {}, {
        headers: { "X-MBX-APIKEY": API_KEY }
    });

    return res.data;
}

// 🧠 اتخاذ القرار
function generateSignal() {

    let rsi = calculateRSI();
    let trend = getTrend();

    if (!isMarketGood()) return "WAIT";

    if (rsi < 35 && trend === "UP") return "BUY";
    if (rsi > 65 && trend === "DOWN") return "SELL";

    return "WAIT";
}

// 🚀 تشغيل البوت
app.post("/start", async (req, res) => {

    console.log("🚀 Bot Started");

    let balance = 1000; // تقديري (تقدر تجيبه من Binance API لاحقًا)

    setInterval(async () => {

        try {

            let price = await getPrice();
            prices.push(price);
            if (prices.length > 50) prices.shift();

            let signal = generateSignal();

            console.log("📊 Price:", price, "Signal:", signal);

            // منع تكرار نفس الصفقة
            if (signal === lastTrade || signal === "WAIT") return;

            let quantity = getQuantity(balance, price);

            let result = await trade(signal, quantity);

            lastTrade = signal;

            console.log("✅ TRADE:", result);

        } catch (e) {
            console.log("❌ ERROR:", e.response?.data || e.message);
        }

    }, TRADE_INTERVAL);

    res.json({ status: "Bot Running 🚀" });
});

app.listen(3000, () => console.log("🔥 Server on 3000"));    return 100 - (100 / (1 + rs));
}

// 💰 تنفيذ صفقة حقيقية
async function trade(side) {

    let timestamp = Date.now();

    let query = `symbol=BTCUSDT&side=${side}&type=MARKET&quantity=0.001&timestamp=${timestamp}`;

    let signature = crypto
        .createHmac("sha256", SECRET)
        .update(query)
        .digest("hex");

    let url = `https://api.binance.com/api/v3/order?${query}&signature=${signature}`;

    let res = await axios.post(url, {}, {
        headers: { "X-MBX-APIKEY": API_KEY }
    });

    return res.data;
}

// 🚀 بدء البوت
app.post("/start", async (req, res) => {

    console.log("🚀 Bot Started");

    setInterval(async () => {

        let price = await getPrice();
        prices.push(price);
        if (prices.length > 20) prices.shift();

        let rsi = calculateRSI();

        let signal = "WAIT";

        if (rsi < 30) signal = "BUY";
        if (rsi > 70) signal = "SELL";

        console.log("Signal:", signal, "RSI:", rsi);

        if (signal !== "WAIT") {
            try {
                let result = await trade(signal);
                console.log("✅ TRADE DONE:", result);
            } catch (e) {
                console.log("❌ ERROR:", e.response?.data || e.message);
            }
        }

    }, 10000);

    res.json({ status: "Bot Started Successfully" });
});
// 💰 تنفيذ صفقة حقيقية
async function trade(side) {

    let timestamp = Date.now();

    let query = `symbol=BTCUSDT&side=${side}&type=MARKET&quantity=0.001&timestamp=${timestamp}`;

    let signature = crypto
        .createHmac("sha256", SECRET)
        .update(query)
        .digest("hex");

    let url = `https://api.binance.com/api/v3/order?${query}&signature=${signature}`;

    let res = await axios.post(url, {}, {
        headers: { "X-MBX-APIKEY": API_KEY }
    });

    return res.data;
}

// 🚀 بدء البوت
app.post("/start", async (req, res) => {

    API_KEY = req.body.api;
    SECRET = req.body.secret;

    setInterval(async () => {

        let price = await getPrice();
        prices.push(price);
        if (prices.length > 20) prices.shift();

        let rsi = calculateRSI();

        let signal = "WAIT";

        if (rsi < 30) signal = "BUY";
        if (rsi > 70) signal = "SELL";

        console.log("Signal:", signal, "RSI:", rsi);

        if (signal !== "WAIT") {
            try {
                let result = await trade(signal);
                console.log("TRADE DONE:", result);
            } catch (e) {
                console.log("ERROR:", e.response?.data || e.message);
            }
        }

    }, 10000);

    res.json({ status: "Bot Started" });
});

app.listen(3000, () => console.log("🔥 Server running on port 3000"));
