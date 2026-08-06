import React from 'react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#121216] border border-[#D4AF37]/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] grid grid-cols-1 md:grid-cols-2">
        
        {/* زر الإغلاق */}
        <button onClick={onClose} className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/60 text-gray-400 hover:text-white flex items-center justify-center border border-gray-700">
          ✕
        </button>

        {/* صورة المنتج */}
        <div className="h-64 md:h-full relative overflow-hidden">
          <img src={product.image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600'} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* تفاصيل العطر في النافذة المنبثقة */}
        <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase">طبعات فاخرة</span>
            <h3 className="text-2xl font-bold text-white mt-1">{product.name}</h3>
            <p className="text-xl font-bold text-gold-gradient mt-2">{product.price} ₪</p>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">{product.description}</p>
            
            <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
              <div className="text-xs text-gray-300">🌿 <strong className="text-gray-100">الافتتاحية:</strong> البرغموت، العود الملكي</div>
              <div className="text-xs text-gray-300">🌸 <strong className="text-gray-100">قلب العطر:</strong> الورد الطائفي، المسك</div>
            </div>
          </div>

          <button 
            onClick={() => { onAddToCart(product); onClose(); }}
            className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-all"
          >
            إضافة لسلة الشراء 🛒
          </button>
        </div>

      </div>
    </div>
  );
}