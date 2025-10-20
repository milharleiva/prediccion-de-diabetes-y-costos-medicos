import { DiabetesPatient, DiabetesPrediction } from '../entities/DiabetesPatient';
import { InsuranceClient, InsurancePrediction } from '../entities/InsuranceClient';

export interface IPredictionRepository {
  predictDiabetes(patient: DiabetesPatient): Promise<DiabetesPrediction>;
  calculateInsuranceCost(client: InsuranceClient): Promise<InsurancePrediction>;
  getModelInfo(modelType: 'diabetes' | 'insurance'): Promise<any>;
  checkApiHealth(apiType: 'diabetes' | 'insurance'): Promise<boolean>;
}