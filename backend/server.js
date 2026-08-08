const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // أو حسب المكتبة التي تستخدمها لقاعدة البيانات
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 🌟 مكتبة التعامل مع الملفات

// 1️⃣ تعريف المتغير app أولاً (مهم جداً أن يكون هنا قبل استخدامه)
const app = express();

// 2️⃣ إعدادات app الأساسية
app.use(cors());
app.use(express.json());

// 3️⃣ إنشاء مجلد uploads تلقائياً إذا لم يكن موجوداً
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 4️⃣ إعداد مكان واسم الصورة المرفوعة
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 5️⃣ السماح للواجهة بقراءة الصور (الآن سيعمل لأن app معرف مسبقاً فوق!)
app.use('/uploads', express.static(uploadDir));

// ... باقي الكود والمسارات (Routes) تبقى كما هي في الأسفل ...
// 💡 مخزن مؤقت لأكواد التحقق المحلي
const otpStore = {};

// 🔌 الاتصال بقاعدة البيانات MySQL باستخدام الـ Connection Pool
// 🔌 الاتصال بقاعدة البيانات MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-dealiopro.alwaysdata.net',
  user: process.env.DB_USER || 'dealiopro',
  password: process.env.DB_PASSWORD || 'Salah000@',
  database: process.env.DB_NAME || 'dealiopro_salah',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// اختبار الاتصال بالـ Pool بطريقة صحيحة
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message);
  } else {
    console.log('✅ تم الاتصال بقاعدة البيانات MySQL بنجاح!');
    connection.release(); // تحرير الاتصال ليعود إلى الـ Pool
  }
});

module.exports = db; // تأكد من تصدير الاتصال إذا كان في ملف منفصل
// 1️⃣ جلب جميع العطور
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2️⃣ إضافة عطر جديد مع التصنيف والصورة والأكثر مبيعاً (لوحة الأدمن)
app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, description, price, category } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = "INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)";
  
  db.query(sql, [name, description, price, category, imageUrl], (err, result) => {
    if (err) {
      console.error("خطأ في الإضافة:", err);
      return res.status(500).json({ error: "حدث خطأ أثناء إضافة المنتج" });
    }
    res.json({ message: "تمت إضافة المنتج بنجاح!", id: result.insertId });
  });
});

// 🌟 الكود القديم (اتركه كما هو) - مسار تعديل منتج
app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;
  
  // إذا لم يرفع صورة جديدة، نحدث فقط النصوص
  let sql = "UPDATE products SET name=?, description=?, price=?, category=? WHERE id=?";
  let values = [name, description, price, category, id];

  // إذا قام برفع صورة جديدة، نحدث مسار الصورة أيضاً
  if (req.file) {
    const imageUrl = `/uploads/${req.file.filename}`;
    sql = "UPDATE products SET name=?, description=?, price=?, category=?, image=? WHERE id=?";
    values = [name, description, price, category, imageUrl, id];
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("خطأ في التعديل:", err);
      return res.status(500).json({ error: "حدث خطأ أثناء تعديل المنتج" });
    }
    res.json({ message: "تم التعديل بنجاح!" });
  });
});


// 👇👇👇 أضف هذا الكود الجديد هنا مباشرة 👇👇👇

// 🌟 مسار جديد: تحديث حالة "الأكثر مبيعاً" للمنتج فقط
app.put('/api/products/:id/best-seller', (req, res) => {
  const productId = req.params.id;
  const { is_best_seller } = req.body;

  // تحويل القيمة المنطقية إلى 1 (نعم) أو 0 (لا) لتناسب قاعدة البيانات
  const bestSellerValue = is_best_seller ? 1 : 0;

  const sql = 'UPDATE products SET is_best_seller = ? WHERE id = ?';
  
  db.query(sql, [bestSellerValue, productId], (err, result) => {
    if (err) {
      console.error('خطأ في تحديث حالة الأكثر مبيعاً:', err);
      return res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
    res.json({ message: 'تم تحديث حالة الأكثر مبيعاً بنجاح!' });
  });
});
// 🌟 مسار تحديث حالة الطلب
app.put('/api/orders/:id/status', (req, res) => {
  const orderId = req.params.id;
  const newStatus = req.body.status;

  // استعلام تحديث الحالة في قاعدة البيانات
  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  
  db.query(sql, [newStatus, orderId], (err, result) => {
    if (err) {
      console.error("خطأ في تحديث قاعدة البيانات:", err);
      return res.status(500).json({ error: "حدث خطأ في الخادم" });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }

    res.json({ message: "تم تحديث الحالة بنجاح" });
  });
});

// 3️⃣ حذف عطر (لوحة الأدمن)
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'تم حذف العطر بنجاح' });
  });
});

