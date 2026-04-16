// Global State
let currentUser = null;
let currentPage = 'dashboard';
let marketData = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showAuth();
    }
    
    // Load market data
    loadMarketData();
    
    // Start real-time updates
    startRealTimeUpdates();
}

// Auth Functions
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.querySelectorAll('.auth-tab').forEach((tab, index) => {
        tab.classList.toggle('active', index === 0);
    });
}

function showRegister() {
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.querySelectorAll('.auth-tab').forEach((tab, index) => {
        tab.classList.toggle('active', index === 1);
    });
}

function showAuth() {
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function showMainApp() {    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('userId').textContent = currentUser?.id || '----';
}

// Form Submissions
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin();
});

document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleRegister();
});

function handleLogin() {
    // Simulate login
    currentUser = {
        id: generateUserId(),
        email: 'user@email.com',
        name: 'مستخدم',
        level: 'FREE',
        balance: 10000
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showMainApp();
}

function handleRegister() {
    handleLogin();
}

function generateUserId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');    }
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    currentPage = pageName;
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
        document.getElementById('sidebar').classList.remove('active');
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function toggleNotifications() {
    alert('🔔 الإشعارات\n\n5 إشعارات جديدة');
}

function toggleSettings() {
    alert('⚙️ الإعدادات');
}

function toggleUserMenu() {
    alert('👤 القائمة\n\nالبريد: user@email.com\nالمستوى: FREE\nID: ' + currentUser?.id);
}

// Market Data
function loadMarketData() {
    // Simulate market data
    marketData = [
        { symbol: 'BTC/USDT', price: 76543.21, change: 2.34, volume: '1.2B' },
        { symbol: 'ETH/USDT', price: 3456.78, change: -1.23, volume: '890M' },
        { symbol: 'BNB/USDT', price: 567.89, change: 0.89, volume: '234M' },
        { symbol: 'SOL/USDT', price: 178.45, change: 5.67, volume: '456M' }
    ];
    
    renderMarketList();
}

function renderMarketList() {
    const container = document.getElementById('marketList');
    if (!container) return;
    
    container.innerHTML = marketData.map(coin => `
        <div class="market-item">            <div class="market-symbol">${coin.symbol}</div>
            <div class="market-price">$${coin.price.toLocaleString()}</div>
            <div class="market-change ${coin.change >= 0 ? 'positive' : 'negative'}">
                ${coin.change >= 0 ? '+' : ''}${coin.change}%
            </div>
        </div>
    `).join('');
}

// Real-time Updates
function startRealTimeUpdates() {
    // Update prices every 3 seconds
    setInterval(() => {
        if (marketData.length > 0) {
            marketData.forEach(coin => {
                const change = (Math.random() - 0.5) * 100;
                coin.price += change;
                coin.change += (Math.random() - 0.5) * 0.1;
            });
            renderMarketList();
        }
    }, 3000);
    
    // Update AI indicators
    setInterval(() => {
        updateAIIndicators();
    }, 5000);
}

function updateAIIndicators() {
    const indicators = document.querySelectorAll('.indicator-value');
    indicators.forEach(indicator => {
        const value = Math.floor(Math.random() * 100);
        indicator.textContent = value;
    });
}

// Trading Functions
function placeOrder(type, symbol, price, amount) {
    console.log('Placing order:', { type, symbol, price, amount });
    alert(`تم تنفيذ الطلب\nالنوع: ${type}\nالزوج: ${symbol}\nالسعر: ${price}\nالكمية: ${amount}`);
}

// Utility Functions
function formatNumber(num, decimals = 2) {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {        style: 'currency',
        currency: currency
    }).format(amount);
}

// Error Handling
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ', msg, '\nURL: ', url, '\nLine: ', lineNo);
    return false;
};

// Console welcome message
console.log('%c CryptoAI Pro v5.0 ', 'background: #f0b90b; color: #0b0e11; font-size: 20px; font-weight: bold;');
console.log('%c AI-Powered Trading Platform ', 'color: #0ecb81; font-size: 14px;');
console.log('%c © 2026 All Rights Reserved ', 'color: #848e9c; font-size: 12px;');