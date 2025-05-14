const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  // Validate API key
  if (!process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY) {
    throw new Error('Google Gemini API key is not configured');
  }
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Model configuration
  const MODEL_CONFIG = {
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  };
  
  // Initialize model with configuration
  const model = genAI.getGenerativeModel(MODEL_CONFIG);
  
  // Create chat session with error handling
  export const createChatSession = () => {
    try {
      return model.startChat({
        generationConfig: MODEL_CONFIG.generationConfig,
        history: [],
      });
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw new Error('Failed to initialize AI chat session');
    }
  };
  
  // Export a singleton instance
  export const chatSession = createChatSession();
  