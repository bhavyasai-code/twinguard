import { SensorReading } from '../types';

/**
 * Remaining Useful Life (RUL) Prediction Module.
 * 
 * In industrial prognostic health management (PHM), RUL represents the estimated
 * operating cycles or hours before an asset reaches its functional failure threshold.
 * 
 * In this reference implementation, RUL is calculated using an exponential Arrhenius-Paris
 * wear progression function driven by vibration and thermal fatigue factors.
 * This module can be swapped with a trained Random Forest Regressor, XGBoost,
 * or LSTM model.
 */
export function calculateRUL(
  healthScore: number,
  sensor: SensorReading,
  baselineNominalHours: number = 720 // 30 days of continuous operation
): {
  rulDays: number;
  rulHours: number;
  confidenceInterval: [number, number];
} {
  // Normalize health score (0-1)
  const healthFraction = Math.max(0.01, healthScore / 100);

  // Accelerated degradation factor based on high vibration and temperature
  // Normal vibration ~1.5mm/s, normal temp ~45C
  const thermalRatio = Math.max(1.0, sensor.temperature / 45);
  const vibrationRatio = Math.max(1.0, sensor.vibration / 2.0);

  // Severe stress multiplier decreases RUL exponentially
  const stressMultiplier = 1 / (Math.pow(thermalRatio, 1.4) * Math.pow(vibrationRatio, 1.8));

  // Compute estimated remaining operating hours
  let estimatedHours = Math.round(baselineNominalHours * Math.pow(healthFraction, 1.7) * stressMultiplier);

  // Minimum safety floor
  estimatedHours = Math.max(4, Math.min(baselineNominalHours, estimatedHours));

  const rulDays = Number((estimatedHours / 24).toFixed(1));

  // 95% Confidence Interval for regression model simulation (+-15% variance)
  const lowerHours = Math.max(1, Math.round(estimatedHours * 0.85));
  const upperHours = Math.round(estimatedHours * 1.15);

  return {
    rulDays,
    rulHours: estimatedHours,
    confidenceInterval: [lowerHours, upperHours],
  };
}
