const mysql = require('mysql2');
require('dotenv').config({ path: '../../.env' }); // جلب متغيرات البيئة
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
// إنشاء Pool للاتصال بقاعدة البيانات لدعم الطلبات المتزامنة
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 100, // يتحمل حتى 100 اتصال متزامن في نفس اللحظة
    queueLimit: 0
});

// استخدام الـ Promises لتسهيل كتابة الكود لاحقاً
const promisePool = pool.promise();

// فحص الاتصال للتأكد من عمله
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message);
    } else {
        console.log('✅ تم الاتصال بقاعدة بيانات MySQL بنجاح!');
        connection.release();
    }
});

module.exports = promisePool;