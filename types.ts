
export type Language = 'he' | 'en';

export interface Patient {
  name: string;
  age: string;
  photo?: string;
}

export interface QuestionOption {
  value: string;
  label: Record<Language, string>;
}

export type QuestionType = 'choice' | 'scale' | 'number' | 'text' | 'multi-choice' | 'boolean-followup';

export interface Question {
  id: string;
  section: string;
  type: QuestionType;
  title: Record<Language, string>;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  placeholder?: Record<Language, string>;
  dependsOn?: {
    id: string;
    value: any;
  };
}

export interface QuestionnaireResponse {
  [key: string]: any;
  timestamp: string;
  recommendation?: string;
}
