import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Flame, 
  Gauge, 
  Hourglass, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert, 
  Sliders, 
  Wrench, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { MachineConditionMode, MachineHealthStatus, MaintenanceAlert, PredictionResult, SensorReading } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface DashboardOverviewProps {
  sensor: SensorReading;
  prediction: PredictionResult;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onReset: () => void;
  conditionMode: MachineConditionMode;
  onConditionChange: (mode: MachineConditionMode) => void;
  alerts: MaintenanceAlert[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  sensor,
  prediction,
  isSimulating,
  onToggleSimulation,
  onReset,
  conditionMode,
  onConditionChange,
  alerts,
  onNavigateTab,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { healthScore, status, failureProbability, rulDays, rulHours, anomalies } = prediction;

  const getStatusColor = (st: MachineHealthStatus) => {
    switch (st) {
      case 'Healthy':
        return isDark ? 'text-emerald-400' : 'text-emerald-700';
      case 'Warning':
        return isDark ? 'text-amber-400' : 'text-amber-700';
      case 'Critical':
        return isDark ? 'text-rose-400' : 'text-rose-700';
    }
  };

  const getStatusBadge = (st: MachineHealthStatus) => {
    switch (st) {
      case 'Healthy':
        return (
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isDark 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            Healthy (Low Risk)
          </span>
        );
      case 'Warning':
        return (
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isDark 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
              : 'bg-amber-100 text-amber-800 border-amber-200'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            Warning (Moderate Risk)
          </span>
        );
      case 'Critical':
        return (
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border animate-pulse ${
            isDark 
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/40' 
              : 'bg-rose-100 text-rose-800 border-rose-200'
          }`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            Critical (High Risk / Failure Imminent)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner Notice */}
      <div className={`rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border transition-colors ${
        isDark 
          ? 'bg-slate-900 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border ${
            isDark 
              ? 'bg-cyan-950/80 border-cyan-800 text-cyan-400' 
              : 'bg-sky-50 border-sky-200 text-sky-600'
          }`}>
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Machine: Industrial Motor 01
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                isDark 
                  ? 'bg-slate-800 text-slate-300 border-slate-700' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                Simulation Mode Active
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Live telemetry is generated via physics-correlated simulation engine. Ready for IoT MQTT stream integration.
            </p>
          </div>
        </div>

        {/* Quick Simulation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              isSimulating
                ? isDark
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                : isDark
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isSimulating ? 'Pause Stream' : 'Run Stream'}</span>
          </button>

          <button
            onClick={onReset}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
            title="Reset Simulation Baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className={`h-5 w-[1px] hidden sm:block ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Condition Mode Quick Trigger */}
          <div className={`flex items-center gap-1 border p-1 rounded-lg ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => onConditionChange('normal')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                conditionMode === 'normal' 
                  ? isDark 
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs' 
                    : 'bg-emerald-200 text-emerald-900 font-bold border border-emerald-300' 
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onConditionChange('warning')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                conditionMode === 'warning' 
                  ? isDark 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'bg-amber-200 text-amber-900 font-bold border border-amber-300' 
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Warning
            </button>
            <button
              onClick={() => onConditionChange('critical')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                conditionMode === 'critical' 
                  ? isDark 
                    ? 'bg-rose-500 text-white font-bold shadow-xs' 
                    : 'bg-rose-200 text-rose-900 font-bold border border-rose-300' 
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Critical
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Summary Metric Cards (Section 4 Mandate) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Machine Health */}
        <div className={`rounded-xl p-5 flex flex-col justify-between border transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-emerald-50/50 border-emerald-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={`font-semibold uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-400' : 'text-emerald-800'}`}>
              Machine Health
            </span>
            <span className={`font-mono font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Health Index
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-extrabold font-mono tabular-nums ${getStatusColor(status)}`}>
                {healthScore}
              </span>
              <span className={`text-lg font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>%</span>
            </div>
            
            {/* Visual Health Progress Bar */}
            <div className={`w-full h-2 rounded-full overflow-hidden mt-2 ${isDark ? 'bg-slate-800' : 'bg-emerald-200/60'}`}>
              <div 
                className={`h-full transition-all duration-500 ${
                  status === 'Healthy' 
                    ? isDark ? 'bg-emerald-400 shadow-xs shadow-emerald-400/50' : 'bg-emerald-500' 
                    : status === 'Warning' 
                    ? isDark ? 'bg-amber-400' : 'bg-amber-500' 
                    : isDark ? 'bg-rose-400' : 'bg-rose-500'
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          <div className={`text-[11px] flex items-center justify-between font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span>Nominal &gt;= 70%</span>
            <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{status}</span>
          </div>
        </div>

        {/* Card 2: Failure Probability */}
        <div className={`rounded-xl p-5 flex flex-col justify-between border transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-rose-50/50 border-rose-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={`font-semibold uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-400' : 'text-rose-800'}`}>
              Failure Probability
            </span>
            <span className={`font-mono font-semibold ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>
              Softmax Risk
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-extrabold font-mono tabular-nums ${
                failureProbability > 0.3 
                  ? (isDark ? 'text-rose-400' : 'text-rose-700') 
                  : (isDark ? 'text-slate-100' : 'text-slate-800')
              }`}>
                {(failureProbability * 100).toFixed(0)}
              </span>
              <span className={`text-lg font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>%</span>
            </div>

            <div className={`w-full h-2 rounded-full overflow-hidden mt-2 ${isDark ? 'bg-slate-800' : 'bg-rose-200/60'}`}>
              <div 
                className={`h-full transition-all duration-500 ${isDark ? 'bg-rose-400 shadow-xs shadow-rose-400/50' : 'bg-rose-500'}`}
                style={{ width: `${failureProbability * 100}%` }}
              />
            </div>
          </div>

          <div className={`text-[11px] flex items-center justify-between font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span>Normal: {((1 - failureProbability) * 100).toFixed(0)}%</span>
            <span className={failureProbability > 0.3 
              ? (isDark ? 'text-rose-400 font-semibold' : 'text-rose-700 font-bold') 
              : (isDark ? 'text-emerald-400' : 'text-emerald-700')
            }>
              {failureProbability < 0.25 ? 'Low Risk' : failureProbability < 0.6 ? 'Moderate Risk' : 'High Risk'}
            </span>
          </div>
        </div>

        {/* Card 3: Remaining Useful Life (RUL) */}
        <div className={`rounded-xl p-5 flex flex-col justify-between border transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-sky-50/50 border-sky-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={`font-semibold uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-400' : 'text-sky-800'}`}>
              Remaining Useful Life
            </span>
            <span className={`font-mono font-semibold ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
              Prognostics
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-4xl font-extrabold font-mono tabular-nums ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
                {rulDays}
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>days</span>
            </div>

            <div className={`w-full h-2 rounded-full overflow-hidden mt-2 ${isDark ? 'bg-slate-800' : 'bg-sky-200/60'}`}>
              <div 
                className={`h-full transition-all duration-500 ${isDark ? 'bg-cyan-400 shadow-xs shadow-cyan-400/50' : 'bg-sky-500'}`}
                style={{ width: `${Math.min(100, (rulDays / 30) * 100)}%` }}
              />
            </div>
          </div>

          <div className={`text-[11px] flex items-center justify-between font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span>Est. {rulHours} hrs</span>
            <span>Arrhenius Model</span>
          </div>
        </div>

        {/* Card 4: Current Operating Status */}
        <div className={`rounded-xl p-5 flex flex-col justify-between border transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-amber-50/50 border-amber-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={`font-semibold uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-400' : 'text-amber-800'}`}>
              Current Status
            </span>
            <span className={`font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              ISO 10816
            </span>
          </div>

          <div className="my-3">
            <div className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {status === 'Healthy' && <CheckCircle2 className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />}
              {status === 'Warning' && <AlertTriangle className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />}
              {status === 'Critical' && <ShieldAlert className={`w-6 h-6 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />}
              <span>{status}</span>
            </div>
            <div className="mt-2">{getStatusBadge(status)}</div>
          </div>

          <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {anomalies.length === 0 ? 'Zero active faults' : `${anomalies.length} anomaly signal flagged`}
          </div>
        </div>
      </div>

      {/* Middle Section: Digital Twin Quick Portal & Live Telemetry Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Telemetry Gauges + Digital Twin Portal */}
        <div className={`lg:col-span-2 rounded-xl p-6 flex flex-col justify-between border transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                <Activity className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                <span>Live Digital Twin Sensor Feed</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Physical sensor state synchronized with virtual mathematical twin.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('twin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-xs shadow-cyan-500/30' 
                  : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
              }`}
            >
              <span>View 3D Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5 Physical Sensors Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-2">
            <div className={`p-3 rounded-lg border transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-orange-50/60 border-orange-200/70'
            }`}>
              <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-orange-700 font-medium'}`}>
                <Flame className={`w-3 h-3 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} /> Temp
              </span>
              <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {sensor.temperature.toFixed(1)} <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>°C</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-sky-50/60 border-sky-200/70'
            }`}>
              <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-sky-700 font-medium'}`}>
                <Activity className={`w-3 h-3 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} /> Vib
              </span>
              <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {sensor.vibration.toFixed(2)} <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>mm/s</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-indigo-50/60 border-indigo-200/70'
            }`}>
              <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-indigo-700 font-medium'}`}>
                <Gauge className={`w-3 h-3 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} /> Press
              </span>
              <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {sensor.pressure.toFixed(2)} <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>bar</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-amber-50/60 border-amber-200/70'
            }`}>
              <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-amber-700 font-medium'}`}>
                <Zap className={`w-3 h-3 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`} /> Volts
              </span>
              <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {sensor.voltage.toFixed(0)} <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>V</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border col-span-2 sm:col-span-1 transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-purple-50/60 border-purple-200/70'
            }`}>
              <span className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-purple-700 font-medium'}`}>
                <Sliders className={`w-3 h-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> Amps
              </span>
              <div className={`text-lg font-bold font-mono mt-1 tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {sensor.current.toFixed(2)} <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>A</span>
              </div>
            </div>
          </div>

          {/* Quick status bar */}
          <div className={`flex items-center justify-between text-xs pt-4 border-t font-mono ${
            isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
          }`}>
            <span>Rotor Speed: {sensor.rotationalSpeed} RPM</span>
            <span>Sample Frequency: 10 Hz</span>
            <span>Health Status: <strong className={getStatusColor(status)}>{status}</strong></span>
          </div>
        </div>

        {/* Right 1 Col: Maintenance Alerts Stream */}
        <div className={`rounded-xl p-6 flex flex-col justify-between border transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                <Wrench className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                <span>Active Maintenance Tickets</span>
              </h3>
              <button
                onClick={() => onNavigateTab('maintenance')}
                className={`text-xs font-medium cursor-pointer ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-sky-600 hover:text-sky-700'}`}
              >
                All &rarr;
              </button>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className={`py-6 text-center text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No active maintenance work orders.
                </div>
              ) : (
                alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border text-xs transition-colors ${
                      alert.severity === 'Critical'
                        ? isDark 
                          ? 'bg-rose-950/30 border-rose-900/60' 
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                        : isDark 
                          ? 'bg-amber-950/30 border-amber-900/50' 
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono mb-1">
                      <span className={`font-bold ${
                        alert.severity === 'Critical' 
                          ? (isDark ? 'text-rose-400' : 'text-rose-700') 
                          : (isDark ? 'text-amber-400' : 'text-amber-700')
                      }`}>
                        {alert.severity}
                      </span>
                      <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className={`line-clamp-2 leading-relaxed text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {alert.recommendation}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`pt-3 border-t mt-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={() => onNavigateTab('predictions')}
              className={`w-full py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
              }`}
            >
              <span>Examine Anomaly Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
