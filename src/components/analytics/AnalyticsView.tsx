import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  Calendar, 
  Flame, 
  Activity, 
  Gauge, 
  Zap, 
  TrendingDown, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { HistoricalPoint } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AnalyticsViewProps {
  history: HistoricalPoint[];
}

type TimeRange = '1h' | '6h' | '24h' | '7d';

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ history }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [activeTab, setActiveTab] = useState<'sensors' | 'predictions' | 'correlations'>('sensors');

  // Generate extended synthetic historical data for 1h, 6h, 24h, 7d if live history is young
  const extendedHistory = useMemo(() => {
    let count = 24;
    let stepHours = 1;
    if (timeRange === '1h') { count = 12; stepHours = 1 / 12; }
    if (timeRange === '6h') { count = 18; stepHours = 6 / 18; }
    if (timeRange === '24h') { count = 24; stepHours = 1; }
    if (timeRange === '7d') { count = 28; stepHours = 6; }

    const now = Date.now();
    const result: HistoricalPoint[] = [];

    for (let i = count - 1; i >= 0; i--) {
      const pastTime = now - i * stepHours * 3600 * 1000;
      const date = new Date(pastTime);
      const timeLabel = timeRange === '7d' 
        ? `${date.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' })}`
        : `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      const diurnal = Math.sin((pastTime / (3600 * 1000)) * (Math.PI / 12));
      const degradationFactor = (count - i) / count;
      
      const temp = 41.5 + diurnal * 3.5 + degradationFactor * 4.2;
      const vib = 1.35 + Math.abs(diurnal) * 0.4 + degradationFactor * 0.8;
      const pres = 2.45 - degradationFactor * 0.2 + diurnal * 0.1;
      const volt = 230 + Math.cos(diurnal * 2) * 2.5;
      const curr = 4.1 + degradationFactor * 0.5 + Math.abs(diurnal) * 0.2;
      
      const health = Math.max(20, Math.min(98, Math.round(96 - degradationFactor * 18 - (vib > 2.5 ? 10 : 0))));
      const failProb = Number(((100 - health) / 100 * 0.35 + 0.05).toFixed(2));
      const rul = Math.max(48, Math.round(720 - (count - i) * 8));

      result.push({
        timeLabel,
        timestamp: pastTime,
        temperature: Number(temp.toFixed(1)),
        vibration: Number(vib.toFixed(2)),
        pressure: Number(pres.toFixed(2)),
        voltage: Number(volt.toFixed(1)),
        current: Number(curr.toFixed(2)),
        healthScore: health,
        failureProbability: failProb,
        rulHours: rul,
      });
    }

    if (history.length > 0) {
      const latest = history[history.length - 1];
      result[result.length - 1] = {
        ...latest,
        timeLabel: 'Now',
      };
    }

    return result;
  }, [timeRange, history]);

  // Analytics Line Chart SVG
  const renderTrendChart = (
    data: HistoricalPoint[],
    key: keyof HistoricalPoint,
    label: string,
    unit: string,
    color: string,
    minVal?: number,
    maxVal?: number
  ) => {
    const values = data.map((d) => Number(d[key]));
    const min = minVal !== undefined ? minVal : Math.min(...values);
    const max = maxVal !== undefined ? maxVal : Math.max(...values);
    const range = (max - min) || 1;

    const width = 800;
    const height = 180;
    const paddingX = 45;
    const paddingY = 24;

    const getX = (idx: number) => paddingX + (idx / (data.length - 1)) * (width - 2 * paddingX);
    const getY = (val: number) => height - paddingY - ((val - min) / range) * (height - 2 * paddingY);

    const points = data.map((d, i) => `${getX(i)},${getY(Number(d[key]))}`).join(' ');

    return (
      <div className={`rounded-xl p-5 border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{label}</span>
            <span className={`text-xs ml-2 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>({unit})</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Min: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{min.toFixed(1)}</strong></span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Avg: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}</strong></span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Max: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{max.toFixed(1)}</strong></span>
          </div>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          {[0, 0.5, 1].map((r, i) => {
            const y = height - paddingY - r * (height - 2 * paddingY);
            const val = min + r * range;
            return (
              <g key={i}>
                <line 
                  x1={paddingX} 
                  y1={y} 
                  x2={width - paddingX} 
                  y2={y} 
                  stroke={isDark ? '#1e293b' : '#e2e8f0'} 
                  strokeDasharray="3 3" 
                />
                <text 
                  x={paddingX - 8} 
                  y={y + 3} 
                  fill={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize="10" 
                  textAnchor="end" 
                  fontFamily="monospace"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          <defs>
            <linearGradient id={`grad-${String(key)}-${isDark ? 'd' : 'l'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={isDark ? 0.3 : 0.18} />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon
            points={`${paddingX},${height - paddingY} ${points} ${width - paddingX},${height - paddingY}`}
            fill={`url(#grad-${String(key)}-${isDark ? 'd' : 'l'})`}
          />

          <polyline
            fill="none"
            stroke={color}
            strokeWidth={isDark ? '2.5' : '2.2'}
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          <text x={paddingX} y={height - 6} fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" fontFamily="monospace">
            {data[0]?.timeLabel}
          </text>
          <text x={width / 2} y={height - 6} fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="middle" fontFamily="monospace">
            {data[Math.floor(data.length / 2)]?.timeLabel}
          </text>
          <text x={width - paddingX} y={height - 6} fill={isDark ? '#64748b' : '#94a3b8'} fontSize="10" textAnchor="end" fontFamily="monospace">
            {data[data.length - 1]?.timeLabel}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Time Horizon Selector */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl p-5 border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            <BarChart2 className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
            <span>Industrial Machine Telemetry &amp; Prediction Analytics</span>
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Temporal degradation trajectories, stress correlation matrices, and prognostic trends.
          </p>
        </div>

        {/* Time Window Buttons */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>Window:</span>
          </span>
          <div className={`flex items-center border rounded-lg p-1 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {(['1h', '6h', '24h', '7d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer ${
                  timeRange === r 
                    ? isDark 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' 
                      : 'bg-sky-600 text-white font-bold shadow-xs' 
                    : isDark 
                      ? 'text-slate-400 hover:text-slate-200' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Last {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Tabs */}
      <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          onClick={() => setActiveTab('sensors')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'sensors'
              ? isDark ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'bg-sky-100 text-sky-800 border border-sky-300'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Sensor Trends (Temp, Vib, Press, Volts, Amps)
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'predictions'
              ? isDark ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'bg-sky-100 text-sky-800 border border-sky-300'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Prediction Trends (Health, Failure Risk, RUL)
        </button>
        <button
          onClick={() => setActiveTab('correlations')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'correlations'
              ? isDark ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'bg-sky-100 text-sky-800 border border-sky-300'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Multi-Variable Correlation Matrix
        </button>
      </div>

      {/* TAB 1: Sensor Trends */}
      {activeTab === 'sensors' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {renderTrendChart(extendedHistory, 'temperature', 'Temperature History', '°C', isDark ? '#f97316' : '#ea580c')}
          {renderTrendChart(extendedHistory, 'vibration', 'Vibration History (Triaxial RMS)', 'mm/s', isDark ? '#00f2fe' : '#0284c7')}
          {renderTrendChart(extendedHistory, 'pressure', 'Lubrication Pressure History', 'bar', isDark ? '#818cf8' : '#6366f1')}
          {renderTrendChart(extendedHistory, 'voltage', 'Grid Bus Voltage History', 'V', isDark ? '#eab308' : '#d97706')}
          <div className="lg:col-span-2">
            {renderTrendChart(extendedHistory, 'current', 'Motor Stator Current History', 'A', isDark ? '#a855f7' : '#9333ea')}
          </div>
        </div>
      )}

      {/* TAB 2: Prediction Trends */}
      {activeTab === 'predictions' && (
        <div className="space-y-5">
          {renderTrendChart(extendedHistory, 'healthScore', 'Machine Health Score Evolution', '%', isDark ? '#10b981' : '#16a34a', 0, 100)}
          {renderTrendChart(extendedHistory, 'failureProbability', 'Failure Probability Trajectory', 'Probability (0-1)', isDark ? '#ff3366' : '#dc2626', 0, 1)}
          {renderTrendChart(extendedHistory, 'rulHours', 'Remaining Useful Life (RUL) Decay', 'Operating Hours', isDark ? '#38bdf8' : '#0284c7', 0, 750)}
        </div>
      )}

      {/* TAB 3: Correlation Matrix Heatmap */}
      {activeTab === 'correlations' && (
        <div className={`rounded-xl p-6 border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Pearson Correlation Heatmap (Sensor vs Failure Risk)
          </h3>
          <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Demonstrates physical coupling between mechanical stress (vibration), thermal dissipation (temperature), and health degradation.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-center border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                  <th className={`text-left p-3 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Feature</th>
                  <th className="p-3">Temperature</th>
                  <th className="p-3">Vibration</th>
                  <th className="p-3">Pressure</th>
                  <th className="p-3">Current</th>
                  <th className={`p-3 font-bold ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>Health Score</th>
                  <th className={`p-3 font-bold ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>Failure Risk</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Temperature', vals: [1.00, 0.74, 0.31, 0.62, -0.84, 0.81] },
                  { name: 'Vibration', vals: [0.74, 1.00, 0.28, 0.58, -0.91, 0.89] },
                  { name: 'Pressure', vals: [0.31, 0.28, 1.00, 0.19, -0.36, 0.33] },
                  { name: 'Current', vals: [0.62, 0.58, 0.19, 1.00, -0.68, 0.65] },
                  { name: 'Health Score', vals: [-0.84, -0.91, -0.36, -0.68, 1.00, -0.96] },
                  { name: 'Failure Risk', vals: [0.81, 0.89, 0.33, 0.65, -0.96, 1.00] },
                ].map((row, rIdx) => (
                  <tr key={rIdx} className={`border-b hover:bg-slate-500/10 ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
                    <td className={`text-left p-3 font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{row.name}</td>
                    {row.vals.map((v, cIdx) => {
                      let bg = isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.7)';
                      if (v > 0.7) bg = isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(254, 205, 211, 0.6)';
                      else if (v > 0.4) bg = isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(254, 240, 138, 0.6)';
                      else if (v < -0.7) bg = isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(187, 247, 208, 0.6)';

                      return (
                        <td 
                          key={cIdx} 
                          className={`p-3 font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
                          style={{ backgroundColor: bg }}
                        >
                          {v.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`mt-4 text-[11px] flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Strong negative correlation (-0.91): Vibration increases directly reduce Machine Health.</span>
            <span>Dataset sample: 10,000 synthetic cycles</span>
          </div>
        </div>
      )}
    </div>
  );
};
