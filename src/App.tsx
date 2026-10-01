import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { DigitalTwinView } from './components/digital_twin/DigitalTwinView';
import { LiveMonitoring } from './components/monitoring/LiveMonitoring';
import { PredictionPanel } from './components/predictions/PredictionPanel';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { DatasetView } from './components/dataset/DatasetView';
import { ModelPerformanceView } from './components/model_performance/ModelPerformanceView';
import { AboutProject } from './components/about/AboutProject';

import { 
  HistoricalPoint, 
  MachineConditionMode, 
  MaintenanceAlert, 
  PredictionResult, 
  SensorReading 
} from './types';
import { globalSimulator } from './services/simulationEngine';
import { calculateHealthScore, determineMachineStatus } from './utils/healthScore';
import { calculateRUL } from './utils/rulPrediction';
import { detectAnomalies } from './utils/anomalyDetection';
import { generateMaintenanceRecommendations } from './utils/recommendations';

function AppContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [conditionMode, setConditionMode] = useState<MachineConditionMode>('normal');
  const [activeAnomaly, setActiveAnomaly] = useState<string>('none');

  // Initial sensor state
  const [sensor, setSensor] = useState<SensorReading>(() => globalSimulator.getReading());

  // History buffer for real-time charting
  const [history, setHistory] = useState<HistoricalPoint[]>(() => {
    const initial: HistoricalPoint[] = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const past = now - i * 1000;
      initial.push({
        timeLabel: new Date(past).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: past,
        temperature: 42.0 + Math.sin(i * 0.4) * 0.6,
        vibration: 1.4 + Math.cos(i * 0.5) * 0.08,
        pressure: 2.4 + Math.sin(i * 0.3) * 0.04,
        voltage: 230 + Math.sin(i * 0.2) * 1.2,
        current: 4.2 + Math.cos(i * 0.4) * 0.05,
        healthScore: 82,
        failureProbability: 0.18,
        rulHours: 336,
      });
    }
    return initial;
  });

  // Maintenance Alerts Queue
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([
    {
      id: 'init-1',
      severity: 'Warning',
      sensor: 'Triaxial Accelerometer (V-204)',
      currentReading: '1.45 mm/s',
      expectedReading: '< 4.5 mm/s',
      recommendation: 'Baseline calibration verified. Schedule quarterly lubrication check.',
      timestamp: Date.now() - 3600 * 1000 * 3,
      status: 'Resolved',
    }
  ]);

  // Derived prediction state
  const prediction: PredictionResult = (() => {
    const { healthScore, failureProbability, normalProbability } = calculateHealthScore(sensor);
    const status = determineMachineStatus(healthScore, failureProbability);
    const { rulDays, rulHours, confidenceInterval } = calculateRUL(healthScore, sensor);
    const anomalies = detectAnomalies(sensor);

    return {
      healthScore,
      status,
      failureProbability,
      normalProbability,
      predictedClass: status === 'Healthy' ? 'Healthy' : status === 'Warning' ? 'Warning' : 'Failure',
      rulDays,
      rulHours,
      rulConfidenceInterval: confidenceInterval,
      anomalies,
      isSimulated: true,
    };
  })();

  // Core Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalMs = Math.max(150, Math.round(900 / speedMultiplier));

    const interval = setInterval(() => {
      const nextSensor = globalSimulator.nextTick(speedMultiplier);
      setSensor(nextSensor);

      // Recompute prediction for historical log
      const { healthScore, failureProbability } = calculateHealthScore(nextSensor);
      const { rulHours } = calculateRUL(healthScore, nextSensor);
      const anomalies = detectAnomalies(nextSensor);

      // Push to history (limit to 35 latest observations)
      setHistory((prev) => {
        const point: HistoricalPoint = {
          timeLabel: new Date(nextSensor.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          timestamp: nextSensor.timestamp,
          temperature: nextSensor.temperature,
          vibration: nextSensor.vibration,
          pressure: nextSensor.pressure,
          voltage: nextSensor.voltage,
          current: nextSensor.current,
          healthScore,
          failureProbability,
          rulHours,
        };
        const updated = [...prev, point];
        return updated.length > 35 ? updated.slice(updated.length - 35) : updated;
      });

      // Auto-generate maintenance recommendation tickets when anomalies are detected
      if (anomalies.length > 0) {
        const newRecs = generateMaintenanceRecommendations(nextSensor, anomalies, healthScore);
        if (newRecs.length > 0) {
          setAlerts((prev) => {
            const now = Date.now();
            const filteredNew = newRecs.filter(
              (nr) => !prev.some((p) => p.sensor === nr.sensor && now - p.timestamp < 15000 && p.status !== 'Resolved')
            );
            return [...filteredNew, ...prev].slice(0, 20);
          });
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isSimulating, speedMultiplier]);

  // Handler for condition mode changes
  const handleConditionChange = (mode: MachineConditionMode) => {
    setConditionMode(mode);
    globalSimulator.setMode(mode);
  };

  // Handler for anomaly injection
  const handleInjectAnomaly = (anomaly: any) => {
    setActiveAnomaly(anomaly);
    globalSimulator.setAnomaly(anomaly);
  };

  // Handler to reset simulation
  const handleResetSimulation = () => {
    const baseline = globalSimulator.reset('normal');
    setSensor(baseline);
    setConditionMode('normal');
    setActiveAnomaly('none');
  };

  // Handler for acknowledging maintenance alert
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Investigating' } : a))
    );
  };

  // Handler for resolving maintenance alert
  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a))
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation Bar with Top Bar Contract & Theme Switcher */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        status={prediction.status}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <LandingPage
            onLaunchDashboard={() => setActiveTab('dashboard')}
            onExploreDigitalTwin={() => setActiveTab('twin')}
            onViewAbout={() => setActiveTab('about')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardOverview
            sensor={sensor}
            prediction={prediction}
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(!isSimulating)}
            onReset={handleResetSimulation}
            conditionMode={conditionMode}
            onConditionChange={handleConditionChange}
            alerts={alerts}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'twin' && (
          <DigitalTwinView
            sensor={sensor}
            healthScore={prediction.healthScore}
            status={prediction.status}
            failureProbability={prediction.failureProbability}
            rulDays={prediction.rulDays}
            onConditionChange={handleConditionChange}
            currentMode={conditionMode}
          />
        )}

        {activeTab === 'monitoring' && (
          <LiveMonitoring
            sensor={sensor}
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(!isSimulating)}
            onReset={handleResetSimulation}
            speedMultiplier={speedMultiplier}
            onSpeedChange={setSpeedMultiplier}
            conditionMode={conditionMode}
            onConditionChange={handleConditionChange}
            history={history}
            onInjectAnomaly={handleInjectAnomaly}
            activeAnomaly={activeAnomaly}
          />
        )}

        {activeTab === 'predictions' && (
          <PredictionPanel
            prediction={prediction}
            sensor={sensor}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView history={history} />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceView
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
            sensor={sensor}
            healthScore={prediction.healthScore}
          />
        )}

        {activeTab === 'dataset' && (
          <DatasetView />
        )}

        {activeTab === 'performance' && (
          <ModelPerformanceView />
        )}

        {activeTab === 'about' && (
          <AboutProject />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
