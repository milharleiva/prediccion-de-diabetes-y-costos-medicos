import sys
import os
import json

# Add current directory to path for imports
sys.path.append(os.path.dirname(__file__))

from diabetes_transformers import DiabetesPreprocessor, FeatureEngineer
from insurance_transformers import CustomLabelEncoder, FeatureSelector

import joblib
import pandas as pd

def test_api_logic():
    """Test the exact same logic as the API endpoint"""
    print("=== TESTING API LOGIC ===")

    try:
        # Simulate API input data - HIGH RISK case
        api_data = {
            'pregnancies': 10,
            'glucose': 200,
            'bloodPressure': 90,
            'skinThickness': 35,
            'insulin': 150,
            'bmi': 35.0,
            'diabetesPedigreeFunction': 1.5,
            'age': 45
        }

        print(f"API Input data: {api_data}")

        # Extract input parameters with defaults (same as API)
        pregnancies = api_data.get('pregnancies', 0)
        glucose = api_data.get('glucose', 0)
        blood_pressure = api_data.get('bloodPressure', 0)  # Note: different key!
        skin_thickness = api_data.get('skinThickness', 0)  # Note: different key!
        insulin = api_data.get('insulin', 0)
        bmi = api_data.get('bmi', 0)
        diabetes_pedigree = api_data.get('diabetesPedigreeFunction', 0)
        age = api_data.get('age', 0)

        print(f"Extracted values:")
        print(f"  pregnancies: {pregnancies}")
        print(f"  glucose: {glucose}")
        print(f"  blood_pressure: {blood_pressure}")  # This might be 0!
        print(f"  skin_thickness: {skin_thickness}")  # This might be 0!
        print(f"  insulin: {insulin}")
        print(f"  bmi: {bmi}")
        print(f"  diabetes_pedigree: {diabetes_pedigree}")
        print(f"  age: {age}")

        # Load the model
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'diabetes_model.pkl')
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

        print(f"\nDataFrame created:")
        print(input_data)

        # Make prediction
        prediction = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]

        print(f"\nPrediction: {prediction}")
        print(f"Probabilities: {probabilities}")
        print(f"Risk: {'High Risk' if prediction == 1 else 'Low Risk'}")

        # Test with corrected keys
        print("\n=== TESTING WITH CORRECTED KEYS ===")

        corrected_data = {
            'pregnancies': 10,
            'glucose': 200,
            'bloodPressure': 90,  # Correct key
            'skinThickness': 35,  # Correct key
            'insulin': 150,
            'bmi': 35.0,
            'diabetesPedigreeFunction': 1.5,
            'age': 45
        }

        pregnancies = corrected_data.get('pregnancies', 0)
        glucose = corrected_data.get('glucose', 0)
        blood_pressure = corrected_data.get('bloodPressure', 0)
        skin_thickness = corrected_data.get('skinThickness', 0)
        insulin = corrected_data.get('insulin', 0)
        bmi = corrected_data.get('bmi', 0)
        diabetes_pedigree = corrected_data.get('diabetesPedigreeFunction', 0)
        age = corrected_data.get('age', 0)

        print(f"Corrected extracted values:")
        print(f"  pregnancies: {pregnancies}")
        print(f"  glucose: {glucose}")
        print(f"  blood_pressure: {blood_pressure}")
        print(f"  skin_thickness: {skin_thickness}")
        print(f"  insulin: {insulin}")
        print(f"  bmi: {bmi}")
        print(f"  diabetes_pedigree: {diabetes_pedigree}")
        print(f"  age: {age}")

        input_data_corrected = pd.DataFrame({
            'Pregnancies': [int(pregnancies)],
            'Glucose': [float(glucose)],
            'BloodPressure': [float(blood_pressure)],
            'SkinThickness': [float(skin_thickness)],
            'Insulin': [float(insulin)],
            'BMI': [float(bmi)],
            'DiabetesPedigreeFunction': [float(diabetes_pedigree)],
            'Age': [int(age)]
        })

        print(f"\nCorrected DataFrame:")
        print(input_data_corrected)

        prediction_corrected = model.predict(input_data_corrected)[0]
        probabilities_corrected = model.predict_proba(input_data_corrected)[0]

        print(f"\nCorrected Prediction: {prediction_corrected}")
        print(f"Corrected Probabilities: {probabilities_corrected}")
        print(f"Corrected Risk: {'High Risk' if prediction_corrected == 1 else 'Low Risk'}")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api_logic()