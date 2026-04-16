const ExchangeService = require('../services/exchangeService');
const AIService = require('../services/aiService');

// @desc    تحليل AI لزوج تداول
exports.getAnalysis = async (req, res) => {
    try {
        const { symbol } = req.params;
        
        // جلب بيانات الشموع من Binance
        const exchangeService = new ExchangeService();
        const ohlcv = await exchangeService.fetchOHLCV('binance', symbol, '1h', 100);
        
        // تحليل البيانات
        const analysis = AIService.analyzeMarket(ohlcv);
        
        res.status(200).json({ success: true, analysis });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    توصيات AI
exports.getRecommendations = async (req, res) => {
    try {
        const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT'];
        const recommendations = [];
        
        const exchangeService = new ExchangeService();
        
        for (const symbol of symbols) {
            const ohlcv = await exchangeService.fetchOHLCV('binance', symbol, '1h', 50);
            const analysis = AIService.analyzeMarket(ohlcv);
            
            if (analysis.confidence > 65) {
                recommendations.push({
                    symbol,
                    ...analysis
                });
            }
        }
        
        recommendations.sort((a, b) => b.confidence - a.confidence);
        
        res.status(200).json({ success: true, recommendations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    محادثة AI
exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        
        const response = await AIService.processChat(message, req.user);
        
        res.status(200).json({ success: true, response });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};