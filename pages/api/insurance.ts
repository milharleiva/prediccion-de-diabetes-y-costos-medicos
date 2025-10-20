import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';

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
    res.status(200).json({ message: 'Insurance cost prediction API is running (Python ML Model)' });
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

      // Prepare Python script path
      const scriptPath = path.join(process.cwd(), 'scripts', 'predict_insurance.py');
      const modelPath = path.join(process.cwd(), 'insurance_cost_model.pkl');

      // Create input data string (only features used in training: age, bmi, children, smoker)
      const inputData = `${age},${bmi},${children},${smoker}`;

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

          const response: InsuranceResponse = {
            predictedCost: result.predicted_cost,
            currency: 'USD',
            modelType: 'Trained ML Model (Polynomial Regression)',
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