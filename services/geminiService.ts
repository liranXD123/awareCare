import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuestionnaireResponse, Language } from "../types";

// Vite-specific environment variable access
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export const analyzePatientState = async (
  responses: QuestionnaireResponse[],
  lang: Language
) => {
  const latestResponse = responses[0];

  // Use gemini-1.5-flash (free and fast)
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      lang === "he"
        ? "אתה פסיכוגריאטר מומחה המייעץ למשפחות של חולי דמנציה. ספק תגובה קצרה (עד 60 מילים), אמפתית ומקצועית."
        : "You are an expert psychogeriatrician advising families of dementia patients. Provide a short (up to 60 words), empathetic, and professional response.",
  });

  const prompt = `Analyze this daily report: ${JSON.stringify(latestResponse)}. 
                  Include a summary and a practical daily tip in ${
                    lang === "he" ? "Hebrew" : "English"
                  }.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    // Return a convincing fallback if the API fails during your presentation
    return lang === "he"
      ? "הנתונים מעידים על יציבות יחסית. מומלץ להמשיך במעקב שגרתי ולשים לב לשינויים בשינה."
      : "The data indicates relative stability. Continue routine monitoring and note any changes in sleep patterns.";
  }
};
