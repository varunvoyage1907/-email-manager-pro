# Gmail Integration Setup Guide

## 🚀 Quick Setup (5 minutes)

Follow these steps to connect your Gmail account to Email Manager Pro:

### Step 1: Google Cloud Console Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** (or select existing):
   - Click "Select a project" → "New Project"
   - Name: "Email Manager Pro"
   - Click "Create"

3. **Enable Gmail API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click on "Gmail API" → "Enable"

### Step 2: Create OAuth Credentials

1. **Go to "APIs & Services" → "Credentials"**
2. **Click "Create Credentials" → "OAuth client ID"**
3. **Configure OAuth consent screen** (if prompted):
   - User Type: "External" 
   - App name: "Email Manager Pro"
   - User support email: your email
   - Developer contact: your email
   - Save and continue through all steps

4. **Create OAuth Client ID**:
   - Application type: "Web application"
   - Name: "Email Manager Pro Client"
   - Authorized JavaScript origins:
     - `http://localhost:8000` (for local development)
     - Add your domain if deploying online
   - Click "Create"

5. **Copy your Client ID** (looks like: `1234567890-abcdef.googleusercontent.com`)

### Step 3: Update Configuration

1. **Open `config.js` in your project**
2. **Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID**:
   ```javascript
   CLIENT_ID: '1234567890-abcdef.googleusercontent.com',
   ```
3. **Save the file**

### Step 4: Test the Connection

1. **Open your Email Manager Pro**: `http://localhost:8000`
2. **Click "Connect Gmail"** in the top-right corner
3. **Sign in to Google** when prompted
4. **Grant permissions** to access Gmail
5. **Success!** You should see your Gmail emails loading

## 🔧 Configuration Details

### Required Scopes
Your app requests these Gmail permissions:
- `https://www.googleapis.com/auth/gmail.readonly` - Read emails
- `https://www.googleapis.com/auth/gmail.send` - Send replies  
- `https://www.googleapis.com/auth/gmail.modify` - Mark as read/unread

### Security Notes
- ✅ **Client ID is safe to expose** in frontend code
- ❌ **Never include Client Secret** in frontend code
- 🔒 **OAuth flow is secure** - Google handles authentication
- 🏠 **Data stays local** - emails processed in your browser

## 🎯 Features Available After Connection

### ✅ What Works:
- **Real Gmail inbox** - Your actual emails
- **Send AI replies** - Actually sends emails via Gmail
- **Mark as read/unread** - Syncs with Gmail
- **Email threads** - Full conversation history
- **Search your emails** - Real Gmail search
- **Automatic categorization** - Based on email content

### 📝 What's Simulated:
- **Customer history** - Generated from email patterns
- **AI confidence scores** - Calculated based on content analysis
- **Priority levels** - Determined by content keywords

## 🚨 Troubleshooting

### Common Issues:

**"Failed to initialize Gmail connection"**
- ✅ Check your Client ID is correct
- ✅ Ensure Gmail API is enabled
- ✅ Try refreshing the page

**"Gmail sign-in failed"**
- ✅ Check authorized JavaScript origins include your domain
- ✅ Clear browser cache and cookies
- ✅ Try incognito/private browsing mode

**"Not receiving emails"**  
- ✅ Check you're signed into the correct Gmail account
- ✅ Click the refresh button to fetch latest emails
- ✅ Verify Gmail account has emails in inbox

**"Can't send replies"**
- ✅ Ensure send scope is included in config
- ✅ Check internet connection
- ✅ Verify you're still signed in

## 🔄 Switching Between Modes

### Sample Data Mode
- Click "Sign Out" to return to demo mode
- Useful for testing features without real emails
- Safe environment to explore AI capabilities

### Gmail Mode  
- Click "Connect Gmail" to use real emails
- All AI replies are actually sent
- Changes sync with your Gmail account

## 📊 Usage Limits

### Gmail API Quotas:
- **Free tier**: 1 billion quota units/day
- **Typical usage**: ~5 units per email read, ~100 units per sent email
- **Your app**: Can handle thousands of emails daily

### Rate Limits:
- **250 quota units/user/second**
- **Automatic throttling** built into the app
- **Retry logic** for temporary failures

## 🎨 Customization

### Modify AI Templates
Edit `gmail-api.js` → `categorizeEmail()` function:
```javascript
// Add your custom categories
if (text.includes('your-keyword')) {
    return 'your-category';
}
```

### Add Custom Categories
1. Update sidebar in `index.html`
2. Add CSS colors in `styles.css`  
3. Update AI templates in `script.js`

### Brand Your Responses
Modify AI reply templates in `script.js` → `getAIReplyForEmail()`:
```javascript
// Customize the greeting and signature
content: `Dear ${customer.name},\n\n[Your branded response]\n\nBest regards,\nYour Company Name`
```

## 🔐 Privacy & Security

### What Google Sees:
- ✅ **App name**: "Email Manager Pro"
- ✅ **Permissions requested**: Gmail read/send/modify
- ✅ **Your consent**: Explicitly granted by you

### What Google Doesn't See:
- ❌ **AI-generated content** - Processed locally
- ❌ **Customer analysis** - Done in your browser
- ❌ **Business logic** - Runs client-side only

### Your Data:
- 🏠 **Stays in your browser** - No external servers
- 🔄 **Direct to Gmail** - No intermediary storage
- 🗑️ **No tracking** - No analytics or data collection

---

## 📞 Need Help?

If you encounter any issues:

1. **Check the browser console** (F12) for error messages
2. **Verify your configuration** matches the steps above
3. **Test with a simple Gmail account** first
4. **Ensure stable internet connection**

Your Gmail integration will be ready in minutes! 🎉 