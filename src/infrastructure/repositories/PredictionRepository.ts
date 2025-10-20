import { IPredictionRepository } from '../../domain/repositories/IPredictionRepository';
import { DiabetesPatient, DiabetesPrediction } from '../../domain/entities/DiabetesPatient';
import { InsuranceClient, InsurancePrediction } from '../../domain/entities/InsuranceClient';
import { HttpClient } from '../http/HttpClient';

export class PredictionRepository implements IPredictionRepository {
  private diabetesClient: HttpClient;
  private insuranceClient: HttpClient;

  constructor() {
    // Use Next.js API routes with real ML models
    const baseURL = typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3006'; // Current dev server port

    this.diabetesClient = new HttpClient({
      baseURL,
      timeout: 15000,
    });

    this.insuranceClient = new HttpClient({
      baseURL,
      timeout: 15000,
    });
  }

  async predictDiabetes(patient: DiabetesPatient): Promise<DiabetesPrediction> {
    // Convert to API format (camelCase)
    const apiPayload = {
      pregnancies: patient.pregnancies,
      glucose: patient.glucose,
      bloodPressure: patient.bloodPressure,
      skinThickness: patient.skinThickness,
      insulin: patient.insulin,
      bmi: patient.bmi,
      diabetesPedigreeFunction: patient.diabetesPedigreeFunction,
      age: patient.age,
    };

    const endpoint = '/api/diabetes';
    const response = await this.diabetesClient.post<DiabetesPrediction>(endpoint, apiPayload);

    if (!response.success) {
      throw new Error(response.error || 'Failed to predict diabetes');
    }

    return response.data!;
  }

  async calculateInsuranceCost(client: InsuranceClient): Promise<InsurancePrediction> {
    const endpoint = '/api/insurance';
    const response = await this.insuranceClient.post<InsurancePrediction>(endpoint, client);

    if (!response.success) {
      throw new Error(response.error || 'Failed to calculate insurance cost');
    }

    return response.data!;
  }

  async getModelInfo(modelType: 'diabetes' | 'insurance'): Promise<any> {
    const client = modelType === 'diabetes' ? this.diabetesClient : this.insuranceClient;
    const response = await client.get('/model-info');

    if (!response.success) {
      throw new Error(response.error || 'Failed to get model info');
    }

    return response.data;
  }

  async checkApiHealth(apiType: 'diabetes' | 'insurance'): Promise<boolean> {
    try {
      const client = apiType === 'diabetes' ? this.diabetesClient : this.insuranceClient;
      const response = await client.get('/');
      return response.success && response.status === 200;
    } catch (error) {
      console.error(`Health check failed for ${apiType} API:`, error);
      return false;
    }
  }

  // Batch prediction methods (bonus functionality)
  async predictDiabetesBatch(patients: DiabetesPatient[]): Promise<DiabetesPrediction[]> {
    const apiPayload = patients.map(patient => ({
      Pregnancies: patient.pregnancies,
      Glucose: patient.glucose,
      BloodPressure: patient.bloodPressure,
      SkinThickness: patient.skinThickness,
      Insulin: patient.insulin,
      BMI: patient.bmi,
      DiabetesPedigreeFunction: patient.diabetesPedigreeFunction,
      Age: patient.age,
    }));

    const response = await this.diabetesClient.post<{predictions: DiabetesPrediction[]}>('/predict-batch', apiPayload);

    if (!response.success) {
      throw new Error(response.error || 'Failed to predict diabetes batch');
    }

    return response.data!.predictions;
  }

  async calculateInsuranceCostBatch(clients: InsuranceClient[]): Promise<InsurancePrediction[]> {
    const response = await this.insuranceClient.post<{predictions: InsurancePrediction[]}>('/predict-batch', clients);

    if (!response.success) {
      throw new Error(response.error || 'Failed to calculate insurance cost batch');
    }

    return response.data!.predictions;
  }
}