import sys
import os

# Add current directory to path for imports
sys.path.append(os.path.dirname(__file__))

# Import the transformers BEFORE loading models
from diabetes_transformers import DiabetesPreprocessor, FeatureEngineer
from insurance_transformers import CustomLabelEncoder, FeatureSelector

import joblib
import json
import numpy as np

def extract_model_params(model_path, model_name):
    """Extract parameters from trained model"""
    try:
        print(f"Loading {model_name} from {model_path}")
        model = joblib.load(model_path)

        print(f"Model type: {type(model)}")

        # Navigate through pipeline to find the actual classifier/regressor
        classifier = None

        if hasattr(model, 'named_steps'):
            print("Model is a pipeline with steps:")
            for step_name, step in model.named_steps.items():
                print(f"  {step_name}: {type(step)}")
                if hasattr(step, 'coef_') and hasattr(step, 'intercept_'):
                    classifier = step
                    print(f"  Found classifier/regressor: {step_name}")
        elif hasattr(model, 'coef_') and hasattr(model, 'intercept_'):
            classifier = model
            print("Direct classifier/regressor")

        if classifier is None:
            print(f"No classifier found in {model_name}")
            return None

        # Extract coefficients and intercept
        coef = classifier.coef_
        intercept = classifier.intercept_

        print(f"Coefficients shape: {coef.shape}")
        print(f"Intercept: {intercept}")

        # Handle different shapes
        if coef.ndim > 1:
            coef = coef.flatten()

        if hasattr(intercept, '__len__'):
            intercept = float(intercept[0])
        else:
            intercept = float(intercept)

        # Create parameter dictionary
        params = {
            'intercept': intercept,
            'coefficients': [float(c) for c in coef],
            'model_type': str(type(classifier).__name__),
            'n_features': len(coef)
        }

        # Try to extract preprocessing info
        if hasattr(model, 'named_steps'):
            for step_name, step in model.named_steps.items():
                if isinstance(step, DiabetesPreprocessor):
                    params['medians'] = step.medians_
                    params['means'] = step.means_
                    print(f"Found preprocessing parameters in {step_name}")
                elif isinstance(step, CustomLabelEncoder):
                    params['encoders'] = {}
                    for col, encoder in step.encoders.items():
                        if hasattr(encoder, 'classes_'):
                            params['encoders'][col] = {
                                'classes': encoder.classes_.tolist(),
                                'mapping': {cls: i for i, cls in enumerate(encoder.classes_)}
                            }
                    print(f"Found encoders in {step_name}")

        return params

    except Exception as e:
        print(f"Error with {model_name}: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    base_dir = os.path.dirname(os.path.dirname(__file__))

    # Extract diabetes model
    diabetes_path = os.path.join(base_dir, 'diabetes_model.pkl')
    if os.path.exists(diabetes_path):
        diabetes_params = extract_model_params(diabetes_path, "diabetes model")
        if diabetes_params:
            output_path = os.path.join(base_dir, 'diabetes_model_params.json')
            with open(output_path, 'w') as f:
                json.dump(diabetes_params, f, indent=2)
            print(f"SUCCESS: Diabetes model parameters saved to {output_path}")
        else:
            print("FAILED: Could not extract diabetes model parameters")
    else:
        print(f"Diabetes model not found at {diabetes_path}")

    # Extract insurance model
    insurance_path = os.path.join(base_dir, 'insurance_cost_model.pkl')
    if os.path.exists(insurance_path):
        insurance_params = extract_model_params(insurance_path, "insurance model")
        if insurance_params:
            output_path = os.path.join(base_dir, 'insurance_model_params.json')
            with open(output_path, 'w') as f:
                json.dump(insurance_params, f, indent=2)
            print(f"SUCCESS: Insurance model parameters saved to {output_path}")
        else:
            print("FAILED: Could not extract insurance model parameters")
    else:
        print(f"Insurance model not found at {insurance_path}")

if __name__ == "__main__":
    main()