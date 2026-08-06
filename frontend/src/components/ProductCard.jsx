import React from 'react';

export default function ProductCard({ product, onQuickView, onAddToCart }) {
  return (
    <div className="group relative bg-[#121216] border border-gray-800 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:-translate-y-2">
      
      {/* شارة الأصالة */}
      <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
        أصلي 100%
      </div>

      {/* صورة العطر مع التكبير عند الماوس */}
      <div className="relative h-72 overflow-hidden bg-black/40">
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-80"></div>
        
        {/* زر العرض السريع */}
        <button 
          onClick={() => onQuickView(product)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-bold px-5 py-2.5 rounded-full border border-[#D4AF37]/40 shadow-xl backdrop-blur-sm"
        >
          🔍 عرض سريع
        </button>
      </div>

      {/* تفاصيل المنتج */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
        <p className="text-gray-400 text-xs line-clamp-2 font-light">{product.description}</p>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-800/80">
          <span className="text-xl font-extrabold text-gold-gradient">{product.price} <span className="text-xs font-normal text-gray-400">₪</span></span>
          
          <button 
            onClick={() => onAddToCart(product)}
            className="p-3 rounded-xl bg-[#1A1A20] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-300 group/btn"
          >
            <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}