/**
 * ===============================================
 * EMAIL MANAGER PRO - MODERN JAVASCRIPT APPLICATION
 * Professional Customer Support Platform
 * Version 2.0 - Optimized for Vercel Deployment
 * ===============================================
 */

'use strict';

// Application State
class EmailManagerPro {
    constructor() {
        // Core properties
        this.emails = [];
        this.customers = new Map();
        this.currentFilter = 'all';
        this.currentCategory = null;
        this.currentSort = 'newest';
        this.searchQuery = '';
        this.selectedEmail = null;
        this.isInitialized = false;
        
        // UI state
        this.sidebarOpen = false;
        this.currentModal = null;
        
        // AI settings
        this.aiEnabled = true;
        this.confidenceThreshold = 80;
        
        // Performance optimizations
        this.emailCache = new Map();
        this.renderQueue = [];
        this.lastRender = 0;
        
        // Initialize when DOM is ready
        this.initializeWhenReady();
    }

    /**
     * Initialize the application when DOM is ready
     */
    initializeWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    /**
     * Main initialization method
     */
    async initialize() {
        try {
            console.log('🚀 Initializing Email Manager Pro...');
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Generate sample data
            await this.generateSampleData();
            console.log(`✅ Generated ${this.emails.length} sample emails`);
            
            // Initialize UI components
            await this.initializeUI();
            console.log('✅ UI components initialized');
            
            // Bind event listeners
            this.bindEventListeners();
            console.log('✅ Event listeners bound');
            
            // Initial render
            this.renderAll();
            console.log('✅ Initial render complete');
            
            // Hide loading screen and show app
            this.hideLoadingScreen();
            
            // Show success notification
            this.showNotification('success', 'Email Manager Pro', 'Successfully loaded with sample data');
            
            this.isInitialized = true;
            console.log('🎉 Email Manager Pro initialized successfully!');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('fade-out');
        }
    }

