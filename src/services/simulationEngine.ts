import { MachineConditionMode, SensorReading } from '../types';

export interface SimulationParams {
  mode: MachineConditionMode;
  speedMultiplier: number;
  noiseLevel: number;
  anomalyInjection: 'none' | 'bearing_fault' | 'thermal_runaway' | 'voltage_spike' | 'pressure_drop';
}

export class SensorSimulator {
  private currentReading: SensorReading;
  private mode: MachineConditionMode = 'normal';
  private stepCount: number = 0;
  private anomaly: SimulationParams['anomalyInjection'] = 'none';

  constructor() {
    this.currentReading = {
      timestamp: Date.now(),
      temperature: 42.4,
      vibration: 1.45,
      pressure: 2.42,
      voltage: 230.2,
      current: 4.22,
      rotationalSpeed: 1780,
    };
  }

  public setMode(mode: MachineConditionMode) {
    this.mode = mode;
  }

  public setAnomaly(anomaly: SimulationParams['anomalyInjection']) {
    this.anomaly = anomaly;
  }

  public reset(mode: MachineConditionMode = 'normal'): SensorReading {
    this.mode = mode;
    this.anomaly = 'none';
    this.stepCount = 0;

    switch (mode) {
      case 'warning':
        this.currentReading = {
          timestamp: Date.now(),
          temperature: 68.5,
          vibration: 4.8,
          pressure: 3.3,
          voltage: 212.0,
          current: 6.9,
          rotationalSpeed: 1740,
        };
        break;
      case 'critical':
        this.currentReading = {
          timestamp: Date.now(),
          temperature: 88.0,
          vibration: 8.2,
          pressure: 4.1,
          voltage: 198.0,
          current: 9.1,
          rotationalSpeed: 1610,
        };
        break;
      case 'normal':
      default:
        this.currentReading = {
          timestamp: Date.now(),
          temperature: 42.0,
          vibration: 1.4,
          pressure: 2.4,
          voltage: 230.0,
          current: 4.2,
          rotationalSpeed: 1780,
        };
        break;
    }
    return { ...this.currentReading };
  }

  public getReading(): SensorReading {
    return { ...this.currentReading };
  }

  public nextTick(speedMultiplier: number = 1.0): SensorReading {
    this.stepCount++;
    const t = this.stepCount * 0.1;
    const now = Date.now();

    // Base target profiles per condition mode
    let targetTemp: number;
    let targetVib: number;
    let targetPres: number;
    let targetVolt: number;
    let targetCurr: number;
    let targetRpm: number;

    switch (this.mode) {
      case 'normal':
        targetTemp = 42.0 + Math.sin(t * 0.4) * 2.5;
        targetVib = 1.4 + Math.cos(t * 0.7) * 0.35;
        targetPres = 2.4 + Math.sin(t * 0.3) * 0.15;
        targetVolt = 230.0 + Math.sin(t * 0.5) * 2.0;
        targetCurr = 4.2 + Math.cos(t * 0.4) * 0.25;
        targetRpm = 1785 + Math.sin(t * 0.6) * 15;
        break;

      case 'warning':
        // Correlated moderate stress
        targetTemp = 68.0 + Math.sin(t * 0.6) * 4.0 + (this.stepCount % 50) * 0.1;
        targetVib = 5.1 + Math.cos(t * 0.9) * 0.8;
        targetPres = 3.35 + Math.sin(t * 0.5) * 0.3;
        targetVolt = 214.0 + (Math.random() - 0.5) * 7.0;
        targetCurr = 7.1 + Math.cos(t * 0.6) * 0.6;
        targetRpm = 1730 - Math.abs(Math.sin(t * 0.8)) * 30;
        break;

      case 'critical':
        // Severe non-linear escalation
        targetTemp = 89.5 + Math.sin(t * 0.8) * 6.0 + (this.stepCount % 100) * 0.15;
        targetVib = 8.6 + Math.cos(t * 1.2) * 1.8 + (Math.random() * 0.6);
        targetPres = 4.15 + Math.sin(t * 0.7) * 0.45;
        targetVolt = 200.0 + (Math.random() - 0.5) * 18.0;
        targetCurr = 9.4 + Math.cos(t * 0.8) * 1.1;
        targetRpm = 1620 - (this.stepCount % 40) * 2;
        break;
    }

    // Apply manual anomaly injection if active
    if (this.anomaly === 'bearing_fault') {
      targetVib += 3.8 + Math.sin(t * 3.0) * 1.2;
      targetTemp += 8.0;
    } else if (this.anomaly === 'thermal_runaway') {
      targetTemp += 18.0 + (this.stepCount % 30) * 0.5;
      targetCurr += 1.8;
    } else if (this.anomaly === 'voltage_spike') {
      targetVolt += 28.0 * (Math.sin(t * 2) > 0.5 ? 1 : -1);
    } else if (this.anomaly === 'pressure_drop') {
      targetPres = Math.max(0.8, targetPres - 1.8);
      targetTemp += 5.0;
    }

    // Correlated physical smoothing with momentum (low pass filter)
    const alpha = Math.min(0.45, 0.15 * speedMultiplier);
    
    // Slight random sensor jitter (Gaussian approximation)
    const jitter = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.1;

    const newTemp = this.currentReading.temperature + alpha * (targetTemp - this.currentReading.temperature) + jitter() * 0.3;
    const newVib = Math.max(0.1, this.currentReading.vibration + alpha * (targetVib - this.currentReading.vibration) + jitter() * 0.1);
    const newPres = Math.max(0.5, this.currentReading.pressure + alpha * (targetPres - this.currentReading.pressure) + jitter() * 0.05);
    const newVolt = this.currentReading.voltage + alpha * (targetVolt - this.currentReading.voltage) + jitter() * 0.8;
    const newCurr = Math.max(0.5, this.currentReading.current + alpha * (targetCurr - this.currentReading.current) + jitter() * 0.1);
    const newRpm = Math.max(800, this.currentReading.rotationalSpeed + alpha * (targetRpm - this.currentReading.rotationalSpeed) + jitter() * 4);

    this.currentReading = {
      timestamp: now,
      temperature: Number(newTemp.toFixed(1)),
      vibration: Number(newVib.toFixed(2)),
      pressure: Number(newPres.toFixed(2)),
      voltage: Number(newVolt.toFixed(1)),
      current: Number(newCurr.toFixed(2)),
      rotationalSpeed: Math.round(newRpm),
    };

    return { ...this.currentReading };
  }
}

export const globalSimulator = new SensorSimulator();
