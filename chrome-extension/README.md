# 🧠 Genius AI Summarizer - Chrome Extension

A powerful Chrome extension that automatically summarizes webpage content and YouTube videos using advanced AI algorithms.

## 🚀 Installation Instructions

### Method 1: Load Unpacked Extension (Developer Mode)

1. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or click the three dots menu → More tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Select the `chrome-extension` folder from this project
   - The extension should now appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Genius AI Summarizer" and click the pin icon
   - The extension icon will now appear in your toolbar

## ✨ Features

- **Smart Content Extraction**: Automatically identifies and extracts main content from webpages
- **YouTube Video Summarization**: Analyzes video titles, descriptions, and comments
- **Multiple Summary Lengths**: Choose between short, medium, or long summaries
- **Multi-language Support**: Generate summaries in 10+ languages
- **Beautiful UI**: Modern dark theme with smooth animations
- **Keyboard Shortcuts**: Quick access with Ctrl+Shift+S (Cmd+Shift+S on Mac)
- **Context Menu Integration**: Right-click to summarize pages or selected text
- **Floating Action Button**: Convenient access button on every page

## 🎯 How to Use

### Basic Usage
1. Navigate to any webpage you want to summarize
2. Click the extension icon in the Chrome toolbar
3. Select your preferred summary length and language
4. Click "Summarize Page" and wait for the AI to process
5. Copy or save your generated summary

### YouTube Videos
1. Open any YouTube video
2. Click the extension icon or the "🧠 Summarize Video" button that appears
3. The extension will automatically analyze the video content
4. Get a comprehensive summary including video description and top comments

### Alternative Access Methods
- **Keyboard shortcut**: Press `Ctrl+Shift+S` (or `Cmd+Shift+S` on Mac)
- **Right-click menu**: Right-click on any page → "Summarize this page with Genius AI"
- **Floating button**: Click the brain icon that appears on pages
- **Selected text**: Highlight text and right-click → "Summarize selected text"

## 🔧 Technical Details

### File Structure
```
chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── background.js          # Background service worker
├── content.js             # Content script for all pages
├── content.css            # Styles for content elements
├── youtube.js             # YouTube-specific functionality
├── summary-widget.html    # Standalone summary widget
├── icons/                 # Extension icons
└── README.md              # This file
```

### Permissions Explained
- **activeTab**: Access current webpage content for summarization
- **storage**: Save user preferences (language, summary length)
- **scripting**: Inject content extraction scripts into webpages
- **contextMenus**: Add right-click menu options
- **host_permissions**: Access content from all websites

## 🎨 Customization

### Modifying the AI Algorithm
The summarization algorithm is located in `popup.js` in the `generateSummary()` function. You can:
- Adjust sentence scoring weights
- Modify summary length calculations
- Add custom content filtering
- Integrate with external AI APIs (OpenAI, Hugging Face, etc.)

### Styling Changes
- **Popup styles**: Edit the `<style>` section in `popup.html`
- **Content elements**: Modify `content.css`
- **YouTube integration**: Update styles in `youtube.js`

### Adding New Languages
Add new language options in the `languages` array in `popup.html`:
```html
<option value="new_lang_code">New Language</option>
```

## 🔒 Privacy & Security

- **Local Processing**: All summarization happens locally in your browser
- **No Data Collection**: Extension doesn't collect or store personal information
- **No External APIs**: Doesn't send your content to external servers by default
- **Minimal Permissions**: Only requests necessary permissions for functionality

## 🐛 Troubleshooting

### Extension Not Loading
1. Make sure Developer mode is enabled
2. Check the console for error messages at `chrome://extensions/`
3. Try reloading the extension

### Popup Not Opening
1. Refresh the current webpage
2. Check if the extension is pinned to the toolbar
3. Try right-clicking on the extension icon

### No Summary Generated
1. Ensure the page has sufficient text content
2. Check if the page is fully loaded
3. Try refreshing and waiting a few seconds

### YouTube Features Not Working
1. Make sure you're on a YouTube video page (`/watch`)
2. Wait for the page to fully load
3. The summarize button should appear automatically

## 🚀 Future Enhancements

- Integration with advanced AI models (GPT, Claude, etc.)
- Summary history and bookmarking
- Export options (PDF, Word, etc.)
- Team sharing capabilities
- Enhanced YouTube transcript analysis
- Mobile browser support

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with the extension
5. Submit a pull request

## 📞 Support

For issues, feature requests, or questions:
- Check this README for troubleshooting steps
- Review the browser console for error messages
- Ensure all files are properly loaded in the extension

---

**Transform your web browsing experience with AI-powered summarization!** 🧠✨