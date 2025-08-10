document.addEventListener('DOMContentLoaded', async function() {
    const summarizeBtn = document.getElementById('summarizeBtn');
    const resultDiv = document.getElementById('result');
    const pageInfo = document.getElementById('pageInfo');
    const pageTitle = document.getElementById('pageTitle');
    const summaryLength = document.getElementById('summaryLength');
    const language = document.getElementById('language');

    let currentTab = null;
    let isYouTube = false;

    // Get current tab information
    try {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        currentTab = tabs[0];
        
        if (currentTab) {
            const url = new URL(currentTab.url);
            isYouTube = url.hostname.includes('youtube.com');
            
            // Update page info
            pageTitle.textContent = currentTab.title || 'Unknown Page';
            
            if (isYouTube) {
                pageInfo.innerHTML = `
                    <h3>🎥 YouTube Video <span class="youtube-indicator">YouTube</span></h3>
                    <p>${currentTab.title}</p>
                `;
                summarizeBtn.innerHTML = '🎥 Summarize Video';
            } else {
                pageInfo.innerHTML = `
                    <h3>📄 Webpage</h3>
                    <p>${currentTab.title}</p>
                `;
            }
        }
    } catch (error) {
        console.error('Error getting tab info:', error);
        pageTitle.textContent = 'Unable to access page information';
    }

    // Summarize button click handler
    summarizeBtn.addEventListener('click', async function() {
        if (!currentTab) {
            showResult('Unable to access current page. Please refresh and try again.', 'error');
            return;
        }

        // Show loading state
        summarizeBtn.disabled = true;
        summarizeBtn.innerHTML = isYouTube ? '🎥 Processing Video...' : '📄 Processing Page...';
        showLoading();

        try {
            let content = '';
            
            if (isYouTube) {
                // Get YouTube video content
                content = await getYouTubeContent(currentTab);
            } else {
                // Get webpage content
                content = await getWebpageContent(currentTab);
            }

            if (!content || content.trim().length < 100) {
                throw new Error('Not enough content found to summarize. The page might be loading or have restricted access.');
            }

            // Generate summary using AI
            const summary = await generateSummary(content, {
                length: summaryLength.value,
                language: language.value,
                isVideo: isYouTube
            });

            showResult(summary, 'success');

        } catch (error) {
            console.error('Summarization error:', error);
            showResult(error.message || 'Failed to summarize content. Please try again.', 'error');
        } finally {
            // Reset button
            summarizeBtn.disabled = false;
            summarizeBtn.innerHTML = isYouTube ? '🎥 Summarize Video' : '✨ Summarize Page';
        }
    });

    async function getWebpageContent(tab) {
        return new Promise((resolve, reject) => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: extractWebpageContent
            }, (results) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                
                if (results && results[0] && results[0].result) {
                    resolve(results[0].result);
                } else {
                    reject(new Error('No content extracted from webpage'));
                }
            });
        });
    }

    async function getYouTubeContent(tab) {
        return new Promise((resolve, reject) => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: extractYouTubeContent
            }, (results) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                
                if (results && results[0] && results[0].result) {
                    resolve(results[0].result);
                } else {
                    reject(new Error('No content extracted from YouTube video'));
                }
            });
        });
    }

    async function generateSummary(content, options) {
        // This is a simplified AI summarization algorithm
        // In a real implementation, you would call an AI API like OpenAI, Hugging Face, etc.
        
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
        
        if (sentences.length === 0) {
            throw new Error('No meaningful sentences found in the content');
        }

        let summaryLength;
        switch (options.length) {
            case 'short':
                summaryLength = Math.min(2, sentences.length);
                break;
            case 'long':
                summaryLength = Math.min(Math.ceil(sentences.length * 0.4), sentences.length);
                break;
            default: // medium
                summaryLength = Math.min(Math.ceil(sentences.length * 0.2), sentences.length);
        }

        // Simple extractive summarization - select most relevant sentences
        const selectedSentences = sentences
            .map(sentence => ({
                text: sentence.trim(),
                score: calculateSentenceScore(sentence, content)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, summaryLength)
            .map(item => item.text);

        let summary = selectedSentences.join('. ') + '.';
        
        // Add context for video summaries
        if (options.isVideo) {
            summary = `This YouTube video discusses: ${summary}`;
        }

        return summary;
    }

    function calculateSentenceScore(sentence, fullContent) {
        // Simple scoring based on sentence length, position, and keyword frequency
        const words = sentence.toLowerCase().split(/\s+/);
        const contentWords = fullContent.toLowerCase().split(/\s+/);
        
        // Length score (prefer medium-length sentences)
        const lengthScore = Math.max(0, 1 - Math.abs(words.length - 15) / 15);
        
        // Keyword frequency score
        const keywordScore = words.reduce((score, word) => {
            if (word.length > 4) {
                const frequency = contentWords.filter(w => w === word).length;
                return score + (frequency / contentWords.length) * 100;
            }
            return score;
        }, 0);
        
        return lengthScore + keywordScore;
    }

    function showLoading() {
        resultDiv.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>AI is analyzing the ${isYouTube ? 'video' : 'page'} content...</p>
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    function showResult(text, type = 'success') {
        const className = type === 'error' ? 'summary-result error' : 'summary-result';
        const icon = type === 'error' ? '❌' : (isYouTube ? '🎥' : '📄');
        const title = type === 'error' ? 'Error' : (isYouTube ? 'Video Summary' : 'Page Summary');
        
        const wordCount = text.split(/\s+/).length;
        
        resultDiv.innerHTML = `
            <div class="${className}">
                <h4>${icon} ${title}</h4>
                <p>${text}</p>
                ${type !== 'error' ? `
                    <div class="word-count">${wordCount} words</div>
                    <button class="copy-btn" onclick="copyToClipboard('${text.replace(/'/g, "\\'")}')">
                        📋 Copy Summary
                    </button>
                ` : ''}
            </div>
        `;
        resultDiv.style.display = 'block';
    }

    // Make copyToClipboard available globally
    window.copyToClipboard = async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Show feedback
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ Copied!';
            copyBtn.style.background = 'rgba(16, 185, 129, 0.3)';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            }, 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };
});

