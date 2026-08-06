import React, { useState } from 'react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  // بيانات النموذج (الاسم، الهاتف، والخانات الثلاث للعنوان)
  const [formData, setFormData] = useState({ 
    customer_name: '', 
    phone: '', 
    governorate: '', 
    city: '',        
    street: ''       
  });

  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 🚀 دالة إرسال الطلبية المباشرة
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    // التثبت من صيغة رقم الهاتف (10 أرقام ويبدأ بـ 05)
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError('⚠️ يجب أن يتكون رقم الهاتف من 10 أرقام ويبدأ بـ 05 (مثال: 059XXXXXXX)');
      return;
    }
    setPhoneError('');

    setIsSubmitting(true);

    // تجميع العنوان التفصيلي
    const fullAddress = `المحافظة: ${formData.governorate} | المدينة/البلد: ${formData.city} | الشارع: ${formData.street}`;

    fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: fullAddress,
        total_amount: totalAmount,
        items: cartItems
      })
    })
      .then(res => res.json())
      .then(() => {
        setIsSubmitting(false);
        setOrderSuccess(true);
        onClearCart();
      })
      .catch(err => {
        console.error('خطأ:', err);
        setIsSubmitting(false);
        alert('حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى.');
      });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#121216] border-r border-[#D4AF37]/30 text-white p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(212,175,55,0.2)]">
          
          {/* الهيدر */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-gold-gradient flex items-center gap-2">
              🛒 سلة المشتريات ({cartItems.reduce((a, b) => a + b.quantity, 0)})
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full bg-black/40">
              ✕
            </button>
          </div>

          {/* محتوى السلة */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {orderSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-5xl">🎉</div>
                <h3 className="text-2xl font-bold text-gold-gradient">تم إرسال طلبك بنجاح!</h3>
                <p className="text-gray-400 text-sm">شكراً لثقتك بمتجر عطورنا. يتصل بك فريقنا قريباً لتأكيد التوصيل.</p>
                <button 
                  onClick={() => { setOrderSuccess(false); onClose(); }} 
                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b8952c] transition-all"
                >
                  العودة للمتجر
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-20 text-gray-500 space-y-3">
                <div className="text-4xl">🛍️</div>
                <p>سلة المشتريات فارغة حالياً</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-[#1A1A20] rounded-xl border border-gray-800">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1 px-3">
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <p className="text-xs text-gold-gradient font-semibold">{item.price} ₪</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 bg-black rounded text-sm text-gray-300">-</button>
                      <span className="text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 bg-black rounded text-sm text-gray-300">+</button>
                    </div>
                  </div>
                  <button onClick={() => onRemoveItem(item.id)} className="text-red-400 hover:text-red-300 text-sm p-1">🗑️</button>
                </div>
              ))
            )}
          </div>

          {/* نموذج إتمام الطلب والسعر الكلي */}
          {cartItems.length > 0 && !orderSuccess && (
            <div className="border-t border-gray-800 pt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>المجموع الكلي:</span>
                <span className="text-gold-gradient">{totalAmount} ₪</span>
              </div>

              {/* فورم إدخال البيانات */}
              <form onSubmit={handleSubmitOrder} className="space-y-3 text-right">
                
                {/* 1. الاسم */}
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">الاسم الكامل</label>
                  <input 
                    type="text" 
                    placeholder="أدخل اسمك الرباعي" 
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
                  />
                </div>

                {/* 2. رقم الهاتف */}
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">رقم الهاتف (10 أرقام تبدأ بـ 05)</label>
                  <input 
                    type="tel" 
                    placeholder="059XXXXXXX" 
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (phoneError) setPhoneError('');
                    }}
                    className="w-full px-3 py-2 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
                  />
                  {phoneError && <p className="text-[11px] text-red-400 mt-1">{phoneError}</p>}
                </div>

                {/* 3. تفاصيل العنوان - 3 خانات */}
                <div className="space-y-2 pt-2 border-t border-gray-800">
                  <span className="block text-xs font-bold text-[#D4AF37]">عنوان التوصيل التفصيلي:</span>

                  <div>
                    <label className="block text-[10px] text-gray-400 mb-0.5">1. المحافظة</label>
                    <input 
                      type="text" 
                      placeholder="مثال: نابلس، رام الله، الخليل..." 
                      required
                      value={formData.governorate}
                      onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 mb-0.5">2. البلد / المدينة / القرية</label>
                    <input 
                      type="text" 
                      placeholder="مثال: مدينة نابلس / قرية حوارة..." 
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 mb-0.5">3. الشارع أو بالقرب من (معلم معروف)</label>
                    <input 
                      type="text" 
                      placeholder="مثال: شارع رفيديا - بالقرب من المستشفى" 
                      required
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0A0A0C] border border-gray-800 rounded-xl text-xs text-white focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                {/* زر الشراء المباشر */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-extrabold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer mt-2"
                >
                  {isSubmitting ? 'جاري إرسال الطلب...' : 'تأكيد وشراء الطلب الآن 🛍️'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}