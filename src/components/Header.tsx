import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative z-20 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
            Genius AI Summarizer
          </h1>
        </div>
        <p className="text-center mt-2 text-gray-300 font-light">
          Transform lengthy text into concise insights with AI-powered precision
        </p>
      </div>
    </header>
  );
};

export default Header;