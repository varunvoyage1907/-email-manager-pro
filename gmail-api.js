// Gmail API Handler
class GmailAPI {
    constructor() {
        this.maxResults = 50; // Number of emails to fetch
        this.labels = {
            inbox: 'INBOX',
            unread: 'UNREAD',
            sent: 'SENT',
            spam: 'SPAM',
            trash: 'TRASH'
        };
    }

    // Fetch emails from Gmail
    async fetchEmails(query = '', maxResults = this.maxResults) {
        try {
            if (!window.gmailAuth || !window.gmailAuth.isUserSignedIn()) {
                throw new Error('User not signed in to Gmail');
            }

            const response = await gapi.client.gmail.users.messages.list({
                userId: 'me',
                q: query || 'in:inbox',
                maxResults: maxResults
            });

            const messages = response.result.messages || [];
            const emails = [];

            // Fetch detailed information for each message
            for (const message of messages) {
                try {
                    const emailDetail = await this.getEmailDetail(message.id);
                    if (emailDetail) {
                        emails.push(emailDetail);
                    }
                } catch (error) {
                    console.error(`Failed to fetch email ${message.id}:`, error);
                }
            }

            return emails;
        } catch (error) {
            console.error('Failed to fetch emails:', error);
            throw error;
        }
    }

    // Get detailed information for a specific email
    async getEmailDetail(messageId) {
        try {
            const response = await gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: messageId,
                format: 'full'
            });

