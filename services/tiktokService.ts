
import { VideoQuality } from "../types";

export interface TikTokMetadata {
  title: string;
  playUrl: string;
  coverUrl: string;
  id: string;
}

// Using a public API (TikWM) to resolve video details without a backend
export const fetchTikTokMetadata = async (url: string, quality: VideoQuality): Promise<TikTokMetadata> => {
  try {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.code === 0 && data.data) {
      let downloadUrl = data.data.play; // Default to standard/720p

      // If user wants HD or Highest, try to find the HD link
      if (quality === '1080p' || quality === 'highest') {
        if (data.data.hdplay && data.data.hdplay !== data.data.play) {
           downloadUrl = data.data.hdplay;
        }
      }

      return {
        title: data.data.title || `tiktok_${data.data.id}`, // Use the original caption/title
        playUrl: downloadUrl, 
        coverUrl: data.data.cover,
        id: data.data.id
      };
    } else {
      throw new Error("Video not found or private");
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
    throw error;
  }
};

export const downloadVideoBlob = async (url: string, filename: string): Promise<void> => {
  try {
    // We fetch the video data as a blob
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor to trigger download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = `${filename}.mp4`;
    
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download blob error:", error);
    throw error;
  }
};

export const sanitizeFilename = (title: string): string => {
  // Remove characters that are illegal in filenames on Windows/Mac/Linux
  // illegal: < > : " / \ | ? *
  let clean = title.replace(/[<>:"/\\|?*]/g, '');
  
  // Truncate to prevent filesystem errors (max 100 chars is usually safe)
  if (clean.length > 100) {
    clean = clean.substring(0, 100);
  }
  
  return clean.trim();
};
