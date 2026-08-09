import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import CustomerAuthModal from './components/CustomerAuthModal';

import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
// أضف هذين السطرين مع باقي استيرادات الصفحات (Pages)
import Home from './pages/Home';
import Contact from './pages/Contact';
const defaultImages = [
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600'
];

export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [viewAdmin, setViewAdmin] = useState(false);

  // حساب الزبون
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('customer_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showCustomerAuth, setShowCustomerAuth] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // <-- متغير جديد لحفظ نوع التبويبة
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ==========================================
  // 1. حالات وتفاصيل نموذج الشراء الجديد
  // ==========================================
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: '', 
    city: '',        
    street: ''       
  });

  // 2. حالات كود التحقق من الهاتف OTP
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); 
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [testOtpNotice, setTestOtpNotice] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // 3. دالة طلب كود التحقق
  const handleSendOtp = () => {
    if (!formData.phone || formData.phone.trim().length < 8) {
      setOtpError('يرجى كتابة رقم هاتف صحيح أولاً');
      return;
    }
    setOtpError('');
    setIsSendingOtp(true);

    fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formData.phone })
    })
    .then(res => res.json())
    .then(data => {
      setIsSendingOtp(false);
      setOtpSent(true);
      if (data.testOtp) setTestOtpNotice(`كود التحقق الخاص بك هو: ${data.testOtp}`);
    })
    .catch(() => {
      setIsSendingOtp(false);
      setOtpError('تعذر الاتصال بالسيرفر لإرسال الكود');
    });
  };

  // 4. دالة التأكد من الكود
  const handleVerifyOtp = () => {
    setOtpError('');
    fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formData.phone, code: otpCode })
    })
    .then(res => res.json().then(data => ({ status: res.status, data })))
    .then(({ status, data }) => {
      if (status === 200 && data.success) {
        setIsPhoneVerified(true);
        setOtpSent(false);
        setTestOtpNotice('');
      } else {
        setOtpError(data.error || 'الكود غير صحيح');
      }
    })
    .catch(() => setOtpError('حدث خطأ أثناء التأكد من الكود'));
  };

  // 5. دالة إرسال الطلبية عند الضغط على تأكيد
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!isPhoneVerified) {
      alert('⚠️ يرجى تأكيد رقم الهاتف أولاً عبر كود التحقق!');
      return;
    }

    const fullAddress = `المحافظة: ${formData.governorate} | المدينة/البلد: ${formData.city} | الشارع: ${formData.street}`;

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: formData.name,
        phone: formData.phone,
        address: fullAddress,
        total_amount: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        items: JSON.stringify(cartItems)
      })
    })
    .then(res => res.json())
    .then(() => {
      setOrderSuccess(true);
      setCartItems([]); // تفريغ السلة بعد الطلب
    });
  };
  // ==========================================

  // فصلنا الكود في دالة منفصلة لسهولة استدعائها
  const fetchAppProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const enriched = data.map((item, idx) => ({
          ...item,
          price: Number(item.price),
          image: item.image || defaultImages[idx % defaultImages.length]
        }));
        setProducts(enriched);
      })
      .catch(err => console.error(err));
  };

  // تشغيل الدالة عند تحميل الصفحة لأول مرة
  useEffect(() => {
    fetchAppProducts();
  }, []);

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleLogoutCustomer = () => {
    localStorage.removeItem('customer_user');
    setCurrentUser(null);
  };

 if (viewAdmin && isAdminAuthenticated) {
    return (
      <AdminDashboard 
        onBackToStore={() => {
          fetchAppProducts(); // جلب المنتجات المحدثة
          setViewAdmin(false); // العودة للمتجر
        }} 
      />
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0C] text-gray-100">
        
        <Navbar 
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAdmin={() => isAdminAuthenticated ? setViewAdmin(true) : setShowLoginModal(true)}
          currentUser={currentUser}
          onOpenCustomerAuth={(type = 'login') => {
            setAuthTab(type); // حفظ القيمة المرسلة من الناف بار
            setShowCustomerAuth(true); // فتح النافذة
          }}
        />

        <Routes>
          <Route path="/" element={
  <>
    <Hero 
      onOpenCustomerAuth={(type = 'login') => {
        setAuthTab(type);
        setShowCustomerAuth(true);
      }} 
    />
    <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center space-y-3 mb-16">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">تشكيلة العطور الملكية</span>
                  <h2 className="text-3xl md:text-5xl font-black text-white">الأكثر مبيعاً ورواجاً</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {products
    //.filter(product => product.is_best_seller == 1 || product.is_best_seller === true || product.is_best_seller === '1')
    .slice(0, 3)
    .map(product => (
      <ProductCard 
        key={product.id} 
        product={product} 
        onQuickView={(p) => setSelectedProduct(p)}
        onAddToCart={handleAddToCart}
      />
    ))}
</div>
              </main>
            </>
          } />

          <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} onQuickView={(p) => setSelectedProduct(p)} />} />
          <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} onClearCart={() => setCartItems([])} currentUser={currentUser} />} />
        {/* 🔒 المسار السري الخاص بك كأدمن فقط */}
  {/* 🔒 المسار السري الخاص بك كأدمن فقط */}
<Route 
  path="/admin-s" 
  element={
    isAdminLoggedIn ? (
      <AdminDashboard onBackToStore={() => window.location.href = '/'} />
    ) : (
      <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
    )
  } 
