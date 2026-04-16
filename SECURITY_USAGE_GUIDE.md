# JavaScript Security - Specific Usage Guide

## 1.  daily Usage Examples

### Environment Variables in Real Projects
```javascript
// config.js - Configuration management
require('dotenv').config();

const config = {
  development: {
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    databaseUrl: process.env.DB_URL || 'mongodb://localhost:27017',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  },
  production: {
    apiUrl: process.env.API_URL,
    databaseUrl: process.env.DB_URL,
    jwtSecret: process.env.JWT_SECRET,
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
```

### Secure API Endpoints
```javascript
// api.js - Secure API implementation
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./config');

const app = express();

// Secure user registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    // Sanitize input
    const sanitizedUsername = username.replace(/[<>]/g, '');
    
    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);
    
    // Save to database (example)
    // await User.create({ username: sanitizedUsername, password: hashedPassword });
    
    res.json({ success: true, message: 'User registered successfully' });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Secure login with JWT
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    // Find user (example)
    // const user = await User.findOne({ username });
    // if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    // Verify password
    // const isValid = await bcrypt.compare(password, user.password);
    // if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: 'user-id', username: username },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
    
    res.json({ success: true, token });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Frontend Security
```javascript
// frontend.js - Secure frontend code
class SecureFormHandler {
  constructor() {
    this.form = document.getElementById('secureForm');
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }
  
  handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(this.form);
    const userInput = formData.get('userInput');
    
    // Validate input
    if (!this.validateInput(userInput)) {
      this.showError('Invalid input detected');
      return;
    }
    
    // Sanitize input
    const sanitizedInput = this.sanitizeInput(userInput);
    
    // Send to server
    this.sendToServer(sanitizedInput);
  }
  
  validateInput(input) {
    // Check for dangerous patterns
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*<\/script>)*/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(input));
  }
  
  sanitizeInput(input) {
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove JavaScript protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }
  
  showError(message) {
    // Use textContent instead of innerHTML to prevent XSS
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  async sendToServer(data) {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.getCSRFToken()
        },
        body: JSON.stringify({ data })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      this.showSuccess(result.message);
      
    } catch (error) {
      console.error('Error:', error);
      this.showError('An error occurred. Please try again.');
    }
  }
  
  getCSRFToken() {
    // Get CSRF token from meta tag or cookie
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  }
  
  showSuccess(message) {
    const successElement = document.getElementById('successMessage');
    successElement.textContent = message;
    successElement.style.display = 'block';
  }
}

// Initialize secure form handler
document.addEventListener('DOMContentLoaded', () => {
  new SecureFormHandler();
});
```

## 2. Database Security

### Secure Database Queries
```javascript
// database.js - Secure database operations
const mongoose = require('mongoose');

// Secure user schema with validation
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/, // Only alphanumeric and underscore
    unique: true
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

// Secure query methods
userSchema.statics.findByUsername = function(username) {
  // Use parameterized queries to prevent injection
  return this.findOne({ username: username }).select('-password');
};

userSchema.statics.secureSearch = function(searchTerm) {
  // Sanitize search term
  const sanitizedTerm = searchTerm.replace(/[<>]/g, '');
  
  // Use regex with proper escaping
  const escapedTerm = sanitizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  return this.find({
    $or: [
      { username: { $regex: escapedTerm, $options: 'i' } },
      { email: { $regex: escapedTerm, $options: 'i' } }
    ]
  }).select('-password');
};

const User = mongoose.model('User', userSchema);
module.exports = User;
```

## 3. File Upload Security

### Secure File Upload
```javascript
// upload.js - Secure file handling
const multer = require('multer');
const path = require('path');

// Configure secure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Secure upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return secure file info (no path disclosure)
    res.json({
      success: true,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

## 4. Session Security

### Secure Session Management
```javascript
// session.js - Secure session handling
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

// Configure secure sessions
const sessionConfig = {
  store: new RedisStore({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  }
};

app.use(session(sessionConfig));

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Secure logout
app.post('/api/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out successfully' });
  });
});
```

## 5. API Security Best Practices

### Rate Limiting
```javascript
// rateLimit.js - Rate limiting implementation
const rateLimit = require('express-rate-limit');

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true
});

app.use('/api/', generalLimiter);
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);
```

### CORS Configuration
```javascript
// cors.js - Secure CORS setup
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'https://yourdomain.com'
    ];
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

## 6. Error Handling Security

### Secure Error Handling
```javascript
// errorHandler.js - Secure error handling
const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  // Don't expose stack traces in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  const response = {
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  };
  
  // Add details only in development
  if (isDevelopment) {
    response.details = err.message;
    response.stack = err.stack;
  }
  
  res.status(500).json(response);
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not found',
    timestamp: new Date().toISOString()
  });
};

app.use(notFoundHandler);
app.use(errorHandler);
```

## 7. Testing Security

### Security Tests
```javascript
// security.test.js - Security testing
const request = require('supertest');
const app = require('../app');

describe('Security Tests', () => {
  test('Should prevent XSS in input', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    
    const response = await request(app)
      .post('/api/submit')
      .send({ data: xssPayload })
      .expect(200);
    
    // Check that script tags are removed
    expect(response.body.processedData).not.toContain('<script>');
    expect(response.body.processedData).toContain('alert("XSS")');
  });
  
  test('Should reject SQL injection attempts', async () => {
    const sqlInjection = "'; DROP TABLE users; --";
    
    const response = await request(app)
      .post('/api/search')
      .send({ query: sqlInjection })
      .expect(400);
    
    expect(response.body.error).toBeDefined();
  });
  
  test('Should enforce rate limiting', async () => {
    const promises = Array(10).fill().map(() =>
      request(app).post('/api/login').send({ username: 'test', password: 'test' })
    );
    
    const responses = await Promise.all(promises);
    
    // Some requests should be rate limited
    const rateLimitedResponses = responses.filter(res => res.status === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });
});
```

## 8. Production Deployment

### Production Security Checklist
```javascript
// production.js - Production security configuration
const helmet = require('helmet');
const compression = require('compression');

// Production security middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));
  
  app.use(compression());
  
  // Force HTTPS
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

## 9. Monitoring and Logging

### Security Monitoring
```javascript
// monitoring.js - Security monitoring
const winston = require('winston');

// Security logger
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'security.log' })
  ]
});

// Security event logging
const logSecurityEvent = (event, details) => {
  securityLogger.info({
    event,
    details,
    timestamp: new Date().toISOString()
  });
};

// Middleware to log suspicious activities
const securityMonitor = (req, res, next) => {
  // Log failed authentication attempts
  if (req.path === '/api/login' && res.statusCode === 401) {
    logSecurityEvent('AUTH_FAILURE', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      username: req.body.username
    });
  }
  
  // Log suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /union.*select/i
  ];
  
  const requestBody = JSON.stringify(req.body);
  if (suspiciousPatterns.some(pattern => pattern.test(requestBody))) {
    logSecurityEvent('SUSPICIOUS_INPUT', {
      ip: req.ip,
      path: req.path,
      body: req.body
    });
  }
  
  next();
};

app.use(securityMonitor);
```

This guide provides practical, real-world examples of JavaScript security implementation. Each section includes code that you can directly use in your projects.
