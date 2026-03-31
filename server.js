const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let prices = [];

// 📊 سعر
async function getPrice() {
    let res = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    return parseFloat(res.data.price);
}

// 📈 RSI
function calculateRSI() {
    if (prices.length < 14) return 50;

    let gains = 0, losses = 0;

    for (let i = 1; i < prices.length; i++) {
        let diff = prices[i] - prices[i - 1];
        if (diff > 0) gains += diff;
        else losses -= diff;
    }

    let rs = gains / (losses || 1);
    return 100 - (100 / (1 + rs));
}

// 🧠 قرار
function decide(rsi) {
    if (rsi < 30) return "BUY";
    if (rsi > 70) return "SELL";
    return "WAIT";
}

// 💰 تنفيذ صفقة (Spot فقط)
async function trade(user, side) {

    let timestamp = Date.now();

    let quantity = user.amount / user.lastPrice;

    let query = `symbol=BTCUSDT&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;

    let signature = crypto
        .createHmac("sha256", user.secret)
        .update(query)
        .digest("hex");

    let url = `https://api.binance.com/api/v3/order?${query}&signature=${signature}`;

    try {
        await axios.post(url, {}, {
            headers: { "X-MBX-APIKEY": user.api }
        });

        console.log("✅ Trade done for user");
    } catch (err) {
        console.log("❌ Trade error");
    }
}

// ➕ إضافة مستخدم
app.post("/add-user", (req, res) => {

    let { api, secret, amount, targetProfit } = req.body;

    users.push({
        api,
        secret,
        amount: Number(amount),
        targetProfit: Number(targetProfit),
        profit: 0,
        active: true,
        lastPrice: 0
    });

    res.json({ msg: "User added" });
});

// 📊 إشارات
app.get("/signal", async (req, res) => {

    let price = await getPrice();
    prices.push(price);

    if (prices.length > 20) prices.shift();

    let rsi = calculateRSI();
    let signal = decide(rsi);

    res.json({ price, rsi, signal });
});

// 👥 عدد المستخدمين
app.get("/users-count", (req, res) => {
    res.json({ count: users.length });
});

// 🤖 البوت
setInterval(async () => {

    if (users.length === 0) return;

    let price = await getPrice();
    prices.push(price);

    if (prices.length > 20) prices.shift();

    let rsi = calculateRSI();
    let signal = decide(rsi);

    for (let user of users) {

        if (!user.active) continue;

        user.lastPrice = price;

        if (signal === "WAIT") continue;

        await trade(user, signal);

        // حساب ربح بسيط
        if (Math.random() > 0.5) {
            user.profit += user.amount * 0.01;
        } else {
            user.profit -= user.amount * 0.005;
        }

        // 🎯 وقف عند الهدف
        if (user.profit >= user.targetProfit) {
            user.active = false;
            console.log("🎯 Target reached - stop trading");
        }
    }

}, 15000);

app.listen(3000, () => console.log("🚀 Server Running"));
