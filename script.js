// Email Management System - Main JavaScript File

class EmailManager {
    constructor() {
        this.emails = [];
        this.customers = new Map();
        this.selectedEmail = null;
        this.filters = {
            active: 'all',
            category: null,
            search: ''
        };
        this.aiAutoReplyEnabled = true;
        this.gmailMode = false; // Track if using Gmail or sample data
        this.sampleEmails = []; // Store sample emails separately
        this.initialized = false;
        
        // Ensure initialization happens after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing Email Manager...');
        
        // Always start with sample data mode for reliable display
        this.gmailMode = false;
        
        try {
            this.generateSampleData();
            console.log('Sample data generated:', this.emails.length, 'emails');
            
            // Force a minimal delay to ensure DOM is ready
            setTimeout(() => {
                try {
                    this.bindEvents();
                    this.renderEmails();
                    this.updateFilterCounts();
                    
                    // Store sample emails separately for switching modes
                    this.sampleEmails = [...this.emails];
                    this.initialized = true;
                    console.log('Email Manager initialized successfully with', this.emails.length, 'sample emails');
                } catch (renderError) {
                    console.error('Error during rendering:', renderError);
                    this.fallbackInit();
                }
            }, 100);
            
        } catch (error) {
            console.error('Error initializing Email Manager:', error);
            // Fallback initialization
            setTimeout(() => this.fallbackInit(), 100);
        }
    }

    fallbackInit() {
        console.log('Using fallback initialization...');
        this.emails = [];
        this.generateMinimalSampleData();
        this.bindEvents();
        this.renderEmails();
        this.updateFilterCounts();
        this.initialized = true;
    }

