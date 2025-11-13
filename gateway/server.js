const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/api/openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Service URLs
const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const WALLET_SERVICE = process.env.WALLET_SERVICE_URL || 'http://localhost:3002';
const TRANSACTION_SERVICE = process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3003';

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', gateway: 'running' });
});

// Proxy to User Service
app.use('/api/users', createProxyMiddleware({
  target: USER_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

// Proxy to Wallet Service
app.use('/api/wallets', createProxyMiddleware({
  target: WALLET_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/wallets': '' }
}));

// Proxy to Transaction Service
app.use('/api/transactions', createProxyMiddleware({
  target: TRANSACTION_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/transactions': '' }
}));

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`   User Service: ${USER_SERVICE}`);
  console.log(`   Wallet Service: ${WALLET_SERVICE}`);
  console.log(`   Transaction Service: ${TRANSACTION_SERVICE}`);
});

