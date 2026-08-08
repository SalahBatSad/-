import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react'; // <-- أضف useEffect
export default function CustomerAuthModal({ onClose, onLoginSuccess, initialTab }) {
  // تحديد الحالة المبدئية بناءً على اللي وصلنا من App.jsx
  const [isRegister, setIsRegister] = useState(initialTab === 'register');

  // التأكد من تحديث الحالة لو تغيرت التبويبة والنافذة مفتوحة
  useEffect(() => {
    setIsRegister(initialTab === 'register');
  }, [initialTab]);
  const [showPassword, setShowPassword] = useState(false); // 👁️ حالة إظهار/إخفاء كلمة المرور
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    governorate: '',
    city: '',
    street: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔍 دالة التثبت من صيغة البريد الإلكتروني
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // 📱 دالة التثبت من رقم الهاتف (10 أرقام وتبدأ بـ 05)
  const validatePhone = (phone) => {
    const regex = /^05\d{8}$/;
    return regex.test(phone);
  };

  // 🚀 دالة إرسال النموذج الأساسي
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 1. فحص البريد الإلكتروني
    if (!validateEmail(formData.email)) {
      setError('⚠️ يرجى إدخال بريد إلكتروني صحيح (مثال: name@gmail.com)');
      return;
    }

    // 2. فحص رقم الهاتف عند إنشاء حساب جديد
    if (isRegister && !validatePhone(formData.phone)) {
      setError('⚠️ يجب أن يتكون رقم الهاتف من 10 أرقام ويبدأ بـ 05');
      return;
    }

    const endpoint = isRegister ? '/api/register' : '/api/login';
    const payload = isRegister ? formData : { email: formData.email, password: formData.password };

    fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json().then(data => ({ status: res.status, data })))
    .then(({ status, data }) => {
      if (status !== 200) {
        setError(data.error || 'حدث خطأ ما، حاول مرة أخرى');
      } else {
        localStorage.setItem('customer_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      }
    })
    .catch(() => setError('تعذر الاتصال بالسيرفر'));
  };

  // 🌐 دالة تسجيل الدخول المباشر بواسطة جوجل
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      const googleUserData = {
        full_name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      };

      // إرسال بيانات جوجل للسيرفر لحفظ الحساب أو تسجيل الدخول
      fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUserData)
      })
      .then(res => res.json())
      .then(data => {
        const userToSave = data.user || googleUserData;
        localStorage.setItem('customer_user', JSON.stringify(userToSave));
        onLoginSuccess(userToSave);
        onClose();
      })
      .catch(() => {
        // في حال عدم توفر المسار في الباك إند بعد، يتم اعتماد الدخول فوراً
        localStorage.setItem('customer_user', JSON.stringify(googleUserData));
        onLoginSuccess(googleUserData);
        onClose();
      });

    } catch (err) {
      setError('حدث خطأ أثناء معالجة حساب جوجل');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-dark border border-[#D4AF37]/30 rounded-3xl p-6 md:p-8 max-w-lg w-full text-white shadow-[0_0_50px_rgba(212,175,55,0.15)] relative max-h-[90vh] overflow-y-auto">
        
        {/* زر الإغلاق */}
        {/* زر الإغلاق الثابت والمطور */}
        <button 
          onClick={onClose}
          className="sticky top-0 z-50 float-left -mt-2 -ml-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white text-lg bg-[#0A0A0C]/90 border border-gray-800 hover:border-[#D4AF37] rounded-full backdrop-blur-md shadow-lg transition-all"
        >
          ✕
        </button>

        {/* الهيدر */}
        <div className="text-center mb-6">
          {/* اسم البراند - تأثير الحفر الأسود اللامع */}
          {/* اسم البراند - لون أسود محفور وخط مختلف */}
          {/* اسم البراند - أسود محفور، خط مايل ومليان حلاوة */}
          {/* اسم البراند - خط عربي انسيابي، أسود محفور بحجم متناسق */}
          {/* اسم البراند - خط عربي انسيابي، أسود ميتاليك لامع ومحفور */}
          {/* اسم البراند - أسود لامع بأطراف براقة ومحفورة */}
          <h1 
            className="text-2xl md:text-3xl font-bold mb-2 select-none tracking-wide"
            style={{
              background: 'linear-gradient(180deg, #2a2a2a 0%, #000000 50%, #151515 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '0.6px rgba(212, 175, 55, 0.85)', // تحديد الأطراف بلمعة ذهبية ميتاليك
              filter: 'drop-shadow(0px 0px 2px rgba(212, 175, 55, 0.6)) drop-shadow(0px 2px 4px rgba(0,0,0,0.95))', // إضاءة الأطراف + ظل الحفر
              fontFamily: '"Aref Ruqaa", "Reem Kufi", serif'
            }}
          >
            عطورنا
          </h1>
          
          <h2 className="text-2xl font-black text-gold-gradient mt-2">
            {isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isRegister ? 'أنشئ حسابك لتسهيل الشراء ومتابعة الطلبات' : 'مرحباً بعودتك! أدخل بياناتك للتسوق'}
          </p>
        </div>

        {/* رسائل الخطأ */}
        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-300 text-xs p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        {/* نموذج الإدخال */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* الاسم (عند التسجيل فقط) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">الاسم الرباعي</label>
              <input 
                type="text" 
                name="full_name"
                required 
                placeholder="أحمد محمد علي عبد الله"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full p-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
              />
            </div>
          )}

          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              name="email"
              required 
              placeholder="example@domain.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
            />
          </div>

          {/* تفاصيل الهاتف والعنوان (عند التسجيل فقط) */}
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">رقم الهاتف </label>
                <input 
                  type="tel" 
                  name="phone"
                  required 
                  placeholder="05XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">المحافظة</label>
                  <input 
                    type="text" 
                    name="governorate"
                    required 
                    placeholder="مثال: نابلس / الخليل"
                    value={formData.governorate}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">البلد / المدينة</label>
                  <input 
                    type="text" 
                    name="city"
                    required 
                    placeholder="اسم المدينة أو القرية"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">الشارع / تفاصيل العنوان</label>
                <input 
                  type="text" 
                  name="street"
                  required 
                  placeholder="اسم الشارع، بجانب المخبز..."
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
                />
              </div>
            </>
          )}

          {/* 👁️ كلمة السر مع زر العين */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">كلمة السر</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                required 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 pl-10 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors p-1"
                title={showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c1.349-4.39 5.37-7.5 9.964-7.5s8.615 3.11 9.964 7.5c-1.349 4.39-5.37 7.5-9.964 7.5S3.385 16.39 2.036 12z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* زر التقديم */}
          <button 
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-extrabold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all mt-2 cursor-pointer"
          >
            {isRegister ? 'إنشاء الحساب الآن 🚀' : 'تسجيل الدخول 🔑'}
          </button>
        </form>

        {/* 🌐 خيار تسجيل الدخول باستخدام جوجل */}
        <div className="mt-5 flex flex-col items-center">
          <div className="w-full border-t border-gray-800 my-2 relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-[#0A0A0C] px-3 text-[11px] text-gray-500">
              أو المتابعة باستخدام
            </span>
          </div>

          <div className="w-full flex justify-center mt-3">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('فشل تسجيل الدخول بواسطة جوجل')}
              theme="filled_black"
              shape="pill"
              text="continue_with"
              locale="ar"
            />
          </div>
        </div>

        {/* التحويل بين الحساب والتسجيل */}
        <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-800/80 pt-4">
          {isRegister ? (
            <p>لديك حساب بالفعل؟ <button onClick={() => setIsRegister(false)} className="text-[#D4AF37] font-bold hover:underline mr-1">سجل دخولك هنا</button></p>
          ) : (
            <p>ليس لديك حساب؟ <button onClick={() => setIsRegister(true)} className="text-[#D4AF37] font-bold hover:underline mr-1">أنشئ حساباً جديداً</button></p>
          )}
        </div>

      </div>
    </div>
  );
}