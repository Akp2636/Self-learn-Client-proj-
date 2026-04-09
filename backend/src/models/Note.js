const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'शीर्षक आवश्यक है'],
      trim: true,
      maxlength: [200, 'शीर्षक 200 अक्षरों से कम होना चाहिए'],
    },
    subject: {
      type: String,
      required: [true, 'विषय आवश्यक है'],
      trim: true,
      maxlength: [100, 'विषय 100 अक्षरों से कम होना चाहिए'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    // Direct download URL (raw resource type)
    downloadUrl: {
      type: String,
      required: true,
    },
    // View URL (for PDF viewer)
    viewUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      default: '',
    },
    downloads: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', noteSchema);
