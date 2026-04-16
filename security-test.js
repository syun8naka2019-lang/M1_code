// JavaScript Security Test - M1_code Version
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.removeHeader('X-Powered-By');
    next();
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <h1>JavaScript Security Test - M1_code</h1>
        <h2>Security Headers Test</h2>
        <p>Check browser developer tools (F12) for security headers</p>
        
        <h2>Input Validation Test</h2>
        <form action="/test-input" method="POST">
            <input type="text" name="userInput" placeholder="Enter some text">
            <button type="submit">Submit</button>
        </form>
        
        <h2>Environment Variables Test</h2>
        <p>NODE_ENV: ${process.env.NODE_ENV || 'not set'}</p>
        <p>API_KEY configured: ${process.env.API_KEY ? 'YES' : 'NO'}</p>
        <p>JWT_SECRET configured: ${process.env.JWT_SECRET ? 'YES' : 'NO'}</p>
        <p>Bcrypt rounds: ${process.env.BCRYPT_ROUNDS || 'not set'}</p>
        
        <h2>XSS Prevention Test</h2>
        <div id="output"></div>
    `);
});

app.post('/test-input', (req, res) => {
    const userInput = req.body.userInput;
    
    const vulnerableOutput = userInput;
    const safeOutput = userInput ? userInput.replace(/[<>]/g, '') : '';
    
    res.send(`
        <h1>Input Validation Results</h1>
        <h2>Unsafe (XSS Vulnerable):</h2>
        <div>${vulnerableOutput}</div>
        
        <h2>Safe (XSS Protected):</h2>
        <div>${safeOutput}</div>
        
        <h2>Validation Log:</h2>
        <ul>
            <li>Input received: ${userInput ? 'YES' : 'NO'}</li>
            <li>Input length: ${userInput ? userInput.length : 0}</li>
            <li>Contains dangerous chars: ${userInput && /[<>]/.test(userInput) ? 'YES' : 'NO'}</li>
            <li>Sanitized: ${safeOutput}</li>
        </ul>
        
        <a href="/">Back to test</a>
    `);
});

app.get('/security-check', (req, res) => {
    const securityChecks = {
        environmentVariables: {
            NODE_ENV: process.env.NODE_ENV || 'not set',
            PORT: process.env.PORT || 'not set',
            API_KEY_CONFIGURED: !!process.env.API_KEY,
            JWT_SECRET_CONFIGURED: !!process.env.JWT_SECRET,
            BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 'not set'
        },
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block'
        },
        recommendations: [
            'Set NODE_ENV=production in production',
            'Configure API_KEY in .env file',
            'Configure JWT_SECRET in .env file',
            'Use HTTPS in production',
            'Implement rate limiting',
            'Add input validation'
        ]
    };
    
    res.json(securityChecks);
});

app.listen(PORT, () => {
    console.log(`Security test server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in browser`);
    console.log(`Security check: http://localhost:${PORT}/security-check`);
});

module.exports = app;
