# JavaScript Security Configuration Guide

This guide provides comprehensive security configurations for JavaScript projects in VSCode.

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your actual values
# NEVER commit .env to version control
```

### 3. Development Commands
```bash
# Start development server
npm run dev

# Run security audit
npm run security:audit

# Fix security issues
npm run security:fix

# Lint code for security issues
npm run lint

# Build for production
npm run build
```

## Security Features Implemented

### 1. Environment Variable Management
- **`.env.example`**: Template for environment variables
- **`.gitignore`**: Prevents sensitive files from being committed
- **`dotenv`**: Secure environment variable loading

### 2. ESLint Security Rules
- **Security plugin**: Detects common security vulnerabilities
- **Import rules**: Prevents insecure module imports
- **Best practices**: Enforces secure coding standards

### 3. Content Security Policy (CSP)
- **HTML meta tags**: CSP headers for static files
- **Express middleware**: Server-side CSP implementation
- **Strict policies**: Prevents XSS and injection attacks

### 4. Build Security
- **Webpack production mode**: Optimizes and minifies code
- **Debug code removal**: Strips development-only code
- **Source maps**: Disabled in production

### 5. VSCode Configuration
- **Security settings**: Trusted workspace configuration
- **File exclusions**: Hides sensitive files from editor
- **Auto-linting**: Fixes security issues on save

## Security Best Practices

### Environment Variables
```javascript
// Load environment variables
require('dotenv').config();

// Use environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Never hardcode secrets
// BAD: const apiKey = "sk-1234567890abcdef";
// GOOD: const apiKey = process.env.API_KEY;
```

### Input Validation
```javascript
// Validate user input
function validateInput(input) {
    if (!input || typeof input !== 'string') {
        throw new Error('Invalid input');
    }
    
    if (input.length > 1000) {
        throw new Error('Input too long');
    }
    
    // Sanitize input
    return input.replace(/[<>]/g, '');
}

// Use textContent instead of innerHTML
// BAD: element.innerHTML = userInput;
// GOOD: element.textContent = userInput;
```

### Secure API Calls
```javascript
async function secureApiCall(endpoint, data) {
    const response = await fetch(`${process.env.API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('API call failed');
    }
    
    return response.json();
}
```

### CSP Configuration
```javascript
// Express.js CSP middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.example.com"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"]
        }
    }
}));
```

## Security Checklist

### Development
- [ ] Environment variables are properly configured
- [ ] `.env` is in `.gitignore`
- [ ] ESLint security rules are enabled
- [ ] No hardcoded secrets in code
- [ ] Input validation is implemented

### Production
- [ ] CSP headers are configured
- [ ] Debug code is removed
- [ ] Source maps are disabled
- [ ] Security headers are set
- [ ] Dependencies are audited

### Regular Maintenance
- [ ] Run `npm audit` regularly
- [ ] Update dependencies frequently
- [ ] Review security logs
- [ ] Monitor for vulnerabilities

## File Structure
```
project/
|
|-- .env.example              # Environment variables template
|-- .env                      # Actual environment variables (DO NOT COMMIT)
|-- .gitignore                # Git ignore rules
|-- .eslintrc.json           # ESLint security configuration
|-- package.json             # Dependencies and scripts
|-- webpack.config.js         # Build configuration
|-- express-csp-middleware.js # Express security middleware
|-- csp-example.html         # CSP implementation example
|-- vscode-settings.json     # VSCode security settings
|-- SECURITY_SETUP.md        # This guide
|
|-- src/                     # Source code
|-- dist/                    # Build output
|-- node_modules/            # Dependencies
```

## Common Security Issues to Avoid

### 1. Hardcoded Secrets
```javascript
// AVOID
const apiKey = "sk-1234567890abcdef";

// USE
const apiKey = process.env.API_KEY;
```

### 2. XSS Vulnerabilities
```javascript
// AVOID
element.innerHTML = userInput;

// USE
element.textContent = userInput;
```

### 3. Insecure Eval Usage
```javascript
// AVOID
eval(userInput);

// USE
JSON.parse(userInput); // with validation
```

### 4. Missing Input Validation
```javascript
// AVOID
app.post('/data', (req, res) => {
    const data = req.body.data; // No validation
});

// USE
app.post('/data', (req, res) => {
    const data = validateInput(req.body.data);
});
```

## Resources

- [OWASP JavaScript Security](https://owasp.org/www-project-cheat-sheets/cheatsheets/Javascript_Security_Cheat_Sheet.html)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [ESLint Security Rules](https://github.com/nodesecurity/eslint-plugin-security)