    /**
     * Hide loading screen and show main app
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const appContainer = document.getElementById('appContainer');
        
        if (loadingScreen && appContainer) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                appContainer.classList.remove('hidden');
            }, 500);
        }
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        console.error('Initialization error:', error);
        
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="loading-content">
                    <div style="color: #ef4444; font-size: 48px; margin-bottom: 24px;">⚠️</div>
                    <h2 style="color: white;">Initialization Failed</h2>
                    <p style="color: rgba(255,255,255,0.9); margin-bottom: 24px;">There was an error loading the application.</p>
                    <button onclick="window.location.reload()" style="background: white; color: #2563eb; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        Reload Application
                    </button>
                </div>
            `;
        }
    }

    /**
     * Generate comprehensive sample data
     */
    async generateSampleData() {
        // Generate customers first
        this.generateCustomers();
        
        // Generate realistic emails
        this.generateEmails();
        
        // Add some processing delay for realism
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    /**
     * Generate sample customers
     */
    generateCustomers() {
        const customers = [
            {
                id: 1,
                name: 'Sarah Johnson',
                email: 'sarah.johnson@techcorp.com',
                company: 'TechCorp Solutions',
                joinDate: '2023-01-15',
                tier: 'premium',
                avatar: 'SJ',
                timezone: 'EST'
            },
            {
                id: 2,
                name: 'Mike Chen',
                email: 'mike.chen@startupdev.io',
                company: 'StartupDev',
                joinDate: '2023-02-20',
                tier: 'business',
                avatar: 'MC',
                timezone: 'PST'
            },
            {
                id: 3,
                name: 'Emily Rodriguez',
                email: 'emily.r@digitalagency.com',
                company: 'Digital Agency Pro',
                joinDate: '2023-03-10',
                tier: 'enterprise',
                avatar: 'ER',
                timezone: 'CST'
            },
            {
                id: 4,
                name: 'David Kim',
                email: 'david.kim@freelancedesign.com',
                company: 'Freelance Design Studio',
                joinDate: '2023-04-05',
                tier: 'standard',
                avatar: 'DK',
                timezone: 'PST'
            },
            {
                id: 5,
                name: 'Lisa Thompson',
                email: 'lisa.t@educationplus.org',
                company: 'Education Plus',
                joinDate: '2023-05-12',
                tier: 'business',
                avatar: 'LT',
                timezone: 'EST'
            },
            {
                id: 6,
                name: 'Alex Parker',
                email: 'alex.parker@healthtech.com',
                company: 'HealthTech Innovations',
                joinDate: '2023-06-18',
                tier: 'premium',
                avatar: 'AP',
                timezone: 'MST'
            },
            {
                id: 7,
                name: 'Jessica Wu',
                email: 'jessica.wu@retailsolutions.com',
                company: 'Retail Solutions Inc',
                joinDate: '2023-07-22',
                tier: 'enterprise',
                avatar: 'JW',
                timezone: 'PST'
            },
            {
                id: 8,
                name: 'Robert Davis',
                email: 'robert.d@financialservices.com',
                company: 'Financial Services Group',
                joinDate: '2023-08-14',
                tier: 'premium',
                avatar: 'RD',
                timezone: 'EST'
            }
        ];

        customers.forEach(customer => {
            this.customers.set(customer.id, {
                ...customer,
                totalEmails: 0,
                lastContact: null,
                satisfaction: Math.floor(Math.random() * 30) + 70, // 70-100%
                tags: this.generateCustomerTags(customer.tier)
            });
        });
    }

    /**
     * Generate customer tags based on tier
     */
    generateCustomerTags(tier) {
        const baseTags = ['active'];
        const tierTags = {
            standard: ['basic-support'],
            business: ['priority-support', 'phone-support'],
            premium: ['premium-support', 'dedicated-rep', 'priority-queue'],
            enterprise: ['enterprise', 'dedicated-rep', 'sla-guaranteed', 'phone-support']
        };
        return [...baseTags, ...(tierTags[tier] || [])];
    }

    /**
     * Generate realistic email conversations
     */
    generateEmails() {
        const emailTemplates = [
            {
                customerId: 1,
                subject: 'Critical Integration Issue - API Not Responding',
                content: `Hi Support Team,

We're experiencing a critical issue with our API integration. Our production system has been unable to connect to your API endpoints since this morning around 9:00 AM EST.

Error details:
- Endpoint: /api/v2/data/sync
- Error: Connection timeout after 30 seconds
- Frequency: Every API call is failing

This is impacting our customer-facing services. Can you please prioritize this issue?

Best regards,
Sarah Johnson
Lead Developer, TechCorp Solutions`,
                category: 'support',
                priority: 'high',
                status: 'unread',
                tags: ['urgent', 'api-issue'],
                thread: [],
                timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
            },
            {
                customerId: 2,
                subject: 'Billing Discrepancy - Double Charge This Month',
                content: `Hello,

I noticed there are two charges on my company credit card for this month's subscription:
- Charge 1: $299.99 on March 1st
- Charge 2: $299.99 on March 3rd

We should only be charged once per month. Our subscription ID is SUB-789012.

Could you please investigate and refund the duplicate charge?

Thanks,
Mike Chen
StartupDev`,
                category: 'billing',
                priority: 'medium',
                status: 'ai-replied',
                tags: ['billing-issue', 'refund-requested'],
                thread: [
                    {
                        type: 'ai-reply',
                        author: 'AI Assistant',
                        content: `Hi Mike,

Thank you for reaching out about the billing discrepancy. I've reviewed your account and can confirm that there was indeed a duplicate charge due to a processing error on our end.

Here's what I've done:
✅ Initiated a refund for the duplicate charge ($299.99)
✅ Added a credit note to your account
✅ Flagged your account to prevent future duplicate charges

The refund should appear in your account within 3-5 business days. You'll receive an email confirmation shortly with the refund details and reference number.

I apologize for any inconvenience this may have caused.

Best regards,
AI Customer Support`,
                        timestamp: new Date(Date.now() - 1000 * 60 * 30),
                        confidence: 94
                    }
                ],
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
            },
            {
                customerId: 3,
                subject: 'Feature Request: Advanced Analytics Dashboard',
                content: `Hi Product Team,

I'd like to request a new feature for our enterprise account. We need an advanced analytics dashboard that includes:

1. Real-time data visualization
2. Custom report generation
3. Data export capabilities (CSV, PDF)
4. User activity tracking
5. Performance metrics over time

Our team manages multiple client accounts and these analytics would help us provide better insights to our clients.

Is this something that's on your roadmap? If so, what's the estimated timeline?

Thank you,
Emily Rodriguez
Digital Agency Pro`,
                category: 'sales',
                priority: 'low',
                status: 'ai-replied',
                tags: ['feature-request', 'enterprise'],
                thread: [
                    {
                        type: 'ai-reply',
                        author: 'AI Assistant',
                        content: `Hi Emily,

Thank you for your detailed feature request! I'm excited to share that an advanced analytics dashboard is indeed on our product roadmap.

Current status:
📋 In development phase
🎯 Beta release planned for Q2 2024
🚀 General availability expected Q3 2024

The features you mentioned align perfectly with what we're building:
✅ Real-time data visualization
✅ Custom report builder
✅ Export capabilities (CSV, PDF, Excel)
✅ User activity insights
✅ Historical performance tracking

As an enterprise customer, you'll have early access to the beta. I'll add you to our beta notification list and our product team will reach out when it's ready for testing.

Would you like to schedule a call to discuss your specific analytics needs?

Best regards,
AI Product Assistant`,
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
                        confidence: 87
                    }
                ],
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
            },
            {
                customerId: 4,
                subject: 'Password Reset Not Working',
                content: `Hi,

I'm trying to reset my password but I'm not receiving the reset email. I've checked my spam folder and tried multiple times over the past hour.

My email is: david.kim@freelancedesign.com
Account ID: ACC-456789

Can you please help me regain access to my account?

Thanks,
David Kim`,
                category: 'support',
                priority: 'medium',
                status: 'unread',
                tags: ['password-reset', 'access-issue'],
                thread: [],
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
            },
            {
                customerId: 5,
                subject: 'Upgrade to Business Plan - Education Discount',
                content: `Hello Sales Team,

We're currently on the Standard plan but need to upgrade to Business to support our growing team of 15 educators.

As we're an educational organization (Education Plus), do you offer any educational discounts for the Business plan?

Our current usage:
- Monthly active users: 150 students
- Data storage: 2.5GB
- Monthly API calls: ~45,000

Please let me know about available discounts and the upgrade process.

Best regards,
Lisa Thompson
IT Director, Education Plus`,
                category: 'sales',
                priority: 'medium',
                status: 'resolved',
                tags: ['upgrade-request', 'education-discount'],
                thread: [
                    {
                        type: 'human-reply',
                        author: 'Sales Representative',
                        content: `Hi Lisa,

Great news! We absolutely offer educational discounts. For qualified educational institutions like yours, we provide a 25% discount on all our plans.

Here's what your Business plan would cost:
• Regular price: $49/month
• Educational discount: $36.75/month
• Annual payment: Additional 10% off = $33.08/month

The Business plan includes:
✅ Up to 500 monthly active users
✅ 10GB storage
✅ 100,000 monthly API calls
✅ Priority support
✅ Advanced reporting

I'll send you the educational verification form and upgrade instructions shortly. Once verified, we can apply the discount and upgrade your account.

Best regards,
Jennifer Walsh
Sales Representative`,
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
                        confidence: null
                    },
                    {
                        type: 'customer-reply',
                        author: 'Lisa Thompson',
                        content: `Perfect! Thank you for the quick response and great pricing. I'll fill out the verification form today and get this upgrade processed.

Looking forward to the enhanced features!

Best,
Lisa`,
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9),
                        confidence: null
                    }
                ],
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
            },
            {
                customerId: 6,
                subject: 'Data Export Issues - Large Dataset',
                content: `Support Team,

I'm having trouble exporting our patient data (anonymized for HIPAA compliance). The export keeps timing out for datasets larger than 10,000 records.

Our export requirements:
- Dataset size: ~25,000 records
- Format: CSV with custom field mapping
- Frequency: Weekly automated exports

Error message: "Export timeout - please try again with smaller dataset"

This is critical for our compliance reporting. Can you please help resolve this?

Dr. Alex Parker
HealthTech Innovations`,
                category: 'support',
                priority: 'high',
                status: 'urgent',
                tags: ['data-export', 'hipaa', 'timeout'],
                thread: [],
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18) // 18 hours ago
            },
            {
                customerId: 7,
                subject: 'Integration Documentation Request',
                content: `Hi Development Team,

We're planning to integrate your platform with our inventory management system. Could you please provide:

1. Complete API documentation
2. Integration examples for retail systems
3. Rate limiting information
4. Webhook documentation for real-time updates

Our tech stack: Node.js, PostgreSQL, Redis
Expected volume: 500-1000 API calls per hour

Timeline: We'd like to complete the integration within 3 weeks.

Thanks,
Jessica Wu
CTO, Retail Solutions Inc`,
                category: 'support',
                priority: 'medium',
                status: 'ai-replied',
                tags: ['integration', 'documentation', 'api'],
                thread: [
                    {
                        type: 'ai-reply',
                        author: 'AI Technical Assistant',
                        content: `Hi Jessica,

I'd be happy to help with your integration! Here are the resources you requested:

📚 **Documentation Links:**
• Complete API Documentation: https://docs.ourplatform.com/api/v2
• Integration Examples: https://docs.ourplatform.com/integrations/retail
• Rate Limits: 1000 calls/hour (your volume is well within limits)
• Webhook Guide: https://docs.ourplatform.com/webhooks

🛠️ **Retail-Specific Resources:**
• Node.js SDK: npm install @ourplatform/node-sdk
• Sample retail integration: https://github.com/ourplatform/retail-examples
• Inventory sync patterns: Real-time via webhooks + hourly batch sync

📞 **Technical Support:**
Given your 3-week timeline, I'd recommend scheduling a technical consultation call. Our integration specialists can provide personalized guidance for your specific use case.

Would you like me to arrange a call this week?

Best regards,
AI Technical Support`,
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
                        confidence: 91
                    }
                ],
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
            },
            {
                customerId: 8,
                subject: 'Security Compliance Audit - SOC 2 Documentation',
                content: `Security Team,

We're undergoing a financial services compliance audit and need documentation regarding your security practices:

1. SOC 2 Type II certification
2. Data encryption standards
3. Access control policies
4. Incident response procedures
5. Data retention and deletion policies

This is required for our annual compliance review. Can you provide these documents under NDA?

Our compliance deadline is in 2 weeks.

Robert Davis
Chief Security Officer
Financial Services Group`,
                category: 'support',
                priority: 'high',
                status: 'resolved',
                tags: ['compliance', 'security', 'soc2'],
                thread: [
                    {
                        type: 'human-reply',
                        author: 'Security Compliance Team',
                        content: `Hi Robert,

Thank you for reaching out regarding our security documentation. We understand the importance of compliance in the financial services sector.

I've prepared a comprehensive compliance package including:

✅ SOC 2 Type II Report (current)
✅ Security Architecture Overview
✅ Data Encryption Standards (AES-256, TLS 1.3)
✅ Identity & Access Management Policies
✅ Incident Response Playbook
✅ Data Lifecycle Management Procedures

Given the sensitive nature of these documents, I'll need you to sign our mutual NDA first. I'll send the NDA template to your email within the hour.

Once executed, I can provide access to our secure compliance portal where all documents are available for download.

Estimated processing time: 24-48 hours after NDA execution.

Best regards,
Michael Torres
Head of Security Compliance`,
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
                        confidence: null
                    }
                ],
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
            }
        ];

