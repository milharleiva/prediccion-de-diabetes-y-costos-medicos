import { InsuranceClientEntity, InsurancePrediction } from '../entities/InsuranceClient';
import { IPredictionRepository } from '../repositories/IPredictionRepository';

export class CalculateInsuranceUseCase {
  constructor(private predictionRepository: IPredictionRepository) {}

  async execute(clientData: any): Promise<{
    success: boolean;
    data?: InsurancePrediction & { riskFactors: string[] };
    errors?: string[];
  }> {
    try {
      // 1. Create domain entity
      const client = InsuranceClientEntity.fromFormData(clientData);

      // 2. Validate input
      const validationErrors = client.validate();
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors
        };
      }

      // 3. Calculate insurance cost
      const prediction = await this.predictionRepository.calculateInsuranceCost(
        client.toApiFormat()
      );

      // 4. Get risk factors (business logic)
      const riskFactors = client.getRiskFactors();

      // 5. Return result with additional business logic
      return {
        success: true,
        data: {
          ...prediction,
          riskFactors
        }
      };
    } catch (error) {
      return {
        success: false,
        errors: [`Failed to calculate insurance cost: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  async getModelInfo(): Promise<any> {
    return this.predictionRepository.getModelInfo('insurance');
  }

  async checkApiHealth(): Promise<boolean> {
    return this.predictionRepository.checkApiHealth('insurance');
  }
}