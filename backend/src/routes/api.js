const express = require('express');
const router = express.Router();

// استدعاء وحدات التحكم
const { getAllProducts, getProductById } = require('../controllers/productController');
const { sendContactMessage } = require('../controllers/contactController');

// --- مسارات العطور ---
router.get('/products', getAllProducts);        // جلب جميع العطور
router.get('/products/:id', getProductById);    // جلب عطر محدد

// --- مسارات التواصل ---
router.post('/contact', sendContactMessage);    // إرسال رسالة تواصل

module.exports = router;