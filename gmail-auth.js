// Gmail Authentication Handler
class GmailAuth {
    constructor() {
        this.isSignedIn = false;
        this.currentUser = null;
        this.authInstance = null;
        this.initializeAuth();
    }

    async initializeAuth() {
        try {
            // Load Google API client
            await this.loadGoogleAPI();
            
            // Initialize the API client
            await gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: GMAIL_CONFIG.CLIENT_ID,
                    scope: GMAIL_CONFIG.SCOPES.join(' ')
                }).then(() => {
                    this.authInstance = gapi.auth2.getAuthInstance();
                    this.isSignedIn = this.authInstance.isSignedIn.get();
                    
                    if (this.isSignedIn) {
                        this.currentUser = this.authInstance.currentUser.get();
                        this.updateUIForSignedInUser();
                    } else {
                        this.updateUIForSignedOutUser();
                    }
                    
                    // Listen for sign-in state changes
                    this.authInstance.isSignedIn.listen(this.updateSignInStatus.bind(this));
                });
            });

            // Load Gmail API
            await gapi.load('client', () => {
                const initConfig = {
                    clientId: GMAIL_CONFIG.CLIENT_ID,
                    discoveryDocs: GMAIL_CONFIG.DISCOVERY_DOCS,
                    scope: GMAIL_CONFIG.SCOPES.join(' ')
                };
                
                // Only add API key if it exists
                if (GMAIL_CONFIG.API_KEY) {
                    initConfig.apiKey = GMAIL_CONFIG.API_KEY;
                }
                
                gapi.client.init(initConfig);
            });

        } catch (error) {
            console.error('Failed to initialize Gmail authentication:', error);
            this.showAuthError('Failed to initialize Gmail connection. Please check your configuration.');
        }
    }

    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (typeof gapi !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async signIn() {
        try {
            if (!this.authInstance) {
                throw new Error('Auth not initialized');
            }

            await this.authInstance.signIn();
            this.isSignedIn = true;
            this.currentUser = this.authInstance.currentUser.get();
            this.updateUIForSignedInUser();
            
            // Trigger email refresh
            if (window.emailManager && window.emailManager.refreshGmailEmails) {
                await window.emailManager.refreshGmailEmails();
            }
            
        } catch (error) {
            console.error('Sign-in failed:', error);
            this.showAuthError('Gmail sign-in failed. Please try again.');
        }
    }

    async signOut() {
        try {
            if (this.authInstance) {
                await this.authInstance.signOut();
            }
            
            this.isSignedIn = false;
            this.currentUser = null;
            this.updateUIForSignedOutUser();
            
            // Clear emails and show sample data
            if (window.emailManager) {
                window.emailManager.switchToSampleData();
            }
            
        } catch (error) {
            console.error('Sign-out failed:', error);
        }
    }

    updateSignInStatus(isSignedIn) {
        this.isSignedIn = isSignedIn;
        
        if (isSignedIn) {
            this.currentUser = this.authInstance.currentUser.get();
            this.updateUIForSignedInUser();
        } else {
            this.currentUser = null;
            this.updateUIForSignedOutUser();
        }
    }

    updateUIForSignedInUser() {
        const profile = this.currentUser.getBasicProfile();
        const userEmail = profile.getEmail();
        const userName = profile.getName();
        const userImage = profile.getImageUrl();

        // Update header with user info
        this.updateHeaderForSignedIn(userName, userEmail, userImage);
        
        // Show Gmail connection status
        this.showGmailStatus('connected', `Connected to ${userEmail}`);
        
        // Enable Gmail features
        this.enableGmailFeatures();
    }

    updateUIForSignedOutUser() {
        // Update header for signed out state
        this.updateHeaderForSignedOut();
        
        // Show Gmail connection status
        this.showGmailStatus('disconnected', 'Not connected to Gmail');
        
        // Disable Gmail features
        this.disableGmailFeatures();
    }

    updateHeaderForSignedIn(name, email, imageUrl) {
        const headerRight = document.querySelector('.nav-right');
        
        // Remove existing Gmail auth button
        const existingBtn = document.getElementById('gmailAuthBtn');
        if (existingBtn) {
            existingBtn.remove();
        }

        // Add user profile and sign-out option
        const userProfile = document.createElement('div');
        userProfile.className = 'user-profile';
        userProfile.innerHTML = `
            <div class="user-info">
                <img src="${imageUrl}" alt="${name}" class="user-avatar">
                <div class="user-details">
                    <div class="user-name">${name}</div>
                    <div class="user-email">${email}</div>
                </div>
            </div>
            <button class="btn btn-secondary" id="signOutBtn">
                <i class="fas fa-sign-out-alt"></i>
                Sign Out
            </button>
        `;

        headerRight.insertBefore(userProfile, headerRight.firstChild);

        // Add sign-out event
        document.getElementById('signOutBtn').addEventListener('click', () => {
            this.signOut();
        });
    }

    updateHeaderForSignedOut() {
        const headerRight = document.querySelector('.nav-right');
        
        // Remove user profile if exists
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.remove();
        }

        // Add Gmail connect button
        const gmailBtn = document.createElement('button');
        gmailBtn.id = 'gmailAuthBtn';
        gmailBtn.className = 'btn btn-primary gmail-connect-btn';
        gmailBtn.innerHTML = `
            <i class="fab fa-google"></i>
            Connect Gmail
        `;
        
        gmailBtn.addEventListener('click', () => {
            this.signIn();
        });

        headerRight.insertBefore(gmailBtn, headerRight.firstChild);
    }

    showGmailStatus(status, message) {
        const statusElement = document.querySelector('.gmail-status') || 
                            this.createStatusElement();
        
        statusElement.className = `gmail-status ${status}`;
        statusElement.innerHTML = `
            <i class="fas fa-${status === 'connected' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
    }

    createStatusElement() {
        const statusElement = document.createElement('div');
        statusElement.className = 'gmail-status';
        
        const aiStatus = document.querySelector('.ai-status');
        aiStatus.parentNode.insertBefore(statusElement, aiStatus.nextSibling);
        
        return statusElement;
    }

    enableGmailFeatures() {
        // Enable real Gmail functionality
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.title = 'Refresh Gmail inbox';
        }
        
        // Update AI status to show Gmail integration
        const aiIndicator = document.querySelector('.ai-indicator');
        if (aiIndicator) {
            aiIndicator.classList.add('gmail-enabled');
        }
    }

    disableGmailFeatures() {
        // Disable Gmail-specific features
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.title = 'Refresh sample emails';
        }
        
        // Remove Gmail integration from AI status
        const aiIndicator = document.querySelector('.ai-indicator');
        if (aiIndicator) {
            aiIndicator.classList.remove('gmail-enabled');
        }
    }

    showAuthError(message) {
        if (window.emailManager && window.emailManager.showNotification) {
            window.emailManager.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    // Get current access token for API calls
    getAccessToken() {
        if (!this.isSignedIn || !this.currentUser) {
            return null;
        }
        
        return this.currentUser.getAuthResponse().access_token;
    }

    // Check if user is currently signed in
    isUserSignedIn() {
        return this.isSignedIn && this.currentUser !== null;
    }

    // Get user's email address
    getUserEmail() {
        if (!this.isSignedIn || !this.currentUser) {
            return null;
        }
        
        return this.currentUser.getBasicProfile().getEmail();
    }
}

// Initialize Gmail authentication when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.gmailAuth = new GmailAuth();
}); 