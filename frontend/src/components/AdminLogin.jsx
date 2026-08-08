import React, { useState } from 'react';

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 🔐 بيانات الدخول الافتراضية للوحة التحكم
    // يمكنك تغيير "admin" و "123456" لأي شيء تريده
    if (username === 'admin' && password === '71677741020066') {
      setError('');
      onLoginSuccess();
    } else {
      setError('❌ اسم المستخدم أو كلمة السر غير صحيحة!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#121216] border border-[#D4AF37]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
        
        {/* زر الإغلاق والعودة */}
        <button 
          onClick={onCancel}
          className="absolute top-4 left-4 text-gray-400 hover:text-white text-sm p-1"
        >
          ✕
        </button>

        {/* الهيدر */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#1A1812] border border-[#D4AF37]/40 flex items-center justify-center text-2xl shadow-lg">
            🔐
          </div>
          <h2 className="text-2xl font-black text-white">تسجيل دخول الأدمن</h2>
          <p className="text-xs text-gray-400">أدخل بيانات السرية للوصول للوحة التحكم</p>
        </div>

        {/* رسالة الخطأ إن وجدت */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-800 text-red-400 text-xs text-center font-bold">
            {error}
          </div>
        )}

        {/* نموذج الدخول */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-300 font-bold mb-1.5">اسم المستخدم</label>
            <input 
              type="text" 
              placeholder=""
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-sm text-white focus:border-[#D4AF37] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-300 font-bold mb-1.5">كلمة السر</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0C] border border-gray-800 rounded-xl text-sm text-white focus:border-[#D4AF37] outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-extrabold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
          >
            دخول للوحة التحكم 🚀
          </button>
        </form>

      </div>
    </div>
  );
}