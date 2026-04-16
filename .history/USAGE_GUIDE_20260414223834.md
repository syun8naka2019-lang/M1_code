# JavaScript Security Configuration - Usage Guide

## 1. 5 Minutes Quick Start

### Step 1: Install Dependencies
```bash
# Open terminal in VSCode (Ctrl+`)
npm install
```

### Step 2: Set Up Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your actual values
# VSCode: Ctrl+, (comma) to open settings, search for "env"
```

### Step 3: Start Development
```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## 2. Environment Variables Setup

### Create Your .env File
```bash
# Copy the template
cp .env.example .env

# Edit .env with your actual values
```

### Example .env Configuration
```env
# API Configuration
API_KEY=your_actual_api_key_here
API_SECRET=your_actual_api_secret_here
API_ENDPOINT=https://api.example.com

# Development settings
NODE_ENV=development
PORT=3000
```

### How to Use in Code
```javascript
// At the top of your file
require('dotenv').config();

// Use environment variables
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

console.log('API Key loaded:', apiKey ? 'YES' : 'NO');
```

## 3. ESLint Security Rules

### Automatic Linting
VSCode will automatically check for security issues:

```javascript
// BAD: ESLint will show error
const userInput = req.body.userInput;
eval(userInput); // Security error!

// GOOD: Safe alternative
const userInput = req.body.userInput;
const parsed = JSON.parse(userInput); // Safe with validation
```

### Manual Lint Check
```bash
# Check all files
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Common Security Issues ESLint Catches
- Use of `eval()`
- Non-literal `require()` calls
- Unsafe regular expressions
- Object injection vulnerabilities

## 4. Content Security Policy (CSP)

### For Static HTML Files
Open `csp-example.html` in your browser - CSP is already configured:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

### For Express.js Applications
```javascript
// In your Express app
const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet()); // Adds security headers automatically
```

### Test CSP Settings
```bash
# Run the Express server
node express-csp-middleware.js

# Open browser to http://localhost:3000
# Check browser console for CSP violations
```

## 5. Webpack Build Security

### Development Mode
```bash
# Start with source maps and debug info
npm run dev
```

### Production Build
```bash
# Create optimized, secure build
npm run build

# Output in dist/ folder
# - Minified code
# - No debug statements
# - No source maps
```

### Build Security Features
- Removes `console.log` in production
- Minifies code to hide logic
- Disables source maps
- Optimizes bundle size

## 6. VSCode Integration

### Automatic Security Features
VSCode will automatically:
- Check for security issues as you type
- Fix issues on save
- Hide sensitive files from explorer

### Manual Security Check
```bash
# Check for security vulnerabilities
npm run security:audit

# Fix found vulnerabilities
npm run security:fix
```

### VSCode Settings
Copy `vscode-settings.json` to `.vscode/settings.json`:

```bash
# Create .vscode folder if it doesn't exist
mkdir .vscode

# Copy settings
cp vscode-settings.json .vscode/settings.json
```

## 7. Daily Usage Examples

### Secure API Call
```javascript
// secure-api.js
require('dotenv').config();

async function secureApiCall() {
    const response = await fetch(`${process.env.API_URL}/data`, {
        headers: {
            'Authorization': `Bearer ${process.env.API_KEY}`
        }
    });
    return response.json();
}

// Usage
secureApiCall().then(data => console.log(data));
```

### Input Validation
```javascript
// validation.js
function validateInput(input) {
    // Check if input exists and is string
    if (!input || typeof input !== 'string') {
        throw new Error('Invalid input');
    }
    
    // Check length
    if (input.length > 1000) {
        throw new Error('Input too long');
    }
    
    // Sanitize dangerous characters
    return input.replace(/[<>]/g, '');
}

// Usage
const userInput = validateInput(req.body.data);
document.getElementById('result').textContent = userInput;
```

### Environment-Based Configuration
```javascript
// config.js
const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
    apiUrl: process.env.API_URL,
    debug: isDevelopment,
    logLevel: isDevelopment ? 'debug' : 'error'
};

// Usage
if (config.debug) {
    console.log('Debug mode enabled');
}
```

## 8. Testing Your Security Setup

### Test 1: Environment Variables
```javascript
// test-env.js
require('dotenv').config();

console.log('Environment test:');
console.log('API_KEY exists:', !!process.env.API_KEY);
console.log('NODE_ENV:', process.env.NODE_ENV);
```

### Test 2: CSP Headers
```bash
# Start Express server
node express-csp-middleware.js

# Check headers
curl -I http://localhost:3000/api/health
```

### Test 3: ESLint Security
```javascript
// test-security.js
// This should trigger ESLint errors
const userInput = 'test';
eval(userInput); // Security violation!

// This should pass
const safeInput = JSON.parse(userInput); // Safe
```

## 9. Common Issues and Solutions

### Issue: "dotenv not found"
```bash
# Solution: Install dotenv
npm install dotenv
```

### Issue: ESLint not working in VSCode
```bash
# Solution: Install ESLint extension
# In VSCode: Ctrl+Shift+X, search "ESLint", install
```

### Issue: CSP blocking resources
```javascript
// Solution: Update CSP policy
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            scriptSrc: ["'self'", "https://trusted-cdn.com"]
        }
    }
}));
```

### Issue: Environment variables not loading
```javascript
// Solution: Check .env file location and format
// .env should be in project root
# No spaces around = sign
API_KEY=value  # Correct
API_KEY = value  # Incorrect
```

## 10. Next Steps

1. **Set up your environment variables**
2. **Run the security audit**: `npm run security:audit`
3. **Test the examples**: Open `csp-example.html`
4. **Configure your project**: Copy settings to your project

## Quick Commands Reference

```bash
# Setup
npm install                    # Install dependencies
cp .env.example .env          # Set up environment

# Development
npm run dev                   # Start dev server
npm run lint                  # Check security
npm run lint:fix             # Fix issues

# Production
npm run build                 # Build for production
npm run security:audit       # Check vulnerabilities
npm run security:fix         # Fix vulnerabilities

# Testing
npm test                      # Run tests
npm run test:coverage        # Test with coverage
```

## Need Help?

- Check `SECURITY_SETUP.md` for detailed configuration
- Look at the example files for implementation patterns
- Run `npm run security:audit` to check for issues
- Check VSCode output panel for ESLint warnings
