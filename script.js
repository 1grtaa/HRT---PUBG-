// server.js

const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

let API_KEY = "";
let SECRET = "";

// 📊 جلب بيانات السوق من Binance
async function getMarketData(symbol = "BTCUSDT") {
    const res = await axios.get(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=100`
    );
    return res.data;
}

// 📈 حساب RSI
function calculateRSI(data) {
    let gains = 0, losses = 0;

    for (let i = 1; i < data.length; i++) {
        let diff = data[i][4] - data[i - 1][4];
        if (diff > 0) gains += diff;
        else losses -= diff;
    }

    let rs = gains / losses;
    return 100 - (100 / (1 + rs));
}

// 📉 تحديد الاتجاه
function getTrend(data) {
    let first = data[0][4];
    let last = data[data.length - 1][4];

    return last > first ? "UP" : "DOWN";
}

// 🔥 توليد إشارة احترافية
function generateSignal(data) {
    let rsi = calculateRSI(data);
    let trend = getTrend(data);

    if (rsi < 30 && trend === "UP") return "BUY";
    if (rsi > 70 && trend === "DOWN") return "SELL";

    return "WAIT";
}

// 🚀 API
app.post("/start", async (req, res) => {
    API_KEY = req.body.api;
    SECRET = req.body.secret;

    let data = await getMarketData();
    let signal = generateSignal(data);

    res.json({ signal });
});

app.listen(3000, () => console.log("Server running..."));
