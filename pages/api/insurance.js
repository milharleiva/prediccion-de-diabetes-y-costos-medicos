import { spawn } from 'child_process';
import path from 'path';

export default function handler(req, res) {
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
      } = req.body;

      // Prepare Python script path
      const scriptPath = path.join(process.cwd(), 'scripts', 'predict_insurance.py');
      const modelPath = path.join(process.cwd(), 'insurance_cost_model.pkl');

      // Create input data string (only features used in training: age, bmi, children, smoker)
      const inputData = `${age},${bmi},${children},${smoker}`;

      console.log('Running insurance prediction with data:', inputData);

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
          console.log('Python output:', pythonOutput);
          const result = JSON.parse(pythonOutput.trim());

          const response = {
            predictedCost: Math.round(result.predicted_cost * 100) / 100,
            currency: 'USD',
            modelType: 'Python ML Model (Polynomial Regression)',
            inputData: {
              age,
              sex,
              bmi,
              children,
              smoker,
              region
            }
          };

          console.log('Sending response:', response);
          res.status(200).json(response);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Raw output:', pythonOutput);
          res.status(500).json({ error: 'Failed to parse Python output' });
        }
      });

    } catch (error) {
      console.error('Request error:', error);
      res.status(500).json({ error: error.message || 'Unknown error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}