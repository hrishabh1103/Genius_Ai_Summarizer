import React, { useState } from 'react';
import Header from './components/Header';
import Summarizer from './components/Summarizer';
// ek baar iska function chk kar lena 

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Summarizer />
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-gray-400">
        <p>&copy; 2025 Genius AI Summarizer. Powered by Advanced AI Technology.</p>
      </footer>
    </div>
  );
}

export default App;
