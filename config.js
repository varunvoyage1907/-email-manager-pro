// Gmail API Configuration
// Replace these with your actual credentials from Google Cloud Console

const GMAIL_CONFIG = {
    // Your OAuth 2.0 Client ID from Google Cloud Console
    CLIENT_ID: '792263029043-5jf8fc8b2nni5jh871giq9109qgfc5t6.apps.googleusercontent.com',
    
    // API Key (optional, for public data access)
    API_KEY: null,
    
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