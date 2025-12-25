
import { GoogleGenAI } from "@google/genai";
import { QuestionnaireResponse, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePatientState = async (responses: QuestionnaireResponse[], lang: Language) => {
  const latestResponse = responses[0]; // Assuming latest is first in the array
  
  const prompt = `
    Analyze this daily monitoring report for an Alzheimer's patient from the perspective of a psychogeriatrician.
    The primary goal is to identify "Turning Points" in the medication cycle or sharp behavioral deteriorations.
    
    Current Data: ${JSON.stringify(latestResponse)}
    History (previous sessions): ${JSON.stringify(responses.slice(1, 4))}
    
    The family provides this data to know if they need to change medications, expedite a doctor appointment, or initiate a video call.
    
    Respond in ${lang === 'he' ? 'Hebrew' : 'English'}.
    Include:
    1. A concise status summary focused on behavioral changes and vital signs.
    2. Identification of critical red flags (e.g., physical aggression, refusal to eat/drink, new side effects like tremors).
    3. Stage 2/3 Action Recommendation: 
       - If stable: Recommend "Daily Monitoring".
       - If subtle changes: Recommend "Professional Consultation" (message in app).
       - If critical: Recommend "Expedite Appointment" and "Video Call".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert psychogeriatrician specializing in dementia 'Turning Points'. You help families understand if a medication cycle is ending or if a crisis is emerging based on daily behavioral and physical data.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return lang === 'he' ? "לא ניתן היה לבצע ניתוח מצב כרגע. אנא פנה לרופא אם יש ספק." : "Could not perform analysis at this time. Please contact a doctor if in doubt.";
  }
};
