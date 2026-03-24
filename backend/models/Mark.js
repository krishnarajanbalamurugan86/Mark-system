const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  studentName: {
    type: String,
    required: true
  },
  regNo: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  courseType: {
    type: String,
    required: true
  },
  subjects: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  signatureHash: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;
