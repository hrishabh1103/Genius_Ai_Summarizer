// Content script for webpage interaction
class SummaryWidget {
    constructor() {
        this.widget = null;
        this.isVisible = false;
        this.init();
    }

    init() {
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'showSummaryWidget') {
                this.showWidget(request.summary);
            } else if (request.action === 'hideSummaryWidget') {
                this.hideWidget();
            }
        });

        // Add keyboard shortcut (Ctrl+Shift+S)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.triggerSummarization();
            }
        });
    }

    triggerSummarization() {
        // Send message to background script to open popup
        chrome.runtime.sendMessage({action: 'openPopup'});
    }

    showWidget(summary) {
        if (this.widget) {
            this.hideWidget();
        }

        this.widget = document.createElement('div');
        this.widget.className = 'genius-summary-widget';
        this.widget.innerHTML = `
            <div class="widget-header">
                <h3>🧠 AI Summary</h3>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="widget-content">
                <p>${summary}</p>
                <div class="widget-actions">
                    <button class="copy-btn" onclick="navigator.clipboard.writeText('${summary.replace(/'/g, "\\'")}')">
                        📋 Copy
                    </button>
                    <button class="close-btn-text" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(this.widget);
        this.isVisible = true;

        // Auto-hide after 30 seconds
        setTimeout(() => {
            if (this.widget && this.widget.parentNode) {
                this.hideWidget();
            }
        }, 30000);
    }

    hideWidget() {
        if (this.widget && this.widget.parentNode) {
            this.widget.remove();
            this.widget = null;
            this.isVisible = false;
        }
    }
}

// Initialize the summary widget
const summaryWidget = new SummaryWidget();

// Add floating action button for easy access
function addFloatingButton() {
    const floatingBtn = document.createElement('div');
    floatingBtn.className = 'genius-floating-btn';
    floatingBtn.innerHTML = '🧠';
    floatingBtn.title = 'Summarize this page (Ctrl+Shift+S)';
    
    floatingBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({action: 'openPopup'});
    });

    document.body.appendChild(floatingBtn);
}

// Add floating button after page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFloatingButton);
} else {
    addFloatingButton();
}