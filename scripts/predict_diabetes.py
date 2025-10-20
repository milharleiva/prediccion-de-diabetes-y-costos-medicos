import sys
import os
import joblib
import pandas as pd
import json

# Add current directory to path for imports
sys.path.append(os.path.dirname(__file__))
from diabetes_transformers import DiabetesPreprocessor, FeatureEngineer

def main():
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python predict_diabetes.py <model_path> <input_data>"}))
        sys.exit(1)

    model_path = sys.argv[1]
    input_data_str = sys.argv[2]

    try:
        # Load the model
        model = joblib.load(model_path)

        # Parse input data
        data_parts = input_data_str.split(',')

        # Create DataFrame with the exact column names expected by the model
        input_data = pd.DataFrame({
            'Pregnancies': [int(data_parts[0])],
            'Glucose': [float(data_parts[1])],
            'BloodPressure': [float(data_parts[2])],
            'SkinThickness': [float(data_parts[3])],
            'Insulin': [float(data_parts[4])],
            'BMI': [float(data_parts[5])],
            'DiabetesPedigreeFunction': [float(data_parts[6])],
            'Age': [int(data_parts[7])]
        })

        # Make prediction
        prediction = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]

        # Return result as JSON
        result = {
            "prediction": int(prediction),
            "probabilities": [float(probabilities[0]), float(probabilities[1])]
        }

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()