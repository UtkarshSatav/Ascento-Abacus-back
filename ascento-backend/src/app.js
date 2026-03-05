require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const { swaggerSpec, swaggerHtml } = require('./config/swagger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

app.get('/', (req, res) => {
  res.json({
    service: 'School ERP Backend API',
    version: '2.0.0',
    docs: '/docs',
    health: '/health'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(swaggerHtml());
});

app.get('/docs.json', (req, res) => {
  res.json(swaggerSpec());
});

app.use('/', routes);
app.use(errorHandler);

module.exports = app;
