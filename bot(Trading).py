import pandas as pd
import numpy as np
import requests
import asyncio
from ta.momentum import RSIIndicator
from ta.trend import MACD
from sklearn.ensemble import RandomForestClassifier
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# =====================
# 🔑 الإعدادات
# =====================
TOKEN = "7966841139:AAFoViD88kRgcdjCWEShg69LOZw7tiRUSjA"
NEWS_API_KEY = "7056010314"

selected_pair = "BTCUSDT"
auto_mode = False

# =====================
# 🧠 نموذج AI
# =====================
model = RandomForestClassifier(n_estimators=100)
trained = False

X_data = []
y_data = []

# =====================
# 📰 الأخبار
# =====================
def check_news():
    try:
        url = f"https://forexnewsapi.com/api/v1/economic-calendar?date=today&importance=high&token={NEWS_API_KEY}"
        data = requests.get(url).json()
        return "data" in data and len(data["data"]) > 0
    except:
        return False

# =====================
# 📊 بيانات السوق
# =====================
def get_data():
    url = f"https://api.binance.com/api/v3/klines?symbol={selected_pair}&interval=1m&limit=100"
    data = requests.get(url).json()

    df = pd.DataFrame(data)
    df[4] = df[4].astype(float)  # close
    df[5] = df[5].astype(float)  # volume

    return df

# =====================
# 🧠 استخراج الميزات
# =====================
def extract_features(df):
    close = df[4]
    volume = df[5]

    rsi = RSIIndicator(close).rsi().iloc[-1]

    macd = MACD(close)
    macd_val = macd.macd().iloc[-1]
    macd_sig = macd.macd_signal().iloc[-1]

    ema50 = close.ewm(span=50).mean().iloc[-1]
    ema200 = close.ewm(span=200).mean().iloc[-1]

    trend = 1 if ema50 > ema200 else 0
    vol_strength = volume.iloc[-1] / volume.mean()

    return [rsi, macd_val, macd_sig, trend, vol_strength]

# =====================
# 📈 التحليل
# =====================
def analyze():

    if check_news():
        return "📰 خبر اقتصادي قوي → توقف التداول ⛔"

    df = get_data()
    features = extract_features(df)

    global trained

    if trained:
        pred = model.predict([features])[0]
        confidence = max(model.predict_proba([features])[0]) * 100
    else:
        # fallback
        rsi = features[0]
        pred = 1 if rsi < 30 else 0
        confidence = 70

    direction = "🔼 صعود" if pred == 1 else "🔽 نزول"

    # ⏱ وقت الصفقة الذكي
    if confidence > 90:
        duration = "30ث"
    elif confidence > 80:
        duration = "1د"
    elif confidence > 70:
        duration = "2د"
    else:
        duration = "3د"

    return direction, confidence, duration, features

# =====================
# 🧠 التعلم
# =====================
def learn(features, result):
    global trained

    X_data.append(features)
    y_data.append(result)

    if len(X_data) > 20:
        model.fit(X_data, y_data)
        trained = True

# =====================
# 🤖 الإشارات التلقائية
# =====================
async def auto_signals(context):
    global auto_mode

    while auto_mode:
        result = analyze()

        if isinstance(result, str):
            await context.bot.send_message(
                chat_id=context.job.chat_id,
                text=result
            )
        else:
            direction, confidence, duration, features = result

            msg = f"""
🔥 AI SIGNAL 🔥

📊 {selected_pair}
{direction}

🧠 الثقة: {round(confidence,2)}%
⏱ وقت الصفقة: {duration}
"""

            await context.bot.send_message(
                chat_id=context.job.chat_id,
                text=msg
            )

            # ❗ هنا المستخدم يقرر النتيجة لاحقًا
            # مثال: learn(features, 1) أو 0

        await asyncio.sleep(30)

# =====================
# 🎛️ الأوامر
# =====================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🔥 ULTIMATE AI BOT جاهز")

async def auto(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global auto_mode
    auto_mode = True
    await update.message.reply_text("🚀 تشغيل الإشارات")

    context.job_queue.run_once(auto_signals, 0, chat_id=update.effective_chat.id)

async def stop(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global auto_mode
    auto_mode = False
    await update.message.reply_text("⛔ تم الإيقاف")

# =====================
# 🚀 تشغيل
# =====================
app = ApplicationBuilder().token(TOKEN).build()

app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("auto", auto))
app.add_handler(CommandHandler("stop", stop))

print("🔥 BOT RUNNING...")
app.run_polling()