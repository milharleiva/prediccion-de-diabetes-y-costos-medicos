import React, { useState } from 'react';
import { Layout } from '../src/presentation/components/common/Layout';
import { PredictionRepository } from '../src/infrastructure/repositories/PredictionRepository';
import { InsurancePrediction, InsuranceClient } from '../src/domain/entities/InsuranceClient';

export default function InsurancePage() {
  const [formData, setFormData] = useState({
    age: '30',
    sex: 'male' as 'male' | 'female',
    bmi: '25.0',
    children: '0',
    smoker: 'no' as 'yes' | 'no',
    region: 'northeast' as 'northeast' | 'northwest' | 'southeast' | 'southwest'
  });

  const [result, setResult] = useState<InsurancePrediction | null>(null);
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
      // Convert string values to correct types
      const insuranceData: InsuranceClient = {
        age: Number(formData.age) || 0,
        sex: formData.sex,
        bmi: Number(formData.bmi) || 0,
        children: Number(formData.children) || 0,
        smoker: formData.smoker,
        region: formData.region
      };

      const repository = new PredictionRepository();
      const response = await repository.calculateInsuranceCost(insuranceData);
      setResult(response);
    } catch (error) {
      setErrors([`Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      age: '30',
      sex: 'male' as 'male' | 'female',
      bmi: '25.0',
      children: '0',
      smoker: 'no' as 'yes' | 'no',
      region: 'northeast' as 'northeast' | 'northwest' | 'southeast' | 'southwest'
    });
    setResult(null);
    setErrors([]);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCostLevel = (cost: number): { level: string; color: string; description: string } => {
    if (cost < 5000) {
      return {
        level: 'Bajo',
        color: 'bg-green-100 text-green-800',
        description: 'Tu costo estimado de seguro está por debajo del promedio'
      };
    } else if (cost < 15000) {
      return {
        level: 'Moderado',
        color: 'bg-yellow-100 text-yellow-800',
        description: 'Tu costo estimado de seguro está cerca del promedio'
      };
    } else {
      return {
        level: 'Alto',
        color: 'bg-red-100 text-red-800',
        description: 'Tu costo estimado de seguro está por encima del promedio'
      };
    }
  };

  const costInfo = result ? getCostLevel(result.predictedCost) : null;

  return (
    <Layout title="Calculadora de Costos de Seguros - Predictor de Salud">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Calculadora de Costos de Seguros
          </h1>
          <p className="text-lg text-gray-600">
            Estima tu costo anual de seguro de salud basado en factores personales
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Age */}
                <div>
                  <label className="form-label">Age</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="form-input"
                    placeholder="Enter your age"
                  />
                  <p className="text-xs text-gray-500 mt-1">Age in years (18-120)</p>
                </div>

                {/* Sex */}
                <div>
                  <label className="form-label">Sex</label>
                  <select
                    value={formData.sex}
                    onChange={(e) => handleInputChange('sex', e.target.value)}
                    className="form-input"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* BMI */}
                <div>
                  <label className="form-label">BMI (Body Mass Index)</label>
                  <input
                    type="text"
                    value={formData.bmi}
                    onChange={(e) => handleInputChange('bmi', e.target.value)}
                    className="form-input"
                    placeholder="Enter your BMI"
                  />
                  <p className="text-xs text-gray-500 mt-1">Body Mass Index (kg/m²)</p>
                </div>

                {/* Children */}
                <div>
                  <label className="form-label">Children</label>
                  <input
                    type="text"
                    value={formData.children}
                    onChange={(e) => handleInputChange('children', e.target.value)}
                    className="form-input"
                    placeholder="Number of children"
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of children covered by insurance</p>
                </div>

                {/* Smoker */}
                <div>
                  <label className="form-label">Smoker</label>
                  <select
                    value={formData.smoker}
                    onChange={(e) => handleInputChange('smoker', e.target.value)}
                    className="form-input"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="form-label">Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="form-input"
                  >
                    <option value="northeast">Northeast</option>
                    <option value="northwest">Northwest</option>
                    <option value="southeast">Southeast</option>
                    <option value="southwest">Southwest</option>
                  </select>
                </div>
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
                      Calculando...
                    </div>
                  ) : (
                    'Calcular Costo de Seguro'
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
                  <h2 className="text-2xl font-bold mb-4">Estimación de Costo</h2>

                  {/* Cost Amount */}
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {formatCurrency(result.predictedCost)}
                  </div>
                  <p className="text-lg text-gray-600 mb-4">Costo Anual de Seguro</p>

                  {/* Cost Level Badge */}
                  <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${costInfo?.color}`}>
                    Costo {costInfo?.level}
                  </div>

                  <p className="text-gray-600 mt-2">{costInfo?.description}</p>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Factores de Costo</h3>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Edad:</span>
                        <span className="font-medium">{result.inputData.age} años</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sexo:</span>
                        <span className="font-medium capitalize">{result.inputData.sex}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BMI:</span>
                        <span className="font-medium">{result.inputData.bmi}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Hijos:</span>
                        <span className="font-medium">{result.inputData.children}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fumador:</span>
                        <span className={`font-medium ${result.inputData.smoker === 'yes' ? 'text-red-600' : 'text-green-600'}`}>
                          {result.inputData.smoker === 'yes' ? 'Sí' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Región:</span>
                        <span className="font-medium capitalize">{result.inputData.region}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Reduction Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Formas de Reducir Costos</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    {result.inputData.smoker === 'yes' && (
                      <li>• Deja de fumar - este es el factor más grande que afecta tu prima</li>
                    )}
                    {result.inputData.bmi > 30 && (
                      <li>• Mantén un peso saludable para reducir riesgos relacionados con la obesidad</li>
                    )}
                    <li>• Compara planes de diferentes proveedores de seguros</li>
                    <li>• Considera planes con deducibles más altos para reducir las primas mensuales</li>
                    <li>• Busca opciones de seguros grupales patrocinados por el empleador</li>
                    <li>• Mantén un estilo de vida saludable con ejercicio regular</li>
                  </ul>
                </div>

                {/* Model Info */}
                <div className="text-xs text-gray-500 border-t pt-4">
                  <p>Modelo: {result.modelType}</p>
                  <p>Estimación generada el: {new Date().toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-lg font-semibold mb-2">Listo para Calcular</h3>
                <p>Completa el formulario para obtener tu estimación de costo de seguro</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Descargo de Responsabilidad:</strong> Esta es una estimación solo para fines educativos.
            Los costos reales de seguros pueden variar significativamente basado en planes específicos, opciones de cobertura,
            ubicación y políticas del proveedor de seguros. Siempre consulta con agentes de seguros licenciados para cotizaciones precisas.
          </p>
        </div>
      </div>
    </Layout>
  );
}