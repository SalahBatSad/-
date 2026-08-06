const db = require('../config/db');

// استقبال وحفظ رسالة جديدة من نموذج "تواصل معنا"
exports.sendContactMessage = async (req, res) => {
    try {
        const { customer_name, email, subject, message } = req.body;

        // التحقق من الحقول الإلزامية
        if (!customer_name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء تعبئة جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة).'
            });
        }

        const query = `INSERT INTO contact_messages (customer_name, email, subject, message) VALUES (?, ?, ?, ?)`;
        await db.query(query, [customer_name, email, subject || 'بدون عنوان', message]);

        res.status(201).json({
            success: true,
            message: 'تم إرسال رسالتك بنجاح! سنتواصل معك في أقرب وقت ممكن.'
        });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً.'
        });
    }
};