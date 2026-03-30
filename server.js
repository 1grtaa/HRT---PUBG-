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

// 📊 جلب بيانات السوق
async function getPrice() {
    let res = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    return parseFloat(res.data.price);
}

// 📈 RSI
let prices = [];

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
