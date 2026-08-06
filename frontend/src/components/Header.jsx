import React from 'react';

const Header = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'products', label: 'عطورنا' },
    { id: 'about', label: 'من نحن' },
    { id: 'contact', label: 'تواصل معنا' }
  ];

  return (
    <header className="bg-slate-900 text-amber-400 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* الشعار */}
        <div className="flex items-center space-x-3 space-x-reverse cursor-pointer" onClick={() => setActivePage('home')}>
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-extrabold text-xl shadow-lg">
            ع
          </div>
          <span className="text-2xl font-bold tracking-wide text-white">عطورنا <span className="text-amber-400 text-sm font-normal">| OTOURNA</span></span>
        </div>

        {/* قائمة الملاحة */}
        <nav className="hidden md:flex space-x-8 space-x-reverse">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`font-semibold transition-colors duration-200 text-base ${
                activePage === item.id 
                  ? 'text-amber-400 border-b-2 border-amber-400 pb-1' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* زر السلة أو زر الإجراء السريع */}
        <button 
          onClick={() => setActivePage('products')}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-5 py-2 rounded-lg transition duration-200 text-sm shadow-md"
        >
          تسوق الآن
        </button>
      </div>
    </header>
  );
};

export default Header;