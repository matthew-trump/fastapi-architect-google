
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
  isGenerating: boolean;
  result: GeneratedCode | null;
  error: string | null;
}
