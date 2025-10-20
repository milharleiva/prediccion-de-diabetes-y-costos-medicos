import sys
import os
import joblib
import pandas as pd
import json

# Add current directory to path for imports
sys.path.append(os.path.dirname(__file__))
from insurance_transformers import CustomLabelEncoder, FeatureSelector

def main():
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python predict_insurance.py <model_path> <input_data>"}))
        sys.exit(1)

    model_path = sys.argv[1]
    input_data_str = sys.argv[2]

    try:
        # Load the model
        model = joblib.load(model_path)

        # Parse input data (age, bmi, children, smoker)
        data_parts = input_data_str.split(',')

        # Create DataFrame with the exact column names expected by the model
        # Based on training: only age, bmi, children, smoker were used
        input_data = pd.DataFrame({
            'age': [int(data_parts[0])],
            'bmi': [float(data_parts[1])],
            'children': [int(data_parts[2])],
            'smoker': [data_parts[3]]  # 'yes' or 'no'
        })

        # Make prediction
        predicted_cost = model.predict(input_data)[0]

        # Return result as JSON
        result = {
            "predicted_cost": float(predicted_cost)
        }

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()