    generateMinimalSampleData() {
        // Minimal sample data as fallback
        const customers = [
            { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', joinDate: '2023-01-15' },
            { id: 2, name: 'Mike Chen', email: 'mike.chen@example.com', joinDate: '2023-02-20' }
        ];

        customers.forEach(customer => {
            this.customers.set(customer.id, {
                ...customer,
                interactions: []
            });
        });

        this.emails = [
            {
                id: 1,
                customerId: 1,
                subject: 'Order Delayed - When will it arrive?',
                content: `Hi there,\n\nI placed an order (#12345) last week and it was supposed to arrive yesterday, but I haven't received it yet. Can you please check the status and let me know when I can expect delivery?\n\nThank you!`,
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                status: 'unread',
                category: 'shipping',
                priority: 'high',
                tags: ['pending'],
                thread: []
            },
            {
                id: 2,
                customerId: 2,
                subject: 'Billing Question - Duplicate Charge',
                content: `Hello,\n\nI noticed there are two charges on my credit card for the same order. Can you please help me understand why I was charged twice?\n\nThanks for your help.`,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
                status: 'ai-replied',
                category: 'billing',
                priority: 'medium',
                tags: ['ai-replied'],
                thread: []
            }
        ];
    }

    generateSampleData() {
        // Sample customer data
        const customers = [
            { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', joinDate: '2023-01-15' },
            { id: 2, name: 'Mike Chen', email: 'mike.chen@example.com', joinDate: '2023-02-20' },
            { id: 3, name: 'Emily Rodriguez', email: 'emily.r@example.com', joinDate: '2023-03-10' },
            { id: 4, name: 'David Kim', email: 'david.kim@example.com', joinDate: '2023-04-05' },
            { id: 5, name: 'Lisa Thompson', email: 'lisa.t@example.com', joinDate: '2023-05-12' },
            { id: 6, name: 'Alex Parker', email: 'alex.parker@example.com', joinDate: '2023-06-18' },
            { id: 7, name: 'Jessica Wu', email: 'jessica.wu@example.com', joinDate: '2023-07-22' },
            { id: 8, name: 'Robert Davis', email: 'robert.d@example.com', joinDate: '2023-08-14' }
        ];

        customers.forEach(customer => {
            this.customers.set(customer.id, {
                ...customer,
                interactions: this.generateCustomerHistory(customer.id)
            });
        });

        // Sample email data
        this.emails = [
            {
                id: 1,
                customerId: 1,
                subject: 'Order Delayed - When will it arrive?',
                content: `Hi there,\n\nI placed an order (#12345) last week and it was supposed to arrive yesterday, but I haven't received it yet. Can you please check the status and let me know when I can expect delivery?\n\nThank you!`,
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                status: 'unread',
                category: 'shipping',
                priority: 'high',
                tags: ['pending'],
                thread: []
            },
            {
                id: 2,
                customerId: 2,
                subject: 'Billing Question - Duplicate Charge',
                content: `Hello,\n\nI noticed there are two charges on my credit card for the same order. One for $49.99 and another for $49.99. Can you please help me understand why I was charged twice?\n\nOrder number: #67890\n\nThanks for your help.`,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                status: 'ai-replied',
                category: 'billing',
                priority: 'medium',
                tags: ['ai-replied'],
                thread: [{
                    type: 'ai-reply',
                    content: 'Thank you for reaching out about the duplicate charge. I understand your concern and I\'m here to help resolve this quickly. I\'ve reviewed your account and can see the duplicate charges for order #67890. This appears to be a processing error on our end. I\'ve initiated a refund for the duplicate charge of $49.99, which should appear in your account within 3-5 business days. You\'ll receive an email confirmation shortly with the refund details.',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
                    confidence: 92
                }]
            },
            {
                id: 3,
                customerId: 3,
                subject: 'Product Return Request',
                content: `Hi,\n\nI'd like to return the wireless headphones I purchased last month. They're not working properly - the left ear piece has stopped working completely.\n\nThe order number is #11223 and I still have the original packaging.\n\nWhat's the return process?`,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
                status: 'resolved',
                category: 'returns',
                priority: 'medium',
                tags: ['resolved'],
                thread: [{
                    type: 'ai-reply',
                    content: 'I\'m sorry to hear that your wireless headphones aren\'t working properly. I\'d be happy to help you with the return process. Since your order #11223 is within our 30-day return window and you have the original packaging, you\'re eligible for a full refund. I\'ve sent you a prepaid return shipping label to your email address. Once we receive the headphones, we\'ll process your refund within 3-5 business days.',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5),
                    confidence: 88
                }, {
                    type: 'customer-reply',
                    content: 'Perfect, thank you so much for the quick response and the prepaid label. I\'ll send them back today!',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
                }]
            },
            {
                id: 4,
                customerId: 4,
                subject: 'Technical Support - App Won\'t Load',
                content: `Hello Support Team,\n\nI'm having trouble with your mobile app. Every time I try to open it, it crashes immediately. I've tried restarting my phone and reinstalling the app, but the problem persists.\n\nI'm using an iPhone 14 with iOS 17.1.\n\nCan you help me fix this?`,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
                status: 'unread',
                category: 'technical',
                priority: 'high',
                tags: ['pending'],
                thread: []
            },
            {
                id: 5,
                customerId: 5,
                subject: 'Product Recommendation Request',
                content: `Hi,\n\nI'm looking for a laptop for my college student daughter. She'll be studying computer science, so it needs to handle programming and development work well.\n\nBudget is around $1200-1500. What would you recommend?\n\nThanks!`,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
                status: 'ai-replied',
                category: 'general',
                priority: 'low',
                tags: ['ai-replied'],
                thread: [{
                    type: 'ai-reply',
                    content: 'Great question! For computer science studies, I\'d recommend looking at our MacBook Air M2 (starting at $1,299) or the Dell XPS 13 Plus (starting at $1,199). Both offer excellent performance for programming, long battery life for all-day use, and are lightweight for carrying around campus. The MacBook Air is particularly popular among CS students for its Unix-based system, while the Dell offers more flexibility with Windows/Linux development environments. Would you like detailed specs for either option?',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7.5),
                    confidence: 85
                }]
            },
            {
                id: 6,
                customerId: 6,
                subject: 'Account Access Issue',
                content: `Hello,\n\nI can't log into my account. I keep getting an "invalid password" error even though I'm sure I'm using the correct password. I tried the password reset, but I'm not receiving the reset email.\n\nCan you help me regain access to my account?\n\nMy email is alex.parker@example.com`,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
                status: 'unread',
                category: 'technical',
                priority: 'medium',
                tags: ['pending'],
                thread: []
            },
            {
                id: 7,
                customerId: 7,
                subject: 'Praise for Excellent Service!',
                content: `Hi team,\n\nI just wanted to reach out and say thank you for the amazing customer service I received last week. The representative who helped me with my order issue was incredibly patient and helpful.\n\nKeep up the great work!\n\nBest regards,\nJessica`,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
                status: 'resolved',
                category: 'general',
                priority: 'low',
                tags: ['resolved'],
                thread: []
            },
            {
                id: 8,
                customerId: 8,
                subject: 'Shipping Address Change',
                content: `Hello,\n\nI need to change the shipping address for my recent order (#45678). I realized I accidentally used my old address.\n\nNew address:\n123 Oak Street\nAnytown, ST 12345\n\nThe order was placed this morning. Is it too late to make this change?\n\nThanks!`,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
                status: 'ai-replied',
                category: 'shipping',
                priority: 'medium',
                tags: ['ai-replied'],
                thread: [{
                    type: 'ai-reply',
                    content: 'Thank you for contacting us about updating your shipping address for order #45678. Good news! Since your order was placed this morning and hasn\'t entered our fulfillment process yet, I was able to update the shipping address to 123 Oak Street, Anytown, ST 12345. You\'ll receive an updated order confirmation email shortly with the new address. Your order should still arrive within the originally estimated timeframe.',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
                    confidence: 94
                }]
            }
        ];
    }

