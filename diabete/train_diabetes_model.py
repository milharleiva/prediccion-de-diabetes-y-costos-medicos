import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib
import warnings
warnings.filterwarnings('ignore')

# Custom Transformers
class DiabetesPreprocessor(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.zero_cols = ['Glucose', 'Insulin', 'SkinThickness', 'BloodPressure', 'BMI']
        self.median_cols = ['Glucose', 'Insulin', 'SkinThickness']
        self.mean_cols = ['BMI', 'BloodPressure']
        self.medians_ = {}
        self.means_ = {}

    def fit(self, X, y=None):
        # Replace 0 with NaN for medical impossibilities
        X_processed = X.copy()
        for col in self.zero_cols:
            if col in X_processed.columns:
                X_processed[col] = X_processed[col].replace(0, np.nan)

        # Calculate medians and means for imputation
        for col in self.median_cols:
            if col in X_processed.columns:
                self.medians_[col] = X_processed[col].median()

        for col in self.mean_cols:
            if col in X_processed.columns:
                self.means_[col] = X_processed[col].mean()

        return self

    def transform(self, X):
        X_processed = X.copy()

        # Replace 0 with NaN for medical impossibilities
        for col in self.zero_cols:
            if col in X_processed.columns:
                X_processed[col] = X_processed[col].replace(0, np.nan)

        # Fill with fitted medians
        for col in self.median_cols:
            if col in X_processed.columns and col in self.medians_:
                X_processed[col] = X_processed[col].fillna(self.medians_[col])

        # Fill with fitted means
        for col in self.mean_cols:
            if col in X_processed.columns and col in self.means_:
                X_processed[col] = X_processed[col].fillna(self.means_[col])

        return X_processed

class FeatureEngineer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X_engineered = X.copy()

        # Feature interactions
        if 'BloodPressure' in X.columns and 'Insulin' in X.columns:
            X_engineered['p_BloodPressure_Insulin'] = X_engineered['BloodPressure'] * X_engineered['Insulin']

        return X_engineered

def train_diabetes_model():
    # Load diabetes dataset (using a simple dataset for demo)
    # In a real scenario, you would load your actual diabetes dataset
    print("Loading diabetes dataset...")

    # Create a sample dataset (replace with actual diabetes.csv loading)
    np.random.seed(42)
    n_samples = 768

    data = {
        'Pregnancies': np.random.randint(0, 15, n_samples),
        'Glucose': np.random.randint(70, 200, n_samples),
        'BloodPressure': np.random.randint(60, 120, n_samples),
        'SkinThickness': np.random.randint(10, 60, n_samples),
        'Insulin': np.random.randint(50, 300, n_samples),
        'BMI': np.random.uniform(15, 50, n_samples),
        'DiabetesPedigreeFunction': np.random.uniform(0.1, 2.5, n_samples),
        'Age': np.random.randint(21, 80, n_samples)
    }

    # Create target with some logic
    df = pd.DataFrame(data)
    # Create diabetes target based on risk factors
    diabetes_prob = (
        (df['Glucose'] > 140) * 0.3 +
        (df['BMI'] > 30) * 0.2 +
        (df['Age'] > 45) * 0.2 +
        (df['BloodPressure'] > 90) * 0.1 +
        (df['Pregnancies'] > 3) * 0.1 +
        np.random.uniform(0, 0.1, n_samples)
    )
    df['Outcome'] = (diabetes_prob > 0.5).astype(int)

    print(f"Dataset shape: {df.shape}")
    print(f"Diabetes cases: {df['Outcome'].sum()} ({df['Outcome'].mean():.2%})")

    # Prepare features and target
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Create pipeline
    pipeline = Pipeline([
        ('preprocessor', DiabetesPreprocessor()),
        ('feature_engineer', FeatureEngineer()),
        ('scaler', StandardScaler()),
        ('classifier', LogisticRegression(random_state=42))
    ])

    # Hyperparameter tuning
    param_grid = {
        'classifier__C': [0.1, 1, 10],
        'classifier__penalty': ['l1', 'l2'],
        'classifier__solver': ['liblinear']
    }

    print("Training model with hyperparameter tuning...")
    grid_search = GridSearchCV(
        pipeline, param_grid, cv=5, scoring='roc_auc', n_jobs=-1
    )

    grid_search.fit(X_train, y_train)

    # Best model
    best_pipeline = grid_search.best_estimator_

    # Evaluate
    y_pred = best_pipeline.predict(X_test)
    y_pred_proba = best_pipeline.predict_proba(X_test)[:, 1]

    print("\n=== Model Performance ===")
    print(f"Best parameters: {grid_search.best_params_}")
    print(f"Best CV score: {grid_search.best_score_:.4f}")
    print(f"Test AUC-ROC: {roc_auc_score(y_test, y_pred_proba):.4f}")
    print(f"Test Accuracy: {(y_pred == y_test).mean():.4f}")

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Save the model
    model_path = 'diabetes_model.pkl'
    joblib.dump(best_pipeline, model_path)
    print(f"\nModel saved to: {model_path}")

    return best_pipeline

if __name__ == "__main__":
    model = train_diabetes_model()