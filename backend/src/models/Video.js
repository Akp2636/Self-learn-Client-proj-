const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'शीर्षक आवश्यक है'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'विषय आवश्यक है'],
      trim: true,
    },
    youtubeId: {
      type: String,
      required: [true, 'YouTube ID आवश्यक है'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
