const ccxt = require('ccxt');
const ApiKey = require('../models/ApiKey');

class ExchangeService {
  constructor(userId) {
    this.userId = userId;
    this.exchanges = {};
  }

  async loadUserExchanges() {
    const keys = await ApiKey.find({ user: this.userId, isActive: true });
    for (let key of keys) {
      try {
        const ExchangeClass = ccxt[key.exchange.toLowerCase()];
        if (ExchangeClass) {
          this.exchanges[key.exchange] = new ExchangeClass({
            apiKey: key.apiKey,
            secret: key.decryptSecret(),
            password: key.password,
            enableRateLimit: true,
            options: { defaultType: 'spot' }
          });
          // اختبار الاتصال
          await this.exchanges[key.exchange].fetchBalance();
        }
      } catch (e) {
        console.error(`❌ فشل تحميل ${key.exchange}:`, e.message);
      }
    }
    return this.exchanges;
  }

  async getBalance(exchangeName) {
    const exchange = this.exchanges[exchangeName];
    if (!exchange) throw new Error('البورصة غير مهيأة');
    return await exchange.fetchBalance();
  }

  async createOrder(exchangeName, symbol, side, amount, price = undefined, params = {}) {
    const exchange = this.exchanges[exchangeName];
    if (!exchange) throw new Error('البورصة غير مهيأة');
    const type = price ? 'limit' : 'market';
    return await exchange.createOrder(symbol, type, side.toLowerCase(), amount, price, params);
  }

  async fetchTicker(exchangeName, symbol) {
    const exchange = this.exchanges[exchangeName] || new ccxt.binance();
    return await exchange.fetchTicker(symbol);
  }

  async fetchOHLCV(exchangeName, symbol, timeframe = '1h', limit = 100) {
    const exchange = this.exchanges[exchangeName] || new ccxt.binance();
    return await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
  }
}

module.exports = ExchangeService;