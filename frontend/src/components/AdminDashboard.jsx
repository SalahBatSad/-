import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ onBackToStore }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
const [editingId, setEditingId] = useState(null); // 🌟 حالة لمعرفة المنتج الجاري تعديله
  // نموذج إضافة عطر جديد
const [newProduct, setNewProduct] = useState({
  name: '',
  price: '',
  description: '',
  category: 'عطور نيش', // التصنيف الافتراضي
  image: ''             // رابط الصورة
});
  // جلب البيانات عند الفتح
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('https://otourna-backend.onrender.com/api/orders').then(res => res.json()),
      fetch('https://otourna-backend.onrender.com/api/products').then(res => res.json())
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
  // 🌟 دالة إضافة أو تعديل العطر
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    // نرفق الصورة فقط إذا قام المستخدم باختيار صورة جديدة
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    // تحديد الرابط ونوع الطلب (POST للإضافة، PUT للتعديل)
    const url = editingId 
      ? `https://otourna-backend.onrender.com/api/products/${editingId}` 
      : 'https://otourna-backend.onrender.com/api/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
      });
      
      if (response.ok) {
        alert(editingId ? 'تم تعديل المنتج بنجاح! ✏️' : 'تمت إضافة المنتج بنجاح! 🚀');
        // تفريغ الحقول وإعادة الحالة لطبيعتها
        setNewProduct({ name: '', price: '', description: '', category: 'عطور نيش', image: '' });
        setEditingId(null);
        fetchData(); // تحديث قائمة العطور
      } else {
        alert('حدث خطأ أثناء حفظ المنتج');
      }
    } catch (error) {
      console.error('خطأ:', error);
    }
  };
  // حذف عطر
  const handleDeleteProduct = (id) => {
    if (window.confirm('هل أنت تأكد من حذف هذا العطر؟')) {
      fetch(`https://otourna-backend.onrender.com/api/products/${id}`, { method: 'DELETE' })
      .then(() => fetchData());
    }
  };
  // 🌟 دالة تبديل حالة "الأكثر مبيعاً" للمنتج
  const handleToggleBestSeller = async (product) => {
    const updatedStatus = !product.is_best_seller;
    try {
      const response = await fetch(`https://otourna-backend.onrender.com/api/products/${product.id}/best-seller`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_best_seller: updatedStatus })
      });

      if (response.ok) {
        fetchData(); // إعادة جلب البيانات لتحديث اللوحة مباشرة
      } else {
        alert('حدث خطأ أثناء تحديث حالة المنتج');
      }
    } catch (error) {
      console.error('خطأ:', error);
    }
  };
