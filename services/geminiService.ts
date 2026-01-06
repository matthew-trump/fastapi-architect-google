
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCode, Framework } from "../types";

export const generateBackendCode = async (userPrompt: string, framework: Framework): Promise<GeneratedCode> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  let frameworkInstructions = "";
  let systemContext = "";

  if (framework === 'Django') {
    frameworkInstructions = "Generate a Django project structure including settings.py, urls.py, models.py, and views.py. Use Django's built-in ORM and migration system.";
    systemContext = "Senior Django and DevOps Architect.";
  } else if (framework === 'FastAPI') {
    frameworkInstructions = "Generate a FastAPI project structure using SQLAlchemy (2.0+) for ORM and Alembic for migrations.";
    systemContext = "Senior FastAPI and DevOps Architect.";
  } else if (framework === 'Firebase') {
    frameworkInstructions = "Generate a serverless Firebase architecture. Include firebaseConfig.ts (initialization), firestore.rules (security rules), and a service file (e.g., dbService.ts) with CRUD functions using the Firebase JS SDK (v10+). Include instructions for setting up the Firebase Console.";
    systemContext = "Senior Full-Stack Developer & Firebase Expert.";
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a ${framework} architectural blueprint based on this request: ${userPrompt}. 
    
    The response must include:
    1. ${frameworkInstructions}
    2. Multiple files structured logically according to best practices for ${framework}.
    ${framework === 'Firebase' ? 
      "3. A .env.example with placeholders for Firebase API keys." : 
      "3. A production-ready Dockerfile and a docker-compose.yml file with a PostgreSQL service."}
    4. A .env.example file containing all required environment variables.
    5. A GitHub Actions CI/CD pipeline in .github/workflows/main.yml.
    6. Comprehensive setup steps (including CLI commands and project initialization).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          files: {
            type: Type.ARRAY,
            description: "List of all files in the project structure",
            items: {
              type: Type.OBJECT,
              properties: {
                path: { type: Type.STRING, description: "The relative path of the file" },
                content: { type: Type.STRING, description: "The full source code or configuration of the file" }
              },
              required: ["path", "content"]
            }
          },
          explanation: { type: Type.STRING, description: "A detailed explanation of the chosen architecture" },
          dependencies: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Required packages (pip for Python, npm for Firebase)"
          },
          setupSteps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Commands to run the app or deploy"
          }
        },
        required: ["files", "explanation", "dependencies", "setupSteps"],
      },
      systemInstruction: `You are a world-class ${systemContext}. You write clean, modular, and highly secure code. You follow industry best practices for the chosen framework, prioritizing developer experience and production readiness.`,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI service");
  
  try {
    return JSON.parse(text) as GeneratedCode;
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("Invalid response format from AI");
  }
};
