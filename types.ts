
export type Framework = 'FastAPI' | 'Django' | 'Firebase';

export interface CodeFile {
  path: string;
  content: string;
}

export interface GeneratedCode {
  files: CodeFile[];
  explanation: string;
  dependencies: string[];
  setupSteps: string[];
}

export interface AppState {
  prompt: string;
  framework: Framework;
  isGenerating: boolean;
  result: GeneratedCode | null;
  error: string | null;
}
