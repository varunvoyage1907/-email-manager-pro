// Gmail API Configuration
// Replace these with your actual credentials from Google Cloud Console

const GMAIL_CONFIG = {
    // Your OAuth 2.0 Client ID from Google Cloud Console
    CLIENT_ID: process.env.GMAIL_CLIENT_ID || '929642664413-1e3gfdp6vbp65f61e4g7m0umb0rb4ue.apps.googleusercontent.com',
    
    // API Key (optional, for public data access)
    API_KEY: process.env.GMAIL_API_KEY || null,
    
    // Discovery docs for Gmail API
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
    
    // Authorization scopes for Gmail access
    SCOPES: [
        'https://www.googleapis.com/auth/gmail.readonly',    // Read emails
        'https://www.googleapis.com/auth/gmail.send',       // Send emails
        'https://www.googleapis.com/auth/gmail.modify'      // Modify emails (mark as read, etc.)
    ]
};

// Environment check
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';

// Export configuration
window.GMAIL_CONFIG = GMAIL_CONFIG; 