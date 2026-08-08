import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ customer_name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'جاري إرسال الرسالة...' });

    fetch('https://otourna-backend.onrender.com/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus({ type: 'success', message: data.message });
          setFormData({ customer_name: '', email: '', subject: '', message: '' });
        } else {
          setStatus({ type: 'error', message: data.message });
        }
      })
      .catch(() => {
        setStatus({ type: 'error', message: 'حدث خطأ في الاتصال بالسيرفر.' });
      });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">تواصل معنا</h2>
        <p className="text-gray-500 text-center mb-8">يسعدنا استقبال استفساراتك واقتراحاتك في أي وقت</p>

        {status && (
          <div className={`p-4 rounded-xl mb-6 text-center text-sm font-semibold ${
            status.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 
            status.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل</label>
            <input 
              type="text" 
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="أدخل اسمك الكريم"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="example@domain.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">موضوع الرسالة</label>
            <input 
              type="text" 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="استفسار، طلب خاص..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الرسالة</label>
            <textarea 
              rows="4" 
              required
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="اكتب رسالتك هنا..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3.5 rounded-xl transition duration-200 shadow-md text-base"
          >
            إرسال الرسالة
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;