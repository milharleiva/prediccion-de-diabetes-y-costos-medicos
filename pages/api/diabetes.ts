import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';

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
    res.status(200).json({ message: 'Diabetes prediction API is running (Python ML Model)' });
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

      // Prepare Python script path
      const scriptPath = path.join(process.cwd(), 'scripts', 'predict_diabetes.py');
      const modelPath = path.join(process.cwd(), 'diabetes_model.pkl');

      // Create input data string
      const inputData = `${pregnancies},${glucose},${bloodPressure},${skinThickness},${insulin},${bmi},${diabetesPedigreeFunction},${age}`;

      // Run Python script
      const python = spawn('python', [scriptPath, modelPath, inputData]);

      let pythonOutput = '';
      let pythonError = '';

      python.stdout.on('data', (data) => {
        pythonOutput += data.toString();
      });

      python.stderr.on('data', (data) => {
        pythonError += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          console.error('Python script error:', pythonError);
          res.status(500).json({ error: `Python script failed: ${pythonError}` });
          return;
        }

        try {
          const result = JSON.parse(pythonOutput.trim());

          const response: DiabetesResponse = {
            prediction: result.prediction,
            diabetesRisk: result.prediction === 1 ? 'High Risk' : 'Low Risk',
            probabilityNoDiabetes: result.probabilities[0],
            probabilityDiabetes: result.probabilities[1],
            modelType: 'Trained ML Model (Logistic Regression)',
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
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          res.status(500).json({ error: 'Failed to parse Python output' });
        }
      });

    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}