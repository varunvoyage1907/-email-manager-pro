# Gmail API Integration Guide

## Prerequisites
1. **Google Cloud Project** - [Create one here](https://console.cloud.google.com/)
2. **Gmail API enabled** - Enable in Google Cloud Console
3. **OAuth 2.0 credentials** - For accessing user's Gmail

## Step 1: Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Gmail API:
   - Go to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click "Enable"

## Step 2: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add authorized origins:
   - `http://localhost:8000` (for local development)
   - Your production domain (if deploying)
5. Download the credentials JSON file

## Step 3: Install Required Libraries

For a complete Gmail integration, you'll need:

```html
<!-- Add to index.html head section -->
<script src="https://apis.google.com/js/api.js"></script>
<script src="https://accounts.google.com/gsi/client"></script>
```

## Step 4: Implementation Files

The integration requires these additional files:
- `gmail-auth.js` - Authentication handling
- `gmail-api.js` - Email fetching and sending
- `config.js` - API configuration

## Security Notes

⚠️ **Important**: 
- Never expose your client secret in frontend code
- Use environment variables for sensitive data
- Consider using a backend proxy for production

## Quick Start vs Full Integration

**Option A: Quick Demo** (Current)
- Uses sample data
- Works immediately
- No API setup required

**Option B: Full Gmail Integration** (Advanced)
- Requires Google Cloud setup
- Real email access
- Production-ready 