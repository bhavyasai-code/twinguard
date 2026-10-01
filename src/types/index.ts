export type MachineConditionMode = 'normal' | 'warning' | 'critical';

export type MachineHealthStatus = 'Healthy' | 'Warning' | 'Critical';

export interface SensorReading {
  timestamp: number;
  temperature: number; // °C
  vibration: number;   // mm/s RMS (or G)
  pressure: number;    // bar
  voltage: number;     // V
  current: number;     // A
  rotationalSpeed: number; // RPM
}

export interface AnomalyReport {
  isAnomaly: boolean;
  sensor: 'temperature' | 'vibration' | 'pressure' | 'voltage' | 'current' | null;
  currentValue: number | string;
  expectedRange: string;
  severity: 'Low' | 'Medium' | 'High';
  message: string;
  detectedAt: number;
}

export interface PredictionResult {
  healthScore: number; // 0-100
  status: MachineHealthStatus;
  failureProbability: number; // 0-1 (e.g. 0.18 for 18%)
  normalProbability: number;  // 0-1 (e.g. 0.82 for 82%)
  predictedClass: 'Healthy' | 'Warning' | 'Failure';
  rulDays: number;
  rulHours: number;
  rulConfidenceInterval: [number, number]; // [lowerHours, upperHours]
  anomalies: AnomalyReport[];
  isSimulated: boolean;
}

export interface MaintenanceAlert {
  id: string;
  severity: 'Info' | 'Warning' | 'Critical';
  sensor: string;
  currentReading: string;
  expectedReading: string;
  recommendation: string;
  timestamp: number;
  acknowledged?: boolean;
  status: 'Open' | 'Investigating' | 'Resolved';
  actionTaken?: string;
}

export interface SensorThresholds {
  temperature: { min: number; maxWarn: number; maxCrit: number; unit: string };
  vibration: { min: number; maxWarn: number; maxCrit: number; unit: string };
  pressure: { min: number; maxWarn: number; maxCrit: number; unit: string };
  voltage: { minWarn: number; minCrit: number; maxWarn: number; maxCrit: number; unit: string };
  current: { min: number; maxWarn: number; maxCrit: number; unit: string };
}

export interface DatasetColumnStats {
  name: string;
  count: number;
  mean: number;
  std: number;
  min: number;
  max: number;
  missing: number;
  type: 'numeric' | 'string' | 'categorical';
}

export interface DatasetSummary {
  name: string;
  description: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  missingValuesTotal: number;
  stats: Record<string, DatasetColumnStats>;
  sampleRows: Record<string, any>[];
}

export interface HistoricalPoint {
  timeLabel: string;
  timestamp: number;
  temperature: number;
  vibration: number;
  pressure: number;
  voltage: number;
  current: number;
  healthScore: number;
  failureProbability: number;
  rulHours: number;
}
