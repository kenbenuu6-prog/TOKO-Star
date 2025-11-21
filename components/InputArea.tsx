
import React, { useState } from 'react';
import { Sparkles, DownloadCloud, Settings2 } from 'lucide-react';
import { VideoQuality } from '../types';

interface InputAreaProps {
  onProcess: (text: string, quality: VideoQuality) => void;
  isProcessing: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onProcess, isProcessing }) => {
  const [text, setText] = useState('');
  const [quality, setQuality] = useState<VideoQuality>('highest');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onProcess(text, quality);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-brand-card rounded-2xl p-1 border border-gray-800 shadow-2xl">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your TikTok links here (one per line, or mixed with text)..."
          className="w-full h-40 bg-brand-dark text-gray-200 p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 transition-all font-mono text-sm"
          disabled={isProcessing}
        />
        <div className="absolute bottom-4 right-4 flex flex-col lg:flex-row items-end lg:items-center gap-3">
          <button
            onClick={() => setText('')}
            className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-white transition-colors mr-auto lg:mr-0"
            disabled={isProcessing}
          >
            Clear
          </button>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {/* Quality Selector */}
            <div className="relative group min-w-[160px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Settings2 className="h-4 w-4 text-gray-400 group-focus-within:text-brand-cyan" />
              </div>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as VideoQuality)}
                disabled={isProcessing}
                className="appearance-none bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block w-full pl-10 pr-8 py-2.5 disabled:opacity-50"
              >
                <option value="720p">720p (Standard)</option>
                <option value="1080p">1080p (HD)</option>
                <option value="highest">Highest Quality</option>
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            {/* Process Button */}
            <button
              onClick={handleSubmit}
              disabled={isProcessing || !text.trim()}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-bold text-brand-dark transition-all transform hover:scale-105 active:scale-95 ${
                isProcessing
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-cyan to-brand-pink hover:shadow-[0_0_20px_rgba(0,242,234,0.4)]'
              }`}
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <DownloadCloud className="w-4 h-4 fill-current" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
