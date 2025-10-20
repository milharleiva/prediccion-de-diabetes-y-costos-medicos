export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatDecimal = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

export const formatRiskLevel = (probability: number): { level: string; color: string; description: string } => {
  if (probability < 0.3) {
    return {
      level: 'Low',
      color: 'text-green-600 bg-green-50',
      description: 'Low risk of diabetes'
    };
  } else if (probability < 0.7) {
    return {
      level: 'Moderate',
      color: 'text-yellow-600 bg-yellow-50',
      description: 'Moderate risk of diabetes'
    };
  } else {
    return {
      level: 'High',
      color: 'text-red-600 bg-red-50',
      description: 'High risk of diabetes'
    };
  }
};

export const formatInsuranceCostLevel = (cost: number): { level: string; color: string; description: string } => {
  if (cost < 5000) {
    return {
      level: 'Low',
      color: 'text-green-600 bg-green-50',
      description: 'Below average insurance cost'
    };
  } else if (cost < 15000) {
    return {
      level: 'Average',
      color: 'text-blue-600 bg-blue-50',
      description: 'Average insurance cost'
    };
  } else if (cost < 30000) {
    return {
      level: 'High',
      color: 'text-orange-600 bg-orange-50',
      description: 'Above average insurance cost'
    };
  } else {
    return {
      level: 'Very High',
      color: 'text-red-600 bg-red-50',
      description: 'Very high insurance cost'
    };
  }
};