import { NextApiRequest, NextApiResponse } from 'next';
import { predictDiabetes, DiabetesData } from './ml-utils';

interface DiabetesInput {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
}

interface DiabetesResponse {
  prediction: number;
  diabetesRisk: string;
  probabilityNoDiabetes: number;
  probabilityDiabetes: number;
  modelType: string;
  inputData: DiabetesInput;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DiabetesResponse | { error: string } | { message: string }>
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
    res.status(200).json({ message: 'Diabetes prediction API is running (Native JS ML Model)' });
    return;
  }

  if (req.method === 'POST') {
    try {
      const {
        pregnancies = 0,
        glucose = 0,
        bloodPressure = 0,
        skinThickness = 0,
        insulin = 0,
        bmi = 0,
        diabetesPedigreeFunction = 0,
        age = 0
      } = req.body as DiabetesInput;

      // Prepare data for ML model
      const modelInput: DiabetesData = {
        Pregnancies: pregnancies,
        Glucose: glucose,
        BloodPressure: bloodPressure,
        SkinThickness: skinThickness,
        Insulin: insulin,
        BMI: bmi,
        DiabetesPedigreeFunction: diabetesPedigreeFunction,
        Age: age
      };

      // Make prediction using native JavaScript
      const result = predictDiabetes(modelInput);

      const response: DiabetesResponse = {
        prediction: result.prediction,
        diabetesRisk: result.prediction === 1 ? 'High Risk' : 'Low Risk',
        probabilityNoDiabetes: result.probabilities[0],
        probabilityDiabetes: result.probabilities[1],
        modelType: 'Native JS ML Model (Logistic Regression)',
        inputData: {
          pregnancies,
          glucose,
          bloodPressure,
          skinThickness,
          insulin,
          bmi,
          diabetesPedigreeFunction,
          age
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