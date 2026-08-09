import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const Home = ({ setActivePage }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.VITE_API_URL || '';

useEffect(() => {
  fetch(`${API_URL}/api/products`)
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => console.error(err));
}, []);
useEffect(() => {
    // جلب المنتجات من الواجهة الخلفية (Node.js API)
    fetch('https://otourna-backend.onrender.com/api/products')
      .then((res) => {
        // التحقق من أن الخادم أرجع JSON وليس صفحة خطأ HTML
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          throw new Error("الخادم لم يرجع بيانات صالحة (قد يكون هناك خطأ في اتصال قاعدة البيانات على Render)");
        }
      })
      .then((data) => {
        // الخادم يرسل مصفوفة مباشرة حسب ملف server.txt
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && data.success) {
          // كإجراء احتياطي إذا قمت بتغيير الخادم لاحقاً
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ خطأ في جلب البيانات:', err);
        setLoading(false);
      });
  }, []);
// 👇 1. أضف هذا السطر هنا مباشرة قبل جملة return 👇
  const bestSellerProducts = products
    .filter(product => product.is_best_seller == 1 || product.is_best_seller === true || product.is_best_seller === '1')
    .slice(0, 3); // تحديد العدد بـ 3 منتجات فقط
  return (
    <div>
      {/* القسم الرئيسي (Hero Section) */}
      <section className="bg-slate-900 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            عالم من <span className="text-amber-400">الفخامة والأناقة</span> بين يديك
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            نركب لك عبق التاريخ وأصالة الشرق بأحدث المعايير العالمية لتجربة عطرية لا تُنسى.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setActivePage('products')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-3 rounded-xl transition shadow-lg text-lg"
            >
              استكشف المجموعة
            </button>
            <button 
              onClick={() => setActivePage('contact')}
              className="border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900 font-semibold px-8 py-3 rounded-xl transition text-lg"
            >
              تواصل معنا
            </button>
          </div>
        </div>
      </section>

      {/* قسم المنتجات المميزة */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">أحدث إصداراتنا العطرية</h2>
          <p className="text-gray-500 mt-2">تشكيلة مختارة بعناية لتناسب ذوقك الرفيع</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-amber-600 font-bold">جاري تحميل تشكيلة العطور...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;