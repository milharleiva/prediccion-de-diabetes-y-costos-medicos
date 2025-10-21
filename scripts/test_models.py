import sys
import os

# Add current directory to path for imports
sys.path.append(os.path.dirname(__file__))

from diabetes_transformers import DiabetesPreprocessor, FeatureEngineer
from insurance_transformers import CustomLabelEncoder, FeatureSelector

import joblib
import pandas as pd
import numpy as np

def test_diabetes_model():
    """Test diabetes model with various inputs"""
    print("=== TESTING DIABETES MODEL ===")

    try:
        # Load model
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'diabetes_model.pkl')
        model = joblib.load(model_path)

        print(f"Model type: {type(model)}")
        if hasattr(model, 'named_steps'):
            print("Pipeline steps:")
            for name, step in model.named_steps.items():
                print(f"  {name}: {type(step)}")

        # Test cases: [Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age]
        test_cases = [
            # Case 1: Low risk case
            [1, 85, 66, 29, 0, 26.6, 0.351, 31],
            # Case 2: High risk case
            [8, 183, 64, 0, 0, 23.3, 0.672, 32],
            # Case 3: Very high risk
            [10, 200, 90, 35, 150, 35.0, 1.5, 45],
            # Case 4: Another high risk
            [6, 148, 72, 35, 0, 33.6, 0.627, 50],
            # Case 5: Borderline case
            [2, 110, 70, 30, 80, 28.0, 0.4, 35]
        ]

        for i, case in enumerate(test_cases, 1):
            print(f"\n--- Test Case {i} ---")
            print(f"Input: {case}")

            # Create DataFrame
            input_data = pd.DataFrame({
                'Pregnancies': [case[0]],
                'Glucose': [case[1]],
                'BloodPressure': [case[2]],
                'SkinThickness': [case[3]],
                'Insulin': [case[4]],
                'BMI': [case[5]],
                'DiabetesPedigreeFunction': [case[6]],
                'Age': [case[7]]
            })

            print(f"DataFrame:\n{input_data}")

            # Make prediction
            prediction = model.predict(input_data)[0]
            probabilities = model.predict_proba(input_data)[0]

            print(f"Prediction: {prediction}")
            print(f"Probabilities: {probabilities}")
            print(f"Risk: {'High Risk' if prediction == 1 else 'Low Risk'}")

            # Debug: Check intermediate steps if it's a pipeline
            if hasattr(model, 'named_steps'):
                transformed_data = input_data.copy()
                for step_name, step in model.named_steps.items():
                    if step_name != 'classifier':  # Don't transform with the final classifier
                        try:
                            transformed_data = step.transform(transformed_data)
                            print(f"After {step_name}: {transformed_data.shape if hasattr(transformed_data, 'shape') else 'transformed'}")
                            if hasattr(transformed_data, 'iloc'):
                                print(f"  Values: {transformed_data.iloc[0].values}")
                            elif isinstance(transformed_data, np.ndarray):
                                print(f"  Values: {transformed_data[0]}")
                        except Exception as e:
                            print(f"Error in {step_name}: {e}")
                            break

    except Exception as e:
        print(f"Error testing diabetes model: {e}")
        import traceback
        traceback.print_exc()

def test_insurance_model():
    """Test insurance model with various inputs"""
    print("\n\n=== TESTING INSURANCE MODEL ===")

    try:
        # Load model
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'insurance_cost_model.pkl')
        model = joblib.load(model_path)

        print(f"Model type: {type(model)}")
        if hasattr(model, 'named_steps'):
            print("Pipeline steps:")
            for name, step in model.named_steps.items():
                print(f"  {name}: {type(step)}")

        # Test cases: [age, bmi, children, smoker]
        test_cases = [
            [25, 22.0, 0, 'no'],   # Young, healthy, no kids, non-smoker
            [45, 30.0, 2, 'yes'],  # Middle-aged, overweight, kids, smoker
            [60, 25.0, 3, 'no'],   # Older, normal weight, kids, non-smoker
            [35, 35.0, 1, 'yes'],  # Middle-aged, obese, kid, smoker
        ]

        for i, case in enumerate(test_cases, 1):
            print(f"\n--- Test Case {i} ---")
            print(f"Input: age={case[0]}, bmi={case[1]}, children={case[2]}, smoker={case[3]}")

            # Create DataFrame
            input_data = pd.DataFrame({
                'age': [case[0]],
                'bmi': [case[1]],
                'children': [case[2]],
                'smoker': [case[3]]
            })

            # Make prediction
            prediction = model.predict(input_data)[0]
            print(f"Predicted cost: ${prediction:.2f}")

    except Exception as e:
        print(f"Error testing insurance model: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_diabetes_model()
    test_insurance_model()