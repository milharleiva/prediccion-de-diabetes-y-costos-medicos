from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import joblib
import pandas as pd

# Add the current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Import custom transformers
try:
    from diabetes_transformers import DiabetesPreprocessor, FeatureEngineer
except ImportError:
    # If transformers not available, we'll handle it gracefully
    DiabetesPreprocessor = None
    FeatureEngineer = None

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        response = {
            "message": "Diabetes prediction API is running (Python ML Model)"
        }
        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            # Extract input parameters with defaults
            pregnancies = data.get('pregnancies', 0)
            glucose = data.get('glucose', 0)
            blood_pressure = data.get('bloodPressure', 0)
            skin_thickness = data.get('skinThickness', 0)
            insulin = data.get('insulin', 0)
            bmi = data.get('bmi', 0)
            diabetes_pedigree = data.get('diabetesPedigreeFunction', 0)
            age = data.get('age', 0)

            # Load the model
            parent_dir = os.path.dirname(current_dir)
            model_path = os.path.join(parent_dir, 'diabetes_model.pkl')

            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}")

            model = joblib.load(model_path)

            # Create DataFrame with the exact column names expected by the model
            input_data = pd.DataFrame({
                'Pregnancies': [int(pregnancies)],
                'Glucose': [float(glucose)],
                'BloodPressure': [float(blood_pressure)],
                'SkinThickness': [float(skin_thickness)],
                'Insulin': [float(insulin)],
                'BMI': [float(bmi)],
                'DiabetesPedigreeFunction': [float(diabetes_pedigree)],
                'Age': [int(age)]
            })

            # Make prediction
            prediction = model.predict(input_data)[0]
            probabilities = model.predict_proba(input_data)[0]

            # Prepare response
            response = {
                "prediction": int(prediction),
                "diabetesRisk": "High Risk" if prediction == 1 else "Low Risk",
                "probabilityNoDiabetes": float(probabilities[0]),
                "probabilityDiabetes": float(probabilities[1]),
                "modelType": "Python ML Model (Logistic Regression)",
                "inputData": {
                    "pregnancies": pregnancies,
                    "glucose": glucose,
                    "bloodPressure": blood_pressure,
                    "skinThickness": skin_thickness,
                    "insulin": insulin,
                    "bmi": bmi,
                    "diabetesPedigreeFunction": diabetes_pedigree,
                    "age": age
                }
            }

            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            # Send error response
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            error_response = {
                "error": str(e)
            }
            self.wfile.write(json.dumps(error_response).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()