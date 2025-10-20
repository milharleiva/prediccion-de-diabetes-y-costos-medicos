export interface DiabetesPatient {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
}

export interface DiabetesPrediction {
  prediction: 0 | 1;
  diabetesRisk: 'Low Risk' | 'High Risk';
  probabilityNoDiabetes: number;
  probabilityDiabetes: number;
  inputData: DiabetesPatient;
  modelType: string;
}

export class DiabetesPatientEntity {
  constructor(
    public readonly pregnancies: number,
    public readonly glucose: number,
    public readonly bloodPressure: number,
    public readonly skinThickness: number,
    public readonly insulin: number,
    public readonly bmi: number,
    public readonly diabetesPedigreeFunction: number,
    public readonly age: number
  ) {}

  static fromFormData(data: any): DiabetesPatientEntity {
    return new DiabetesPatientEntity(
      Number(data.pregnancies) || 0,
      Number(data.glucose) || 0,
      Number(data.bloodPressure) || 0,
      Number(data.skinThickness) || 0,
      Number(data.insulin) || 0,
      Number(data.bmi) || 0,
      Number(data.diabetesPedigreeFunction) || 0,
      Number(data.age) || 0
    );
  }

  toApiFormat(): DiabetesPatient {
    return {
      pregnancies: this.pregnancies,
      glucose: this.glucose,
      bloodPressure: this.bloodPressure,
      skinThickness: this.skinThickness,
      insulin: this.insulin,
      bmi: this.bmi,
      diabetesPedigreeFunction: this.diabetesPedigreeFunction,
      age: this.age
    };
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.pregnancies < 0 || this.pregnancies > 20) {
      errors.push('Pregnancies must be between 0 and 20');
    }
    if (this.glucose < 0 || this.glucose > 300) {
      errors.push('Glucose must be between 0 and 300 mg/dL');
    }
    if (this.bloodPressure < 0 || this.bloodPressure > 200) {
      errors.push('Blood pressure must be between 0 and 200 mmHg');
    }
    if (this.bmi < 10 || this.bmi > 70) {
      errors.push('BMI must be between 10 and 70');
    }
    if (this.age < 18 || this.age > 120) {
      errors.push('Age must be between 18 and 120 years');
    }

    return errors;
  }

  isValid(): boolean {
    return this.validate().length === 0;
  }
}