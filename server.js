// 📦 File: server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // ✅ لحل مشكلة CORS
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ من الأفضل تخزين هاد القيم فـ .env فالنسخة النهائية
const SHOPIFY_API_KEY = '05af89d61893f7f6e9c59a9bd2486fcc';
const SHOPIFY_API_SECRET = '8fc0e7b4d183b748398ed7c32e93d911';
const SHOPIFY_STORE = 'privilegiashop.ma';
const ACCESS_TOKEN = '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';

// ✅ Middleware
app.use(cors({
  origin: 'https://www.privilegiashop.ma', // 🛡️ حدد الموقع المسموح به
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Endpoint لإنشاء الطلب في Shopify
app.post('/create-order', async (req, res) => {
  const { nom, tele, ville, address, quantity, variantId } = req.body;

  try {
    const orderData = {
      order: {
        line_items: [
          {
            variant_id: variantId,
            quantity: parseInt(quantity || 1)
          }
        ],
        customer: {
          first_name: nom,
          phone: tele
        },
        shipping_address: {
          address1: address,
          city: ville,
          first_name: nom,
          phone: tele
        },
        financial_status: 'pending'
      }
    };

    const response = await axios.post(
      `https://${SHOPIFY_STORE}/admin/api/2023-07/orders.json`,
      orderData,
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Order created:', response.data);
    res.status(200).json({ success: true, order: response.data });
  } catch (err) {
    console.error('❌ Error creating order:', err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

app.get('/', (req, res) => {
  res.send('🟢 Shopify Order API running');
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
