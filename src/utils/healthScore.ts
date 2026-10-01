import { MachineHealthStatus, SensorReading, SensorThresholds } from '../types';
import { DEFAULT_THRESHOLDS } from './thresholds';

/**
 * Calculates a Machine Health Score between 0 and 100%.
 * High score = healthy machine operating within nominal tolerances.
 * Low score = multiple anomalies, high thermal stress or mechanical vibration.
 * 
 * Reusable function designed to be swapped for a trained ML model
 * (e.g., Logistic Regression, Random Forest, or Multi-layer Perceptron).
 */
export function calculateHealthScore(
  sensor: SensorReading,
  thresholds: SensorThresholds = DEFAULT_THRESHOLDS
): { healthScore: number; failureProbability: number; normalProbability: number } {
  // 1. Temperature degradation penalty (Nominal 40-50°C)
  let tempPenalty = 0;
  if (sensor.temperature > thresholds.temperature.maxCrit) {
    tempPenalty = 35 + Math.min(15, (sensor.temperature - thresholds.temperature.maxCrit) * 2);
  } else if (sensor.temperature > thresholds.temperature.maxWarn) {
    const ratio = (sensor.temperature - thresholds.temperature.maxWarn) / 
      (thresholds.temperature.maxCrit - thresholds.temperature.maxWarn);
    tempPenalty = ratio * 30;
  }

  // 2. Vibration degradation penalty (Nominal 1.0-2.5 mm/s)
  let vibPenalty = 0;
  if (sensor.vibration > thresholds.vibration.maxCrit) {
    vibPenalty = 40 + Math.min(20, (sensor.vibration - thresholds.vibration.maxCrit) * 5);
  } else if (sensor.vibration > thresholds.vibration.maxWarn) {
    const ratio = (sensor.vibration - thresholds.vibration.maxWarn) / 
      (thresholds.vibration.maxCrit - thresholds.vibration.maxWarn);
    vibPenalty = ratio * 35;
  }

  // 3. Pressure penalty (Nominal 2.0 - 2.8 bar)
  let pressPenalty = 0;
  if (sensor.pressure > thresholds.pressure.maxCrit) {
    pressPenalty = 15;
  } else if (sensor.pressure > thresholds.pressure.maxWarn) {
    pressPenalty = 8;
  } else if (sensor.pressure < thresholds.pressure.min) {
    pressPenalty = 12;
  }

  // 4. Electrical stress penalty (Voltage & Current)
  let elecPenalty = 0;
  if (sensor.current > thresholds.current.maxCrit) {
    elecPenalty += 20;
  } else if (sensor.current > thresholds.current.maxWarn) {
    elecPenalty += 10;
  }
  
  if (sensor.voltage < thresholds.voltage.minCrit || sensor.voltage > thresholds.voltage.maxCrit) {
    elecPenalty += 15;
  } else if (sensor.voltage < thresholds.voltage.minWarn || sensor.voltage > thresholds.voltage.maxWarn) {
    elecPenalty += 6;
  }

  // Composite raw health score (Base 100 - aggregated penalties)
  const totalPenalty = tempPenalty + vibPenalty + pressPenalty + elecPenalty;
  const rawHealth = Math.max(5, Math.min(100, Math.round(100 - totalPenalty)));

  // Failure probability derived from degradation sigmoid curve
  // Probability increases rapidly as health drops below 60
  const z = (65 - rawHealth) / 12;
  const sigmoid = 1 / (1 + Math.exp(-z));
  const failureProbability = Number(Math.max(0.02, Math.min(0.98, sigmoid)).toFixed(2));
  const normalProbability = Number((1 - failureProbability).toFixed(2));

  return {
    healthScore: rawHealth,
    failureProbability,
    normalProbability,
  };
}

/**
 * Status Engine mapping health score & failure probability to MachineHealthStatus
 * Configurable thresholds:
 * Health >= 70 -> HEALTHY
 * Health 40-69 -> WARNING
 * Health < 40  -> CRITICAL
 * Low Health + High Failure Probability -> CRITICAL
 */
export function determineMachineStatus(
  healthScore: number,
  failureProbability: number,
  healthyThreshold = 70,
  warningThreshold = 40
): MachineHealthStatus {
  if (healthScore < warningThreshold || failureProbability > 0.65) {
    return 'Critical';
  }
  if (healthScore < healthyThreshold || failureProbability > 0.30) {
    return 'Warning';
  }
  return 'Healthy';
}
