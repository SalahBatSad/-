const db = require('../config/db');

// جلب جميع العطور من قاعدة البيانات
exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم أثناء جلب العطور.'
        });
    }
};

// جلب عطر محدد بواسطة الـ ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const [product] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'لم يتم العثور على العطر المطلوب.'
            });
        }

        res.status(200).json({
            success: true,
            data: product[0]
        });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم.'
        });
    }
};