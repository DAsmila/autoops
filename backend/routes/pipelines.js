const express = require('express');
const Pipeline = require('../models/Pipeline');
const router = express.Router();

// Get all pipelines
router.get('/', async (req, res) => {
  try {
    const pipelines = await Pipeline.find().sort({ createdAt: -1 }).limit(30);
    res.json(pipelines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger pipeline
router.post('/trigger', async (req, res) => {
  try {
    const stages = [
      { name: 'Checkout', status: 'pending' },
      { name: 'Install Dependencies', status: 'pending' },
      { name: 'Lint & Format', status: 'pending' },
      { name: 'Unit Tests', status: 'pending' },
      { name: 'Build Docker Image', status: 'pending' },
      { name: 'Push to Registry', status: 'pending' },
      { name: 'Deploy to Staging', status: 'pending' },
      { name: 'Integration Tests', status: 'pending' },
      { name: 'Deploy to Production', status: 'pending' },
    ];

    const pipeline = await Pipeline.create({
      name: req.body.name || 'AutoOps Pipeline',
      repo: req.body.repo || 'github.com/autoops/app',
      branch: req.body.branch || 'main',
      status: 'running',
      stages,
      triggerType: req.body.triggerType || 'manual',
      runNumber: Math.floor(Math.random() * 1000) + 1,
    });

    // Simulate stage execution
    stages.forEach((stage, i) => {
      setTimeout(async () => {
        const p = await Pipeline.findById(pipeline._id);
        if (!p) return;
        p.stages[i].status = 'running';
        p.stages[i].startedAt = new Date();
        await p.save();

        setTimeout(async () => {
          const p2 = await Pipeline.findById(pipeline._id);
          if (!p2) return;
          const failed = i === 3 && Math.random() < 0.1;
          p2.stages[i].status = failed ? 'failed' : 'success';
          p2.stages[i].completedAt = new Date();
          p2.stages[i].duration = Math.floor(Math.random() * 30) + 5;
          if (i === stages.length - 1) {
            p2.status = 'success';
            p2.completedAt = new Date();
            p2.duration = Math.floor(Math.random() * 180) + 60;
          }
          await p2.save();
        }, 2000);
      }, i * 3000);
    });

    res.status(201).json(pipeline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const p = await Pipeline.findById(req.params.id);
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
