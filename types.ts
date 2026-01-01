export type Language = "he" | "en";

export interface Patient {
  name: string;
  age: string;
  photo?: string;
}

export interface QuestionOption {
  value: string;
  label: Record<Language, string>;
}

export type QuestionType =
  | "choice"
  | "scale"
  | "number"
  | "text"
  | "multi-choice"
  | "boolean-followup";

export interface Question {
  id: string;
  section: string;
  type: QuestionType;
  title: Record<Language, string>;
  help: Record<Language, string>;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  placeholder?: Record<Language, string>;
  dependsOn?: {
    id: string;
    value: any;
  };
}

export interface Clinic {
  name: Record<Language, string>;
  address: Record<Language, string>;
  phone: string;
  city: string;
}

export interface QuestionnaireResponse {
  [key: string]: any;
  timestamp: string;
  userName?: string;
  userRelation?: string;
  reportReason?: string;
}
