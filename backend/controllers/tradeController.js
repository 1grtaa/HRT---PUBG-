const ExchangeService = require('../services/exchangeService');
const Trade = require('../models/Trade');
const ApiKey = require('../models/ApiKey');

// @desc    الحصول على أرصدة جميع المنصات المرتبطة
exports.getBalances = async (req, res) => {
    try {
        const exchangeService = new ExchangeService(req.user._id);
        await exchangeService.loadUserExchanges();
        
        const balances = {};
        for (const [name, exchange] of Object.entries(exchangeService.exchanges)) {
            try {
                balances[name] = await exchange.fetchBalance();
            } catch (e) {
                balances[name] = { error: e.message };
            }
        }
        
        res.status(200).json({ success: true, balances });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    وضع أمر تداول
exports.placeOrder = async (req, res) => {
    try {
        const { exchange, symbol, side, amount, price, stopLoss, takeProfit } = req.body;
        
        // التحقق من وجود مفتاح API
        const apiKey = await ApiKey.findOne({ user: req.user._id, exchange });
        if (!apiKey) {
            return res.status(400).json({ success: false, message: `الرجاء ربط ${exchange} أولاً` });
        }
        
        const exchangeService = new ExchangeService(req.user._id);
        await exchangeService.loadUserExchanges();
        
        // تنفيذ الأمر
        const order = await exchangeService.createOrder(exchange, symbol, side, amount, price);
        
        // حفظ الصفقة في قاعدة البيانات
        const trade = await Trade.create({
            user: req.user._id,
            exchange,
            symbol,
            side: side.toUpperCase(),
            quantity: amount,
            price: order.price || price,
            stopLoss,
            takeProfit,
            status: 'open',
            entryTime: new Date()
        });
        
        res.status(201).json({ success: true, order, trade });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    الحصول على سجل التداولات
exports.getTradeHistory = async (req, res) => {
    try {
        const trades = await Trade.find({ user: req.user._id })
            .sort('-entryTime')
            .limit(100);
        
        res.status(200).json({ success: true, trades });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    إلغاء أمر
exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const trade = await Trade.findById(orderId);
        
        if (!trade || trade.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
        }
        
        const exchangeService = new ExchangeService(req.user._id);
        await exchangeService.loadUserExchanges();
        
        await exchangeService.exchanges[trade.exchange].cancelOrder(trade.orderId);
        
        trade.status = 'canceled';
        await trade.save();
        
        res.status(200).json({ success: true, message: 'تم إلغاء الطلب' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};