            const message = response.result;
            return this.parseGmailMessage(message);
        } catch (error) {
            console.error(`Failed to get email detail for ${messageId}:`, error);
            return null;
        }
    }

    // Parse Gmail message format into our email format
    parseGmailMessage(message) {
        const headers = message.payload.headers;
        const getHeader = (name) => {
            const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
            return header ? header.value : '';
        };

        // Extract email content
        const body = this.extractEmailBody(message.payload);
        
        // Parse sender information
        const fromHeader = getHeader('From');
        const senderInfo = this.parseSenderInfo(fromHeader);
        
        // Determine email category based on content
        const category = this.categorizeEmail(getHeader('Subject'), body);
        
        // Check if email is unread
        const isUnread = message.labelIds && message.labelIds.includes('UNREAD');
        
        // Extract thread information
        const threadId = message.threadId;

        return {
            id: message.id,
            gmailId: message.id,
            threadId: threadId,
            customerId: this.getOrCreateCustomerId(senderInfo.email),
            subject: getHeader('Subject'),
            content: body,
            timestamp: new Date(parseInt(message.internalDate)),
            status: isUnread ? 'unread' : 'read',
            category: category,
            priority: this.determinePriority(getHeader('Subject'), body),
            tags: isUnread ? ['pending'] : [],
            thread: [],
            senderInfo: senderInfo,
            labels: message.labelIds || []
        };
    }

    // Extract email body from Gmail payload
    extractEmailBody(payload) {
        let body = '';
        
        if (payload.body && payload.body.data) {
            // Single part message
            body = this.decodeBase64(payload.body.data);
        } else if (payload.parts) {
            // Multi-part message
            for (const part of payload.parts) {
                if (part.mimeType === 'text/plain' && part.body && part.body.data) {
                    body += this.decodeBase64(part.body.data);
                } else if (part.mimeType === 'text/html' && part.body && part.body.data && !body) {
                    // Use HTML if no plain text found
                    body = this.decodeBase64(part.body.data);
                    body = this.stripHtmlTags(body);
                }
            }
        }
        
        return body || 'No content available';
    }

    // Decode base64 content
    decodeBase64(data) {
        try {
            // Gmail uses URL-safe base64
            const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
            return decodeURIComponent(escape(atob(base64)));
        } catch (error) {
            console.error('Failed to decode base64:', error);
            return '';
        }
    }

    // Strip HTML tags for plain text
    stripHtmlTags(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    // Parse sender information from From header
    parseSenderInfo(fromHeader) {
        const emailRegex = /<(.+)>/;
        const nameRegex = /^(.+?)\s*</;
        
        let email = fromHeader;
        let name = fromHeader;
        
        const emailMatch = fromHeader.match(emailRegex);
        if (emailMatch) {
            email = emailMatch[1];
            const nameMatch = fromHeader.match(nameRegex);
            if (nameMatch) {
                name = nameMatch[1].replace(/"/g, '');
            } else {
                name = email.split('@')[0];
            }
        } else {
            name = email.split('@')[0];
        }
        
        return { name, email };
    }

    // Categorize email based on content
    categorizeEmail(subject, content) {
        const text = (subject + ' ' + content).toLowerCase();
        
        if (text.includes('bill') || text.includes('payment') || text.includes('charge') || 
            text.includes('refund') || text.includes('invoice')) {
            return 'billing';
        }
        
        if (text.includes('ship') || text.includes('delivery') || text.includes('track') || 
            text.includes('address') || text.includes('order')) {
            return 'shipping';
        }
        
        if (text.includes('return') || text.includes('refund') || text.includes('exchange') || 
            text.includes('defective') || text.includes('broken')) {
            return 'returns';
        }
        
        if (text.includes('login') || text.includes('password') || text.includes('account') || 
            text.includes('technical') || text.includes('bug') || text.includes('error') || 
            text.includes('app') || text.includes('website')) {
            return 'technical';
        }
        
        return 'general';
    }

    // Determine email priority
    determinePriority(subject, content) {
        const text = (subject + ' ' + content).toLowerCase();
        
        if (text.includes('urgent') || text.includes('asap') || text.includes('emergency') || 
            text.includes('immediately') || text.includes('broken') || text.includes('not working')) {
            return 'high';
        }
        
        if (text.includes('question') || text.includes('help') || text.includes('issue') || 
            text.includes('problem')) {
            return 'medium';
        }
        
        return 'low';
    }

    // Get or create customer ID for email tracking
    getOrCreateCustomerId(email) {
        // In a real implementation, this would check against a customer database
        // For now, we'll use a simple hash-based approach
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            const char = email.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    // Send a reply to an email
    async sendReply(originalEmail, replyContent, isAI = false) {
        try {
            if (!window.gmailAuth || !window.gmailAuth.isUserSignedIn()) {
                throw new Error('User not signed in to Gmail');
            }

            const userEmail = window.gmailAuth.getUserEmail();
            const to = originalEmail.senderInfo.email;
            const subject = originalEmail.subject.startsWith('Re: ') ? 
                           originalEmail.subject : 
                           `Re: ${originalEmail.subject}`;

            // Create email message
            const messageParts = [
                `To: ${to}`,
                `Subject: ${subject}`,
                `In-Reply-To: <${originalEmail.gmailId}>`,
                `References: <${originalEmail.gmailId}>`,
                '',
                replyContent
            ];

            const message = messageParts.join('\n');
            const encodedMessage = btoa(unescape(encodeURIComponent(message)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            // Send the email
            const response = await gapi.client.gmail.users.messages.send({
                userId: 'me',
                resource: {
                    raw: encodedMessage,
                    threadId: originalEmail.threadId
                }
            });

            // Mark original email as read
            await this.markAsRead(originalEmail.gmailId);

            return response.result;
        } catch (error) {
            console.error('Failed to send reply:', error);
            throw error;
        }
    }

    // Mark email as read
    async markAsRead(messageId) {
        try {
            await gapi.client.gmail.users.messages.modify({
                userId: 'me',
                id: messageId,
                resource: {
                    removeLabelIds: ['UNREAD']
                }
            });
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    }

    // Mark email as unread
    async markAsUnread(messageId) {
        try {
            await gapi.client.gmail.users.messages.modify({
                userId: 'me',
                id: messageId,
                resource: {
                    addLabelIds: ['UNREAD']
                }
            });
        } catch (error) {
            console.error('Failed to mark as unread:', error);
        }
    }

    // Archive an email
    async archiveEmail(messageId) {
        try {
            await gapi.client.gmail.users.messages.modify({
                userId: 'me',
                id: messageId,
                resource: {
                    removeLabelIds: ['INBOX']
                }
            });
        } catch (error) {
            console.error('Failed to archive email:', error);
        }
    }

    // Get email thread information
    async getThread(threadId) {
        try {
            const response = await gapi.client.gmail.users.threads.get({
                userId: 'me',
                id: threadId
            });

            const thread = response.result;
            const messages = thread.messages || [];

            // Parse all messages in the thread
            const threadMessages = messages.map(message => this.parseGmailMessage(message));
            
            return {
                threadId: threadId,
                messages: threadMessages,
                messageCount: messages.length
            };
        } catch (error) {
            console.error('Failed to get thread:', error);
            return null;
        }
    }

    // Search emails with specific query
    async searchEmails(query, maxResults = 20) {
        try {
            // Build Gmail search query
            let gmailQuery = '';
            
            if (query.includes('@')) {
                gmailQuery = `from:${query}`;
            } else {
                gmailQuery = `subject:${query} OR ${query}`;
            }

            return await this.fetchEmails(gmailQuery, maxResults);
        } catch (error) {
            console.error('Failed to search emails:', error);
            return [];
        }
    }

    // Get emails by category (using labels)
    async getEmailsByCategory(category, maxResults = 20) {
        try {
            let query = 'in:inbox';
            
            // Add category-specific search terms
            switch (category) {
                case 'billing':
                    query += ' (billing OR payment OR invoice OR charge OR refund)';
                    break;
                case 'shipping':
                    query += ' (shipping OR delivery OR tracking OR order)';
                    break;
                case 'technical':
                    query += ' (technical OR support OR login OR password OR bug)';
                    break;
                case 'returns':
                    query += ' (return OR exchange OR defective OR broken)';
                    break;
                case 'general':
                    query += ' -(billing OR payment OR shipping OR delivery OR return OR technical OR support)';
                    break;
            }

            return await this.fetchEmails(query, maxResults);
        } catch (error) {
            console.error('Failed to get emails by category:', error);
            return [];
        }
    }

    // Get user's Gmail profile
    async getUserProfile() {
        try {
            const response = await gapi.client.gmail.users.getProfile({
                userId: 'me'
            });

            return response.result;
        } catch (error) {
            console.error('Failed to get user profile:', error);
            return null;
        }
    }

    // Check Gmail API quota
    async checkQuota() {
        try {
            // This is a simple check - in production you'd want more sophisticated quota monitoring
            const response = await gapi.client.gmail.users.getProfile({
                userId: 'me'
            });
            
            return response.result ? 'ok' : 'error';
        } catch (error) {
            if (error.status === 429) {
                return 'quota_exceeded';
            }
            return 'error';
        }
    }
}

// Initialize Gmail API when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.gmailAPI = new GmailAPI();
}); 