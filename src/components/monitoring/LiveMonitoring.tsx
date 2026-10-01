import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Activity, 
  Gauge, 
  Zap, 
  Sliders, 
  AlertOctagon, 
  ShieldCheck, 
  Clock,
  Sparkles
} from 'lucide-react';
import { HistoricalPoint, MachineConditionMode, SensorReading } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface LiveMonitoringProps {
  sensor: SensorReading;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onReset: () => void;
  speedMultiplier: number;
  onSpeedChange: (speed: number) => void;
  conditionMode: MachineConditionMode;
  onConditionChange: (mode: MachineConditionMode) => void;
  history: HistoricalPoint[];
  onInjectAnomaly: (type: 'none' | 'bearing_fault' | 'thermal_runaway' | 'voltage_spike' | 'pressure_drop') => void;
  activeAnomaly: string;
}

export const LiveMonitoring: React.FC<LiveMonitoringProps> = ({
  sensor,
  isSimulating,
  onToggleSimulation,
  onReset,
  speedMultiplier,
  onSpeedChange,
  conditionMode,
  onConditionChange,
  history,
  onInjectAnomaly,
  activeAnomaly,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedChart, setSelectedChart] = useState<'all' | 'temperature' | 'vibration' | 'pressure' | 'electrical'>('all');

  // SVG Chart rendering helper adapted for themes
  const renderLineChart = (
    data: HistoricalPoint[],
    dataKey: keyof HistoricalPoint,
    unit: string,
    darkColor: string,
    lightColor: string,
    warnLine?: number,
    critLine?: number,
    minY?: number,
    maxY?: number
  ) => {
    const color = isDark ? darkColor : lightColor;
    if (!data || data.length < 2) {
      return (
        <div className={`h-44 flex items-center justify-center text-xs font-mono ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`}>
          Buffering telemetry stream...
        </div>
      );
    }

    const values = data.map((d) => Number(d[dataKey]));
    const computedMin = minY !== undefined ? minY : Math.min(...values);
    const computedMax = maxY !== undefined ? maxY : Math.max(...values);
    const range = (computedMax - computedMin) || 1;

    const width = 600;
    const height = 160;
    const paddingX = 40;
    const paddingY = 20;

    const getX = (index: number) => paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
    const getY = (val: number) => height - paddingY - ((val - computedMin) / range) * (height - 2 * paddingY);

    const points = data.map((d, i) => `${getX(i)},${getY(Number(d[dataKey]))}`).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = height - paddingY - ratio * (height - 2 * paddingY);
          const val = computedMin + ratio * range;
          return (
            <g key={idx}>
              <line 
                x1={paddingX} 
                y1={y} 
                x2={width - paddingX} 
                y2={y} 
                stroke={isDark ? '#1e293b' : '#e2e8f0'} 
                strokeDasharray="3 3" 
                strokeWidth="1" 
              />
              <text 
                x={paddingX - 8} 
                y={y + 3} 
                fill={isDark ? '#64748b' : '#94a3b8'} 
                fontSize="9" 
                textAnchor="end" 
                fontFamily="monospace"
              >
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Warning threshold line */}
        {warnLine !== undefined && warnLine >= computedMin && warnLine <= computedMax && (
          <g>
            <line
              x1={paddingX}
              y1={getY(warnLine)}
              x2={width - paddingX}
              y2={getY(warnLine)}
              stroke={isDark ? '#f59e0b' : '#d97706'}
              strokeDasharray="4 2"
              strokeWidth="1.2"
            />
            <text 
              x={width - paddingX + 4} 
              y={getY(warnLine) + 3} 
              fill={isDark ? '#f59e0b' : '#d97706'} 
              fontSize="9" 
              fontFamily="monospace"
              fontWeight="bold"
            >
              WARN
            </text>
          </g>
        )}

        {/* Critical threshold line */}
        {critLine !== undefined && critLine >= computedMin && critLine <= computedMax && (
          <g>
            <line
              x1={paddingX}
              y1={getY(critLine)}
              x2={width - paddingX}
              y2={getY(critLine)}
              stroke={isDark ? '#ff3366' : '#dc2626'}
              strokeDasharray="4 2"
              strokeWidth="1.2"
            />
            <text 
              x={width - paddingX + 4} 
              y={getY(critLine) + 3} 
              fill={isDark ? '#ff3366' : '#dc2626'} 
              fontSize="9" 
              fontFamily="monospace"
              fontWeight="bold"
            >
              CRIT
            </text>
          </g>
        )}

        {/* The data path */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth={isDark ? '2.5' : '2.2'}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Active trailing cursor pulse */}
        {data.length > 0 && (
          <circle
            cx={getX(data.length - 1)}
            cy={getY(Number(data[data.length - 1][dataKey]))}
            r="4.5"
            fill={color}
            className="animate-pulse"
          />
        )}
      </svg>
    );
  };

  const getVibrationLabel = (v: number) => {
    if (v < 2.5) return 'Low (Good)';
    if (v < 4.5) return 'Moderate (Acceptable)';
    if (v < 7.1) return 'High (Warning)';
    return 'Critical (Failure)';
  };

  return (
    <div className="space-y-6">
      {/* Simulation Command Center Bar */}
      <div className={`flex flex-col xl:flex-row xl:items-center justify-between gap-4 rounded-xl p-5 border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Start / Stop Toggle */}
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isSimulating
                ? isDark
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
                : isDark
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Stop Simulation</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Simulation</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>

          {/* Speed Selector */}
          <div className={`flex items-center gap-1 border rounded-lg p-1 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <span className={`text-xs px-2 font-mono flex items-center gap-1 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Speed:</span>
            </span>
            {[0.5, 1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                  speedMultiplier === spd
                    ? isDark 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' 
                      : 'bg-sky-600 text-white font-bold shadow-xs'
                    : isDark 
                      ? 'text-slate-400 hover:text-slate-200' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Operating condition profile selection */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Condition State:
          </span>
          <button
            onClick={() => onConditionChange('normal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              conditionMode === 'normal'
                ? isDark 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : isDark 
                  ? 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            Normal (40-50°C, Low Vib)
          </button>
          <button
            onClick={() => onConditionChange('warning')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              conditionMode === 'warning'
                ? isDark 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                : isDark 
                  ? 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            Warning (Degrading)
          </button>
          <button
            onClick={() => onConditionChange('critical')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              conditionMode === 'critical'
                ? isDark 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                : isDark 
                  ? 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            Critical (Imminent Trip)
          </button>
        </div>
      </div>

      {/* Manual Anomaly Injection Ribbon */}
      <div className={`rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border transition-colors ${
        isDark 
          ? 'bg-slate-900/60 border-slate-800/80' 
          : 'bg-sky-50/50 border-sky-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
          <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Viva Anomaly Injector:
          </span>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Trigger specific physical failure modes into live stream:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onInjectAnomaly('bearing_fault')}
            className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
              activeAnomaly === 'bearing_fault'
                ? isDark 
                  ? 'bg-amber-500 text-black font-semibold border-amber-400' 
                  : 'bg-amber-300 text-amber-950 font-bold border-amber-400'
                : isDark 
                  ? 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            + Bearing Flaw (+Vib)
          </button>
          <button
            onClick={() => onInjectAnomaly('thermal_runaway')}
            className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
              activeAnomaly === 'thermal_runaway'
                ? isDark 
                  ? 'bg-rose-500 text-white font-semibold border-rose-400' 
                  : 'bg-rose-300 text-rose-950 font-bold border-rose-400'
                : isDark 
                  ? 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            + Thermal Runaway (+Temp)
          </button>
          <button
            onClick={() => onInjectAnomaly('voltage_spike')}
            className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
              activeAnomaly === 'voltage_spike'
                ? isDark 
                  ? 'bg-yellow-500 text-black font-semibold border-yellow-400' 
                  : 'bg-yellow-300 text-yellow-950 font-bold border-yellow-400'
                : isDark 
                  ? 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            + Grid Voltage Surge
          </button>
          <button
            onClick={() => onInjectAnomaly('pressure_drop')}
            className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
              activeAnomaly === 'pressure_drop'
                ? isDark 
                  ? 'bg-indigo-500 text-white font-semibold border-indigo-400' 
                  : 'bg-indigo-300 text-indigo-950 font-bold border-indigo-400'
                : isDark 
                  ? 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            + Lube Pressure Drop
          </button>
          {activeAnomaly !== 'none' && (
            <button
              onClick={() => onInjectAnomaly('none')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                isDark ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Clear Fault
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Metric Strip (Section 5) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Temperature */}
        <div className={`rounded-xl p-4 border transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-orange-50/50 border-orange-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-orange-700 font-medium'}`}>
              <Flame className={`w-3.5 h-3.5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
              <span>Temperature</span>
            </span>
            <span className={`font-mono text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Nominal 40-50°C</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-3xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {sensor.temperature.toFixed(1)}
            </span>
            <span className={`text-sm font-medium font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>°C</span>
          </div>
          <div className={`mt-2 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Status: <span className={
              sensor.temperature > 65 
                ? (isDark ? 'text-rose-400 font-semibold' : 'text-rose-700 font-bold') 
                : (isDark ? 'text-emerald-400' : 'text-emerald-700 font-semibold')
            }>
              {sensor.temperature > 65 ? 'Elevated' : 'Optimal'}
            </span>
          </div>
        </div>

        {/* Vibration */}
        <div className={`rounded-xl p-4 border transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-sky-50/50 border-sky-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-sky-700 font-medium'}`}>
              <Activity className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <span>Vibration</span>
            </span>
            <span className={`font-mono text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>ISO 10816</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-3xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {sensor.vibration.toFixed(2)}
            </span>
            <span className={`text-sm font-medium font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>mm/s</span>
          </div>
          <div className={`mt-2 text-xs font-mono truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Level: <span className={
              sensor.vibration > 4.5 
                ? (isDark ? 'text-rose-400 font-semibold' : 'text-rose-700 font-bold') 
                : (isDark ? 'text-emerald-400' : 'text-emerald-700 font-semibold')
            }>
              {getVibrationLabel(sensor.vibration)}
            </span>
          </div>
        </div>

        {/* Pressure */}
        <div className={`rounded-xl p-4 border transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-indigo-50/50 border-indigo-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-indigo-700 font-medium'}`}>
              <Gauge className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span>Pressure</span>
            </span>
            <span className={`font-mono text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Nominal 2.4 bar</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-3xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {sensor.pressure.toFixed(2)}
            </span>
            <span className={`text-sm font-medium font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>bar</span>
          </div>
          <div className={`mt-2 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Hydraulic: <span className={
              sensor.pressure > 3.2 
                ? (isDark ? 'text-amber-400 font-semibold' : 'text-amber-700 font-bold') 
                : (isDark ? 'text-emerald-400' : 'text-emerald-700 font-semibold')
            }>
              {sensor.pressure > 3.2 ? 'Slightly High' : 'Normal'}
            </span>
          </div>
        </div>

        {/* Voltage */}
        <div className={`rounded-xl p-4 border transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-amber-50/50 border-amber-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-amber-700 font-medium'}`}>
              <Zap className={`w-3.5 h-3.5 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`} />
              <span>Voltage</span>
            </span>
            <span className={`font-mono text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Nominal 230 V</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-3xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {sensor.voltage.toFixed(0)}
            </span>
            <span className={`text-sm font-medium font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>V</span>
          </div>
          <div className={`mt-2 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Grid: <span className={
              sensor.voltage < 210 || sensor.voltage > 250 
                ? (isDark ? 'text-rose-400 font-semibold' : 'text-rose-700 font-bold') 
                : (isDark ? 'text-emerald-400' : 'text-emerald-700 font-semibold')
            }>
              {sensor.voltage < 210 || sensor.voltage > 250 ? 'Fluctuating' : 'Stable'}
            </span>
          </div>
        </div>

        {/* Current */}
        <div className={`rounded-xl p-4 col-span-2 md:col-span-1 border transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-purple-50/50 border-purple-200/80 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-purple-700 font-medium'}`}>
              <Sliders className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span>Current</span>
            </span>
            <span className={`font-mono text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Nominal 4.2 A</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-3xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {sensor.current.toFixed(2)}
            </span>
            <span className={`text-sm font-medium font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>A</span>
          </div>
          <div className={`mt-2 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Load: <span className={
              sensor.current > 6.8 
                ? (isDark ? 'text-rose-400 font-semibold' : 'text-rose-700 font-bold') 
                : (isDark ? 'text-emerald-400' : 'text-emerald-700 font-semibold')
            }>
              {sensor.current > 6.8 ? 'Increased' : 'Nominal'}
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Interactive Charts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Live Dynamic Telemetry Charts
          </h3>
          <div className={`flex items-center gap-1 border rounded-lg p-1 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {(['all', 'temperature', 'vibration', 'pressure', 'electrical'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedChart(tab)}
                className={`px-3 py-1 text-xs font-medium rounded capitalize transition-colors cursor-pointer ${
                  selectedChart === tab 
                    ? isDark 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' 
                      : 'bg-sky-600 text-white font-bold shadow-xs' 
                    : isDark 
                      ? 'text-slate-400 hover:text-slate-200' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart 1: Temperature vs Time */}
          {(selectedChart === 'all' || selectedChart === 'temperature') && (
            <div className={`rounded-xl p-5 border transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                  <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Temperature vs Time
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold tabular-nums ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                  {sensor.temperature.toFixed(1)} °C
                </span>
              </div>
              {renderLineChart(history, 'temperature', '°C', '#f97316', '#ea580c', 65, 85, 30, 100)}
              <div className={`flex items-center justify-between text-[11px] font-mono mt-2 ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}>
                <span>Thresholds: Warn &gt;65°C · Crit &gt;85°C</span>
                <span>Buffer: {history.length} pts</span>
              </div>
            </div>
          )}

          {/* Chart 2: Vibration vs Time */}
          {(selectedChart === 'all' || selectedChart === 'vibration') && (
            <div className={`rounded-xl p-5 border transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                  <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Vibration vs Time (RMS Velocity)
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold tabular-nums ${isDark ? 'text-cyan-400' : 'text-sky-600'}`}>
                  {sensor.vibration.toFixed(2)} mm/s
                </span>
              </div>
              {renderLineChart(history, 'vibration', 'mm/s', '#00f2fe', '#0284c7', 4.5, 7.1, 0, 10)}
              <div className={`flex items-center justify-between text-[11px] font-mono mt-2 ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}>
                <span>ISO 10816 Zone C &gt;4.5 · Zone D &gt;7.1 mm/s</span>
                <span>Buffer: {history.length} pts</span>
              </div>
            </div>
          )}

          {/* Chart 3: Pressure vs Time */}
          {(selectedChart === 'all' || selectedChart === 'pressure') && (
            <div className={`rounded-xl p-5 border transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Gauge className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Pressure vs Time
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold tabular-nums ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {sensor.pressure.toFixed(2)} bar
                </span>
              </div>
              {renderLineChart(history, 'pressure', 'bar', '#818cf8', '#6366f1', 3.2, 4.0, 1.0, 5.0)}
              <div className={`flex items-center justify-between text-[11px] font-mono mt-2 ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}>
                <span>Nominal: 2.0 - 2.8 bar · Relief limit 4.0 bar</span>
                <span>Buffer: {history.length} pts</span>
              </div>
            </div>
          )}

          {/* Chart 4: Electrical Dual Track */}
          {(selectedChart === 'all' || selectedChart === 'electrical') && (
            <div className={`rounded-xl p-5 border transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`} />
                  <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Electrical Load (Current vs Time)
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold tabular-nums ${isDark ? 'text-yellow-400' : 'text-amber-600'}`}>
                  {sensor.current.toFixed(2)} A · {sensor.voltage.toFixed(0)} V
                </span>
              </div>
              {renderLineChart(history, 'current', 'A', '#eab308', '#d97706', 6.8, 8.5, 2.0, 10.0)}
              <div className={`flex items-center justify-between text-[11px] font-mono mt-2 ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}>
                <span>Motor FLA 5.0A · Overcurrent warn &gt;6.8A</span>
                <span>Supply: {sensor.voltage.toFixed(0)}V</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
