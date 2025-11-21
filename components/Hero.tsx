import React from 'react';
import { CloudDownload } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center mb-10 pt-10">
      <div className="inline-flex items-center justify-center p-3 bg-brand-card rounded-full border border-gray-800 mb-4 shadow-lg shadow-brand-pink/10">
        <CloudDownload className="w-8 h-8 text-brand-cyan mr-2" />
        <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-pink">
          TikBulk AI
        </span>
      </div>
      <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 tracking-tight">
        Bulk Video <span className="text-brand-pink">Manager</span>
      </h1>
      <p className="text-gray-400 max-w-2xl mx-auto text-lg">
        Paste a messy list of links. Gemini AI extracts the URLs, names them, and prepares your queue.
      </p>
    </div>
  );
};