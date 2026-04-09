const express = require('express');
const jwt = require('jsonwebtoken');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Note = require('../models/Note');
const Video = require('../models/Video');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// ─── Admin Login ──────────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || 'devesh';
  const adminPassword = process.env.ADMIN_PASSWORD || 'devesh123';

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ success: false, message: 'गलत यूजरनेम या पासवर्ड।' });
  }

  const token = jwt.sign(
    { role: 'admin', username: adminUsername },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ success: true, token, message: 'लॉगिन सफल!' });
});

// ─── Upload PDF Note ──────────────────────────────────────────────────────────
router.post('/notes/upload', adminAuth, async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ success: false, message: 'PDF फ़ाइल आवश्यक है।' });
    }

    const { title, subject, description } = req.body;
    if (!title || !subject) {
      return res.status(400).json({ success: false, message: 'शीर्षक और विषय आवश्यक हैं।' });
    }

    const file = req.files.pdf;

    // Validate file type
    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ success: false, message: 'केवल PDF फ़ाइलें अनुमत हैं।' });
    }

    // Validate file size (max 20MB)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(400).json({ success: false, message: 'फ़ाइल का आकार 20MB से कम होना चाहिए।' });
    }

    // Upload to Cloudinary as raw resource
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'self-learn-academy/notes',
          format: 'pdf',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(file.data).pipe(uploadStream);
    });

    // Calculate file size string
    const fileSizeKB = Math.round(file.size / 1024);
    const fileSizeStr = fileSizeKB > 1024
      ? `${(fileSizeKB / 1024).toFixed(1)} MB`
      : `${fileSizeKB} KB`;

    // Cloudinary raw download URL
    const downloadUrl = uploadResult.secure_url;
    // View URL — use Google Docs viewer as fallback for inline display
    const viewUrl = uploadResult.secure_url;

    const note = await Note.create({
      title,
      subject,
      description: description || '',
      cloudinaryId: uploadResult.public_id,
      downloadUrl,
      viewUrl,
      fileSize: fileSizeStr,
    });

    res.status(201).json({
      success: true,
      message: 'नोट्स सफलतापूर्वक अपलोड हो गए!',
      note,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'अपलोड में समस्या हुई: ' + err.message });
  }
});

// ─── Delete Note ──────────────────────────────────────────────────────────────
router.delete('/notes/:id', adminAuth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'नोट्स नहीं मिले।' });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(note.cloudinaryId, { resource_type: 'raw' });
    } catch (cloudErr) {
      console.error('Cloudinary delete error:', cloudErr.message);
    }

    await note.deleteOne();
    res.json({ success: true, message: 'नोट्स सफलतापूर्वक हटाए गए।' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Get All Notes (Admin) ────────────────────────────────────────────────────
router.get('/notes', adminAuth, async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Add Video ────────────────────────────────────────────────────────────────
router.post('/videos', adminAuth, async (req, res) => {
  try {
    const { title, subject, youtubeId, description } = req.body;
    if (!title || !subject || !youtubeId) {
      return res.status(400).json({ success: false, message: 'शीर्षक, विषय और YouTube ID आवश्यक हैं।' });
    }

    // Extract video ID if full URL pasted
    let vid = youtubeId.trim();
    const urlMatch = vid.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    if (urlMatch) vid = urlMatch[1];

    const video = await Video.create({ title, subject, youtubeId: vid, description: description || '' });
    res.status(201).json({ success: true, message: 'वीडियो सफलतापूर्वक जोड़ा गया!', video });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Delete Video ─────────────────────────────────────────────────────────────
router.delete('/videos/:id', adminAuth, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'वीडियो नहीं मिला।' });
    res.json({ success: true, message: 'वीडियो सफलतापूर्वक हटाया गया।' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Get All Videos (Admin) ───────────────────────────────────────────────────
router.get('/videos', adminAuth, async (req, res) => {
  try {
    const videos = await Video.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
