const mongoose = require('mongoose');

const aiMarkdownNoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trader',
    required: true
  },
  userRole: {
    type: String,
    default: 'Employee'
  },
  source: {
    type: String,
    default: 'employee-copilot'
  },
  prompt: {
    type: String,
    required: true
  },
  markdownContent: {
    type: String,
    required: true
  },
  modelUsed: String,
  metadata: Object
}, { timestamps: true });

module.exports = mongoose.model('AiMarkdownNote', aiMarkdownNoteSchema);