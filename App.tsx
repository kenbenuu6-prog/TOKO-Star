
import React, { useState, useCallback } from 'react';
import { Hero } from './components/Hero';
import { InputArea } from './components/InputArea';
import { VideoQueue } from './components/VideoQueue';
import { VideoItem, VideoQuality } from './types';
import { parseInputWithGemini } from './services/geminiService';
import { fetchTikTokMetadata, downloadVideoBlob, sanitizeFilename } from './services/tiktokService';
import { Info } from 'lucide-react';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [queue, setQueue] = useState<VideoItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Helper to update a specific item in the queue
  const updateItem = (id: string, updates: Partial<VideoItem>) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  // The core logic to process a single video item
  const processVideoItem = async (item: VideoItem, quality: VideoQuality) => {
    try {
      // Step 1: Fetch Metadata
      updateItem(item.id, { status: 'fetching_info' });
      
      // We pass the quality setting here
      const metadata = await fetchTikTokMetadata(item.originalUrl, quality);
      
      // Use the original title from metadata
      const cleanTitle = sanitizeFilename(metadata.title);
      
      updateItem(item.id, { 
        title: metadata.title, // Display full title in UI
        filename: cleanTitle,  // Use sanitized title for filename
        downloadUrl: metadata.playUrl,
        coverUrl: metadata.coverUrl,
        status: 'downloading'
      });

      // Step 2: Download Blob
      await downloadVideoBlob(metadata.playUrl, cleanTitle);
      
      updateItem(item.id, { status: 'success' });

    } catch (err) {
      console.error(`Error processing ${item.originalUrl}:`, err);
      updateItem(item.id, { 
        status: 'error', 
        errorMsg: err instanceof Error ? err.message : 'Download failed' 
      });
    }
  };

  const handleProcess = useCallback(async (text: string, quality: VideoQuality) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // 1. Use Gemini to extract URLs from the text
      const result = await parseInputWithGemini(text);
      
      if (!result.urls || result.urls.length === 0) {
        setError("No valid TikTok links found in the provided text.");
        setIsProcessing(false);
        return;
      }

      // 2. Create queue items
      const newItems: VideoItem[] = result.urls.map((url) => ({
        id: crypto.randomUUID(),
        originalUrl: url,
        filename: 'pending...',
        status: 'pending',
      }));

      // Add to queue immediately so user sees them
      setQueue((prev) => [...newItems, ...prev]);
      
      // 3. Process items with fixed concurrency limit
      const itemsToProcess = [...newItems];
      const activeWorkers = [];
      // We hardcode concurrency to 3 to allow speed but prevent browser blocking
      const CONCURRENCY_LIMIT = 3; 

      // Worker function: pulls items from the shared list until empty
      const worker = async () => {
        while (itemsToProcess.length > 0) {
          const item = itemsToProcess.shift();
          if (item) {
            await processVideoItem(item, quality);
          }
        }
      };

      // Start workers
      const actualConcurrency = Math.min(CONCURRENCY_LIMIT, itemsToProcess.length);
      for (let i = 0; i < actualConcurrency; i++) {
        activeWorkers.push(worker());
      }

      await Promise.all(activeWorkers);
      setIsProcessing(false);

    } catch (err) {
      console.error(err);
      setError("Failed to parse input. Please try again.");
      setIsProcessing(false);
    }
  }, []);

  const handleRetry = (id: string) => {
    const item = queue.find(q => q.id === id);
    if (item) {
      processVideoItem(item, 'highest');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-20">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <Hero />
        
        {error && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center text-red-400">
            <Info className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <InputArea onProcess={handleProcess} isProcessing={isProcessing} />
        
        <div className="max-w-3xl mx-auto mt-4 text-center">
           <p className="text-xs text-gray-500">
             Note: Allow "Multiple File Downloads" in your browser permissions for bulk downloading to work seamlessly.
           </p>
        </div>

        <VideoQueue items={queue} onRetry={handleRetry} />
        
        {!process.env.API_KEY && (
           <div className="fixed bottom-0 left-0 w-full bg-red-600 text-white text-center p-2 font-bold z-50">
             CRITICAL: API_KEY is missing in environment variables.
           </div>
        )}
      </div>
    </div>
  );
}
