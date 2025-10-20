export interface ApiEndpoints {
  diabetes: {
    baseUrl: string;
    predict: string;
    predictBatch: string;
    modelInfo: string;
    health: string;
  };
  insurance: {
    baseUrl: string;
    predict: string;
    predictBatch: string;
    modelInfo: string;
    health: string;
  };
}

export const apiConfig: ApiEndpoints = {
  diabetes: {
    baseUrl: process.env.NEXT_PUBLIC_DIABETES_API_URL || 'http://localhost:8001',
    predict: '/predict',
    predictBatch: '/predict-batch',
    modelInfo: '/model-info',
    health: '/',
  },
  insurance: {
    baseUrl: process.env.NEXT_PUBLIC_INSURANCE_API_URL || 'http://localhost:8002',
    predict: '/predict',
    predictBatch: '/predict-batch',
    modelInfo: '/model-info',
    health: '/',
  },
};

export const getApiUrl = (service: 'diabetes' | 'insurance', endpoint: keyof ApiEndpoints['diabetes']): string => {
  const config = apiConfig[service];
  return `${config.baseUrl}${config[endpoint]}`;
};

// Environment validation
export const validateEnvironment = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_DIABETES_API_URL) {
    console.warn('NEXT_PUBLIC_DIABETES_API_URL not set, using default: http://localhost:8001');
  }

  if (!process.env.NEXT_PUBLIC_INSURANCE_API_URL) {
    console.warn('NEXT_PUBLIC_INSURANCE_API_URL not set, using default: http://localhost:8002');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};