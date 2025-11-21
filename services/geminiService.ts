
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiParseResponse } from "../types";

export const parseInputWithGemini = async (inputText: string): Promise<GeminiParseResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze the following text. It contains a mix of random text and multiple TikTok video URLs. 
    1. Extract all valid TikTok URLs (including vm.tiktok.com short links, vt.tiktok.com, and tiktok.com/@user/video links).
    2. Return a JSON object with a single array 'urls'.
    3. Do not invent filenames, just extract the links.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: prompt }] },
        { role: "user", parts: [{ text: `Input text to parse: \n"${inputText}"` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urls: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return { urls: [] };
    
    return JSON.parse(text) as GeminiParseResponse;
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    throw new Error("Failed to parse links with AI.");
  }
};
