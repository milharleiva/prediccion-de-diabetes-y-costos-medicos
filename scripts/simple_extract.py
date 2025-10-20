import joblib
import json
import numpy as np
import os

def safe_extract_model(model_path, model_name):
    """Safely extract model parameters"""
    try:
        print(f"Loading {model_name} from {model_path}")
        model = joblib.load(model_path)

        print(f"Model type: {type(model)}")
        print(f"Model attributes: {dir(model)}")

        # Try different ways to access the model
        classifier = None

        # Case 1: Direct model
        if hasattr(model, 'coef_') and hasattr(model, 'intercept_'):
            classifier = model
            print("Found direct model with coefficients")

        # Case 2: Pipeline
        elif hasattr(model, 'named_steps'):
            print("Model is a pipeline")
            for step_name, step in model.named_steps.items():
                print(f"  Step: {step_name}, Type: {type(step)}")
                if hasattr(step, 'coef_') and hasattr(step, 'intercept_'):
                    classifier = step
                    print(f"  Found classifier in step: {step_name}")
                    break

        # Case 3: Try steps_ attribute
        elif hasattr(model, 'steps'):
            print("Model has steps")
            for step_name, step in model.steps:
                print(f"  Step: {step_name}, Type: {type(step)}")
                if hasattr(step, 'coef_') and hasattr(step, 'intercept_'):
                    classifier = step
                    print(f"  Found classifier in step: {step_name}")
                    break

        if classifier is None:
            print(f"Could not find classifier in {model_name}")
            return None

        # Extract basic parameters
        coef = classifier.coef_
        intercept = classifier.intercept_

        print(f"Coefficients shape: {coef.shape}")
        print(f"Intercept: {intercept}")

        # Handle different coefficient shapes
        if coef.ndim > 1:
            coef = coef[0]  # For binary classification

        if hasattr(intercept, '__len__'):
            intercept = float(intercept[0])
        else:
            intercept = float(intercept)

        params = {
            'intercept': intercept,
            'coefficients': [float(c) for c in coef],
            'model_type': str(type(classifier).__name__),
            'n_features': len(coef)
        }

        return params

    except Exception as e:
        print(f"Error extracting {model_name}: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    print("Starting model parameter extraction...")

    base_dir = os.path.dirname(os.path.dirname(__file__))

    # Extract diabetes model
    diabetes_path = os.path.join(base_dir, 'diabetes_model.pkl')
    diabetes_params = safe_extract_model(diabetes_path, "diabetes model")

    if diabetes_params:
        output_path = os.path.join(base_dir, 'diabetes_model_params.json')
        with open(output_path, 'w') as f:
            json.dump(diabetes_params, f, indent=2)
        print(f"Diabetes model parameters saved to {output_path}")

    # Extract insurance model
    insurance_path = os.path.join(base_dir, 'insurance_cost_model.pkl')
    insurance_params = safe_extract_model(insurance_path, "insurance model")

    if insurance_params:
        output_path = os.path.join(base_dir, 'insurance_model_params.json')
        with open(output_path, 'w') as f:
            json.dump(insurance_params, f, indent=2)
        print(f"Insurance model parameters saved to {output_path}")

    print("Extraction complete!")

if __name__ == "__main__":
    main()