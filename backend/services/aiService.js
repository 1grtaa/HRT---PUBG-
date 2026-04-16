class AIService {
    static analyzeMarket(ohlcv) {
        if (!ohlcv || ohlcv.length < 50) {
            return { rsi: 50, macd: 'محايد', prediction: 'غير متوفر', confidence: 0 };
        }
        
        const closes = ohlcv.map(c => c[4]);
        
        // حساب RSI
        const rsi = this.calculateRSI(closes, 14);
        
        // حساب MACD
        const macd = this.calculateMACD(closes);
        
        // تحديد الاتجاه
        const sma20 = this.calculateSMA(closes, 20);
        const sma50 = this.calculateSMA(closes, 50);
        const trend = closes[closes.length - 1] > sma20 ? 'صاعد' : 'هابط';
        
        // التوقع
        let prediction = 'محايد';
        let confidence = 50;
        
        if (rsi < 30 && trend === 'صاعد') {
            prediction = 'شراء قوي';
            confidence = 75;
        } else if (rsi > 70 && trend === 'هابط') {
            prediction = 'بيع قوي';
            confidence = 75;
        } else if (rsi < 40 && closes[closes.length - 1] > sma20) {
            prediction = 'شراء';
            confidence = 60;
        } else if (rsi > 60 && closes[closes.length - 1] < sma20) {
            prediction = 'بيع';
            confidence = 60;
        }
        
        // تحسين الثقة باستخدام MACD
        if (macd.histogram > 0 && macd.macd > macd.signal) {
            confidence += 10;
        } else if (macd.histogram < 0 && macd.macd < macd.signal) {
            confidence -= 10;
        }
        
        confidence = Math.min(95, Math.max(30, confidence));
        
        return {
            rsi: parseFloat(rsi.toFixed(2)),
            macd: macd.histogram > 0 ? 'إيجابي' : 'سلبي',
            trend,
            prediction,
            confidence: Math.round(confidence),
            support: this.findSupport(closes),
            resistance: this.findResistance(closes)
        };
    }
    
    static calculateRSI(prices, period = 14) {
        if (prices.length < period + 1) return 50;
        
        let gains = 0, losses = 0;
        
        for (let i = prices.length - period; i < prices.length; i++) {
            const change = prices[i] - prices[i - 1];
            if (change > 0) gains += change;
            else losses -= change;
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        
        if (avgLoss === 0) return 100;
        
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }
    
    static calculateSMA(prices, period) {
        if (prices.length < period) return prices[prices.length - 1];
        
        const slice = prices.slice(-period);
        return slice.reduce((a, b) => a + b, 0) / period;
    }
    
    static calculateMACD(prices) {
        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        const macd = ema12 - ema26;
        const signal = this.calculateEMA([macd], 9);
        const histogram = macd - signal;
        
        return { macd, signal, histogram };
    }
    
    static calculateEMA(prices, period) {
        if (prices.length < period) return prices[prices.length - 1];
        
        const k = 2 / (period + 1);
        let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
        
        for (let i = period; i < prices.length; i++) {
            ema = prices[i] * k + ema * (1 - k);
        }
        
        return ema;
    }
    
    static findSupport(prices) {
        const recent = prices.slice(-20);
        return Math.min(...recent);
    }
    
    static findResistance(prices) {
        const recent = prices.slice(-20);
        return Math.max(...recent);
    }
    
    static async processChat(message, user) {
        const lowerMsg = message.toLowerCase();
        
        // ردود ذكية
        if (lowerMsg.includes('سعر') || lowerMsg.includes('price')) {
            if (lowerMsg.includes('btc') || lowerMsg.includes('بيتكوين')) {
                return 'سعر البيتكوين الحالي يتم تحديثه مباشرة. يمكنك مشاهدة السعر في لوحة التحكم.';
            }
            return 'أي عملة تريد معرفة سعرها؟ اكتب "سعر BTC" مثلاً.';
        }
        
        if (lowerMsg.includes('تحليل') || lowerMsg.includes('analysis')) {
            return 'يمكنني تحليل أي عملة. اكتب "تحليل BTC" للحصول على تحليل فني كامل.';
        }
        
        if (lowerMsg.includes('توصية') || lowerMsg.includes('recommendation')) {
            return 'بناءً على تحليلي، أفضل الفرص حالياً هي BTC و ETH. يمكنك مشاهدة الإشارات في قسم الإشارات.';
        }
        
        if (lowerMsg.includes('مساعدة') || lowerMsg.includes('help')) {
            return `أستطيع مساعدتك في:
- معرفة الأسعار الحية
- تحليل فني للعملات
- توصيات تداول
- إدارة محفظتك
- شرح أي ميزة في المنصة`;
        }
        
        if (lowerMsg.includes('شكرا') || lowerMsg.includes('thanks')) {
            return 'العفو! أنا هنا لخدمتك 24/7. هل تحتاج مساعدة أخرى؟';
        }
        
        return 'يمكنك سؤالي عن الأسعار، التحليل الفني، توصيات التداول، أو أي شيء آخر. كيف يمكنني مساعدتك؟';
    }
}

module.exports = AIService;