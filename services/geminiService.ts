import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. Gemini features will be mocked.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (name: string, category: string, keywords: string) => {
  const client = getClient();
  
  if (!client) {
    // Mock response if no API key
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`[AI MOCK] Experience the ultimate quality with the ${name}. Perfect for ${category} enthusiasts. Key features include: ${keywords}. Designed for modern living.`);
      }, 1000);
    });
  }

  try {
    const prompt = `Write a compelling, SEO-friendly ecommerce product description (max 100 words) for a product named "${name}" in the category "${category}". Keywords to include: ${keywords}. Tone: Professional and persuasive.`;
    
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate description. Please try again.";
  }
};
