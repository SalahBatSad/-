import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ cartItems, onClearCart, currentUser }) {
  const navigate = useNavigate();

  // بيانات النموذج
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: '', // 1. المحافظة
    city: '',        // 2. البلد / المدينة / القرية
    street: ''       // 3. الشارع / بالقرب من
  });

  // حالات التحقق من الرقم عبر OTP
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [testOtpNotice, setTestOtpNotice] = useState(''); // لعرض الكود في الشاشة للتجربة
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  // تعبئة البيانات تلقائياً إن كان الزبون مسجلاً دخوله
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.full_name || '',
        phone: currentUser.phone || '',
        governorate: currentUser.governorate || '',
        city: currentUser.city || '',
        street: currentUser.street || ''
      });
    }
  }, [currentUser]);

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // 📲 1. دالة طلب إرسال كود التحقق
  const handleSendOtp = () => {
    if (!formData.phone || formData.phone.length < 8) {
      setOtpError('الرجاء إدخال رقم هاتف صحيح أولاً');
      return;
    }

    setOtpError('');
    setIsSendingOtp(true);

    fetch('http://localhost:5000/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formData.phone })
    })
    .then(res => res.json())
    .then(data => {
      setIsSendingOtp(false);
      setOtpSent(true);
      if (data.testOtp) {
        setTestOtpNotice(`📩 (كود التجربة المحلي: ${data.testOtp})`);
      }
    })
    .catch(() => {
      setIsSendingOtp(false);
      setOtpError('فشل الاتصال بسيرفر التحقق');
    });
  };

  // 🔑 2. دالة التأكد من الكود المكتوب
  const handleVerifyOtp = () => {
    setOtpError('');

    fetch('http://localhost:5000/api/verify-otp', {
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
        setOtpError(data.error || 'كود غير صحيح');
      }
    })
    .catch(() => setOtpError('حدث خطأ أثناء التأكد من الكود'));
  };

  // 🚀 3. دالة تأكيد الطلبية النهائية
  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!isPhoneVerified) {
      alert('⚠️ يرجى تأكيد رقم الهاتف بواسطة كود التحقق قبل إتمام الطلب!');
      return;
    }

    const fullAddress = `المحافظة: ${formData.governorate} | المدينة/البلد: ${formData.city} | الشارع: ${formData.street}`;

    fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: formData.name,
        phone: formData.phone,
        address: fullAddress,
        total_amount: total,
        items: JSON.stringify(cartItems)
      })
    })
    .then(res => res.json())
    .then(() => {
      setSubmitted(true);
      onClearCart();
    });
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-dark text-center rounded-3xl border border-[#D4AF37]/40 text-white space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-black text-gold-gradient">تم إرسال طلبيتك بنجاح!</h2>
        <p className="text-xs text-gray-300">شكراً لثقتك بعطورنا، تم تأكيد رقم هاتفك وسيتم تجهيز الطلب فوراً.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2.5 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b8952c] transition-all"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-black text-[#D4AF37] mb-8 text-center">💳 إتمام الطلب والدفع عند الاستلام</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ملخص منتجات السلة */}
        <div className="bg-[#16161E] p-6 rounded-2xl border border-gray-800 space-y-4 h-fit">
          <h3 className="font-bold text-lg border-b border-gray-800 pb-2">ملخص العطور</h3>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center text-xs py-2 border-b border-gray-800/50">
              <div className="flex items-center gap-2">
                <span>{item.name} (x{item.quantity})</span>
                {/* 🌟 الكود الخاص بعرض شارة الأكثر مبيعاً 🌟 */}
{(item.is_best_seller == 1 || item.is_best_seller === true || item.is_best_seller === '1') && (                  <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
                    الأكثر مبيعاً 🌟
                  </span>
                )}
              </div>
              <span className="font-bold text-[#D4AF37]">{item.price * item.quantity} ₪</span>
            </div>
          ))}
          
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold text-gray-300">
              <span>رسوم التوصيل:</span>
              <span className="text-green-400">مجاني 🚚</span>
            </div>
            <div className="flex justify-between text-base font-black pt-2 border-t border-gray-800/50">
              <span>المجموع الإجمالي:</span>
              <span className="text-[#D4AF37]">{total} ₪</span>
            </div>
          </div>
        </div>

        {/* نموذج البيانات والتأكيد */}
        <form onSubmit={handleSubmitOrder} className="bg-[#16161E] p-6 rounded-2xl border border-[#D4AF37]/30 space-y-5">
          <h3 className="font-bold text-lg mb-2 text-[#D4AF37]">تفاصيل المشتري والشحن</h3>

          {/* 1. الاسم الرباعي */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">الاسم الكامل</label>
            <input 
              type="text" 
              placeholder="أدخل اسمك الرباعي" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
            />
          </div>

          {/* 2. رقم الهاتف مع زر التأكيد OTP */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">رقم الهاتف</label>
            <div className="flex gap-2">
              <input 
                type="tel" 
                placeholder="059XXXXXXX" 
                disabled={isPhoneVerified}
                required 
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setIsPhoneVerified(false);
                }}
                className={`w-full p-3 bg-[#0A0A0C] border ${isPhoneVerified ? 'border-green-500 text-green-400' : 'border-gray-800'} rounded-xl text-xs outline-none`}
              />
              {!isPhoneVerified ? (
                <button 
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="px-4 py-3 bg-[#D4AF37] text-black text-xs font-extrabold rounded-xl whitespace-nowrap hover:bg-[#b8952c] transition-all"
                >
                  {isSendingOtp ? 'جاري الإرسال...' : 'تأكيد الرقم 📱'}
                </button>
              ) : (
                <span className="px-3 py-3 bg-green-900/30 border border-green-500 text-green-400 text-xs font-bold rounded-xl flex items-center whitespace-nowrap">
                  مؤكد ✅
                </span>
              )}
            </div>

            {/* حقل إدخال الكود عند الإرسال */}
            {otpSent && !isPhoneVerified && (
              <div className="mt-3 p-3 bg-[#18181C] border border-[#D4AF37]/40 rounded-xl space-y-2 animate-fadeIn">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-300 font-bold">أدخل كود التحقق المرسل لك:</span>
                  {testOtpNotice && <span className="text-[#D4AF37] font-mono">{testOtpNotice}</span>}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="4 أرقام" 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full p-2 bg-[#0A0A0C] border border-gray-700 rounded-lg text-xs text-center font-mono tracking-widest text-white outline-none"
                  />
                  <button 
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black text-xs font-bold rounded-lg whitespace-nowrap"
                  >
                    تأكيد الكود
                  </button>
                </div>
              </div>
            )}

            {otpError && <p className="text-xs text-red-400 mt-1 font-semibold">{otpError}</p>}
          </div>

          {/* 3. العنوان مقسم إلى 3 خانات دقيقة */}
          <div className="space-y-3 pt-2 border-t border-gray-800">
            <span className="block text-xs font-bold text-[#D4AF37]">عنوان التوصيل التفصيلي:</span>

            {/* الخانة 1: المحافظة */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">1. المحافظة</label>
              <input 
                type="text" 
                placeholder="مثال: نابلس، رام الله، الخليل..." 
                required 
                value={formData.governorate}
                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                className="w-full p-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
              />
            </div>

            {/* الخانة 2: البلد أو المدينة أو القرية */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">2. البلد / المدينة / القرية</label>
              <input 
                type="text" 
                placeholder="مثال: مدينة نابلس / قرية حوارة..." 
                required 
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
              />
            </div>

            {/* الخانة 3: الشارع أو بالقرب من */}
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">3. الشارع أو بالقرب من (معلم معروف)</label>
              <input 
                type="text" 
                placeholder="مثال: شارع رفيديا - مقابل سوبرماركت الهدى" 
                required 
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full p-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>

          {/* زر تأكيد الطلبية النهائي */}
          <button 
            type="submit"
            className={`w-full py-4 text-black font-extrabold rounded-xl transition-all shadow-lg mt-4 ${
              isPhoneVerified 
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer' 
                : 'bg-gray-700 opacity-60 cursor-not-allowed'
            }`}
          >
            {isPhoneVerified ? 'تأكيد الطلبية الآن 🚀' : '🔒 يرجى تأكيد رقم الهاتف أولاً'}
          </button>
        </form>

      </div>
    </div>
  );
}