// Content extraction functions (injected into page)
function extractWebpageContent() {
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style, nav, header, footer, aside, .advertisement, .ads, .sidebar');
    scripts.forEach(el => el.remove());
    
    // Try to find main content areas
    const contentSelectors = [
        'main',
        'article',
        '[role="main"]',
        '.content',
        '.main-content',
        '.post-content',
        '.entry-content',
        '#content',
        '#main'
    ];
    
    let content = '';
    
    for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            content = element.innerText || element.textContent || '';
            break;
        }
    }
    
    // Fallback to body content if no main content found
    if (!content || content.trim().length < 200) {
        content = document.body.innerText || document.body.textContent || '';
    }
    
    // Clean up the content
    content = content
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim();
    
    // Limit content length to avoid processing too much text
    if (content.length > 10000) {
        content = content.substring(0, 10000) + '...';
    }
    
    return content;
}

function extractYouTubeContent() {
    let content = '';
    
    // Get video title
    const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer, h1.title');
    if (titleElement) {
        content += titleElement.textContent + '. ';
    }
    
    // Get video description
    const descriptionElement = document.querySelector('#description-text, .content-description, #watch-description-text');
    if (descriptionElement) {
        content += descriptionElement.textContent + ' ';
    }
    
    // Get comments (first few)
    const comments = document.querySelectorAll('#content-text, .comment-text');
    if (comments.length > 0) {
        content += 'Comments: ';
        Array.from(comments).slice(0, 5).forEach(comment => {
            content += comment.textContent + ' ';
        });
    }
    
    // Clean up content
    content = content
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim();
    
    // If no content found, try alternative selectors
    if (!content || content.length < 50) {
        const fallbackSelectors = [
            '.ytd-video-secondary-info-renderer',
            '.watch-main-col',
            '#watch-description'
        ];
        
        for (const selector of fallbackSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                content = element.textContent || '';
                break;
            }
        }
    }
    
    return content;
}