
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCode, Framework } from "../types";

export const generateBackendCode = async (userPrompt: string, framework: Framework): Promise<GeneratedCode> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const frameworkInstructions = framework === 'Django' 
    ? "Generate a Django project structure including settings.py, urls.py, models.py, and views.py. Use Django's built-in ORM and migration system."
    : "Generate a FastAPI project structure using SQLAlchemy (2.0+) for ORM and Alembic for migrations.";

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a full-stack Python ${framework} architectural blueprint based on this request: ${userPrompt}. 
    
    The response must include:
    1. ${frameworkInstructions}
    2. Multiple files structured logically (e.g., for Django: project settings, app models/views; for FastAPI: main.py, models.py, database.py).
    3. A production-ready Dockerfile and a docker-compose.yml file. 
       - The Dockerfile should use a multi-stage build or a slim Python image and support environment variables.
       - The docker-compose.yml should include the application service and a PostgreSQL database service, using environment variables for sensitive data.
    4. A .env.example file containing all required environment variables (e.g., DATABASE_URL, POSTGRES_USER, POSTGRES_PASSWORD, SECRET_KEY).
    5. A GitHub Actions CI/CD pipeline in .github/workflows/main.yml with linting and pytest.
    6. Comprehensive setup steps (including virtualenv, copying the .env file, migrations, and docker-compose commands).`,
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
            description: "Required pip packages"
          },
          setupSteps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Terminal commands to run the app"
          }
        },
        required: ["files", "explanation", "dependencies", "setupSteps"],
      },
      systemInstruction: `You are a world-class Senior ${framework} and DevOps Architect. You write clean, type-hinted, modular code. You follow the latest best practices for ${framework} and Containerization (Docker) including security, scalability, and maintainability. Always ensure configurations include health checks, non-root users, and secure environment variable management (using .env).`,
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
