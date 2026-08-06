import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ cartCount, onOpenCart, onOpenAdmin, currentUser, onOpenCustomerAuth, onLogout }) {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="bg-gradient-to-r from-[#111115] via-[#1A1812] to-[#111115] border-b border-[#D4AF37]/20 text-[#D4AF37] text-xs py-2 overflow-hidden shadow-inner">
        <div className="animate-marquee font-medium tracking-wide text-center">
          ✨ عروض حصرية: شحن مجاني للطلبات فوق 300 شيكل &nbsp;&nbsp; | &nbsp;&nbsp; 🎁 عينة مجانية مع كل طلب
        </div>
      </div>

      <nav className="glass-dark px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <Link to="/" onDoubleClick={onOpenAdmin} className="flex items-center space-x-3 space-x-reverse group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#111] p-[1px] group-hover:scale-110 transition-transform">
              <div className="w-full h-full bg-[#0A0A0C] rounded-full flex items-center justify-center">
                <span className="text-xl">👑</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-widest text-gold-gradient">عُطُورْنَا</h1>
              <span className="text-[9px] tracking-[0.3em] text-gray-400 block -mt-1 uppercase">HAUTE PARFUMERIE</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8 space-x-reverse text-sm font-medium text-gray-300">
            <Link to="/" className="hover:text-[#D4AF37]">الرئيسية</Link>
            <Link to="/shop" className="hover:text-[#D4AF37]">كل العطور</Link>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            
            {/* حساب الزبون */}
            {currentUser ? (
              <div className="flex items-center gap-3 bg-[#18181C] px-3 py-1.5 rounded-full border border-[#D4AF37]/30 text-xs">
                <span className="text-[#D4AF37] font-bold">👤 {currentUser.full_name.split(' ')[0]}</span>
                <button 
                  onClick={onLogout}
                  className="text-gray-400 hover:text-red-400 text-[10px] border-r border-gray-700 pr-2"
                >
                  خروج
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenCustomerAuth}
                className="text-xs text-gray-300 hover:text-[#D4AF37] font-bold px-3 py-2 border border-gray-800 rounded-xl hover:border-[#D4AF37] transition-all"
              >
                تسجيل الدخول / حساب جديد
              </button>
            )}

            {/* زر السلة */}
            <button 
              onClick={onOpenCart}
              className="relative p-2.5 bg-[#18181C] border border-[#D4AF37]/30 rounded-full text-gray-200 hover:border-[#D4AF37]"
            >
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </nav>
    </header>
  );
}