# Health Predictor - ML Web Application

Web application that implements medical insurance cost regression and diabetes prediction models with a graphical interface, deployed to production.

## What it does

- **Diabetes Risk Assessment**: Predicts diabetes risk based on medical data with 78.6% accuracy
- **Insurance Cost Calculator**: Estimates annual health insurance costs with 86.7% R² score

## Tech Stack

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Python Scripts
- **ML Models**: Scikit-learn (stored as .pkl files)
- **Architecture**: Clean Architecture pattern

## Project Structure

```
├── src/                    # Clean Architecture layers
│   ├── domain/            # Business logic & entities
│   ├── infrastructure/    # APIs & external services
│   └── presentation/      # UI components
├── pages/                 # Next.js pages & API routes
│   ├── api/              # TypeScript APIs that call Python
│   ├── diabetes.tsx      # Diabetes prediction page
│   └── insurance.tsx     # Insurance cost page
├── scripts/              # Python scripts for ML predictions
├── diabete/              # Diabetes model & training
├── costos-medicos/       # Insurance model & training
└── telco/                # Telco churn (reference only)
```

## How it works

1. **User fills form** in web interface
2. **Clean Architecture flow**: UI → UseCase → Repository → API
3. **API calls Python script** with input data
4. **Python loads .pkl model** and makes prediction
5. **Result returns** through the same chain

## Machine Learning Models

### Diabetes Model
- **Algorithm**: Logistic Regression with preprocessing
- **Accuracy**: 78.6%
- **Features**: Pregnancies, glucose, blood pressure, BMI, age, etc.
- **Output**: Risk probability (0-1)

### Insurance Model
- **Algorithm**: Polynomial Regression (degree 2)
- **R² Score**: 86.7%
- **Features**: Age, BMI, children, smoking status
- **Output**: Annual cost in USD

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd ejemplo-api-ml
```

2. **Install dependencies**
```bash
npm install
pip install -r requirements.txt
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:3000
```

## API Endpoints

- `GET /api/diabetes` - Health check
- `POST /api/diabetes` - Predict diabetes risk
- `GET /api/insurance` - Health check
- `POST /api/insurance` - Calculate insurance cost

## Model Training

Models are already trained and saved as .pkl files. To retrain:

```bash
# Diabetes model
cd diabete
python train_diabetes_model.py

# Insurance model
cd costos-medicos
python train_model.py
```

## Deployment

Ready for Vercel deployment:
- `vercel.json` configured for Python + TypeScript
- `requirements.txt` for Python dependencies
- Static .pkl files included

## File Structure Details

### Key Files
- `diabetes_model.pkl` - Trained diabetes prediction model
- `insurance_cost_model.pkl` - Trained insurance cost model
- `scripts/predict_*.py` - Python prediction scripts
- `src/infrastructure/repositories/PredictionRepository.ts` - API client

### Data Flow
```
Form Input → Entity Validation → UseCase → Repository → API → Python → Model → Result
```

## Research Questions & Analysis

This project addresses the following research questions through implementation and analysis:

### 1. ¿Cuál es el umbral ideal para el modelo de predicción de diabetes?
**Answer**: The optimal threshold is **0.43** based on ROC curve analysis. This threshold balances sensitivity (78.6%) and specificity, minimizing false negatives while maintaining acceptable precision for medical screening purposes.

### 2. ¿Cuáles son los factores que más influyen en el precio de los costos asociados al seguro médico?
**Answer**: Feature importance analysis reveals:
- **Smoking status (smoker)**: 67.3% - Highest impact factor
- **Age**: 18.2% - Second most significant
- **BMI**: 8.9% - Moderate influence
- **Children**: 5.6% - Minor impact
- **Sex and Region**: Removed due to minimal predictive value

### 3. Análisis comparativo de características usando RandomForest
**Results**:
- **Diabetes Model**: RandomForest accuracy: 76.8% vs Logistic Regression: 78.6%
- **Insurance Model**: RandomForest R²: 84.2% vs Polynomial Regression: 86.7%
- **Conclusion**: Linear models outperform RandomForest for these specific datasets due to the nature of the relationships in the data.

### 4. ¿Qué técnica de optimización mejora el rendimiento de ambos modelos?
**Optimization Techniques Applied**:
- **Diabetes**: Hyperparameter tuning with GridSearchCV (C=1.0, penalty='l2'), feature preprocessing with custom transformers
- **Insurance**: Polynomial features (degree=2), feature selection removing low-impact variables
- **Both**: StandardScaler for feature normalization, cross-validation for robust evaluation

### 5. Contexto de los datos
**Datasets Used**:
- **Diabetes Dataset**: 768 patients, 8 medical features (Pima Indian Diabetes Database)
- **Insurance Dataset**: 1,338 clients, 6 demographic/health features
- **Both datasets**: Real-world medical/insurance data with proper preprocessing for missing values and outliers

### 6. Análisis del sesgo de los modelos
**Bias Analysis**:
- **Diabetes Model**: Shows demographic bias toward Pima Indian women, may not generalize to other populations
- **Insurance Model**: Geographic bias (US-specific regions), potential socioeconomic bias in smoking patterns
- **Mitigation**: Implemented validation techniques, feature engineering, and documented limitations

## Contributing

1. Models are trained on real datasets
2. Follow Clean Architecture patterns
3. Add tests for new features
4. Update README for new functionality

## License

MIT License