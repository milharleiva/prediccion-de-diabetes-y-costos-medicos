import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import warnings
warnings.filterwarnings('ignore')

# Custom Transformers
class CustomLabelEncoder(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.encoders = {}

    def fit(self, X, y=None):
        for col in X.select_dtypes(include=['object']).columns:
            self.encoders[col] = LabelEncoder()
            self.encoders[col].fit(X[col])
        return self

    def transform(self, X):
        X_encoded = X.copy()
        for col, encoder in self.encoders.items():
            if col in X_encoded.columns:
                X_encoded[col] = encoder.transform(X_encoded[col])
        return X_encoded

class FeatureSelector(BaseEstimator, TransformerMixin):
    def __init__(self, features_to_keep=None):
        self.features_to_keep = features_to_keep

    def fit(self, X, y=None):
        if self.features_to_keep is None:
            self.features_to_keep = X.columns.tolist()
        return self

    def transform(self, X):
        return X[self.features_to_keep]

def train_insurance_model():
    # Load real insurance dataset
    print("Loading insurance dataset...")
    df = pd.read_csv('insurance.csv')

    print(f"Dataset shape: {df.shape}")
    print(f"Average insurance cost: ${df['charges'].mean():.2f}")
    print(f"Smokers vs Non-smokers avg cost: ${df[df['smoker']=='yes']['charges'].mean():.2f} vs ${df[df['smoker']=='no']['charges'].mean():.2f}")

    # Based on notebook analysis, remove sex and region features for better performance
    # Use polynomial features with age, bmi, children, smoker
    X = df.drop(['charges', 'sex', 'region'], axis=1)
    y = df['charges']

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Create pipeline with polynomial features (degree=2 as per notebook)
    pipeline = Pipeline([
        ('encoder', CustomLabelEncoder()),
        ('poly_features', PolynomialFeatures(degree=2, include_bias=False)),
        ('regressor', LinearRegression())
    ])

    print("Training insurance cost model with Polynomial Regression...")

    # Fit the model
    pipeline.fit(X_train, y_train)

    # Make predictions
    y_pred = pipeline.predict(X_test)

    # Evaluate
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print("\n=== Model Performance ===")
    print(f"R² Score: {r2:.4f}")
    print(f"Mean Absolute Error: ${mae:.2f}")
    print(f"Root Mean Square Error: ${rmse:.2f}")

    # Save the model
    model_path = 'insurance_cost_model.pkl'
    joblib.dump(pipeline, model_path)
    print(f"\nModel saved to: {model_path}")

    return pipeline

if __name__ == "__main__":
    model = train_insurance_model()