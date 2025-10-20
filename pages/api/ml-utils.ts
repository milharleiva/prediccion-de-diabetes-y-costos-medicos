// Utilidades para ML en JavaScript/TypeScript
// Implementaciones nativas sin dependencias de Python

export interface DiabetesData {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

export interface InsuranceData {
  age: number;
  bmi: number;
  children: number;
  smoker: string;
}

// Parámetros reales extraídos del modelo entrenado
const DIABETES_MEDIANS = {
  Glucose: 131.0,
  Insulin: 175.0,
  SkinThickness: 33.0
};

const DIABETES_MEANS = {
  BMI: 32.32894703884422,
  BloodPressure: 89.08794788273616
};

// Función logística para predicción de diabetes
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

// Coeficientes reales del modelo de diabetes entrenado
// Orden: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age, p_BloodPressure_Insulin
const DIABETES_COEFFICIENTS = {
  intercept: 0.3404258428017019,
  coefficients: [
    0.33017640750093313,  // Pregnancies
    1.9464180116461807,   // Glucose
    0.3161478707356027,   // BloodPressure
    -0.09439815871113763, // SkinThickness
    0.0,                  // Insulin
    1.6124618253703344,   // BMI
    0.0,                  // DiabetesPedigreeFunction
    1.4902135991042622,   // Age
    -0.15131742186682828  // p_BloodPressure_Insulin
  ]
};

export function preprocessDiabetesData(data: DiabetesData): DiabetesData {
  const processed = { ...data };

  // Reemplazar valores imposibles (0) con valores estimados
  if (processed.Glucose === 0) processed.Glucose = DIABETES_MEDIANS.Glucose;
  if (processed.Insulin === 0) processed.Insulin = DIABETES_MEDIANS.Insulin;
  if (processed.SkinThickness === 0) processed.SkinThickness = DIABETES_MEDIANS.SkinThickness;
  if (processed.BMI === 0) processed.BMI = DIABETES_MEANS.BMI;
  if (processed.BloodPressure === 0) processed.BloodPressure = DIABETES_MEANS.BloodPressure;

  return processed;
}

export function predictDiabetes(data: DiabetesData) {
  const processed = preprocessDiabetesData(data);

  // Calcular feature interaction
  const bloodPressureInsulin = processed.BloodPressure * processed.Insulin;

  // Preparar los valores de entrada en el orden correcto
  const features = [
    processed.Pregnancies,
    processed.Glucose,
    processed.BloodPressure,
    processed.SkinThickness,
    processed.Insulin,
    processed.BMI,
    processed.DiabetesPedigreeFunction,
    processed.Age,
    bloodPressureInsulin
  ];

  // Calcular la suma ponderada (modelo lineal)
  let linearSum = DIABETES_COEFFICIENTS.intercept;
  for (let i = 0; i < features.length; i++) {
    linearSum += DIABETES_COEFFICIENTS.coefficients[i] * features[i];
  }

  // Aplicar función logística
  const probability = sigmoid(linearSum);
  const prediction = probability > 0.5 ? 1 : 0;

  return {
    prediction,
    probabilities: [1 - probability, probability]
  };
}

// Coeficientes reales del modelo de seguros entrenado (PolynomialFeatures + LinearRegression)
// Orden de características: age, bmi, children, smoker, age^2, age*bmi, age*children, age*smoker, bmi^2, bmi*children, bmi*smoker, children^2, children*smoker, smoker^2
const INSURANCE_COEFFICIENTS = {
  intercept: -4180.1423420562005,
  coefficients: [
    -93.36209877984236,    // age
    505.46857700879303,    // bmi
    1208.8155838935104,    // children
    -10140.499275169626,   // smoker
    4.052371621822658,     // age^2
    1.138881049028754,     // age*bmi
    -4.067147563640193,    // age*children
    7.446933868845254,     // age*smoker
    -8.719301631492407,    // bmi^2
    1.1658677477179618,    // bmi*children
    1446.3438319267716,    // bmi*smoker
    -111.85827715064728,   // children^2
    -441.51630688345466,   // children*smoker
    -10140.499275169652    // smoker^2
  ]
};

export function predictInsuranceCost(data: InsuranceData) {
  const { age, bmi, children, smoker } = data;

  // Codificar variable categórica
  const smokerBinary = smoker === 'yes' ? 1 : 0;

  // Calcular todas las características polinomiales (degree=2)
  const features = [
    age,                      // age
    bmi,                      // bmi
    children,                 // children
    smokerBinary,             // smoker
    age * age,                // age^2
    age * bmi,                // age*bmi
    age * children,           // age*children
    age * smokerBinary,       // age*smoker
    bmi * bmi,                // bmi^2
    bmi * children,           // bmi*children
    bmi * smokerBinary,       // bmi*smoker
    children * children,      // children^2
    children * smokerBinary,  // children*smoker
    smokerBinary * smokerBinary // smoker^2
  ];

  // Calcular costo predicho
  let predictedCost = INSURANCE_COEFFICIENTS.intercept;
  for (let i = 0; i < features.length; i++) {
    predictedCost += INSURANCE_COEFFICIENTS.coefficients[i] * features[i];
  }

  // Asegurar que el costo no sea negativo
  return Math.max(0, predictedCost);
}