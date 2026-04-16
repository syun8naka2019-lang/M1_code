const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware configuration
app.use(helmet({
    // Content Security Policy
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.example.com"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: [],
        },
    },
    
    // Additional security headers
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    
    // HSTS (HTTP Strict Transport Security)
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));

// Body parser with security considerations
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom security middleware
app.use((req, res, next) => {
    // Remove server information
    res.removeHeader('X-Powered-By');
    
    // Rate limiting headers (basic implementation)
    res.setHeader('X-RateLimit-Limit', '100');
    res.setHeader('X-RateLimit-Remaining', '99');
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    next();
});

// Secure API routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/data', (req, res) => {
    // Validate request parameters
    const { id } = req.query;
    
    if (!id || !/^[a-zA-Z0-9-_]+$/.test(id)) {
        return res.status(400).json({ error: 'Invalid ID parameter' });
    }
    
    // Sanitize and return data
    const data = {
        id: id,
        message: 'Secure API response',
        timestamp: new Date().toISOString()
    };
    
    res.json(data);
});

app.post('/api/submit', (req, res) => {
    try {
        const { data } = req.body;
        
        // Input validation
        if (!data || typeof data !== 'string' || data.length > 1000) {
            return res.status(400).json({ error: 'Invalid data' });
        }
        
        // Sanitize input
        const sanitizedData = data.replace(/[<>]/g, '');
        
        // Process data (in a real app, this would save to database)
        console.log('Processed data:', sanitizedData);
        
        res.json({ 
            success: true, 
            message: 'Data processed successfully',
            processedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve static files with security headers
app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Don't expose stack traces in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.status(500).json({
        error: 'Internal server error',
        ...(isDevelopment && { details: err.message, stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Secure server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    
    if (process.env.NODE_ENV !== 'production') {
        console.log('Development mode - debug features enabled');
    }
});

module.exports = app;
