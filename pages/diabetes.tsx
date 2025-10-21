import React, { useState } from 'react';
import { Layout } from '../src/presentation/components/common/Layout';
import { PredictDiabetesUseCase } from '../src/domain/usecases/PredictDiabetesUseCase';
import { PredictionRepository } from '../src/infrastructure/repositories/PredictionRepository';
import { formatPercentage, formatRiskLevel } from '../src/shared/utils/formatters';
import { DiabetesPrediction } from '../src/domain/entities/DiabetesPatient';

export default function DiabetesPage() {
  const [formData, setFormData] = useState({
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    diabetesPedigreeFunction: '',
    age: ''
  });

  const [result, setResult] = useState<DiabetesPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      // Convert string values to numbers
      const numericData = {
        pregnancies: Number(formData.pregnancies) || 0,
        glucose: Number(formData.glucose) || 0,
        bloodPressure: Number(formData.bloodPressure) || 0,
        skinThickness: Number(formData.skinThickness) || 0,
        insulin: Number(formData.insulin) || 0,
        bmi: Number(formData.bmi) || 0,
        diabetesPedigreeFunction: Number(formData.diabetesPedigreeFunction) || 0,
        age: Number(formData.age) || 0
      };

      const repository = new PredictionRepository();
      const useCase = new PredictDiabetesUseCase(repository);

      const response = await useCase.execute(numericData);

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setErrors(response.errors || ['Failed to get prediction']);
      }
    } catch (error) {
      setErrors([`Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      pregnancies: '',
      glucose: '',
      bloodPressure: '',
      skinThickness: '',
      insulin: '',
      bmi: '',
      diabetesPedigreeFunction: '',
      age: ''
    });
    setResult(null);
    setErrors([]);
  };

  const formFields = [
    { key: 'pregnancies', label: 'Pregnancies', type: 'text', min: 0, max: 20, step: 1, help: 'Number of times pregnant' },
    { key: 'glucose', label: 'Glucose Level', type: 'text', min: 0, max: 300, step: 1, help: 'Plasma glucose concentration (mg/dL)' },
    { key: 'bloodPressure', label: 'Blood Pressure', type: 'text', min: 0, max: 200, step: 1, help: 'Diastolic blood pressure (mmHg)' },
    { key: 'skinThickness', label: 'Skin Thickness', type: 'text', min: 0, max: 100, step: 1, help: 'Triceps skin fold thickness (mm)' },
    { key: 'insulin', label: 'Insulin', type: 'text', min: 0, max: 1000, step: 1, help: '2-Hour serum insulin (mu U/ml)' },
    { key: 'bmi', label: 'BMI', type: 'text', min: 10, max: 70, step: 0.1, help: 'Body mass index (kg/m²)' },
    { key: 'diabetesPedigreeFunction', label: 'Diabetes Pedigree Function', type: 'text', min: 0, max: 3, step: 0.001, help: 'Genetic predisposition score' },
    { key: 'age', label: 'Age', type: 'text', min: 18, max: 120, step: 1, help: 'Age in years' }
  ];

  const riskInfo = result ? formatRiskLevel(result.probabilityDiabetes) : null;

  return (
    <Layout title="Evaluación de Riesgo de Diabetes - Predictor de Salud">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Evaluación de Riesgo de Diabetes
          </h1>
          <p className="text-lg text-gray-600">
            Ingresa tu información de salud para evaluar tu riesgo de diabetes usando nuestro modelo de IA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map((field) => (
                  <div key={field.key}>
                    <label className="form-label">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="form-input"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">{field.help}</p>
                  </div>
                ))}
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="text-red-800 text-sm">
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-3"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Analizando...
                    </div>
                  ) : (
                    'Evaluar Riesgo de Diabetes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary px-6"
                >
                  Restablecer
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="card p-6">
            {result ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Resultados de la Evaluación</h2>

                  {/* Risk Level Badge */}
                  <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${riskInfo?.color}`}>
                    Riesgo {riskInfo?.level === 'High' ? 'Alto' : riskInfo?.level === 'Low' ? 'Bajo' : 'Medio'}
                  </div>

                  <p className="text-gray-600 mt-2">{riskInfo?.description === 'High risk of diabetes' ? 'Alto riesgo de diabetes' : riskInfo?.description === 'Low risk of diabetes' ? 'Bajo riesgo de diabetes' : 'Riesgo medio de diabetes'}</p>
                </div>

                {/* Probability Breakdown */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Análisis de Riesgo</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Probabilidad Sin Diabetes:</span>
                      <span className="font-semibold text-green-600">
                        {formatPercentage(result.probabilityNoDiabetes)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Probabilidad de Diabetes:</span>
                      <span className="font-semibold text-red-600">
                        {formatPercentage(result.probabilityDiabetes)}
                      </span>
                    </div>

                    {/* Visual Probability Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${result.probabilityDiabetes * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Recomendaciones</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    {result.probabilityDiabetes > 0.7 ? (
                      <>
                        <li>• Consulta con un profesional de la salud inmediatamente</li>
                        <li>• Considera hacerte pruebas de HbA1c y glucosa en ayunas</li>
                        <li>• Adopta una dieta baja en azúcar y balanceada</li>
                        <li>• Aumenta la actividad física y ejercítate regularmente</li>
                      </>
                    ) : result.probabilityDiabetes > 0.3 ? (
                      <>
                        <li>• Monitorea tus niveles de azúcar en sangre regularmente</li>
                        <li>• Mantén una dieta saludable y rutina de ejercicio</li>
                        <li>• Programa chequeos regulares con tu médico</li>
                        <li>• Considera modificaciones en el estilo de vida para reducir el riesgo</li>
                      </>
                    ) : (
                      <>
                        <li>• Continúa manteniendo tu estilo de vida saludable</li>
                        <li>• Mantente al día con los exámenes de salud regulares</li>
                        <li>• Mantente físicamente activo y come una dieta balanceada</li>
                        <li>• Monitorea cualquier cambio en tu estado de salud</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Model Info */}
                <div className="text-xs text-gray-500 border-t pt-4">
                  <p>Modelo: {result.modelType}</p>
                  <p>Predicción generada el: {new Date().toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-6xl mb-4">🩺</div>
                <h3 className="text-lg font-semibold mb-2">Listo para la Evaluación</h3>
                <p>Completa el formulario para obtener tu evaluación de riesgo de diabetes</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Descargo Médico:</strong> Esta herramienta es solo para fines educativos y no debe reemplazar el consejo médico profesional.
            Siempre consulta con proveedores de atención médica calificados para una evaluación y tratamiento médico adecuado.
          </p>
        </div>
      </div>
    </Layout>
  );
}