/>
        </Routes>

        {showCustomerAuth && (
          <CustomerAuthModal 
            onClose={() => setShowCustomerAuth(false)}
            onLoginSuccess={(user) => setCurrentUser(user)}
            initialTab={authTab} // <-- تمرير نوع التبويبة للنافذة
          />
        )}

        {showLoginModal && (
          <AdminLogin 
            onLoginSuccess={() => {
              setIsAdminAuthenticated(true);
              setShowLoginModal(false);
              setViewAdmin(true);
            }}
            onCancel={() => setShowLoginModal(false)}
          />
        )}

        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCart}
        />

        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={(id, delta) => setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))}
          onRemoveItem={(id) => setCartItems(prev => prev.filter(item => item.id !== id))}
          onClearCart={() => setCartItems([])}
          
          // 👇 الأسطر الجديدة التي تم إضافتها 👇
          currentUser={currentUser}
          onOpenCustomerAuth={(type = 'register') => {
            setIsCartOpen(false); // 1. إغلاق السلة أولاً
            setAuthTab(type);     // 2. تعيين نوع النافذة (register)
            setShowCustomerAuth(true); // 3. إظهار نافذة الدخول/التسجيل المنبثقة
          }}
        />

        <footer className="border-t border-gray-900 bg-[#070709] py-10 text-center text-xs text-gray-500">
          <p>© 2026 متجر عطورنا - جميع الحقوق محفوظة</p>
        </footer>

        {/* 🚀 نافذة الشراء المنبثقة (المحدثة) */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 bg-black/85 flex justify-center items-center p-4 z-50 overflow-y-auto">
            <div className="bg-[#16161E] p-6 rounded-2xl max-w-lg w-full border border-[#D4AF37]/40 space-y-4 my-8">
              
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <h2 className="text-xl font-bold text-[#D4AF37]">إتمام الطلبية</h2>
                <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 text-lg">✕</button>
              </div>

              {orderSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="text-5xl">🎉</div>
                  <h3 className="text-xl font-bold text-[#D4AF37]">تم إرسال طلبيتك بنجاح!</h3>
                  <p className="text-xs text-gray-300">تم تأكيد رقم هاتفك وسيتم التواصل معك للتوصيل.</p>
                  <button 
                    onClick={() => { setIsCheckoutOpen(false); setOrderSuccess(false); }}
                    className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-xl"
                  >
                    إغلاق
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitOrder} className="space-y-4 text-right">
                  
                  {/* 1. الاسم */}
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">الاسم الكامل</label>
                    <input 
                      type="text" 
                      placeholder="أدخل اسمك الكريم" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-[#0D0D11] border border-gray-800 rounded-xl text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* 2. رقم الهاتف + كود التحقق */}
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">رقم الهاتف</label>
                    <div className="flex gap-2">
                      <input 
                        type="tel" 
                        placeholder="05XXXXXXXX" 
                        disabled={isPhoneVerified}
                        required 
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          setIsPhoneVerified(false);
                        }}
                        className={`w-full p-2.5 bg-[#0D0D11] border ${isPhoneVerified ? 'border-green-500 text-green-400' : 'border-gray-800'} rounded-xl text-xs outline-none`}
                      />
                      {!isPhoneVerified ? (
                        <button 
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp}
                          className="px-3 py-2 bg-[#D4AF37] text-black text-xs font-bold rounded-xl whitespace-nowrap"
                        >
                          {isSendingOtp ? 'جاري الإرسال...' : 'تأكيد الرقم 📱'}
                        </button>
                      ) : (
                        <span className="px-3 py-2 bg-green-900/40 text-green-400 text-xs font-bold rounded-xl border border-green-500 flex items-center">
                          مؤكد ✅
                        </span>
                      )}
                    </div>

                    {otpSent && !isPhoneVerified && (
                      <div className="mt-2 p-3 bg-[#22222E] rounded-xl space-y-2 border border-[#D4AF37]/30">
                        {testOtpNotice && (
                          <p className="text-[11px] text-[#D4AF37] font-bold text-center bg-black/40 p-1.5 rounded-lg">
                            📩 {testOtpNotice}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="أدخل الكود (4 أرقام)" 
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full p-2 bg-[#0D0D11] border border-gray-700 rounded-lg text-xs text-center font-mono text-white outline-none"
                          />
                          <button 
                            type="button"
                            onClick={handleVerifyOtp}
                            className="px-3 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black text-xs font-bold rounded-lg"
                          >
                            تأكيد
                          </button>
                        </div>
                      </div>
                    )}

                    {otpError && <p className="text-xs text-red-400 mt-1">{otpError}</p>}
                  </div>

                  {/* 3. العنوان 3 خانات */}
                  <div className="space-y-3 pt-2 border-t border-gray-800">
                    <span className="block text-xs font-bold text-[#D4AF37]">تفاصيل العنوان:</span>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">1. المحافظة</label>
                      <input 
                        type="text" 
                        placeholder="مثال: نابلس، رام الله، الخليل..." 
                        required 
                        value={formData.governorate}
                        onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                        className="w-full p-2.5 bg-[#0D0D11] border border-gray-800 rounded-xl text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">2. البلد / المدينة / القرية</label>
                      <input 
                        type="text" 
                        placeholder="مثال: مدينة نابلس / قرية حوارة..." 
                        required 
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-2.5 bg-[#0D0D11] border border-gray-800 rounded-xl text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">3. الشارع / معلم معروف</label>
                      <input 
                        type="text" 
                        placeholder="مثال: شارع رفيديا - بالقرب من مستشفى العربي" 
                        required 
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full p-2.5 bg-[#0D0D11] border border-gray-800 rounded-xl text-xs text-white outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* زر التأكيد */}
                  <button 
                    type="submit"
                    className={`w-full py-3 text-black font-extrabold rounded-xl transition-all mt-4 ${
                      isPhoneVerified 
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] cursor-pointer' 
                        : 'bg-gray-700 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {isPhoneVerified ? 'تأكيد الطلبية الآن 🚀' : '🔒 يرجى تأكيد رقم الهاتف أولاً'}
                  </button>

                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}