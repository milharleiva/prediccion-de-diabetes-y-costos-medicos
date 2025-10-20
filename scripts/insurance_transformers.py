import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import LabelEncoder

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