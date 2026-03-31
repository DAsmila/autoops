const express = require('express');
const router = express.Router();

// Simulated container data
const getContainers = () => [
  { id: 'abc123def456', name: 'autoops-frontend', image: 'autoops/frontend:latest', status: 'running', cpu: (Math.random() * 15 + 2).toFixed(1), memory: (Math.random() * 200 + 100).toFixed(0), port: '3000:3000', uptime: '2d 14h', restarts: 0, health: 'healthy' },
  { id: 'def456ghi789', name: 'autoops-backend', image: 'autoops/backend:latest', status: 'running', cpu: (Math.random() * 20 + 5).toFixed(1), memory: (Math.random() * 300 + 150).toFixed(0), port: '5000:5000', uptime: '2d 14h', restarts: 1, health: 'healthy' },
  { id: 'ghi789jkl012', name: 'autoops-mongo', image: 'mongo:6', status: 'running', cpu: (Math.random() * 10 + 1).toFixed(1), memory: (Math.random() * 400 + 200).toFixed(0), port: '27017:27017', uptime: '2d 14h', restarts: 0, health: 'healthy' },
  { id: 'jkl012mno345', name: 'autoops-prometheus', image: 'prom/prometheus:latest', status: 'running', cpu: (Math.random() * 5 + 1).toFixed(1), memory: (Math.random() * 150 + 80).toFixed(0), port: '9090:9090', uptime: '2d 14h', restarts: 0, health: 'healthy' },
  { id: 'mno345pqr678', name: 'autoops-grafana', image: 'grafana/grafana:latest', status: 'running', cpu: (Math.random() * 8 + 2).toFixed(1), memory: (Math.random() * 180 + 90).toFixed(0), port: '3001:3000', uptime: '2d 14h', restarts: 0, health: 'healthy' },
  { id: 'pqr678stu901', name: 'autoops-cadvisor', image: 'gcr.io/cadvisor/cadvisor', status: 'running', cpu: (Math.random() * 6 + 1).toFixed(1), memory: (Math.random() * 100 + 50).toFixed(0), port: '8080:8080', uptime: '2d 14h', restarts: 0, health: 'healthy' },
];

router.get('/', (req, res) => {
  res.json(getContainers());
});

router.post('/:name/restart', (req, res) => {
  const { name } = req.params;
  console.log(`🔄 Restarting container: ${name}`);
  res.json({ message: `Container ${name} is restarting...`, status: 'restarting', timestamp: new Date().toISOString() });
});

router.post('/:name/stop', (req, res) => {
  const { name } = req.params;
  res.json({ message: `Container ${name} stopped`, status: 'stopped', timestamp: new Date().toISOString() });
});

router.get('/:name/logs', (req, res) => {
  const { name } = req.params;
  const logs = [
    `[${new Date().toISOString()}] INFO: Container ${name} started`,
    `[${new Date().toISOString()}] INFO: Health check passed`,
    `[${new Date().toISOString()}] INFO: Accepting connections on port`,
    `[${new Date().toISOString()}] DEBUG: Request processed successfully`,
    `[${new Date().toISOString()}] INFO: Memory usage within normal range`,
  ];
  res.json({ container: name, logs });
});

module.exports = router;
