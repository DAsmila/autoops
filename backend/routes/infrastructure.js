// infrastructure.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    provider: 'AWS',
    region: 'ap-south-1',
    resources: [
      { type: 'EC2 Instance', name: 'autoops-prod-server', status: 'running', spec: 't3.medium', cost: '$0.042/hr' },
      { type: 'RDS Database', name: 'autoops-db', status: 'available', spec: 'db.t3.micro', cost: '$0.018/hr' },
      { type: 'S3 Bucket', name: 'autoops-artifacts', status: 'active', size: '2.3 GB', cost: '$0.023/GB' },
      { type: 'Load Balancer', name: 'autoops-alb', status: 'active', requests: '1.2k/min', cost: '$0.008/hr' },
      { type: 'VPC', name: 'autoops-vpc', status: 'available', cidr: '10.0.0.0/16', cost: 'Free' },
      { type: 'ECS Cluster', name: 'autoops-cluster', status: 'active', tasks: 6, cost: '$0.0000/hr' },
    ],
    iacStatus: 'applied',
    lastApplied: new Date(Date.now() - 3600000).toISOString(),
    terraform: { version: '1.5.0', state: 'clean', resources: 24 },
  });
});

router.post('/apply', (req, res) => {
  res.json({ message: 'Terraform apply initiated', status: 'running', jobId: `tf-${Date.now()}` });
});

router.post('/plan', (req, res) => {
  res.json({
    message: 'Terraform plan generated',
    changes: { add: 2, change: 1, destroy: 0 },
    plan: 'Plan: 2 to add, 1 to change, 0 to destroy.',
  });
});

module.exports = router;
