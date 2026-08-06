import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ onBackToStore }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // نموذج إضافة عطر جديد
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });

  // جلب البيانات عند الفتح
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5000/api/orders').then(res => res.json()),
      fetch('http://localhost:5000/api/products').then(res => res.json())
    ])
    .then(([ordersData, productsData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  // إضافة عطر جديد
  const handleAddProduct = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
    .then(res => res.json())
    .then(() => {
      alert('✅ تم إضافة العطر بنجاح!');
      setNewProduct({ name: '', price: '', description: '' });
      fetchData();
    });
  };

  // حذف عطر
  const handleDeleteProduct = (id) => {
    if (window.confirm('هل أنت تأكد من حذف هذا العطر؟')) {
      fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' })
      .then(() => fetchData());
    }
  };

  // إحصائيات المبيعات
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 p-6 md:p-10 font-sans">
      
      {/* الهيدر العلوي للوحة الأدمن */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pb-6 border-b border-gray-800 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gold-gradient flex items-center gap-2">
            👑 لوحة تحكم الإدارة
          </h1>
          <p className="text-xs text-gray-400 mt-1">إدارة الطلبات، العطور، والعمليات التجارية</p>
        </div>
        <button 
          onClick={onBackToStore}
          className="px-5 py-2.5 bg-[#18181C] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-white text-xs font-bold rounded-xl transition-all"
        >
          ← العودة للمتجر الرئيسي
        </button>
      </div>

      {/* 📊 كروت الإحصائيات السريعة */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="glass-dark p-6 rounded-2xl border border-[#D4AF37]/20">
          <span className="text-xs text-gray-400 font-bold uppercase">إجمالي المبيعات</span>
          <h3 className="text-3xl font-black text-gold-gradient mt-2">{totalRevenue} ₪</h3>
        </div>
        <div className="glass-dark p-6 rounded-2xl border border-gray-800">
          <span className="text-xs text-gray-400 font-bold uppercase">عدد الطلبات الواردة</span>
          <h3 className="text-3xl font-black text-white mt-2">{orders.length} طلب</h3>
        </div>
        <div className="glass-dark p-6 rounded-2xl border border-gray-800">
          <span className="text-xs text-gray-400 font-bold uppercase">إجمالي العطور المتاحة</span>
          <h3 className="text-3xl font-black text-white mt-2">{products.length} عطر</h3>
        </div>
      </div>

      {/* تبويبات التنقل */}
      <div className="max-w-7xl mx-auto flex gap-4 border-b border-gray-800 pb-4 mb-8">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2.5 font-bold text-sm rounded-xl transition-all ${activeTab === 'orders' ? 'bg-[#D4AF37] text-black' : 'bg-[#121216] text-gray-400 hover:text-white'}`}
        >
          📦 الطلبات الواردة ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2.5 font-bold text-sm rounded-xl transition-all ${activeTab === 'products' ? 'bg-[#D4AF37] text-black' : 'bg-[#121216] text-gray-400 hover:text-white'}`}
        >
          🧴 إضافة وإدارة العطور ({products.length})
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-12 text-gold-gradient font-bold animate-pulse">جاري تحميل البيانات...</div>
        ) : activeTab === 'orders' ? (
          
          /* 📦 جدول عرض الطلبات */
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-10">لا توجد طلبات حتّى الآن.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="glass-dark p-6 rounded-2xl border border-gray-800 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <div>
                      <span className="text-xs text-[#D4AF37] font-bold">طلب رقم #{order.id}</span>
                      <h4 className="text-lg font-bold text-white">{order.customer_name}</h4>
                    </div>
                    <span className="text-sm font-black text-gold-gradient">{order.total_amount} ₪</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                    <p>📱 <strong>رقم الهاتف:</strong> {order.phone}</p>
                    <p>📍 <strong>العنوان:</strong> {order.address}</p>
                  </div>

                  {/* تفاصيل عناصر الطلب */}
                  <div className="bg-[#0A0A0C] p-3 rounded-xl space-y-2">
                    <span className="text-[11px] text-gray-400 font-bold block">العناصر المطلوبة:</span>
                    {JSON.parse(order.items || '[]').map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-200">
                        <span>• {item.name} (x{item.quantity})</span>
                        <span className="text-gray-400">{item.price * item.quantity} ₪</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

        ) : (

          /* 🧴 قسم إدارة العطور وإضافتها */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="glass-dark p-6 rounded-2xl border border-[#D4AF37]/30 h-fit">
              <h3 className="text-lg font-bold text-[#D4AF37] mb-4">➕ إضافة عطر جديد</h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="اسم العطر" 
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0A0A0C] border border-gray-800 rounded-xl text-sm text-white focus:border-[#D4AF37] outline-none"
                />
                <input 
                  type="number" 
                  placeholder="السعر (بالشيقل ₪)" 
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0A0A0C] border border-gray-800 rounded-xl text-sm text-white focus:border-[#D4AF37] outline-none"
                />
                <textarea 
                  placeholder="وصف العطر ونوتاته العطرية" 
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0A0A0C] border border-gray-800 rounded-xl text-sm text-white focus:border-[#D4AF37] outline-none"
                ></textarea>

                <button 
                  type="submit"
                  className="w-full py-3 bg-[#D4AF37] text-black font-extrabold rounded-xl hover:bg-[#b8952c] transition-all"
                >
                  حفظ ونشر العطر 🚀
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-white">قائمة العطور الحالية</h3>
              {products.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-[#121216] border border-gray-800 rounded-xl">
                  <div>
                    <h4 className="font-bold text-white">{product.name}</h4>
                    <p className="text-xs text-gold-gradient font-semibold">{product.price} ₪</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-800 rounded-lg text-xs hover:bg-red-800 hover:text-white transition-all"
                  >
                    حذف العطر 🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

        )}
      </div>

    </div>
  );
}