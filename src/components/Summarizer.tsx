import React, { useState } from 'react';
import { Send, Loader2, Languages, FileText, Copy, CheckCircle } from 'lucide-react';
import Lottie from 'lottie-react';
import axios from 'axios';

const Summarizer: React.FC = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ];

  // Simple loading animation data (inline since we can't use external files)
  const loadingAnimation = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 120,
    w: 200,
    h: 200,
    nm: "Loading",
    ddd: 0,
    assets: [],
    layers: [{
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 120, s: [360] }] },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [{
          d: 1,
          ty: "el",
          s: { a: 0, k: [80, 80] },
          p: { a: 0, k: [0, 0] }
        }, {
          ty: "st",
          c: { a: 0, k: [0.7, 0.4, 1, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 8 }
        }, {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 }
        }]
      }],
      ip: 0,
      op: 120,
      st: 0
    }]
  };

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      // In a real implementation, this would call your FastAPI backend
      const response = await axios.post('/api/summarize', {
        text: text.trim(),
        lang: language
      });

      setSummary(response.data.summary);
    } catch (err) {
      // Fallback simulation for demo purposes
      setError('API is not available in demo mode. Here\'s a simulated summary:');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const words = text.trim().split(' ');
      const summaryLength = Math.max(Math.floor(words.length * 0.3), 10);
      const simulatedSummary = words.slice(0, summaryLength).join(' ') + '...';
      
      setSummary(`[DEMO] ${simulatedSummary}`);
      setError('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSummarize();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-semibold text-white">Input Text</h2>
        </div>

        <div className="space-y-6">
          {/* Language Selector */}
          <div className="flex items-center space-x-4">
            <Languages className="w-5 h-5 text-purple-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Text Input */}
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Paste your text here to summarize... (Ctrl/Cmd + Enter to summarize)"
              className="w-full h-48 bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-400">
              {text.length} characters
            </div>
          </div>

          {/* Summarize Button */}
          <button
            onClick={handleSummarize}
            disabled={isLoading || !text.trim()}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Summarize</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Animation */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto">
                <Lottie animationData={loadingAnimation} loop={true} />
              </div>
              <p className="text-purple-300 font-medium">AI is processing your text...</p>
              <div className="flex space-x-1 justify-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Summary Result */}
      {summary && (
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Summary</span>
            </h2>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-200"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-300">Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-600/30">
            <p className="text-gray-100 leading-relaxed text-lg">{summary}</p>
          </div>

          <div className="mt-4 text-sm text-gray-400 text-center">
            Summary generated in {language !== 'en' ? `${languages.find(l => l.code === language)?.name}` : 'English'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Summarizer;