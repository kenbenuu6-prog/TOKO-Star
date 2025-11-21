
export type VideoQuality = '720p' | '1080p' | 'highest';

export interface VideoItem {
  id: string;
  originalUrl: string;
  title?: string;
  filename: string;
  downloadUrl?: string;
  coverUrl?: string;
  status: 'pending' | 'fetching_info' | 'downloading' | 'success' | 'error';
  errorMsg?: string;
}

export interface GeminiParseResponse {
  urls: string[];
}
