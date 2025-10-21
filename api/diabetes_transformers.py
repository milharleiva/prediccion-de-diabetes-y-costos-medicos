import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

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