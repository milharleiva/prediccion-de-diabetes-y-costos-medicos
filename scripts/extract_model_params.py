import joblib
import json
import numpy as np
import sys
import os
import pickle

def extract_diabetes_model():
    """Extract parameters from diabetes model"""
    try:
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'diabetes_model.pkl')
        model = joblib.load(model_path)

        # Get the actual trained model (it might be in a pipeline)
        if hasattr(model, 'named_steps'):
            # It's a pipeline, get the classifier
            classifier = None
            for step_name, step in model.named_steps.items():
                if hasattr(step, 'coef_') and hasattr(step, 'intercept_'):
                    classifier = step
                    break
        else:
            # It's a direct classifier
            classifier = model

        if classifier is None:
            raise ValueError("Could not find classifier with coefficients")

        # Extract coefficients and intercept
        coef = classifier.coef_[0] if classifier.coef_.ndim > 1 else classifier.coef_
        intercept = float(classifier.intercept_[0]) if hasattr(classifier.intercept_, '__len__') else float(classifier.intercept_)

        # Get feature names (assuming standard diabetes dataset order)
        feature_names = [
            'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
            'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'
        ]

        # Check if there are additional engineered features
        if len(coef) > len(feature_names):
            # Add interaction features
            feature_names.append('p_BloodPressure_Insulin')

        params = {
            'intercept': intercept,
            'coefficients': {name: float(coef[i]) for i, name in enumerate(feature_names[:len(coef)])},
            'model_type': str(type(classifier).__name__),
            'n_features': len(coef)
        }

        # Try to get preprocessing parameters if available
        preprocessor = None
        if hasattr(model, 'named_steps'):
            for step_name, step in model.named_steps.items():
                if hasattr(step, 'medians_') or hasattr(step, 'means_'):
                    preprocessor = step
                    break

        if preprocessor:
            if hasattr(preprocessor, 'medians_'):
                params['medians'] = {k: float(v) for k, v in preprocessor.medians_.items()}
            if hasattr(preprocessor, 'means_'):
                params['means'] = {k: float(v) for k, v in preprocessor.means_.items()}

        return params

    except Exception as e:
        print(f"Error extracting diabetes model: {e}")
        return None

def extract_insurance_model():
    """Extract parameters from insurance model"""
    try:
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'insurance_cost_model.pkl')
        model = joblib.load(model_path)

        # Get the actual trained model (it might be in a pipeline)
        if hasattr(model, 'named_steps'):
            # It's a pipeline, get the regressor
            regressor = None
            for step_name, step in model.named_steps.items():
                if hasattr(step, 'coef_') and hasattr(step, 'intercept_'):
                    regressor = step
                    break
        else:
            # It's a direct regressor
            regressor = model

        if regressor is None:
            raise ValueError("Could not find regressor with coefficients")

        # Extract coefficients and intercept
        coef = regressor.coef_
        intercept = float(regressor.intercept_)

        # Get feature names (based on polynomial features)
        # This will depend on how the model was trained
        feature_names = []
        if len(coef) == 4:
            # Simple linear features: age, bmi, children, smoker
            feature_names = ['age', 'bmi', 'children', 'smoker']
        elif len(coef) > 4:
            # Polynomial features - we need to map them
            # Common polynomial features for this type of model:
            feature_names = ['age', 'bmi', 'children', 'smoker']
            # Add polynomial terms if they exist
            if len(coef) > 4:
                feature_names.extend(['age_squared', 'bmi_squared', 'age_bmi'])

        params = {
            'intercept': intercept,
            'coefficients': {name: float(coef[i]) for i, name in enumerate(feature_names[:len(coef)])},
            'model_type': str(type(regressor).__name__),
            'n_features': len(coef)
        }

        # Try to get label encoder mappings if available
        encoder = None
        if hasattr(model, 'named_steps'):
            for step_name, step in model.named_steps.items():
                if hasattr(step, 'encoders'):
                    encoder = step
                    break

        if encoder and hasattr(encoder, 'encoders'):
            params['encoders'] = {}
            for col, enc in encoder.encoders.items():
                if hasattr(enc, 'classes_'):
                    params['encoders'][col] = {
                        'classes': enc.classes_.tolist(),
                        'mapping': {cls: i for i, cls in enumerate(enc.classes_)}
                    }

        return params

    except Exception as e:
        print(f"Error extracting insurance model: {e}")
        return None

def main():
    print("Extracting model parameters...")

    # Extract diabetes model parameters
    diabetes_params = extract_diabetes_model()
    if diabetes_params:
        with open('diabetes_model_params.json', 'w') as f:
            json.dump(diabetes_params, f, indent=2)
        print("SUCCESS: Diabetes model parameters saved to diabetes_model_params.json")
    else:
        print("ERROR: Failed to extract diabetes model parameters")

    # Extract insurance model parameters
    insurance_params = extract_insurance_model()
    if insurance_params:
        with open('insurance_model_params.json', 'w') as f:
            json.dump(insurance_params, f, indent=2)
        print("SUCCESS: Insurance model parameters saved to insurance_model_params.json")
    else:
        print("ERROR: Failed to extract insurance model parameters")

    # Print summary
    if diabetes_params:
        print(f"\nDiabetes model: {diabetes_params['model_type']} with {diabetes_params['n_features']} features")
        print(f"Features: {list(diabetes_params['coefficients'].keys())}")

    if insurance_params:
        print(f"\nInsurance model: {insurance_params['model_type']} with {insurance_params['n_features']} features")
        print(f"Features: {list(insurance_params['coefficients'].keys())}")

if __name__ == "__main__":
    main()