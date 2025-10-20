from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import importlib
import logging

# Inicializar la app
app = FastAPI(title="Telco Churn Prediction API")

# Cargar el modelo entrenado
logger = logging.getLogger("telco_churn_api")

# Compatibility shim: some pickles created with older scikit-learn versions
# reference internal classes that may not exist in newer sklearn builds
try:
    ct_mod = importlib.import_module("sklearn.compose._column_transformer")
    if not hasattr(ct_mod, "_RemainderColsList"):
        class _RemainderColsList(list):
            """Compatibility shim for older pickles referencing _RemainderColsList."""
            pass
        ct_mod._RemainderColsList = _RemainderColsList
        logger.info("Applied compatibility shim for sklearn.compose._column_transformer._RemainderColsList")
except Exception:
    # If import fails, continue and let joblib raise a clear error below
    logger.exception("Failed to apply sklearn compatibility shim")

try:
    model = joblib.load("telco_churn_model.pkl")
except FileNotFoundError:
    logger.exception("Model file 'telco_churn_model.pkl' not found in project root.")
    raise
except Exception:
    logger.exception("Failed to load the model. This often happens when the model was pickled with a different scikit-learn version.")
    raise

# Definir la estructura de entrada (ajústala según tu dataset)
class CustomerData(BaseModel):
    gender: str
    SeniorCitizen: int
    Partner: str
    Dependents: str
    tenure: int
    PhoneService: str
    MultipleLines: str
    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str
    Contract: str
    PaperlessBilling: str
    PaymentMethod: str
    MonthlyCharges: float
    TotalCharges: float

@app.get("/")
def home():
    return {"message": "API de predicción de Churn está funcionando 🚀"}

@app.post("/predict")
def predict(data: CustomerData):
    # Convertir datos a DataFrame
    df = pd.DataFrame([data.dict()])

    # Hacer predicción
    prediction = model.predict(df)[0]
    proba = model.predict_proba(df)[0][1]

    return {
        "churn_pred": int(prediction),
        "churn_probability": round(float(proba), 4)
    }