// 4️⃣ جلب جميع الطلبات الواردة (لوحة الأدمن)
app.get('/api/orders', (req, res) => {
  db.query('SELECT * FROM orders ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 5️⃣ إنشاء طلب شراء جديد
app.post('/api/orders', (req, res) => {
  const { customer_name, phone, address, total_amount, items } = req.body;
  db.query(
    'INSERT INTO orders (customer_name, phone, address, total_amount, items) VALUES (?, ?, ?, ?, ?)',
    [customer_name, phone, address, total_amount, JSON.stringify(items)],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'تم إرسال الطلب بنجاح', orderId: result.insertId });
    }
  );
});

// 6️⃣ تسجيل حساب جديد للزبون
app.post('/api/register', (req, res) => {
  const { full_name, email, phone, governorate, city, street, password } = req.body;

  if (!full_name || !email || !phone || !password) {
    return res.status(400).json({ error: 'الرجاء تعبئة جميع الحقول المطلوبة' });
  }

  const query = `INSERT INTO users (full_name, email, phone, governorate, city, street, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [full_name, email, phone, governorate, city, street, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'البريد الإلكتروني مُسجل مسبقاً' });
      }
      return res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
    const user = { id: result.insertId, full_name, email, phone, governorate, city, street };
    res.json({ message: 'تم إنشاء الحساب بنجاح', user });
  });
});

// 7️⃣ تسجيل دخول الزبون
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT id, full_name, email, phone, governorate, city, street FROM users WHERE email = ? AND password = ?`;
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
    if (results.length === 0) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة السر غير صحيحة' });
    }
    res.json({ message: 'تم تسجيل الدخول بنجاح', user: results[0] });
  });
});

// 8️⃣ إرسال كود التحقق محلياً (بدون Green API)
app.post('/api/send-otp', (req, res) => {
  const { phone } = req.body;

  // فحص صيغة الرقم (10 أرقام ويبدأ بـ 05)
  const phoneRegex = /^05\d{8}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).json({ 
      success: false, 
      error: 'رقم الهاتف غير صحيح. يجب أن يتكون من 10 أرقام ويبدأ بـ 05' 
    });
  }

  // توليد كود عشوائي محلي من 4 أرقام
  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[phone] = generatedOtp;

  console.log(`📱 [OTP المحلي] الكود المولد للرقم ${phone} هو: ${generatedOtp}`);

  res.json({ 
    success: true, 
    message: 'تم توليد كود التحقق بنجاح',
    testOtp: generatedOtp 
  });
});

// 9️⃣ التأكد من صحة كود التحقق
app.post('/api/verify-otp', (req, res) => {
  const { phone, code } = req.body;

  if (otpStore[phone] && otpStore[phone] === code?.toString().trim()) {
    delete otpStore[phone]; // مسح الكود بعد النجاح لأسباب أمنية
    return res.json({ success: true, message: 'تم التحقق من رقم الهاتف بنجاح' });
  }

  res.status(400).json({ success: false, error: '❌ كود التحقق غير صحيح، حاول مرة أخرى' });
});
const nodemailer = require('nodemailer');

// إعداد خادم الإيميل (استخدام حساب Gmail الخاص بمتجرك)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-store-email@gmail.com', // إيميل متجرك
    pass: 'your-app-password'           // كلمة مرور التطبيقات من جوجل
  }
});

// مسار إرسال كود التحقق للإيميل
app.post('/api/send-email-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
  }

  // توليد كود من 4 أرقام
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

  const mailOptions = {
    from: '"متجر العطور" <your-store-email@gmail.com>',
    to: email,
    subject: 'رمز تحقق حسابك في متجر العطور 🔑',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: right; direction: rtl; padding: 20px;">
        <h2>أهلاً بك في متجرنا! 🎉</h2>
        <p>كود التحقق الخاص بك لتأكيد البريد الإلكتروني هو:</p>
        <h1 style="color: #D4AF37; letter-spacing: 5px;">${otpCode}</h1>
        <p>هذا الكود صالحة لاستخدام واحد فقط.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    // حفظ الكود في السيرفر للتحقق منه لاحقاً
    otpStore[email] = otpCode;
    res.json({ success: true, message: 'تم إرسال كود التحقق إلى إيميلك بنجاح' });
  } catch (error) {
    console.error('خطأ إرسال الإيميل:', error);
    res.status(500).json({ success: false, error: 'فشل إرسال الإيميل، تأكد من صحته' });
  }
});
// 🚀 تشغيل السيرفر
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل بنجاح على الرابط: http://localhost:${PORT}`);
});