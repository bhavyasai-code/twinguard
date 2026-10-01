import { AnomalyReport, SensorReading, SensorThresholds } from '../types';
import { DEFAULT_THRESHOLDS } from './thresholds';

/**
 * Anomaly Detection Engine.
 * 
 * Inspects sensor channels against multi-tier industrial statistical envelopes.
 * Designed to act as a drop-in interface for an Isolation Forest, One-Class SVM,
 * or LSTM Autoencoder reconstruction error classifier.
 */
export function detectAnomalies(
  sensor: SensorReading,
  thresholds: SensorThresholds = DEFAULT_THRESHOLDS
): AnomalyReport[] {
  const anomalies: AnomalyReport[] = [];
  const now = Date.now();

  // 1. Vibration inspection
  if (sensor.vibration > thresholds.vibration.maxCrit) {
    anomalies.push({
      isAnomaly: true,
      sensor: 'vibration',
      currentValue: `${sensor.vibration.toFixed(2)} mm/s`,
      expectedRange: `< ${thresholds.vibration.maxWarn} mm/s`,
      severity: 'High',
      message: 'Severe mechanical oscillation detected. Exceeds ISO 10816 Zone D boundary.',
      detectedAt: now,
    });
  } else if (sensor.vibration > thresholds.vibration.maxWarn) {
    anomalies.push({
      isAnomaly: true,
      sensor: 'vibration',
      currentValue: `${sensor.vibration.toFixed(2)} mm/s`,
      expectedRange: `< ${thresholds.vibration.maxWarn} mm/s`,
      severity: 'Medium',
      message: 'Elevated vibration signature indicating prospective bearing degradation or unbalance.',
      detectedAt: now,
    });
  }

  // 2. Temperature inspection
  if (sensor.temperature > thresholds.temperature.maxCrit) {
    anomalies.push({
      isAnomaly: true,
      sensor: 'temperature',
      currentValue: `${sensor.temperature.toFixed(1)} °C`,
      expectedRange: `20 - ${thresholds.temperature.maxWarn} °C`,
      severity: 'High',
      message: 'Extreme thermal overload. Stator winding insulation breakdown imminent.',
      detectedAt: now,
    });
  } else if (sensor.temperature > thresholds.temperature.maxWarn) {
    anomalies.push({
      isAnomaly: true,
      sensor: 'temperature',
      currentValue: `${sensor.temperature.toFixed(1)} °C`,
      expectedRange: `20 - ${thresholds.temperature.maxWarn} °C`,
      severity: 'Medium',
      message: 'Abnormal thermal drift. Cooling efficiency degraded.',
      detectedAt: now,
    });
  }

  // 3. Pressure inspection
  if (sensor.pressure > thresholds.pressure.maxCrit || sensor.pressure < thresholds.pressure.min) {
    anomalies.push({
      isAnomaly: true,
      sensor: 'pressure',
      currentValue: `${sensor.pressure.toFixed(2)} bar`,
      expectedRange: `${thresholds.pressure.min} - ${thresholds.pressure.maxWarn} bar`,
      severity: 'High',
      message: 'Hydraulic/lubrication pressure outside operational safety boundary.',
      detectedAt: now,
    });
  } else if (sensor.pressure > thresholds.pressure.maxWarn) {
    anomalies.push({
      isAnomaly: true,
      sensor: 'pressure',
      currentValue: `${sensor.pressure.toFixed(2)} bar`,
      expectedRange: `${thresholds.pressure.min} - ${thresholds.pressure.maxWarn} bar`,
      severity: 'Medium',
      message: 'Lubrication line pressure elevated. Potential filter blockage.',
      detectedAt: now,
    });
  }

  // 4. Current inspection
  if (sensor.current > thresholds.current.maxCrit) {
    anomalies.push({
      isAnomaly: true,
      sensor: 'current',
      currentValue: `${sensor.current.toFixed(1)} A`,
      expectedRange: `< ${thresholds.current.maxWarn} A`,
      severity: 'High',
      message: 'Excessive overcurrent draw. Mechanical jamming or winding short circuit.',
      detectedAt: now,
    });
  } else if (sensor.current > thresholds.current.maxWarn) {
    anomalies.push({
      isAnomaly: true,
      sensor: 'current',
      currentValue: `${sensor.current.toFixed(1)} A`,
      expectedRange: `< ${thresholds.current.maxWarn} A`,
      severity: 'Medium',
      message: 'Motor drawing higher current than rated load curve.',
      detectedAt: now,
    });
  }

  // 5. Voltage inspection
  if (sensor.voltage > thresholds.voltage.maxCrit || sensor.voltage < thresholds.voltage.minCrit) {
    anomalies.push({
      isAnomaly: true,
      sensor: 'voltage',
      currentValue: `${sensor.voltage.toFixed(0)} V`,
      expectedRange: `${thresholds.voltage.minWarn} - ${thresholds.voltage.maxWarn} V`,
      severity: 'Medium',
      message: 'Power supply voltage excursion detected. Risk of stator surge.',
      detectedAt: now,
    });
  }

  return anomalies;
}
