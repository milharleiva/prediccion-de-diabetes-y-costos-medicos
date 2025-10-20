import { NextApiRequest, NextApiResponse } from 'next';
import { predictInsuranceCost, InsuranceData } from './ml-utils';

interface InsuranceInput {
  age: number;
  sex: string;
  bmi: number;
  children: number;
  smoker: string;
  region: string;
}

interface InsuranceResponse {
  predictedCost: number;
  currency: string;
  modelType: string;
  inputData: InsuranceInput;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<InsuranceResponse | { error: string } | { message: string }>
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ message: 'Insurance cost prediction API is running (Native JS ML Model)' });
    return;
  }

  if (req.method === 'POST') {
    try {
      const {
        age = 0,
        sex = 'male',
        bmi = 0,
        children = 0,
        smoker = 'no',
        region = 'northeast'
      } = req.body as InsuranceInput;

      // Prepare data for ML model (only features used in training)
      const modelInput: InsuranceData = {
        age,
        bmi,
        children,
        smoker
      };

      // Make prediction using native JavaScript
      const predictedCost = predictInsuranceCost(modelInput);

      const response: InsuranceResponse = {
        predictedCost: Math.round(predictedCost * 100) / 100, // Round to 2 decimal places
        currency: 'USD',
        modelType: 'Native JS ML Model (Polynomial Regression)',
        inputData: {
          age,
          sex,
          bmi,
          children,
          smoker,
          region
        }
      };

      res.status(200).json(response);

    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}