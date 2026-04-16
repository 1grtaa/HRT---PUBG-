const express = require('express');
const router = express.Router();
const {
    getBalances,
    placeOrder,
    getTradeHistory,
    cancelOrder
} = require('../controllers/tradeController');

router.get('/balances', getBalances);
router.post('/order', placeOrder);
router.get('/orders', getTradeHistory);
router.delete('/order/:orderId', cancelOrder);
router.get('/history', getTradeHistory);

module.exports = router;