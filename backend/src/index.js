require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(fileUpload({
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  useTempFiles: false,
  abortOnLimit: true,
}));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Self-Learn Academy API चल रहा है!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'रूट नहीं मिला।' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'यह रिकॉर्ड पहले से मौजूद है।' });
  }

  res.status(500).json({ success: false, message: err.message || 'सर्वर में समस्या हुई।' });
});

// ─── Connect + Start ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB से कनेक्ट हो गया');
    app.listen(PORT, () => {
      console.log(`🚀  Self-Learn Academy API → http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌  MongoDB कनेक्शन विफल:', err.message);
    process.exit(1);
  });

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
