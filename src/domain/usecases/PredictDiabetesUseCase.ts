import { DiabetesPatientEntity, DiabetesPrediction } from '../entities/DiabetesPatient';
import { IPredictionRepository } from '../repositories/IPredictionRepository';

export class PredictDiabetesUseCase {
  constructor(private predictionRepository: IPredictionRepository) {}

  async execute(patientData: any): Promise<{
    success: boolean;
    data?: DiabetesPrediction;
    errors?: string[];
  }> {
    try {
      // 1. Create domain entity
      const patient = DiabetesPatientEntity.fromFormData(patientData);

      // 2. Validate input
      const validationErrors = patient.validate();
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors
        };
      }

      // 3. Make prediction
      const prediction = await this.predictionRepository.predictDiabetes(
        patient.toApiFormat()
      );

      // 4. Return result
      return {
        success: true,
        data: prediction
      };
    } catch (error) {
      return {
        success: false,
        errors: [`Failed to predict diabetes: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  async getModelInfo(): Promise<any> {
    return this.predictionRepository.getModelInfo('diabetes');
  }

  async checkApiHealth(): Promise<boolean> {
    return this.predictionRepository.checkApiHealth('diabetes');
  }
}