const express = require('express');
const Deployment = require('../models/Deployment');
const router = express.Router();

// Get all deployments
router.get('/', async (req, res) => {
  try {
    const deployments = await Deployment.find().sort({ createdAt: -1 }).limit(50);
    res.json(deployments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create deployment
router.post('/', async (req, res) => {
  try {
    const deployment = await Deployment.create({
      ...req.body,
      logs: [{ timestamp: new Date(), message: 'Deployment initiated', level: 'info' }],
    });

    // Simulate deployment lifecycle
    setTimeout(async () => {
      deployment.status = 'running';
      deployment.logs.push({ timestamp: new Date(), message: 'Building Docker image...', level: 'info' });
      await deployment.save();
    }, 1000);

    setTimeout(async () => {
      const success = Math.random() > 0.2;
      deployment.status = success ? 'success' : 'failed';
      deployment.completedAt = new Date();
      deployment.duration = Math.floor(Math.random() * 120) + 30;
      deployment.logs.push({
        timestamp: new Date(),
        message: success ? '✅ Deployment successful!' : '❌ Deployment failed',
        level: success ? 'info' : 'error',
      });
      await deployment.save();
    }, 5000);

    res.status(201).json(deployment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get deployment by ID
router.get('/:id', async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id);
    if (!deployment) return res.status(404).json({ error: 'Not found' });
    res.json(deployment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rollback deployment
router.post('/:id/rollback', async (req, res) => {
  try {
    const deployment = await Deployment.findByIdAndUpdate(
      req.params.id,
      { status: 'rolled_back' },
      { new: true }
    );
    res.json({ message: 'Rollback initiated', deployment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
