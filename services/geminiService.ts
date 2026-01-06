
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCode } from "../types";

export const generateFastAPICode = async (userPrompt: string): Promise<GeneratedCode> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a full-stack FastAPI Python architectural blueprint based on this request: ${userPrompt}. 
    
    The response must include:
    1. A complete project structure using SQLAlchemy for ORM and Alembic for database migrations.
    2. Multiple files (e.g., main.py, models.py, database.py, alembic.ini, and a sample migration env.py if necessary).
    3. A GitHub Actions CI/CD pipeline in .github/workflows/main.yml with linting and pytest.
    4. Comprehensive setup steps including 'alembic init', 'alembic revision --autogenerate', and 'alembic upgrade head'.`,
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
                path: { type: Type.STRING, description: "The relative path of the file (e.g., app/models.py)" },
                content: { type: Type.STRING, description: "The full source code or configuration of the file" }
              },
              required: ["path", "content"]
            }
          },
          explanation: { type: Type.STRING, description: "A detailed explanation of the architecture, database schema, and migration strategy" },
          dependencies: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Required pip packages including fastapi, sqlalchemy, alembic, psycopg2-binary, pytest, etc."
          },
          setupSteps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Terminal commands for environment setup, database initialization, and running the app"
          }
        },
        required: ["files", "explanation", "dependencies", "setupSteps"],
      },
      systemInstruction: "You are a world-class Senior Python Architect and DevOps Engineer. You specialize in FastAPI, SQLAlchemy (2.0+), Alembic, and modern CI/CD practices. Your code is clean, type-hinted, modular, and adheres to production-grade security standards. You provide full file contents that are ready to be saved and executed.",
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
