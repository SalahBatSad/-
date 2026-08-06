import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-gray-400 pt-12 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h4 className="text-white text-lg font-bold mb-4">شركة عطورنا</h4>
          <p className="text-sm leading-relaxed">
            علامة تجارية رائدة في صناعة واستيراد أفخم العطور الشرقية والغربية بكل فخامة وإتقان.
          </p>
        </div>

        <div>
          <h4 className="text-white text-lg font-bold mb-4">روابط سريعة</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#about" className="hover:text-amber-400 transition">عن الشركة</a></li>
            <li><a href="#services" className="hover:text-amber-400 transition">مجموعتنا الفاخرة</a></li>
            <li><a href="#privacy" className="hover:text-amber-400 transition">سياسة الخصوصية</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-lg font-bold mb-4">تواصل معنا</h4>
          <p className="text-sm">الرياض، المملكة العربية السعودية</p>
          <p className="text-sm mt-1">info@otourna.com</p>
          <p className="text-sm mt-1">+966 50 000 0000</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-6 text-center text-xs text-gray-500">
        جميع الحقوق محفوظة © {new Date().getFullYear()} لشركة عطورنا الرسمية.
      </div>
    </footer>
  );
};

export default Footer;