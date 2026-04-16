const express = require('express');
const router = express.Router();
const {
    getAnalysis,
    getRecommendations,
    chat
} = require('../controllers/aiController');

router.get('/analysis/:symbol', getAnalysis);
router.get('/recommendations', getRecommendations);
router.post('/chat', chat);

module.exports = router;