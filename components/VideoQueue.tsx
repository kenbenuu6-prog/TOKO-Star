
import React from 'react';
import { VideoItem } from '../types';
import { FileVideo, CheckCircle, AlertCircle, Loader2, Download, ExternalLink, Film } from 'lucide-react';

interface VideoQueueProps {
  items: VideoItem[];
  onRetry: (id: string) => void;
}

export const VideoQueue: React.FC<VideoQueueProps> = ({ items, onRetry }) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <FileVideo className="w-5 h-5 mr-2 text-brand-pink" />
          Download Queue ({items.length})
        </h2>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-center justify-between p-4 bg-brand-card border border-gray-800 rounded-xl hover:border-gray-600 transition-all hover:bg-gray-800/50"
          >
            <div className="flex items-center space-x-4 overflow-hidden w-full">
              {/* Icon / Status Indicator */}
              <div className={`p-3 rounded-lg flex-shrink-0 ${
                item.status === 'success' ? 'bg-green-500/10 text-green-500' :
                item.status === 'error' ? 'bg-red-500/10 text-red-500' :
                'bg-brand-cyan/10 text-brand-cyan'
              }`}>
                {(item.status === 'pending' || item.status === 'fetching_info') && <Loader2 className="w-5 h-5 animate-spin" />}
                {item.status === 'downloading' && <Download className="w-5 h-5 animate-bounce" />}
                {item.status === 'success' && <CheckCircle className="w-5 h-5" />}
                {item.status === 'error' && <AlertCircle className="w-5 h-5" />}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {item.title || item.filename || "Waiting for details..."}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                  <a 
                    href={item.originalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-brand-cyan truncate max-w-[200px] flex items-center"
                  >
                    {item.originalUrl}
                    <ExternalLink className="w-3 h-3 ml-1 inline" />
                  </a>
                  <span className="text-gray-700">|</span>
                  <span className={`
                    ${item.status === 'error' ? 'text-red-400' : ''}
                    ${item.status === 'success' ? 'text-green-400' : ''}
                  `}>
                    {item.status === 'pending' && 'Queued'}
                    {item.status === 'fetching_info' && 'Fetching Metadata...'}
                    {item.status === 'downloading' && 'Downloading to PC...'}
                    {item.status === 'success' && 'Downloaded'}
                    {item.status === 'error' && (item.errorMsg || 'Failed')}
                  </span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="flex items-center ml-4 flex-shrink-0">
               {item.status === 'error' && (
                <button
                  onClick={() => onRetry(item.id)}
                  className="flex items-center px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors text-xs font-bold"
                >
                  Retry
                </button>
               )}
               {item.status === 'success' && (
                 <div className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs font-mono">
                   .MP4
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
