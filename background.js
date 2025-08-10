// Background service worker
chrome.runtime.onInstalled.addListener(() => {
    console.log('Genius AI Summarizer extension installed');
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openPopup') {
        // Open the extension popup
        chrome.action.openPopup();
    }
    
    if (request.action === 'summarizeCurrentPage') {
        // This could be used for additional functionality
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'extractContent'
                });
            }
        });
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // This will open the popup automatically
    chrome.action.openPopup();
});

// Optional: Add context menu for right-click summarization
chrome.contextMenus.create({
    id: "summarizePage",
    title: "Summarize this page with Genius AI",
    contexts: ["page"]
});

chrome.contextMenus.create({
    id: "summarizeSelection",
    title: "Summarize selected text",
    contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarizePage") {
        chrome.action.openPopup();
    } else if (info.menuItemId === "summarizeSelection") {
        // Handle selected text summarization
        chrome.tabs.sendMessage(tab.id, {
            action: 'summarizeSelection',
            selectedText: info.selectionText
        });
    }
});