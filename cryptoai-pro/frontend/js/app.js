let currentUser = null;
let socket = null;
let currentPage = 'dashboard';

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initSocket();
});

// التحقق من حالة تسجيل الدخول
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const data = await api.getMe();
            currentUser = data.user;
            showApp();
            loadPage('dashboard');
        } catch (error) {
            clearAuthToken();
            showAuth();
        }
    } else {
        showAuth();
    }
}

// إظهار واجهة المصادقة
function showAuth() {
    document.getElementById('splash').classList.add('hide');
    setTimeout(() => {
        document.getElementById('splash').style.display = 'none';
        document.getElementById('authContainer').style.display = 'flex';
    }, 800);
}

// إظهار التطبيق الرئيسي
function showApp() {
    document.getElementById('splash').classList.add('hide');
    setTimeout(() => {
        document.getElementById('splash').style.display = 'none';
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
    }, 800);
}

// تبديل نماذج المصادقة
function showRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
}

function showLogin() {
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

// تسجيل الدخول
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('الرجاء إدخال البريد وكلمة المرور', 'error');
        return;
    }
    
    try {
        const data = await api.login({ email, password });
        
        if (data.require2FA) {
            // عرض نموذج 2FA
            show2FAForm(data.userId);
            return;
        }
        
        setAuthToken(data.token);
        currentUser = data.user;
        showApp();
        loadPage('dashboard');
    } catch (error) {
        // الخطأ معروض من api.js
    }
}

// تسجيل حساب جديد
async function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regPasswordConfirm').value;
    
    if (!name || !email || !password) {
        showToast('الرجاء ملء الحقول المطلوبة', 'error');
        return;
    }
    
    if (password !== confirm) {
        showToast('كلمة المرور غير متطابقة', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }
    
    try {
        await api.register({ name, email, phone, password });
        
        // إظهار نموذج OTP
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('otpForm').classList.add('active');
        
        // تخزين البريد مؤقتاً
        sessionStorage.setItem('pendingEmail', email);
    } catch (error) {
        // الخطأ معروض
    }
}

// تحقق OTP
async function verifyOTP() {
    const digits = document.querySelectorAll('.otp-digit');
    let otp = '';
    digits.forEach(d => otp += d.value);
    
    if (otp.length !== 6) {
        showToast('الرجاء إدخال 6 أرقام', 'error');
        return;
    }
    
    const email = sessionStorage.getItem('pendingEmail');
    
    try {
        const data = await api.verifyOTP({ email, otp });
        setAuthToken(data.token);
        currentUser = data.user;
        sessionStorage.removeItem('pendingEmail');
        showApp();
        loadPage('dashboard');
    } catch (error) {
        // خطأ
    }
}

// تحريك حقول OTP
function moveOtp(input) {
    if (input.value.length === 1) {
        const next = input.nextElementSibling;
        if (next) next.focus();
    }
}

// تحميل الصفحات
async function loadPage(pageName) {
    currentPage = pageName;
    
    // تحديث حالة القائمة
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
    
    const container = document.getElementById('pageContainer');
    
    // تحميل محتوى الصفحة (يمكن تحميلها من ملفات HTML منفصلة أو توليدها ديناميكياً)
    switch (pageName) {
        case 'dashboard':
            container.innerHTML = await loadDashboard();
            break;
        case 'trade':
            container.innerHTML = await loadTradePage();
            break;
        case 'signals':
            container.innerHTML = await loadSignalsPage();
            break;
        case 'community':
            container.innerHTML = await loadCommunityPage();
            break;
        case 'profile':
            container.innerHTML = await loadProfilePage();
            break;
        case 'admin':
            if (currentUser.role === 'admin') {
                container.innerHTML = await loadAdminPage();
            } else {
                loadPage('dashboard');
            }
            break;
    }
}

// تحميل لوحة التحكم
async function loadDashboard() {
    // جلب البيانات
    const [balances, signals, analysis] = await Promise.all([
        api.getBalances().catch(() => ({})),
        api.getSignals().catch(() => []),
        api.getAIAnalysis('BTC/USDT').catch(() => ({}))
    ]);
    
    return `
        <div class="page active">
            <div class="greeting">
                <h2>مرحباً، ${currentUser.name}</h2>
                <span class="badge ${currentUser.plan}">${currentUser.plan.toUpperCase()}</span>
            </div>
            
            <div class="balance-card">
                <div class="balance-label">الرصيد الإجمالي</div>
                <div class="balance-value">$${calculateTotalBalance(balances).toLocaleString()}</div>
            </div>
            
            <div class="price-cards" id="priceCards">
                <!-- يتم ملؤها عبر WebSocket -->
            </div>
            
            <div class="quick-actions">
                <button onclick="loadPage('trade')" class="action-btn">⚡ تداول سريع</button>
                <button onclick="loadPage('signals')" class="action-btn">🤖 إشارات AI</button>
                <button onclick="showAIChat()" class="action-btn">💬 مساعد AI</button>
            </div>
            
            <div class="ai-analysis">
                <h3>تحليل السوق</h3>
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <span>RSI</span>
                        <span class="value ${analysis.rsi > 70 ? 'overbought' : analysis.rsi < 30 ? 'oversold' : 'neutral'}">${analysis.rsi || '--'}</span>
                    </div>
                    <div class="analysis-item">
                        <span>MACD</span>
                        <span class="value">${analysis.macd || '--'}</span>
                    </div>
                    <div class="analysis-item">
                        <span>التوقع</span>
                        <span class="value">${analysis.prediction || '--'}</span>
                    </div>
                </div>
            </div>
            
            <div class="recent-signals">
                <h3>آخر الإشارات</h3>
                <div id="recentSignalsList">
                    ${signals.slice(0, 5).map(s => `
                        <div class="signal-item ${s.type.toLowerCase()}">
                            <span>${s.pair}</span>
                            <span>${s.type}</span>
                            <span>ثقة ${s.confidence}%</span>
                            <button onclick="executeSignal('${s._id}')">تنفيذ</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// WebSocket للأسعار الحية
function initSocket() {
    socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
        console.log('WebSocket connected');
        socket.emit('subscribe', 'BTC/USDT,ETH/USDT,SOL/USDT');
    });
    
    socket.on('ticker', (data) => {
        updatePriceCards(data);
    });
}

function updatePriceCards(ticker) {
    const container = document.getElementById('priceCards');
    if (!container) return;
    
    // تحديث بطاقات الأسعار
    // ...
}

// تسجيل الخروج
function logout() {
    clearAuthToken();
    currentUser = null;
    document.getElementById('appContainer').style.display = 'none';
    showAuth();
}

// دوال مساعدة
function calculateTotalBalance(balances) {
    // حساب إجمالي الرصيد بالدولار
    return 10000; // قيمة افتراضية
}

// بدء التطبيق
window.login = login;
window.register = register;
window.verifyOTP = verifyOTP;
window.moveOtp = moveOtp;
window.showRegister = showRegister;
window.showLogin = showLogin;
window.loadPage = loadPage;
window.logout = logout;