from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import joblib
import pandas as pd

# Add the scripts directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
scripts_dir = os.path.join(parent_dir, 'scripts')
sys.path.append(scripts_dir)

# Import custom transformers
try:
    from insurance_transformers import CustomLabelEncoder, FeatureSelector
except ImportError:
    # If transformers not available, we'll handle it gracefully
    CustomLabelEncoder = None
    FeatureSelector = None

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        response = {
            "message": "Insurance cost prediction API is running (Python ML Model)"
        }
        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            # Extract input parameters with defaults
            age = data.get('age', 0)
            sex = data.get('sex', 'male')
            bmi = data.get('bmi', 0)
            children = data.get('children', 0)
            smoker = data.get('smoker', 'no')
            region = data.get('region', 'northeast')

            # Load the model
            model_path = os.path.join(parent_dir, 'insurance_cost_model.pkl')

            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}")

            model = joblib.load(model_path)

            # Create DataFrame with the features used in training
            # Based on the model, only age, bmi, children, smoker were used
            input_data = pd.DataFrame({
                'age': [int(age)],
                'bmi': [float(bmi)],
                'children': [int(children)],
                'smoker': [smoker]  # 'yes' or 'no'
            })

            # Make prediction
            predicted_cost = model.predict(input_data)[0]

            # Prepare response
            response = {
                "predictedCost": round(float(predicted_cost), 2),
                "currency": "USD",
                "modelType": "Python ML Model (Polynomial Regression)",
                "inputData": {
                    "age": age,
                    "sex": sex,
                    "bmi": bmi,
                    "children": children,
                    "smoker": smoker,
                    "region": region
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