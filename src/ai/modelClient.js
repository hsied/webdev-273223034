import { GoogleGenAI } from '@google/genai';

const ALLOWED_TAGS = ["workshop", "social", "talk", "hackathon", "career", "sports", "general"];

export async function generateEventDraft(rawIdea, apiKey = process.env.GEMINI_API_KEY) {
  // Fallback if API key is missing
  if (!apiKey) {
    return getFallbackDraft(rawIdea, "Missing Gemini API Key");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Create an AbortController for a strict 4-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Turn this rough event idea into a JSON object with keys "title" (string, max 100 chars), "summary" (string, max 300 chars), and "tags" (array of strings chosen strictly from this list: ["workshop", "social", "talk", "hackathon", "career", "sports", "general"]). Rough idea: "${rawIdea}"`,
      config: {
        responseMimeType: "application/json",
      }
    }, { signal: controller.signal });

    clearTimeout(timeoutId);

    const text = response.text();
    const parsed = JSON.parse(text);

    // Validate output against guardrails
    const title = typeof parsed.title === 'string' ? parsed.title.slice(0, 100) : rawIdea.slice(0, 80);
    const summary = typeof parsed.summary === 'string' ? parsed.summary.slice(0, 300) : "";
    
    let tags = Array.isArray(parsed.tags) 
      ? parsed.tags.filter(t => ALLOWED_TAGS.includes(t)) 
      : ["general"];
      
    if (tags.length === 0) tags = ["general"];

    return { title, summary, tags, fallbackUsed: false };

  } catch (error) {
    clearTimeout(timeoutId);
    return getFallbackDraft(rawIdea, error.message);
  }
}

function getFallbackDraft(rawIdea, reason) {
  return {
    title: rawIdea ? rawIdea.slice(0, 80) : "Untitled Event",
    summary: "",
    tags: ["general"],
    fallbackUsed: true,
    fallbackReason: reason
  };
}
