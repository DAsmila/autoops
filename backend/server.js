const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const client = require('prom-client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Prometheus Metrics Setup ───────────────────────────────────────────────
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  registers: [register],
});

const activeUsers = new client.Gauge({
  name: 'active_users_total',
  help: 'Total active users in the system',
  registers: [register],
});

const deploymentsTotal = new client.Counter({
  name: 'deployments_total',
  help: 'Total number of deployments',
  labelNames: ['status', 'environment'],
  registers: [register],
});

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Metrics middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
    end();
  });
  next();
});

// ─── MongoDB Connection ──────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/autoops';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/deployments', require('./routes/deployments'));
app.use('/api/pipelines', require('./routes/pipelines'));
app.use('/api/containers', require('./routes/containers'));
app.use('/api/infrastructure', require('./routes/infrastructure'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/team', require('./routes/team'));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '1.0.0',
    service: 'autoops-backend',
  };
  res.status(200).json(healthCheck);
});

// ─── Prometheus Metrics Endpoint ─────────────────────────────────────────────
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const Deployment = require('./models/Deployment');
    const Pipeline = require('./models/Pipeline');
    const User = require('./models/User');

    const totalDeployments = await Deployment.countDocuments();
    const successfulDeployments = await Deployment.countDocuments({ status: 'success' });
    const failedDeployments = await Deployment.countDocuments({ status: 'failed' });
    const totalPipelines = await Pipeline.countDocuments();
    const activeUsers_count = await User.countDocuments({ isActive: true });

    activeUsers.set(activeUsers_count);

    res.json({
      deployments: { total: totalDeployments, success: successfulDeployments, failed: failedDeployments },
      pipelines: { total: totalPipelines },
      users: { active: activeUsers_count },
      uptime: Math.floor(process.uptime()),
      successRate: totalDeployments > 0 ? ((successfulDeployments / totalDeployments) * 100).toFixed(1) : 100,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Self-Healing Simulation Endpoint ───────────────────────────────────────
app.post('/api/self-heal', async (req, res) => {
  const { service } = req.body;
  console.log(`🔄 Self-healing triggered for service: ${service}`);
  
  // Simulate restart delay
  setTimeout(() => {
    deploymentsTotal.inc({ status: 'self_healed', environment: 'production' });
    console.log(`✅ Service ${service} self-healed successfully`);
  }, 2000);

  res.json({
    message: `Self-healing initiated for ${service}`,
    status: 'restarting',
    estimatedRecovery: '2-5 seconds',
    timestamp: new Date().toISOString(),
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 AutoOps Backend running on port ${PORT}`);
  console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
  console.log(`❤️  Health check at http://localhost:${PORT}/health`);
});
