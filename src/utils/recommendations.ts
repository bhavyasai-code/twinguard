import { AnomalyReport, MaintenanceAlert, SensorReading } from '../types';

/**
 * Maintenance Recommendation Engine.
 * 
 * Generates rule-based actionable work orders and engineering instructions
 * based on live telemetry anomalies and machine health degradation.
 */
export function generateMaintenanceRecommendations(
  sensor: SensorReading,
  anomalies: AnomalyReport[],
  healthScore: number
): MaintenanceAlert[] {
  const alerts: MaintenanceAlert[] = [];
  const now = Date.now();

  // If multiple anomalies detected simultaneously:
  if (anomalies.length >= 2) {
    alerts.push({
      id: `crit-multi-${now}`,
      severity: 'Critical',
      sensor: 'Multi-Sensor (Vibration & Thermal)',
      currentReading: `${sensor.vibration.toFixed(1)} mm/s | ${sensor.temperature.toFixed(0)} °C`,
      expectedReading: 'All parameters nominal',
      recommendation: 'Compound failure detected: Schedule immediate emergency inspection. Throttle motor speed and lubricate bearings.',
      timestamp: now,
      status: 'Open',
    });
  }

  // Individual sensor rules
  for (const anomaly of anomalies) {
    if (anomaly.sensor === 'temperature') {
      alerts.push({
        id: `temp-${anomaly.detectedAt}`,
        severity: anomaly.severity === 'High' ? 'Critical' : 'Warning',
        sensor: 'Temperature Sensor (T-101)',
        currentReading: String(anomaly.currentValue),
        expectedReading: anomaly.expectedRange,
        recommendation: anomaly.severity === 'High'
          ? 'Emergency cooling system flush required. Check coolant circulation pump and clean stator heat dissipation fins.'
          : 'Inspect cooling fan shroud for dust accumulation; check ambient enclosure airflow.',
        timestamp: anomaly.detectedAt,
        status: 'Open',
      });
    }

    if (anomaly.sensor === 'vibration') {
      alerts.push({
        id: `vib-${anomaly.detectedAt}`,
        severity: anomaly.severity === 'High' ? 'Critical' : 'Warning',
        sensor: 'Triaxial Accelerometer (V-204)',
        currentReading: String(anomaly.currentValue),
        expectedReading: anomaly.expectedRange,
        recommendation: anomaly.severity === 'High'
          ? 'Severe mechanical looseness or inner/outer bearing raceway spalling. Immediate rotor balancing and bearing replacement advised.'
          : 'Inspect motor shaft alignment and verify anchor bolt torque on foundation plate.',
        timestamp: anomaly.detectedAt,
        status: 'Open',
      });
    }

    if (anomaly.sensor === 'pressure') {
      alerts.push({
        id: `press-${anomaly.detectedAt}`,
        severity: 'Warning',
        sensor: 'Hydraulic/Oil Pressure (P-301)',
        currentReading: String(anomaly.currentValue),
        expectedReading: anomaly.expectedRange,
        recommendation: 'Check oil filter differential pressure, replenish ISO VG 68 synthetic lubricant.',
        timestamp: anomaly.detectedAt,
        status: 'Open',
      });
    }

    if (anomaly.sensor === 'current' || anomaly.sensor === 'voltage') {
      alerts.push({
        id: `elec-${anomaly.detectedAt}`,
        severity: anomaly.severity === 'High' ? 'Critical' : 'Warning',
        sensor: anomaly.sensor === 'current' ? 'Current Sensor (I-402)' : 'Bus Voltage (V-401)',
        currentReading: String(anomaly.currentValue),
        expectedReading: anomaly.expectedRange,
        recommendation: anomaly.severity === 'High'
          ? 'Potential phase imbalance or winding short. Isolate variable frequency drive (VFD) and perform megger insulation test.'
          : 'Check electrical distribution bus bars and verify power factor correction capacitors.',
        timestamp: anomaly.detectedAt,
        status: 'Open',
      });
    }
  }

  // If machine health is low but no specific sensor alert fired (drift)
  if (healthScore < 50 && alerts.length === 0) {
    alerts.push({
      id: `health-drift-${now}`,
      severity: 'Warning',
      sensor: 'System Diagnostics',
      currentReading: `Health Score ${healthScore}%`,
      expectedReading: 'Health Score > 70%',
      recommendation: 'Cumulative wear index is deteriorating. Schedule routine preventive overhaul within 48 operating hours.',
      timestamp: now,
      status: 'Open',
    });
  }

  return alerts;
}
