const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  version: { type: String, required: true },
  environment: { type: String, enum: ['development', 'staging', 'production'], default: 'development' },
  status: { type: String, enum: ['pending', 'running', 'success', 'failed', 'rolled_back'], default: 'pending' },
  branch: { type: String, default: 'main' },
  commitHash: { type: String, default: '' },
  commitMessage: { type: String, default: '' },
  author: { type: String, default: '' },
  duration: { type: Number, default: 0 },  // seconds
  logs: [{ timestamp: Date, message: String, level: String }],
  triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model('Deployment', deploymentSchema);
