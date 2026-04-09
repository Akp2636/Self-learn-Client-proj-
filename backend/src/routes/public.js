const express = require('express');
const Note = require('../models/Note');
const Video = require('../models/Video');

const router = express.Router();

// ─── Get All Public Notes ─────────────────────────────────────────────────────
router.get('/notes', async (req, res) => {
  try {
    const { subject, search } = req.query;
    let query = { isActive: true };

    if (subject && subject !== 'सभी') {
      query.subject = subject;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(query)
      .select('title subject description downloadUrl viewUrl fileSize downloads createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Get Single Note ──────────────────────────────────────────────────────────
router.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !note.isActive) {
      return res.status(404).json({ success: false, message: 'नोट्स नहीं मिले।' });
    }
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Increment Download Count ─────────────────────────────────────────────────
router.post('/notes/:id/download', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'नोट्स नहीं मिले।' });
    res.json({ success: true, downloadUrl: note.downloadUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Get All Subjects ─────────────────────────────────────────────────────────
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Note.distinct('subject', { isActive: true });
    res.json({ success: true, subjects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Get All Public Videos ────────────────────────────────────────────────────
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find({ isActive: true })
      .select('title subject youtubeId description order createdAt')
      .sort({ order: 1, createdAt: -1 });
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