    generateCustomerHistory(customerId) {
        const interactions = [];
        const numInteractions = Math.floor(Math.random() * 5) + 2;
        
        for (let i = 0; i < numInteractions; i++) {
            const daysAgo = Math.floor(Math.random() * 90) + 1;
            const timestamp = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000));
            
            interactions.push({
                date: timestamp,
                type: ['general', 'billing', 'shipping', 'technical', 'returns'][Math.floor(Math.random() * 5)],
                subject: [
                    'Order status inquiry',
                    'Payment question', 
                    'Product information request',
                    'Technical support',
                    'Return processed'
                ][Math.floor(Math.random() * 5)],
                status: ['resolved', 'ai-replied'][Math.floor(Math.random() * 2)],
                summary: 'Customer inquiry resolved successfully with AI assistance.'
            });
        }
        
        return interactions.sort((a, b) => b.date - a.date);
    }

    bindEvents() {
        // Check if essential DOM elements exist
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) {
            console.log('Search input element not found, retrying bindEvents in 500ms...');
            setTimeout(() => this.bindEvents(), 500);
            return;
        }
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.renderEmails();
        });

        // Filter events
        document.querySelectorAll('.filter-item').forEach(item => {
            item.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-item').forEach(f => f.classList.remove('active'));
                item.classList.add('active');
                this.filters.active = item.dataset.filter;
                this.renderEmails();
            });
        });

        // Category events
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (this.filters.category === item.dataset.category) {
                    this.filters.category = null;
                    item.classList.remove('active');
                } else {
                    document.querySelectorAll('.category-item').forEach(c => c.classList.remove('active'));
                    item.classList.add('active');
                    this.filters.category = item.dataset.category;
                }
                this.renderEmails();
            });
        });

        // Control button events
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshEmails();
        });

        document.getElementById('selectAllBtn').addEventListener('click', () => {
            this.toggleSelectAll();
        });

        // AI toggle
        document.querySelector('.ai-indicator').addEventListener('click', () => {
            this.toggleAIAutoReply();
        });

        // Modal events
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            this.closeModal('aiReplyModal');
        });

        document.getElementById('closeHistoryModalBtn').addEventListener('click', () => {
            this.closeModal('customerHistoryModal');
        });

        // AI Reply Modal buttons
        document.getElementById('regenerateBtn').addEventListener('click', () => {
            this.regenerateAIReply();
        });

        document.getElementById('editReplyBtn').addEventListener('click', () => {
            this.enableReplyEditing();
        });

        document.getElementById('sendReplyBtn').addEventListener('click', () => {
            this.sendAIReply();
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    renderEmails() {
        const emailList = document.getElementById('emailList');
        if (!emailList) {
            console.log('Email list element not found, retrying in 500ms...');
            setTimeout(() => this.renderEmails(), 500);
            return;
        }
        
        const filteredEmails = this.getFilteredEmails();
        
        if (filteredEmails.length === 0) {
            emailList.innerHTML = `
                <div class="no-emails">
                    <i class="fas fa-inbox"></i>
                    <h3>No emails found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        emailList.innerHTML = filteredEmails.map(email => {
            const customer = this.customers.get(email.customerId);
            const timeAgo = this.getTimeAgo(email.timestamp);
            const isUnread = email.status === 'unread';
            
            return `
                <div class="email-item ${isUnread ? 'unread' : ''} ${this.selectedEmail?.id === email.id ? 'selected' : ''}" 
                     data-email-id="${email.id}">
                    <div class="email-header">
                        <div class="sender-info">
                            <div class="sender-name">${customer.name}</div>
                            <div class="sender-email">${customer.email}</div>
                        </div>
                        <div class="email-meta">
                            <div class="email-time">${timeAgo}</div>
                            <div class="email-priority priority-${email.priority}">
                                <i class="fas fa-circle"></i>
                            </div>
                        </div>
                    </div>
                    <div class="email-subject">${email.subject}</div>
                    <div class="email-preview-text">${this.truncateText(email.content, 100)}</div>
                    <div class="email-tags">
                        ${email.tags.map(tag => `<span class="email-tag ${tag}">${tag.replace('-', ' ')}</span>`).join('')}
                        <span class="email-tag category-${email.category}">${email.category}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Add click events to email items
        document.querySelectorAll('.email-item').forEach(item => {
            item.addEventListener('click', () => {
                const emailId = parseInt(item.dataset.emailId);
                this.selectEmail(emailId);
            });
        });
    }

    getFilteredEmails() {
        return this.emails.filter(email => {
            // Status filter
            if (this.filters.active !== 'all' && email.status !== this.filters.active) {
                return false;
            }

            // Category filter
            if (this.filters.category && email.category !== this.filters.category) {
                return false;
            }

            // Search filter
            if (this.filters.search) {
                const customer = this.customers.get(email.customerId);
                const searchText = `${customer.name} ${customer.email} ${email.subject} ${email.content}`.toLowerCase();
                if (!searchText.includes(this.filters.search)) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => b.timestamp - a.timestamp);
    }

    selectEmail(emailId) {
        this.selectedEmail = this.emails.find(email => email.id === emailId);
        if (!this.selectedEmail) return;

        // Mark as read
        if (this.selectedEmail.status === 'unread') {
            this.selectedEmail.status = 'read';
            this.updateFilterCounts();
        }

        this.renderEmails();
        this.renderEmailPreview();
    }

    renderEmailPreview() {
        if (!this.selectedEmail) return;

        const customer = this.customers.get(this.selectedEmail.customerId);
        const emailPreview = document.getElementById('emailPreview');

        emailPreview.innerHTML = `
            <div class="preview-header">
                <div class="preview-subject">${this.selectedEmail.subject}</div>
                <div class="preview-meta">
                    <div class="preview-sender">
                        <div class="sender-avatar">
                            ${customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="sender-details">
                            <h4>${customer.name}</h4>
                            <p>${customer.email}</p>
                            <p>${this.formatDateTime(this.selectedEmail.timestamp)}</p>
                        </div>
                    </div>
                    <div class="preview-actions">
                        <button class="action-btn" onclick="emailManager.showCustomerHistory(${customer.id})">
                            <i class="fas fa-history"></i>
                            History
                        </button>
                        <button class="action-btn ai" onclick="emailManager.generateAIReply()">
                            <i class="fas fa-robot"></i>
                            AI Reply
                        </button>
                        <button class="action-btn primary">
                            <i class="fas fa-reply"></i>
                            Reply
                        </button>
                    </div>
                </div>
            </div>
            <div class="preview-content">
                ${this.formatEmailContent(this.selectedEmail.content)}
                ${this.renderEmailThread()}
            </div>
        `;
    }

    renderEmailThread() {
        if (!this.selectedEmail.thread || this.selectedEmail.thread.length === 0) {
            return '';
        }

        return `
            <div class="email-thread">
                <h4>Thread History</h4>
                ${this.selectedEmail.thread.map(item => `
                    <div class="thread-item ${item.type}">
                        <div class="thread-header">
                            <span class="thread-type">
                                ${item.type === 'ai-reply' ? '<i class="fas fa-robot ai-icon"></i> AI Reply' : 
                                  item.type === 'customer-reply' ? '<i class="fas fa-user"></i> Customer Reply' : 'Reply'}
                            </span>
                            <span class="thread-time">${this.getTimeAgo(item.timestamp)}</span>
                            ${item.confidence ? `<span class="thread-confidence">${item.confidence}% confidence</span>` : ''}
                        </div>
                        <div class="thread-content">${this.formatEmailContent(item.content)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    formatEmailContent(content) {
        return content.split('\n').map(paragraph => 
            paragraph.trim() ? `<p>${paragraph}</p>` : ''
        ).join('');
    }

    updateFilterCounts() {
        const counts = {
            all: this.emails.length,
            unread: this.emails.filter(e => e.status === 'unread').length,
            'ai-replied': this.emails.filter(e => e.status === 'ai-replied').length,
            pending: this.emails.filter(e => e.tags.includes('pending')).length,
            resolved: this.emails.filter(e => e.status === 'resolved').length
        };

        Object.keys(counts).forEach(filter => {
            const element = document.querySelector(`[data-filter="${filter}"] .count`);
            if (element) {
                element.textContent = counts[filter];
            }
        });
    }

    generateAIReply() {
        if (!this.selectedEmail) return;

        const modal = document.getElementById('aiReplyModal');
        const textarea = document.getElementById('aiReplyText');
        const confidenceBar = document.getElementById('confidenceFill');
        const confidenceValue = document.getElementById('confidenceValue');

        // Simulate AI processing
        textarea.value = 'Generating AI response...';
        modal.classList.add('show');

        setTimeout(() => {
            const aiReply = this.getAIReplyForEmail(this.selectedEmail);
            textarea.value = aiReply.content;
            
            const confidence = aiReply.confidence;
            confidenceBar.style.width = `${confidence}%`;
            confidenceValue.textContent = `${confidence}%`;
        }, 1500);
    }

    getAIReplyForEmail(email) {
        const customer = this.customers.get(email.customerId);
        
        // AI reply templates based on category and content
        const templates = {
            shipping: {
                delayed: {
                    content: `Dear ${customer.name},\n\nThank you for reaching out about your order. I understand your concern about the delivery delay, and I sincerely apologize for any inconvenience.\n\nI've checked your order status and can see that there was an unexpected delay in our fulfillment center. Your order is now being prioritized and should ship within the next 24 hours. You'll receive a tracking number via email once it's dispatched.\n\nAs an apology for the delay, I've applied a 15% discount to your next order. The discount code SORRY15 will be automatically applied to your account.\n\nThank you for your patience and understanding.`,
                    confidence: 88
                },
                address: {
                    content: `Hello ${customer.name},\n\nThank you for contacting us about updating your shipping address. Good news! Since your order was placed recently and hasn't entered our fulfillment process yet, I was able to update the shipping address as requested.\n\nYour new shipping address has been confirmed and you'll receive an updated order confirmation email shortly. Your order should still arrive within the originally estimated timeframe.\n\nIf you have any other questions, please don't hesitate to reach out.`,
                    confidence: 94
                }
            },
            billing: {
                duplicate: {
                    content: `Dear ${customer.name},\n\nThank you for bringing this billing concern to our attention. I understand how frustrating duplicate charges can be, and I'm here to resolve this quickly.\n\nI've reviewed your account and confirmed that there was indeed a duplicate charge. This appears to be a processing error on our end. I've immediately initiated a refund for the duplicate amount, which should appear in your account within 3-5 business days.\n\nYou'll receive an email confirmation with the refund details shortly. Again, I apologize for this error and any inconvenience it may have caused.`,
                    confidence: 92
                }
            },
            technical: {
                app_crash: {
                    content: `Hi ${customer.name},\n\nI'm sorry to hear you're experiencing issues with our mobile app. App crashes can be frustrating, and I'm here to help you resolve this.\n\nBased on your device information (iPhone 14 with iOS 17.1), this appears to be related to a known compatibility issue that we've recently addressed. Please try the following steps:\n\n1. Update to the latest app version (v2.1.3) from the App Store\n2. Restart your device after the update\n3. Clear the app cache by logging out and back in\n\nIf the issue persists, please let me know and I can escalate this to our technical team for further investigation.`,
                    confidence: 85
                },
                account_access: {
                    content: `Hello ${customer.name},\n\nI understand how frustrating it can be when you can't access your account. Let me help you regain access quickly.\n\nI've checked our system and found that your account may have been temporarily locked due to multiple login attempts. I've unlocked your account and reset your password.\n\nYou should receive a password reset email within the next few minutes. Please check your spam folder if you don't see it in your inbox.\n\nOnce you've reset your password, you should be able to access your account normally. If you continue to experience issues, please reply to this email and I'll personally ensure it's resolved.`,
                    confidence: 90
                }
            },
            returns: {
                defective: {
                    content: `Dear ${customer.name},\n\nI'm sorry to hear that your wireless headphones aren't working properly. Product defects are certainly not the experience we want our customers to have.\n\nSince your order is within our 30-day return window and you have the original packaging, you're eligible for a full refund or replacement. I've generated a prepaid return shipping label that I'm sending to your email address.\n\nOnce we receive the returned item, we'll process your refund within 3-5 business days. If you'd prefer a replacement instead, please let me know and I can arrange that for you.\n\nThank you for giving us the opportunity to make this right.`,
                    confidence: 88
                }
            },
            general: {
                recommendation: {
                    content: `Hi ${customer.name},\n\nThank you for reaching out about laptop recommendations for your daughter's computer science studies. I'd be happy to help you find the perfect device!\n\nBased on your budget of $1200-1500 and the need for programming/development work, I'd recommend these options:\n\n1. MacBook Air M2 (starting at $1,299) - Excellent for CS students, long battery life, Unix-based system\n2. Dell XPS 13 Plus (starting at $1,199) - Great Windows/Linux development environment, powerful performance\n\nBoth laptops offer excellent performance for coding, are lightweight for campus use, and fall within your budget. Would you like detailed specifications for either option, or do you have specific software requirements I should consider?`,
                    confidence: 85
                }
            }
        };

        // Determine the best template based on email content
        const category = email.category;
        const content = email.content.toLowerCase();
        
        if (category === 'shipping') {
            if (content.includes('delay') || content.includes('late') || content.includes('arrive')) {
                return templates.shipping.delayed;
            } else if (content.includes('address') || content.includes('change')) {
                return templates.shipping.address;
            }
        } else if (category === 'billing') {
            if (content.includes('duplicate') || content.includes('twice') || content.includes('charged')) {
                return templates.billing.duplicate;
            }
        } else if (category === 'technical') {
            if (content.includes('crash') || content.includes('app') || content.includes('load')) {
                return templates.technical.app_crash;
            } else if (content.includes('login') || content.includes('password') || content.includes('access')) {
                return templates.technical.account_access;
            }
        } else if (category === 'returns') {
            if (content.includes('return') || content.includes('defective') || content.includes('not working')) {
                return templates.returns.defective;
            }
        } else if (category === 'general') {
            if (content.includes('recommend') || content.includes('laptop') || content.includes('computer')) {
                return templates.general.recommendation;
            }
        }

        // Default generic response
        return {
            content: `Dear ${customer.name},\n\nThank you for contacting us. I've received your message and I'm looking into your inquiry.\n\nI'll provide you with a detailed response shortly. In the meantime, if you have any urgent questions, please don't hesitate to reach out.\n\nBest regards,\nCustomer Support Team`,
            confidence: 75
        };
    }

    regenerateAIReply() {
        const textarea = document.getElementById('aiReplyText');
        const confidenceBar = document.getElementById('confidenceFill');
        const confidenceValue = document.getElementById('confidenceValue');

        textarea.value = 'Regenerating response...';
        
        setTimeout(() => {
            const aiReply = this.getAIReplyForEmail(this.selectedEmail);
            // Slightly different confidence for regenerated reply
            const newConfidence = Math.max(70, aiReply.confidence + (Math.random() * 10 - 5));
            
            textarea.value = aiReply.content;
            confidenceBar.style.width = `${newConfidence}%`;
            confidenceValue.textContent = `${Math.round(newConfidence)}%`;
        }, 1000);
    }

    enableReplyEditing() {
        const textarea = document.getElementById('aiReplyText');
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        
        // Change button text to indicate editing mode
        const editBtn = document.getElementById('editReplyBtn');
        editBtn.innerHTML = '<i class="fas fa-check"></i> Editing Enabled';
        editBtn.style.backgroundColor = 'var(--secondary-green)';
        editBtn.style.borderColor = 'var(--secondary-green)';
        editBtn.style.color = 'white';
    }

    async sendAIReply() {
        const textarea = document.getElementById('aiReplyText');
        const reply = textarea.value.trim();
        
        if (!reply) {
            alert('Please enter a reply before sending.');
            return;
        }

        // Check if we're in Gmail mode and send real email
        if (this.gmailMode && this.selectedEmail.gmailId) {
            const success = await this.sendGmailReply(this.selectedEmail, reply);
            if (!success) {
                return; // Error already shown
            }
        } else {
            // Sample data mode - just update locally
            this.selectedEmail.thread.push({
                type: 'ai-reply',
                content: reply,
                timestamp: new Date(),
                confidence: parseInt(document.getElementById('confidenceValue').textContent)
            });

            // Update email status
            this.selectedEmail.status = 'ai-replied';
            this.selectedEmail.tags = ['ai-replied'];
        }

        // Close modal and refresh views
        this.closeModal('aiReplyModal');
        this.renderEmails();
        this.renderEmailPreview();
        this.updateFilterCounts();

        // Show success message
        const message = this.gmailMode ? 'Gmail reply sent successfully!' : 'AI reply sent successfully!';
        this.showNotification(message, 'success');
    }

    showCustomerHistory(customerId) {
        const customer = this.customers.get(customerId);
        const modal = document.getElementById('customerHistoryModal');
        
        document.getElementById('customerName').textContent = customer.name;
        document.getElementById('customerEmail').textContent = customer.email;
        document.getElementById('customerJoined').textContent = `Customer since: ${this.formatDate(new Date(customer.joinDate))}`;

        const historyContainer = document.getElementById('interactionHistory');
        historyContainer.innerHTML = customer.interactions.map(interaction => `
            <div class="history-item ${interaction.status}">
                <div class="history-date">${this.formatDate(interaction.date)}</div>
                <div class="history-subject">${interaction.subject}</div>
                <div class="history-summary">${interaction.summary}</div>
            </div>
        `).join('');

        modal.classList.add('show');
    }

    toggleAIAutoReply() {
        this.aiAutoReplyEnabled = !this.aiAutoReplyEnabled;
        const indicator = document.querySelector('.ai-indicator');
        
        if (this.aiAutoReplyEnabled) {
            indicator.classList.add('active');
            indicator.innerHTML = '<i class="fas fa-robot"></i> AI Auto-Reply: ON';
        } else {
            indicator.classList.remove('active');
            indicator.innerHTML = '<i class="fas fa-robot"></i> AI Auto-Reply: OFF';
        }
    }

    async refreshEmails() {
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
        
        try {
            if (this.gmailMode && window.gmailAuth && window.gmailAuth.isUserSignedIn()) {
                // Refresh from Gmail
                await this.refreshGmailEmails();
            } else {
                // Simulate new emails arriving in sample mode
                setTimeout(() => {
                    if (Math.random() > 0.5) {
                        this.addNewEmail();
                    }
                    
                    this.renderEmails();
                    this.updateFilterCounts();
                    this.showNotification('Sample emails refreshed', 'info');
                }, 1500);
            }
        } catch (error) {
            console.error('Failed to refresh emails:', error);
            this.showNotification('Failed to refresh emails', 'error');
        } finally {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        }
    }

    addNewEmail() {
        const newEmail = {
            id: this.emails.length + 1,
            customerId: Math.floor(Math.random() * 8) + 1,
            subject: 'New customer inquiry',
            content: 'This is a new email that just arrived...',
            timestamp: new Date(),
            status: 'unread',
            category: ['general', 'billing', 'shipping', 'technical', 'returns'][Math.floor(Math.random() * 5)],
            priority: 'medium',
            tags: ['pending'],
            thread: []
        };
        
        this.emails.unshift(newEmail);
    }

    toggleSelectAll() {
        const emailItems = document.querySelectorAll('.email-item');
        const allSelected = Array.from(emailItems).every(item => item.classList.contains('selected'));
        
        emailItems.forEach(item => {
            if (allSelected) {
                item.classList.remove('selected');
            } else {
                item.classList.add('selected');
            }
        });
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        
        // Reset edit button if it was modified
        if (modalId === 'aiReplyModal') {
            const editBtn = document.getElementById('editReplyBtn');
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Reply';
            editBtn.style.backgroundColor = '';
            editBtn.style.borderColor = '';
            editBtn.style.color = '';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: 'white',
            backgroundColor: type === 'success' ? 'var(--secondary-green)' : 
                           type === 'error' ? '#f44336' : 'var(--primary-blue)',
            boxShadow: 'var(--shadow)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideInRight 0.3s ease'
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Gmail Integration Methods
    async refreshGmailEmails() {
        if (!window.gmailAPI || !window.gmailAuth || !window.gmailAuth.isUserSignedIn()) {
            this.showNotification('Please connect to Gmail first', 'error');
            return;
        }

        try {
            this.showNotification('Fetching emails from Gmail...', 'info');
            
            const gmailEmails = await window.gmailAPI.fetchEmails('in:inbox', 50);
            
            // Convert Gmail emails to our format and update customers
            this.emails = gmailEmails.map(email => {
                // Add customer to our system
                if (!this.customers.has(email.customerId)) {
                    this.customers.set(email.customerId, {
                        id: email.customerId,
                        name: email.senderInfo.name,
                        email: email.senderInfo.email,
                        joinDate: new Date().toISOString().split('T')[0],
                        interactions: this.generateCustomerHistory(email.customerId)
                    });
                }
                
                return email;
            });

            this.gmailMode = true;
            this.renderEmails();
            this.updateFilterCounts();
            
            this.showNotification(`Loaded ${gmailEmails.length} emails from Gmail`, 'success');
        } catch (error) {
            console.error('Failed to refresh Gmail emails:', error);
            this.showNotification('Failed to fetch Gmail emails', 'error');
        }
    }

    switchToSampleData() {
        this.emails = [...this.sampleEmails];
        this.gmailMode = false;
        this.renderEmails();
        this.updateFilterCounts();
        this.showNotification('Switched to sample data', 'info');
    }

    async sendGmailReply(originalEmail, replyContent) {
        if (!window.gmailAPI || !window.gmailAuth || !window.gmailAuth.isUserSignedIn()) {
            this.showNotification('Please connect to Gmail first', 'error');
            return false;
        }

        try {
            const result = await window.gmailAPI.sendReply(originalEmail, replyContent, true);
            
            // Update email status in our local data
            const emailIndex = this.emails.findIndex(e => e.id === originalEmail.id);
            if (emailIndex !== -1) {
                this.emails[emailIndex].status = 'ai-replied';
                this.emails[emailIndex].tags = ['ai-replied'];
                this.emails[emailIndex].thread.push({
                    type: 'ai-reply',
                    content: replyContent,
                    timestamp: new Date(),
                    confidence: parseInt(document.getElementById('confidenceValue').textContent)
                });
            }

            return true;
        } catch (error) {
            console.error('Failed to send Gmail reply:', error);
            this.showNotification('Failed to send Gmail reply', 'error');
            return false;
        }
    }

    // Utility functions
    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) {
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            return `${days}d ago`;
        }
    }

    formatDateTime(timestamp) {
        return timestamp.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(timestamp) {
        return timestamp.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
}

// Initialize the application
let emailManager;

// Initialize when DOM is ready or immediately if already ready
function initializeApp() {
    if (!window.emailManager) {
        console.log('Creating Email Manager instance...');
        window.emailManager = emailManager = new EmailManager();
    } else {
        emailManager = window.emailManager;
    }
    
    // Add some additional CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .no-emails {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 24px;
            color: var(--dark-grey);
            text-align: center;
        }
        
        .no-emails i {
            font-size: 48px;
            margin-bottom: 16px;
            color: var(--medium-grey);
        }
        
        .no-emails h3 {
            font-size: 18px;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .no-emails p {
            font-size: 14px;
            color: var(--dark-grey);
        }
        
        .email-thread {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid var(--border-color);
        }
        
        .email-thread h4 {
            margin-bottom: 16px;
            color: var(--text-dark);
            font-size: 16px;
        }
        
        .thread-item {
            background-color: var(--light-grey);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
        }
        
        .thread-item.ai-reply {
            border-left: 4px solid var(--ai-purple);
        }
        
        .thread-item.customer-reply {
            border-left: 4px solid var(--primary-blue);
        }
        
        .thread-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
        }
        
        .thread-type {
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .thread-time {
            color: var(--dark-grey);
        }
        
        .thread-confidence {
            color: var(--ai-purple);
            font-weight: 500;
        }
        
        .thread-content {
            font-size: 14px;
            line-height: 1.5;
        }
        
        .priority-high {
            color: #f44336;
        }
        
        .priority-medium {
            color: var(--accent-orange);
        }
        
        .priority-low {
            color: var(--secondary-green);
        }
    `;
    document.head.appendChild(style);
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
} 