// 🌟 دالة تحديث حالة الطلب
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://otourna-backend.onrender.com/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // تحديث قائمة الطلبات محلياً لإظهار الصح الأخضر فوراً بدون تحديث الصفحة
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert('حدث خطأ أثناء تحديث حالة الطلب');
      }
    } catch (error) {
      console.error('خطأ:', error);
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
                  {/* 🚦 قسم تغيير حالة الطلب */}
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <h4 className="text-[11px] font-bold text-gray-400 mb-3">تحديث حالة الطلب:</h4>
                    <div className="flex flex-wrap gap-4">
                      {['قيد التجهيز', 'قيد التوصيل', 'تم التوصيل بنجاح'].map((statusOption) => {
                        // نعتبر "قيد التجهيز" هي الحالة الافتراضية إذا كان الحقل فارغاً
                        const currentStatus = order.status || 'قيد التجهيز';
                        const isActive = currentStatus === statusOption;

                        return (
                          <label key={statusOption} className="flex items-center gap-2 cursor-pointer group">
                            {/* المربع الصغير */}
                            <div 
                              onClick={() => handleUpdateOrderStatus(order.id, statusOption)}
                              className={`w-4 h-4 flex items-center justify-center rounded-[4px] border transition-all duration-300 ${
                                isActive 
                                  ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
                                  : 'bg-[#121216] border-gray-600 group-hover:border-[#D4AF37]'
                              }`}
                            >
                              {/* علامة الصح تظهر فقط إذا كانت الحالة نشطة */}
                              {isActive && <span className="text-black text-[10px] font-black">✓</span>}
                            </div>
                            
                            {/* نص الحالة */}
                            <span onClick={() => handleUpdateOrderStatus(order.id, statusOption)} className={`text-xs select-none transition-colors ${isActive ? 'text-green-400 font-bold' : 'text-gray-400 group-hover:text-gray-200'}`}>
                              {statusOption}
                            </span>
                          </label>
                        );
                      })}
                    </div>
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
                
                {/* 1. اسم العطر */}
                <input 
                  type="text" 
                  placeholder="اسم العطر" 
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0A0A0C] border border-gray-800 rounded-xl text-sm text-white focus:border-[#D4AF37] outline-none"
                />

                {/* 2. السعر */}
                <input 
                  type="number" 
                  placeholder="السعر (بالشيقل ₪)" 
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0A0A0C] border border-gray-800 rounded-xl text-sm text-white focus:border-[#D4AF37] outline-none"
                />

                {/* 3. الوصف */}
                <textarea 
                  placeholder="وصف العطر ونوتاته العطرية" 
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0A0A0C] border border-gray-800 rounded-xl text-sm text-white focus:border-[#D4AF37] outline-none"
                ></textarea>

                {/* 🟢 4. قائمة اختيار التصنيف (جديد) */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">تصنيف العطر</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0A0A0C] border border-gray-800 rounded-xl text-sm text-white focus:border-[#D4AF37] outline-none cursor-pointer"
                  >
                    <option value="عطور نيش">عطور نيش</option>
                    <option value="عطور رجالية">عطور رجالية</option>
                    <option value="عطور نسائية">عطور نسائية</option>
                    <option value="العود والبخور">العود والبخور</option>
                  </select>
                </div>

                {/* 🟢 5. حقل إضافة صورة العطر (رفع ملف من الجهاز) */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">صورة العطر (رفع من الجهاز)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                    className="w-full px-4 py-2.5 bg-[#0A0A0C] border border-gray-800 rounded-xl text-sm text-gray-400 focus:border-[#D4AF37] outline-none file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#D4AF37] file:text-black hover:file:bg-yellow-600 transition-all cursor-pointer"
                  />
                </div>
                {/* زر حفظ ونشر العطر */}
                {/* زر حفظ ونشر العطر أو تعديله */}
                <button 
                  type="submit"
                  className="w-full py-3 bg-[#D4AF37] text-black font-extrabold rounded-xl hover:bg-[#b8952c] transition-all cursor-pointer"
                >
                  {editingId ? 'حفظ التعديلات 💾' : 'حفظ ونشر العطر 🚀'}
                </button>
                
                {/* زر التراجع عن التعديل (يظهر فقط أثناء التعديل) */}
                {editingId && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setNewProduct({ name: '', price: '', description: '', category: 'عطور نيش', image: '' });
                    }}
                    className="w-full py-2 mt-2 bg-gray-800 text-gray-300 font-bold rounded-xl hover:bg-gray-700 transition-all cursor-pointer"
                  >
                    إلغاء التعديل
                  </button>
                )}
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-white">قائمة العطور الحالية</h3>
              {products.map(product => {
                const isBest = product.is_best_seller == 1 || product.is_best_seller === true || product.is_best_seller === '1';

                return (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-[#121216] border border-gray-800 rounded-xl">
                    <div>
                      <h4 className="font-bold text-white">{product.name}</h4>
                      <p className="text-xs text-gold-gradient font-semibold">{product.price} ₪</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* زر تبديل الأكثر مبيعاً */}
                      <button 
                        onClick={() => handleToggleBestSeller(product)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          isBest 
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]' 
                            : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                        }`}
                      >
                        {isBest ? '🌟 الأكثر مبيعاً' : '☆ عادي'}
                      </button>

                      {/* زر التعديل */}
                      <button 
                        onClick={() => {
                          setEditingId(product.id);
                          setNewProduct({
                            name: product.name,
                            price: product.price,
                            description: product.description || '',
                            category: product.category || 'عطور نيش',
                            image: '' 
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3 py-1.5 bg-blue-900/30 text-blue-400 border border-blue-800 rounded-lg text-xs hover:bg-blue-800 hover:text-white transition-all"
                      >
                        تعديل ✏️
                      </button>

                      {/* زر الحذف */}
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-3 py-1.5 bg-red-900/30 text-red-400 border border-red-800 rounded-lg text-xs hover:bg-red-800 hover:text-white transition-all"
                      >
                        حذف 🗑️
                      </button>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          </div>

        )}
      </div>

    </div>
  );
}