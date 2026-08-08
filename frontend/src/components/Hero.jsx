import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero({ onOpenCustomerAuth }) {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 bg-gradient-to-b from-[#0A0A0C] via-[#121216] to-[#0A0A0C]">
      
      {/* خلفية الإضاءة الذهبية */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* النصوص التسويقية */}
        <div className="space-y-6 text-center lg:text-right">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1812] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase animate-pulse">
            <span>💖 إطلاق مجموعة 2026 الحصرية</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            عبقُ الفخامة <br />
            <span className="text-gold-gradient">يُجسّد حضورك المَلَكي</span>
          </h1>
          
          <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed font-light">
            استكشف تشكيلة العطور النادرة المُبتكرة من أنقى الزيوت العطرية العالمية، صُممت لتترك أثراً لا يُنسى في كل حضور.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
            {/* زر تسوق المجموعة الآن -> يفتح نافذة تسجيل الدخول */}
{/* زر تسوق المجموعة الآن -> يفحص حالة تسجيل الدخول أولاً */}
<button 
  onClick={() => {
    // التحقق مما إذا كان هناك حساب مسجل في التخزين المحلي
    const isLoggedIn = localStorage.getItem('customer_user');
    
    if (isLoggedIn) {
      alert("تم تسجيل الدخول بنجاح");
      // ملاحظة: إذا أردت نقله لصفحة المنتجات بدلاً من بقائه في الرئيسية، يمكنك إزالة التعليق عن السطر التالي:
      // navigate('/shop');
    } else {
      // إذا لم يكن مسجلاً، نفتح نافذة تسجيل الدخول
      onOpenCustomerAuth && onOpenCustomerAuth('login');
    }
  }}
  className="relative group overflow-hidden rounded-full p-[1px] font-semibold text-sm cursor-pointer"
>
  <span className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#FFF] to-[#AA771C] group-hover:opacity-100 transition-opacity duration-500"></span>
  <span className="relative block px-8 py-4 bg-[#0A0A0C] rounded-full text-white group-hover:bg-transparent group-hover:text-black transition-all duration-300 font-bold tracking-wider">
    تسوق المجموعة الآن ←
  </span>
</button>

{/* زر اكتشف مكونات العطور -> ينقل لصفحة المعرض وكل العطور /shop */}
<button 
  onClick={() => navigate('/shop')}
  className="px-8 py-4 rounded-full border border-gray-700 hover:border-[#D4AF37] text-gray-300 hover:text-[#D4AF37] transition-all text-sm font-medium cursor-pointer"
>
  اكتشف مكوّنات العطور
</button>
          </div>
        </div>

        {/* زجاجة العطر الرئيسية المتحركة */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-72 h-96 md:w-80 md:h-[450px] animate-float">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-3xl blur-2xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury Perfume" 
              className="w-full h-full object-cover rounded-3xl border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-700 cursor-pointer"
            />
          </div>
        </div>

      </div>
    </section>
  );
}