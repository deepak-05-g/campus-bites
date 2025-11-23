import { GoogleGenAI } from "@google/genai";
import { MENU_ITEMS } from '../constants';

// Initialize Gemini client
// API Key is expected to be available in process.env.API_KEY
// Vite uses import.meta.env for variables
const apiKey = import.meta.env.VITE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are "CampusBot", a cheerful and helpful food assistant for the Campus Bites App.
Your tone should be fun, energetic, and concise.
The menu is strictly limited to the following items:
${JSON.stringify(MENU_ITEMS.map(item => ({ name: item.name, category: item.category, price: item.price, description: item.description, spicy: item.isSpicy })))}

If a user asks for something not on the menu, politely suggest a similar alternative from the menu.
Do not make up prices or items.
If asked for recommendations:
- Suggest "Masala Dosa" for breakfast.
- Suggest "Biryani" or "Thali" for lunch.
- Suggest "Samosa" or "Coffee" for snacks.
Keep responses short (under 50 words) unless asked for a story.
Use emojis! 🍛🥘😋
`;

export const getChatResponse = async (message: string, history: {role: 'user' | 'model', text: string}[]) => {
  if (!apiKey) {
    return "I'm currently offline (API Key missing). But the food is still real! 😋";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.text }]
        })),
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "Oops! I dropped the tray. Can you say that again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "My brain froze like a slushie! 🥶 Try again later.";
  }
};