        // Add emails to the main array
        this.emails = emailTemplates.map((template, index) => ({
            id: index + 1,
            ...template,
            isRead: template.status !== 'unread',
            hasAttachments: Math.random() > 0.7,
            importance: template.priority
        }));

        // Update customer stats
        this.emails.forEach(email => {
            const customer = this.customers.get(email.customerId);
            if (customer) {
                customer.totalEmails++;
                if (!customer.lastContact || email.timestamp > customer.lastContact) {
                    customer.lastContact = email.timestamp;
                }
            }
        });
    }

    /**
     * Initialize UI components
     */
    async initializeUI() {
        // Initialize filters
        this.updateFilterCounts();
        
        // Initialize stats
        this.updateStats();
        
        // Initialize AI controls
        this.initializeAIControls();
        
        // Add small delay for smooth transitions
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    /**
     * Initialize AI controls
     */
    initializeAIControls() {
        const aiToggle = document.getElementById('aiAutoReply');
        const confidenceSlider = document.getElementById('confidenceSlider');
        const confidenceValue = document.getElementById('confidenceValue');

        if (aiToggle) {
            aiToggle.checked = this.aiEnabled;
        }

        if (confidenceSlider) {
            confidenceSlider.value = this.confidenceThreshold;
        }

        if (confidenceValue) {
            confidenceValue.textContent = `${this.confidenceThreshold}%`;
        }
    }

    /**
     * Bind all event listeners
     */
    bindEventListeners() {
        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', this.debounce((e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.renderEmailList();
                this.updateSearchClear();
            }, 300));
        }

        // Search clear button
        const clearSearch = document.getElementById('clearSearch');
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Filter items
        document.querySelectorAll('.filter-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.setFilter(item.dataset.filter);
            });
        });

        // Category items
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCategory(item.dataset.category);
            });
        });

        // Control buttons
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshEmails());
        }

        const selectAllBtn = document.getElementById('selectAllBtn');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => this.toggleSelectAll());
        }

        // Sort options
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                this.setSort(option.dataset.sort);
            });
        });

        // AI Controls
        const aiToggle = document.getElementById('aiAutoReply');
        if (aiToggle) {
            aiToggle.addEventListener('change', (e) => {
                this.aiEnabled = e.target.checked;
                this.showNotification('info', 'AI Assistant', 
                    `Auto-reply ${this.aiEnabled ? 'enabled' : 'disabled'}`);
            });
        }

        const confidenceSlider = document.getElementById('confidenceSlider');
        const confidenceValue = document.getElementById('confidenceValue');
        if (confidenceSlider && confidenceValue) {
            confidenceSlider.addEventListener('input', (e) => {
                this.confidenceThreshold = parseInt(e.target.value);
                confidenceValue.textContent = `${this.confidenceThreshold}%`;
            });
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Modal overlays
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', () => this.closeModal());
        });

        // AI Modal buttons
        const regenerateBtn = document.getElementById('regenerateResponse');
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => this.regenerateAIResponse());
        }

        const sendBtn = document.getElementById('sendResponse');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendAIResponse());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window resize
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        // Escape key closes modals
        if (e.key === 'Escape' && this.currentModal) {
            this.closeModal();
        }

        // Ctrl/Cmd + K focuses search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('globalSearch');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // R key refreshes emails (when not in input)
        if (e.key === 'r' && !this.isInputFocused() && !this.currentModal) {
            e.preventDefault();
            this.refreshEmails();
        }
    }

    /**
     * Check if an input element is currently focused
     */
    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile sidebar on resize to desktop
        if (window.innerWidth > 768) {
            this.sidebarOpen = false;
            this.updateSidebarState();
        }
    }

    /**
     * Update sidebar state for mobile
     */
    updateSidebarState() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open', this.sidebarOpen);
        }
    }

    /**
     * Clear search
     */
    clearSearch() {
        this.searchQuery = '';
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        this.updateSearchClear();
        this.renderEmailList();
    }

    /**
     * Update search clear button visibility
     */
    updateSearchClear() {
        const clearBtn = document.getElementById('clearSearch');
        if (clearBtn) {
            clearBtn.style.display = this.searchQuery ? 'block' : 'none';
        }
    }

    /**
     * Set current filter
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active state
        document.querySelectorAll('.filter-item').forEach(item => {
            item.classList.toggle('active', item.dataset.filter === filter);
        });

        // Update panel title
        const panelTitle = document.getElementById('panelTitle');
        if (panelTitle) {
            const titles = {
                all: 'All Emails',
                unread: 'Unread Emails',
                'ai-replied': 'AI Handled',
                urgent: 'Urgent Emails',
                resolved: 'Resolved Emails'
            };
            panelTitle.textContent = titles[filter] || 'Emails';
        }

        this.renderEmailList();
    }

    /**
     * Toggle category filter
     */
    toggleCategory(category) {
        if (this.currentCategory === category) {
            this.currentCategory = null;
        } else {
            this.currentCategory = category;
        }

        // Update active state
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.toggle('active', item.dataset.category === this.currentCategory);
        });

        this.renderEmailList();
    }

    /**
     * Set sort method
     */
    setSort(sort) {
        this.currentSort = sort;

        // Update active state
        document.querySelectorAll('.sort-option').forEach(option => {
            option.classList.toggle('active', option.dataset.sort === sort);
        });

        this.renderEmailList();
    }

    /**
     * Render all UI components
     */
    renderAll() {
        this.renderEmailList();
        this.updateStats();
        this.updateFilterCounts();
    }

    /**
     * Render the email list
     */
    renderEmailList() {
        const emailList = document.getElementById('emailList');
        if (!emailList) return;

        const filteredEmails = this.getFilteredEmails();
        const visibleCount = document.getElementById('visibleCount');
        
        if (visibleCount) {
            visibleCount.textContent = `${filteredEmails.length} email${filteredEmails.length !== 1 ? 's' : ''}`;
        }

        if (filteredEmails.length === 0) {
            emailList.innerHTML = this.renderEmptyState();
            return;
        }

        const emailItems = filteredEmails.map(email => this.renderEmailItem(email)).join('');
        emailList.innerHTML = emailItems;

        // Bind email item click events
        emailList.querySelectorAll('.email-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const emailId = parseInt(item.dataset.emailId);
                this.selectEmail(emailId);
            });
        });

        // Add fade-in animation
        emailList.classList.add('fade-in');
    }

    /**
     * Get filtered and sorted emails
     */
    getFilteredEmails() {
        let filtered = [...this.emails];

        // Apply filters
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(email => {
                switch (this.currentFilter) {
                    case 'unread':
                        return email.status === 'unread';
                    case 'ai-replied':
                        return email.status === 'ai-replied';
                    case 'urgent':
                        return email.priority === 'high' || email.tags.includes('urgent');
                    case 'resolved':
                        return email.status === 'resolved';
                    default:
                        return true;
                }
            });
        }

        // Apply category filter
        if (this.currentCategory) {
            filtered = filtered.filter(email => email.category === this.currentCategory);
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(email => {
                const customer = this.customers.get(email.customerId);
                const searchText = `${email.subject} ${email.content} ${customer?.name} ${customer?.email}`.toLowerCase();
                return searchText.includes(this.searchQuery);
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return b.timestamp.getTime() - a.timestamp.getTime();
                case 'oldest':
                    return a.timestamp.getTime() - b.timestamp.getTime();
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'sender':
                    const customerA = this.customers.get(a.customerId);
                    const customerB = this.customers.get(b.customerId);
                    return (customerA?.name || '').localeCompare(customerB?.name || '');
                default:
                    return 0;
            }
        });

        return filtered;
    }

    /**
     * Render empty state
     */
    renderEmptyState() {
        return `
            <div class="detail-placeholder">
                <div class="placeholder-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No emails found</h3>
                <p>Try adjusting your filters or search terms to find what you're looking for.</p>
            </div>
        `;
    }

    /**
     * Render individual email item
     */
    renderEmailItem(email) {
        const customer = this.customers.get(email.customerId);
        const timeAgo = this.formatTimeAgo(email.timestamp);
        const isSelected = this.selectedEmail?.id === email.id;
        
        return `
            <div class="email-item ${email.status === 'unread' ? 'unread' : ''} ${isSelected ? 'selected' : ''}" 
                 data-email-id="${email.id}">
                <div class="email-header">
                    <div class="sender-info">
                        <div class="sender-name">${customer?.name || 'Unknown'}</div>
                        <div class="sender-email">${customer?.email || ''}</div>
                    </div>
                    <div class="email-meta">
                        <div class="email-time">${timeAgo}</div>
                        <div class="priority-indicator ${email.priority}"></div>
                    </div>
                </div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${this.truncateText(email.content, 120)}</div>
                <div class="email-tags">
                    ${email.tags.map(tag => `<span class="email-tag ${tag}">${tag.replace('-', ' ')}</span>`).join('')}
                    <span class="email-tag ${email.category}">${email.category}</span>
                    ${email.hasAttachments ? '<span class="email-tag attachment"><i class="fas fa-paperclip"></i></span>' : ''}
                </div>
            </div>
        `;
    }

    /**
     * Select an email and show details
     */
    selectEmail(emailId) {
        const email = this.emails.find(e => e.id === emailId);
        if (!email) return;

        this.selectedEmail = email;

        // Mark as read if unread
        if (email.status === 'unread') {
            email.status = 'read';
            email.isRead = true;
            this.updateFilterCounts();
        }

        // Update UI
        this.renderEmailList();
        this.renderEmailDetail();
    }

    /**
     * Render email detail panel
     */
    renderEmailDetail() {
        const emailDetail = document.getElementById('emailDetail');
        if (!emailDetail || !this.selectedEmail) return;

        const email = this.selectedEmail;
        const customer = this.customers.get(email.customerId);
        
        emailDetail.innerHTML = `
            <div class="email-detail-content">
                <div class="detail-header">
                    <div class="detail-subject">${email.subject}</div>
                    <div class="detail-meta">
                        <div class="customer-info">
                            <div class="customer-avatar">${customer?.avatar || '?'}</div>
                            <div class="customer-details">
                                <h4>${customer?.name || 'Unknown Customer'}</h4>
                                <p>${customer?.email || ''}</p>
                                <p>Customer since ${customer ? this.formatDate(new Date(customer.joinDate)) : 'Unknown'}</p>
                            </div>
                        </div>
                        <div class="detail-actions">
                            <button class="action-btn" onclick="emailManager.showCustomerProfile(${email.customerId})">
                                <i class="fas fa-user"></i> Profile
                            </button>
                            <button class="action-btn ai" onclick="emailManager.generateAIReply(${email.id})">
                                <i class="fas fa-robot"></i> AI Reply
                            </button>
                            <button class="action-btn primary" onclick="emailManager.composeReply(${email.id})">
                                <i class="fas fa-reply"></i> Reply
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="email-content">${email.content}</div>
                
                ${email.thread.length > 0 ? this.renderEmailThread(email.thread) : ''}
            </div>
        `;
    }

    /**
     * Render email thread
     */
    renderEmailThread(thread) {
        if (!thread.length) return '';

        return `
            <div class="email-thread">
                <div class="thread-title">
                    <i class="fas fa-comments"></i>
                    Conversation History
                </div>
                ${thread.map(item => this.renderThreadItem(item)).join('')}
            </div>
        `;
    }

    /**
     * Render thread item
     */
    renderThreadItem(item) {
        const timeAgo = this.formatTimeAgo(item.timestamp);
        const isAI = item.type === 'ai-reply';
        
        return `
            <div class="thread-item ${item.type}">
                <div class="thread-header">
                    <div class="thread-author">
                        ${isAI ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
                        ${item.author}
                        ${item.confidence ? `<span class="confidence-badge">${item.confidence}% confidence</span>` : ''}
                    </div>
                    <div class="thread-time">${timeAgo}</div>
                </div>
                <div class="thread-content">${item.content}</div>
            </div>
        `;
    }

    /**
     * Generate AI reply for an email
     */
    generateAIReply(emailId) {
        const email = this.emails.find(e => e.id === emailId);
        if (!email) return;

        this.showAIModal(email);
    }

    /**
     * Show AI reply modal
     */
    showAIModal(email) {
        const modal = document.getElementById('aiModal');
        const responseText = document.getElementById('aiResponseText');
        const confidenceFill = document.getElementById('modalConfidenceFill');
        const confidenceText = document.getElementById('modalConfidenceText');
        const responseTime = document.getElementById('responseTime');

        if (!modal || !responseText) return;

        this.currentModal = 'aiModal';
        modal.classList.add('show');

        // Show generating state
        responseText.value = 'Generating AI response...';
        responseText.disabled = true;

        // Simulate AI generation
        const startTime = Date.now();
        setTimeout(() => {
            const aiResponse = this.generateAIResponseText(email);
            const confidence = aiResponse.confidence;
            const duration = ((Date.now() - startTime) / 1000).toFixed(1);

            responseText.value = aiResponse.content;
            responseText.disabled = false;

            if (confidenceFill) {
                confidenceFill.style.width = `${confidence}%`;
            }
            if (confidenceText) {
                confidenceText.textContent = `${confidence}%`;
            }
            if (responseTime) {
                responseTime.textContent = `${duration}s`;
            }
        }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds
    }

    /**
     * Generate AI response text based on email content
     */
    generateAIResponseText(email) {
        const customer = this.customers.get(email.customerId);
        const templates = {
            support: {
                high: {
                    content: `Hi ${customer?.name || 'there'},\n\nThank you for reaching out about this urgent issue. I understand the critical nature of this problem and I'm prioritizing your case immediately.\n\nI've escalated this to our technical team and we're investigating the root cause. Based on your description, this appears to be [specific technical issue]. Here's what we're doing:\n\n1. Immediate investigation by our senior engineers\n2. Temporary workaround implementation if available\n3. Root cause analysis and permanent fix\n4. Prevention measures to avoid recurrence\n\nI'll provide updates every 2 hours until this is resolved. You can also reach me directly at [support phone] for immediate assistance.\n\nThank you for your patience as we work to resolve this quickly.\n\nBest regards,\nAI Technical Support`,
                    confidence: 92
                },
                medium: {
                    content: `Hi ${customer?.name || 'there'},\n\nThank you for contacting our support team. I've reviewed your issue and I'm here to help resolve this for you.\n\nBased on your description, this appears to be related to [relevant area]. Here are the steps I recommend:\n\n1. [First troubleshooting step]\n2. [Second troubleshooting step]\n3. [Third troubleshooting step]\n\nIf these steps don't resolve the issue, please let me know and I'll investigate further. I've also included some additional resources that might be helpful: [documentation links].\n\nI'm committed to getting this working for you. Please don't hesitate to reach out if you need any clarification on these steps.\n\nBest regards,\nAI Support Assistant`,
                    confidence: 87
                }
            },
            billing: {
                content: `Hi ${customer?.name || 'there'},\n\nThank you for reaching out about your billing inquiry. I've reviewed your account and understand your concern.\n\nI can see the issue you've mentioned and I want to resolve this quickly for you. Here's what I've found and what I'm doing:\n\n✅ Account review completed\n✅ Issue confirmed and documented\n✅ Correction/refund initiated\n✅ Account notes updated to prevent recurrence\n\nThe resolution should be reflected in your account within 3-5 business days. You'll receive an email confirmation with all the details and reference numbers.\n\nI apologize for any inconvenience this may have caused. If you have any questions about this resolution, please don't hesitate to contact me.\n\nBest regards,\nAI Billing Support`,
                confidence: 94
            },
            sales: {
                content: `Hi ${customer?.name || 'there'},\n\nThank you for your interest in our solutions! I'm excited to help you find the perfect fit for your needs.\n\nBased on your requirements, I can see that you're looking for [specific features/solutions]. Here's what I recommend:\n\n📋 **Recommended Solution:**\n• [Plan/Package details]\n• Key features that match your needs\n• Pricing and any applicable discounts\n• Implementation timeline\n\n🎯 **Next Steps:**\n1. Review the proposed solution\n2. Schedule a demo call if you'd like\n3. Discuss any customization needs\n4. Plan implementation timeline\n\nI'd love to schedule a brief call to discuss your specific requirements and show you how our solution can benefit your organization. Are you available for a 30-minute demo this week?\n\nLooking forward to working with you!\n\nBest regards,\nAI Sales Assistant`,
                confidence: 89
            }
        };

        const categoryTemplate = templates[email.category];
        if (!categoryTemplate) {
            return {
                content: `Hi ${customer?.name || 'there'},\n\nThank you for reaching out. I've received your message and I'm here to help.\n\nI'm reviewing your request and will provide a detailed response shortly. In the meantime, please let me know if you have any urgent questions.\n\nBest regards,\nAI Customer Support`,
                confidence: 75
            };
        }

        if (email.category === 'support' && categoryTemplate[email.priority]) {
            return categoryTemplate[email.priority];
        }

        return categoryTemplate;
    }

    /**
     * Regenerate AI response
     */
    regenerateAIResponse() {
        if (!this.selectedEmail) return;
        
        this.showAIModal(this.selectedEmail);
        this.showNotification('info', 'AI Assistant', 'Regenerating response...');
    }

    /**
     * Send AI response
     */
    sendAIResponse() {
        const responseText = document.getElementById('aiResponseText');
        const confidenceText = document.getElementById('modalConfidenceText');
        
        if (!responseText || !this.selectedEmail) return;

        const response = responseText.value.trim();
        if (!response) {
            this.showNotification('error', 'Error', 'Please enter a response before sending.');
            return;
        }

        // Add response to email thread
        this.selectedEmail.thread.push({
            type: 'ai-reply',
            author: 'AI Assistant',
            content: response,
            timestamp: new Date(),
            confidence: parseInt(confidenceText?.textContent || '85')
        });

        // Update email status
        this.selectedEmail.status = 'ai-replied';
        this.selectedEmail.tags = this.selectedEmail.tags.filter(tag => tag !== 'pending');
        if (!this.selectedEmail.tags.includes('ai-replied')) {
            this.selectedEmail.tags.push('ai-replied');
        }

        // Close modal and update UI
        this.closeModal();
        this.renderEmailDetail();
        this.renderEmailList();
        this.updateFilterCounts();

        this.showNotification('success', 'AI Reply Sent', 'Response has been sent successfully.');
    }

    /**
     * Show customer profile modal
     */
    showCustomerProfile(customerId) {
        const customer = this.customers.get(customerId);
        if (!customer) return;

        const modal = document.getElementById('customerModal');
        const profileContent = document.getElementById('customerProfile');

        if (!modal || !profileContent) return;

        const customerEmails = this.emails.filter(email => email.customerId === customerId);
        const avgResponseTime = '2.3 hours'; // Mock data
        
        profileContent.innerHTML = `
            <div class="customer-profile-header">
                <div class="customer-avatar-large">${customer.avatar}</div>
                <div class="customer-info-detailed">
                    <h3>${customer.name}</h3>
                    <p class="customer-email">${customer.email}</p>
                    <p class="customer-company">${customer.company}</p>
                    <div class="customer-tier ${customer.tier}">${customer.tier.toUpperCase()}</div>
                </div>
            </div>
            
            <div class="customer-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Emails</span>
                    <span class="stat-value">${customer.totalEmails}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Satisfaction</span>
                    <span class="stat-value">${customer.satisfaction}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Avg Response</span>
                    <span class="stat-value">${avgResponseTime}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Last Contact</span>
                    <span class="stat-value">${customer.lastContact ? this.formatTimeAgo(customer.lastContact) : 'Never'}</span>
                </div>
            </div>
            
            <div class="customer-tags">
                <h4>Tags</h4>
                <div class="tag-list">
                    ${customer.tags.map(tag => `<span class="customer-tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="customer-emails">
                <h4>Recent Emails (${customerEmails.length})</h4>
                <div class="email-history">
                    ${customerEmails.slice(0, 5).map(email => `
                        <div class="history-item" onclick="emailManager.selectEmail(${email.id}); emailManager.closeModal();">
                            <div class="history-subject">${email.subject}</div>
                            <div class="history-meta">
                                <span class="history-status ${email.status}">${email.status}</span>
                                <span class="history-time">${this.formatTimeAgo(email.timestamp)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.currentModal = 'customerModal';
        modal.classList.add('show');
    }

    /**
     * Close current modal
     */
    closeModal() {
        if (!this.currentModal) return;

        const modal = document.getElementById(this.currentModal);
        if (modal) {
            modal.classList.remove('show');
        }

        this.currentModal = null;
    }

    /**
     * Refresh emails (simulate new emails)
     */
    refreshEmails() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
        }

        // Simulate refresh delay
        setTimeout(() => {
            // Simulate new email arrival (10% chance)
            if (Math.random() < 0.1) {
                this.addNewEmail();
            }

            // Update timestamps to simulate activity
            this.emails.forEach(email => {
                if (Math.random() < 0.05) { // 5% chance of update
                    email.timestamp = new Date(email.timestamp.getTime() + Math.random() * 300000); // Add up to 5 minutes
                }
            });

            this.renderEmailList();
            this.updateFilterCounts();

            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            }

            this.showNotification('success', 'Refreshed', 'Email list updated successfully.');
        }, 1000);
    }

    /**
     * Add a new sample email
     */
    addNewEmail() {
        const randomCustomerId = Math.floor(Math.random() * 8) + 1;
        const customer = this.customers.get(randomCustomerId);
        
        const subjects = [
            'Quick Question About Features',
            'Follow-up on Previous Issue',
            'New Support Request',
            'Billing Inquiry',
            'Integration Help Needed'
        ];

        const newEmail = {
            id: Math.max(...this.emails.map(e => e.id)) + 1,
            customerId: randomCustomerId,
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            content: 'This is a new email that just arrived...',
            category: ['support', 'billing', 'sales', 'general'][Math.floor(Math.random() * 4)],
            priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            status: 'unread',
            tags: ['new'],
            thread: [],
            timestamp: new Date(),
            isRead: false,
            hasAttachments: Math.random() > 0.8
        };

        this.emails.unshift(newEmail);
        
        // Update customer stats
        if (customer) {
            customer.totalEmails++;
            customer.lastContact = newEmail.timestamp;
        }
    }

    /**
     * Toggle select all emails
     */
    toggleSelectAll() {
        // Implementation for bulk actions
        this.showNotification('info', 'Bulk Actions', 'Select all functionality would be implemented here.');
    }

    /**
     * Update filter counts
     */
    updateFilterCounts() {
        const counts = {
            all: this.emails.length,
            unread: this.emails.filter(e => e.status === 'unread').length,
            'ai-replied': this.emails.filter(e => e.status === 'ai-replied').length,
            urgent: this.emails.filter(e => e.priority === 'high' || e.tags.includes('urgent')).length,
            resolved: this.emails.filter(e => e.status === 'resolved').length
        };

        Object.entries(counts).forEach(([filter, count]) => {
            const element = document.getElementById(`count${filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', '')}`);
            if (element) {
                element.textContent = count;
            }
        });
    }

    /**
     * Update dashboard stats
     */
    updateStats() {
        const totalEmails = document.getElementById('totalEmails');
        const aiReplies = document.getElementById('aiReplies');

        if (totalEmails) {
            totalEmails.textContent = this.emails.length;
        }

        if (aiReplies) {
            const aiCount = this.emails.filter(e => e.status === 'ai-replied').length;
            aiReplies.textContent = aiCount;
        }
    }

    /**
     * Show notification
     */
    showNotification(type, title, message) {
        const container = document.getElementById('notifications');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon ${type}">
                    <i class="${icons[type]}"></i>
                </div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });

        container.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility: Format time ago
     */
    formatTimeAgo(date) {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    }

    /**
     * Utility: Format date
     */
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Utility: Truncate text
     */
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    /**
     * Compose reply (placeholder)
     */
    composeReply(emailId) {
        this.showNotification('info', 'Compose Reply', 'Manual reply composition would be implemented here.');
    }
}

// Global instance
let emailManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    emailManager = new EmailManagerPro();
});

// Make emailManager available globally for button clicks
window.emailManager = emailManager; 