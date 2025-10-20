export interface InsuranceClient {
  age: number;
  sex: 'male' | 'female';
  bmi: number;
  children: number;
  smoker: 'yes' | 'no';
  region: 'northeast' | 'northwest' | 'southeast' | 'southwest';
}

export interface InsurancePrediction {
  predictedCost: number;
  currency: string;
  modelType: string;
  inputData: InsuranceClient;
}

export class InsuranceClientEntity {
  constructor(
    public readonly age: number,
    public readonly sex: 'male' | 'female',
    public readonly bmi: number,
    public readonly children: number,
    public readonly smoker: 'yes' | 'no',
    public readonly region: 'northeast' | 'northwest' | 'southeast' | 'southwest'
  ) {}

  static fromFormData(data: any): InsuranceClientEntity {
    return new InsuranceClientEntity(
      Number(data.age) || 0,
      data.sex || 'male',
      Number(data.bmi) || 0,
      Number(data.children) || 0,
      data.smoker || 'no',
      data.region || 'northeast'
    );
  }

  toApiFormat(): InsuranceClient {
    return {
      age: this.age,
      sex: this.sex,
      bmi: this.bmi,
      children: this.children,
      smoker: this.smoker,
      region: this.region
    };
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.age < 18 || this.age > 120) {
      errors.push('Age must be between 18 and 120 years');
    }
    if (this.bmi < 15 || this.bmi > 50) {
      errors.push('BMI must be between 15 and 50');
    }
    if (this.children < 0 || this.children > 10) {
      errors.push('Children must be between 0 and 10');
    }
    if (!['male', 'female'].includes(this.sex)) {
      errors.push('Sex must be male or female');
    }
    if (!['yes', 'no'].includes(this.smoker)) {
      errors.push('Smoker must be yes or no');
    }
    if (!['northeast', 'northwest', 'southeast', 'southwest'].includes(this.region)) {
      errors.push('Region must be northeast, northwest, southeast, or southwest');
    }

    return errors;
  }

  isValid(): boolean {
    return this.validate().length === 0;
  }

  getRiskFactors(): string[] {
    const factors: string[] = [];

    if (this.age > 45) factors.push('Advanced age');
    if (this.bmi > 30) factors.push('Obesity (BMI > 30)');
    if (this.bmi > 25) factors.push('Overweight (BMI > 25)');
    if (this.smoker === 'yes') factors.push('Smoking');
    if (this.children > 3) factors.push('Large family');

    return factors;
  }
}