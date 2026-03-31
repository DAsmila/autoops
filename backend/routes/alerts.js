// alerts.js
const express = require('express');
const router = express.Router();

const mockAlerts = [
  { id: 1, severity: 'critical', title: 'High CPU Usage', message: 'Backend CPU above 90% for 5 minutes', service: 'autoops-backend', timestamp: new Date(Date.now() - 300000).toISOString(), resolved: false },
  { id: 2, severity: 'warning', title: 'Memory Usage High', message: 'MongoDB memory at 80% capacity', service: 'autoops-mongo', timestamp: new Date(Date.now() - 600000).toISOString(), resolved: false },
  { id: 3, severity: 'info', title: 'Deployment Complete', message: 'Version 2.4.1 deployed to production successfully', service: 'autoops-frontend', timestamp: new Date(Date.now() - 900000).toISOString(), resolved: true },
  { id: 4, severity: 'warning', title: 'Slow Response Time', message: 'API response time > 500ms', service: 'autoops-backend', timestamp: new Date(Date.now() - 1200000).toISOString(), resolved: true },
  { id: 5, severity: 'critical', title: 'Container Restarted', message: 'Self-healing triggered: container restart #3', service: 'autoops-backend', timestamp: new Date(Date.now() - 1800000).toISOString(), resolved: true },
];

router.get('/', (req, res) => res.json(mockAlerts));

router.patch('/:id/resolve', (req, res) => {
  res.json({ message: `Alert ${req.params.id} resolved`, timestamp: new Date().toISOString() });
});

module.exports = router;
