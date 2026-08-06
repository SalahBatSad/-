import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id === parseInt(id));
        setProduct(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-30 text-[#D4AF37] font-bold">جاري تحميل تفاصيل العطر...</div>;
  if (!product) return <div className="text-center py-30 text-white">العطر غير موجود.</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-white">
      <button onClick={() => navigate(-1)} className="mb-8 text-xs font-bold text-[#D4AF37] hover:underline">
        ← العودة للصفحة السابقة
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center glass-dark p-8 rounded-3xl border border-[#D4AF37]/20">
        <div className="relative group overflow-hidden rounded-2xl border border-gray-800">
          <img 
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600" 
            alt={product.name} 
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="space-y-6">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">HAUTE PARFUMERIE</span>
          <h1 className="text-4xl font-black">{product.name}</h1>
          <p className="text-3xl font-extrabold text-gold-gradient">{product.price} ₪</p>
          <p className="text-sm text-gray-300 leading-relaxed">{product.description || 'تركيبة عطرية ساحرة تمزج بين الفخامة والأناقة وتدوم طويلاً.'}</p>
          
          <div className="pt-4 space-y-3">
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-black rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
            >
              إضافة إلى السلة 🛍️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}