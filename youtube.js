// Enhanced YouTube content extraction
class YouTubeSummarizer {
    constructor() {
        this.init();
    }

    init() {
        // Wait for YouTube to load
        this.waitForYouTubeLoad();
        
        // Listen for navigation changes (YouTube is a SPA)
        this.observeNavigation();
    }

    waitForYouTubeLoad() {
        const checkForVideo = () => {
            if (this.isVideoPage() && document.querySelector('h1.ytd-video-primary-info-renderer')) {
                this.addYouTubeFeatures();
            } else {
                setTimeout(checkForVideo, 1000);
            }
        };
        checkForVideo();
    }

    observeNavigation() {
        // YouTube uses pushState for navigation
        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(() => {
                if (this.isVideoPage()) {
                    this.addYouTubeFeatures();
                }
            }, 1000);
        }.bind(this);

        // Also listen for popstate
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                if (this.isVideoPage()) {
                    this.addYouTubeFeatures();
                }
            }, 1000);
        });
    }

    isVideoPage() {
        return window.location.pathname === '/watch';
    }

    addYouTubeFeatures() {
        // Remove existing button if present
        const existingBtn = document.querySelector('.genius-youtube-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        // Add summarize button to YouTube interface
        this.addSummarizeButton();
        
        // Add transcript extraction capability
        this.setupTranscriptExtraction();
    }

    addSummarizeButton() {
        const targetContainer = document.querySelector('#above-the-fold') || 
                              document.querySelector('#primary-inner') ||
                              document.querySelector('#info');

        if (!targetContainer) return;

        const summaryBtn = document.createElement('div');
        summaryBtn.className = 'genius-youtube-btn';
        summaryBtn.innerHTML = `
            <button class="yt-summary-btn">
                🧠 Summarize Video
            </button>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .genius-youtube-btn {
                margin: 12px 0;
                padding: 0;
            }
            
            .yt-summary-btn {
                background: linear-gradient(45deg, #8b5cf6, #ec4899);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
            }
            
            .yt-summary-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
            }
            
            .yt-summary-btn:active {
                transform: translateY(0);
            }
        `;
        
        if (!document.querySelector('#genius-yt-styles')) {
            style.id = 'genius-yt-styles';
            document.head.appendChild(style);
        }

        summaryBtn.querySelector('.yt-summary-btn').addEventListener('click', () => {
            chrome.runtime.sendMessage({action: 'openPopup'});
        });

        targetContainer.insertBefore(summaryBtn, targetContainer.firstChild);
    }

    setupTranscriptExtraction() {
        // This would be used to extract video transcripts if available
        // YouTube's transcript API is complex, so this is a placeholder
        // for future enhancement
    }

    extractVideoMetadata() {
        const metadata = {};
        
        // Video title
        const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer');
        if (titleElement) {
            metadata.title = titleElement.textContent.trim();
        }

        // Channel name
        const channelElement = document.querySelector('#owner-name a, #channel-name a');
        if (channelElement) {
            metadata.channel = channelElement.textContent.trim();
        }

        // View count
        const viewElement = document.querySelector('#count .view-count, .view-count');
        if (viewElement) {
            metadata.views = viewElement.textContent.trim();
        }

        // Upload date
        const dateElement = document.querySelector('#date span, #info-strings yt-formatted-string');
        if (dateElement) {
            metadata.uploadDate = dateElement.textContent.trim();
        }

        // Description
        const descElement = document.querySelector('#description-text, .content-description');
        if (descElement) {
            metadata.description = descElement.textContent.trim();
        }

        return metadata;
    }

    async extractComments(limit = 10) {
        // Scroll to load comments
        const commentsSection = document.querySelector('#comments');
        if (commentsSection) {
            commentsSection.scrollIntoView();
            
            // Wait for comments to load
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const commentElements = document.querySelectorAll('#content-text');
            const comments = Array.from(commentElements)
                .slice(0, limit)
                .map(el => el.textContent.trim())
                .filter(text => text.length > 10);
                
            return comments;
        }
        
        return [];
    }
}

// Initialize YouTube summarizer
if (window.location.hostname.includes('youtube.com')) {
    const ytSummarizer = new YouTubeSummarizer();
    
    // Make it available globally for the popup to use
    window.ytSummarizer = ytSummarizer;
}