const mongoose = require('mongoose');

const stageSchema = new mongoose.Schema({
  name: String,
  status: { type: String, enum: ['pending', 'running', 'success', 'failed', 'skipped'], default: 'pending' },
  duration: Number,
  logs: String,
  startedAt: Date,
  completedAt: Date,
});

const pipelineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  repo: { type: String, default: '' },
  branch: { type: String, default: 'main' },
  status: { type: String, enum: ['idle', 'running', 'success', 'failed'], default: 'idle' },
  stages: [stageSchema],
  triggerType: { type: String, enum: ['push', 'manual', 'schedule', 'pr'], default: 'manual' },
  duration: { type: Number, default: 0 },
  runNumber: { type: Number, default: 1 },
  triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model('Pipeline', pipelineSchema);
