import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const defaultImages = [
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600'
];

export default function Shop({ onAddToCart, onQuickView }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const categories = ['الكل', 'عطور نيش', 'عطور رجالية', 'عطور نسائية', 'العود والبخور'];

  export default function Shop({ products = [], onAddToCart, onQuickView }) {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const categories = ['الكل', 'عطور نيش', 'عطور رجالية', 'عطور نسائية', 'العود والبخور'];

  // 🟢 هذا الجزء وجميع الأسطر القادمة بأسفل الملف تبقى كما هي تماماً!
  const filteredProducts = selectedCategory === 'الكل'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="shop-page">
      {/* باقي تصميم واجهة المعرض وأزرار التصنيفات كما هي عندك */}
    </div>
  );
}
// تصفية العطور بناءً على التصنيف المحدد من المستخدم
const filteredProducts = selectedCategory === 'الكل'
  ? products
  : products.filter(product => product.category === selectedCategory);
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl font-black text-gold-gradient">معرض العطور والتشكيلات</h1>
        <p className="text-xs text-gray-400">اختر قسمك المفضل واستمتع بأرقام العطور الفريدة</p>
      </div>

      {/* أزرار الأقسام */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat, idx) => (
          <button 
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-[#D4AF37] text-black' : 'bg-[#18181C] text-gray-400 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* الكود الجديد بعد الفلترة */}
{filteredProducts.map(product => (
  <ProductCard 
    key={product.id} 
    product={product} 
    onQuickView={onQuickView}
    onAddToCart={onAddToCart}
  />
))}
      </div>
    </div>
  );
}