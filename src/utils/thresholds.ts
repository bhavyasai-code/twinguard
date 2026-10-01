import { SensorThresholds } from '../types';

export const DEFAULT_THRESHOLDS: SensorThresholds = {
  temperature: {
    min: 20,
    maxWarn: 65,  // ISO motor winding standard
    maxCrit: 85,  // Critical thermal threshold
    unit: '°C',
  },
  vibration: {
    min: 0.1,
    maxWarn: 4.5, // ISO 10816-3 Zone C boundary (unrestricted operation limit)
    maxCrit: 7.1, // ISO 10816-3 Zone D boundary (causes damage)
    unit: 'mm/s',
  },
  pressure: {
    min: 1.5,
    maxWarn: 3.2,
    maxCrit: 4.0,
    unit: 'bar',
  },
  voltage: {
    minCrit: 205,
    minWarn: 215,
    maxWarn: 245,
    maxCrit: 255,
    unit: 'V',
  },
  current: {
    min: 1.0,
    maxWarn: 6.8, // Rated current 5.0A, 135% is warn
    maxCrit: 8.5, // Overcurrent trip point
    unit: 'A',
  },
};
