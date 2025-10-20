export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  details?: string[];
}

export interface ApiStatus {
  diabetes: boolean;
  insurance: boolean;
  lastChecked: Date | null;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

export interface PredictionHistory {
  id: string;
  timestamp: Date;
  type: 'diabetes' | 'insurance';
  input: any;
  result: any;
}

// Common form field types
export interface FormField {
  name: string;
  label: string;
  type: 'number' | 'select' | 'radio';
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  helpText?: string;
}

// Result display types
export interface PredictionResult {
  success: boolean;
  prediction: any;
  confidence: number;
  riskFactors?: string[];
  recommendations?: string[];
  timestamp: Date;
}