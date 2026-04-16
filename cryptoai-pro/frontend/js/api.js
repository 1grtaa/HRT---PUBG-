const API_BASE = 'http://localhost:5000/api';
let authToken = localStorage.getItem('token');

const api = {
    async request(endpoint, method = 'GET', body = null, requireAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (requireAuth && authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        const config = {
            method,
            headers
        };
        
        if (body) {
            config.body = JSON.stringify(body);
        }
        
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'حدث خطأ');
            }
            
            return data;
        } catch (error) {
            showToast(error.message, 'error');
            throw error;
        }
    },
    
    // المصادقة
    register: (data) => api.request('/auth/register', 'POST', data, false),
    login: (data) => api.request('/auth/login', 'POST', data, false),
    verifyOTP: (data) => api.request('/auth/verify-otp', 'POST', data, false),
    getMe: () => api.request('/auth/me'),
    enable2FA: () => api.request('/auth/enable-2fa', 'POST'),
    verify2FA: (token) => api.request('/auth/verify-2fa', 'POST', { token }),
    
    // المستخدمين
    getUser: (userId) => api.request(`/users/${userId}`),
    followUser: (userId) => api.request(`/users/${userId}/follow`, 'POST'),
    unfollowUser: (userId) => api.request(`/users/${userId}/unfollow`, 'POST'),
    searchUsers: (query) => api.request(`/users/search?q=${encodeURIComponent(query)}`),
    
    // التداول
    getBalances: () => api.request('/trade/balances'),
    placeOrder: (data) => api.request('/trade/order', 'POST', data),
    getOrders: () => api.request('/trade/orders'),
    cancelOrder: (orderId) => api.request(`/trade/order/${orderId}`, 'DELETE'),
    getTradeHistory: () => api.request('/trade/history'),
    
    // الإشارات
    getSignals: (filter = 'all') => api.request(`/signals?filter=${filter}`),
    executeSignal: (signalId) => api.request(`/signals/${signalId}/execute`, 'POST'),
    getSignalHistory: () => api.request('/signals/history'),
    
    // الذكاء الاصطناعي
    getAIAnalysis: (symbol) => api.request(`/ai/analysis/${symbol}`),
    getAIRecommendations: () => api.request('/ai/recommendations'),
    chatWithAI: (message) => api.request('/ai/chat', 'POST', { message }),
    
    // المدفوعات
    getPlans: () => api.request('/payments/plans', 'GET', null, false),
    subscribe: (plan, coupon) => api.request('/payments/subscribe', 'POST', { plan, coupon }),
    getPaymentMethods: () => api.request('/payments/methods', 'GET', null, false),
    
    // المسؤول
    adminGetUsers: () => api.request('/admin/users'),
    adminSendNotification: (data) => api.request('/admin/notify', 'POST', data),
    adminCreateCoupon: (data) => api.request('/admin/coupon', 'POST', data),
    adminGetStats: () => api.request('/admin/stats'),
    
    // الدردشة
    getChatRooms: () => api.request('/chat/rooms'),
    getMessages: (roomId) => api.request(`/chat/messages/${roomId}`),
    sendMessage: (roomId, text) => api.request(`/chat/messages/${roomId}`, 'POST', { text })
};

// تخزين الـ token
function setAuthToken(token) {
    authToken = token;
    localStorage.setItem('token', token);
}

function clearAuthToken() {
    authToken = null;
    localStorage.removeItem('token');
}

// دالة عرض الإشعارات
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}