import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  HelpCircle, 
  Hourglass, 
  Info, 
  Layers, 
  PieChart, 
  ShieldAlert, 
  TrendingDown, 
  Zap 
} from 'lucide-react';
import { AnomalyReport, MachineHealthStatus, PredictionResult, SensorReading } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface PredictionPanelProps {
  prediction: PredictionResult;
  sensor: SensorReading;
  onModelSwitch?: (model: string) => void;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  prediction,
  sensor,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { healthScore, status, failureProbability, normalProbability, rulDays, rulHours, rulConfidenceInterval, anomalies, isSimulated } = prediction;

  const getStatusColor = (st: MachineHealthStatus) => {
    switch (st) {
      case 'Healthy':
        return isDark ? '#10b981' : '#059669';
      case 'Warning':
        return isDark ? '#f59e0b' : '#d97706';
      case 'Critical':
        return isDark ? '#ff3366' : '#dc2626';
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation / Honesty Notice Banner */}
      <div className={`rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border transition-colors ${
        isDark 
          ? 'bg-slate-900/90 border-cyan-500/20 text-slate-100' 
          : 'bg-sky-50/70 border-sky-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${
            isDark 
              ? 'bg-cyan-950 text-cyan-400 border-cyan-800/50' 
              : 'bg-white text-sky-600 border-sky-200 shadow-xs'
          }`}>
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Prediction Pipeline Architecture:
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                isDark 
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800' 
                  : 'bg-sky-100 text-sky-800 border-sky-300'
              }`}>
                Simulation Mode — Ready for Trained Weights
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Inference is computed via calibrated degradation &amp; multi-sensor hazard scoring. Drop in a trained Scikit-Learn or Keras/ONNX model in <code className={`font-mono ${isDark ? 'text-cyan-300' : 'text-sky-700'}`}>models/</code> without UI restructuring.
            </p>
          </div>
        </div>
      </div>

      {/* Primary 3-Pillar Prediction Grid: Health Gauge, Failure Classification, RUL Prognosis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Pillar 1: Machine Health Score Gauge */}
        <div className={`rounded-xl p-6 flex flex-col items-center justify-between border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="w-full flex items-center justify-between text-xs">
            <span className={`font-semibold uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Prognostic Health
            </span>
            <span className={`font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Module: healthScore.ts</span>
          </div>

          {/* Semi-circular Radial Health Gauge */}
          <div className="relative my-4 flex flex-col items-center">
            <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke={isDark ? '#1e293b' : '#e2e8f0'}
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Active Value Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke={getStatusColor(status)}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="251.32"
                strokeDashoffset={251.32 - (healthScore / 100) * 251.32}
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Centered Value Readout */}
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className={`text-4xl font-extrabold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {healthScore}%
              </span>
              <span 
                className="text-xs font-bold uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full"
                style={{
                  color: getStatusColor(status),
                  backgroundColor: `${getStatusColor(status)}${isDark ? '20' : '15'}`,
                  border: `1px solid ${getStatusColor(status)}${isDark ? '50' : '40'}`
                }}
              >
                {status}
              </span>
            </div>
          </div>

          {/* Threshold Guidance */}
          <div className={`w-full grid grid-cols-3 gap-2 text-center pt-3 border-t text-[11px] font-mono ${
            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
          }`}>
            <div>
              <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>&gt;= 70%</span>
              <div className="text-[10px]">Healthy</div>
            </div>
            <div>
              <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>40 - 69%</span>
              <div className="text-[10px]">Warning</div>
            </div>
            <div>
              <span className={`font-bold ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>&lt; 40%</span>
              <div className="text-[10px]">Critical</div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Failure Probability & Classification */}
        <div className={`rounded-xl p-6 flex flex-col justify-between border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="w-full flex items-center justify-between text-xs">
            <span className={`font-semibold uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Binary / Multi-Class Risk
            </span>
            <span className={`font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Softmax Layer</span>
          </div>

          <div className="my-3 space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Failure Probability:</span>
                <span className={`text-2xl font-bold font-mono tabular-nums ${
                  failureProbability > 0.3 
                    ? (isDark ? 'text-rose-400' : 'text-rose-700') 
                    : (isDark ? 'text-slate-100' : 'text-slate-800')
                }`}>
                  {(failureProbability * 100).toFixed(0)}%
                </span>
              </div>
              
              {/* Dual Probability Bar */}
              <div className={`w-full h-3 rounded-full overflow-hidden flex ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div 
                  className={`h-full transition-all duration-500 ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`}
                  style={{ width: `${normalProbability * 100}%` }}
                />
                <div 
                  className={`h-full transition-all duration-500 ${isDark ? 'bg-rose-500' : 'bg-rose-500'}`}
                  style={{ width: `${failureProbability * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono mt-1.5">
                <span className={`flex items-center gap-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  <span className={`w-2 h-2 rounded-full inline-block ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
                  Normal: {(normalProbability * 100).toFixed(0)}%
                </span>
                <span className={`flex items-center gap-1 ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>
                  <span className={`w-2 h-2 rounded-full inline-block ${isDark ? 'bg-rose-400' : 'bg-rose-600'}`} />
                  Failure: {(failureProbability * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Tri-state Classification Output */}
            <div className={`rounded-lg p-3 border transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`text-[11px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Target State:</div>
              <div className="flex items-center gap-2">
                {status === 'Healthy' && <CheckCircle className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />}
                {status === 'Warning' && <AlertTriangle className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />}
                {status === 'Critical' && <ShieldAlert className={`w-4 h-4 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />}
                <span className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  Predicted State: {status}
                </span>
              </div>
              <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {failureProbability < 0.2
                  ? 'Machine operating within normal statistical limits. No failure signs.'
                  : failureProbability < 0.5
                  ? 'Subtle telemetry drift detected. Early component wear emerging.'
                  : 'High probability of catastrophic mechanical trip without intervention.'}
              </p>
            </div>
          </div>

          <div className={`text-[11px] font-mono pt-2 border-t ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
            Models: XGBoost · Random Forest · MLP
          </div>
        </div>

        {/* Pillar 3: Remaining Useful Life (RUL) */}
        <div className={`rounded-xl p-6 flex flex-col justify-between border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="w-full flex items-center justify-between text-xs">
            <span className={`font-semibold uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Prognostic Horizon
            </span>
            <span className={`font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>RUL Regressor</span>
          </div>

          <div className="my-2 space-y-3">
            <div>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Estimated Remaining Useful Life:</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-extrabold font-mono tabular-nums ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
                  {rulDays}
                </span>
                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>days</span>
              </div>
              <div className={`text-xs font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ≈ {rulHours} continuous operating hours
              </div>
            </div>

            {/* Timeline Progress Bar */}
            <div className="space-y-1">
              <div className={`flex justify-between text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>0 days (Trip)</span>
                <span>30 days (Cycle)</span>
              </div>
              <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div 
                  className={`h-full transition-all duration-500 ${
                    rulDays > 15 
                      ? isDark ? 'bg-cyan-400' : 'bg-sky-500' 
                      : rulDays > 7 
                      ? isDark ? 'bg-amber-400' : 'bg-amber-500' 
                      : isDark ? 'bg-rose-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (rulDays / 30) * 100)}%` }}
                />
              </div>
            </div>

            {/* 95% Confidence Interval */}
            <div className={`rounded-lg p-3 text-xs border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-sky-50/60 border-sky-200'
            }`}>
              <div className={`mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>95% Confidence Interval:</div>
              <div className={`font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {rulConfidenceInterval[0]} hrs – {rulConfidenceInterval[1]} hrs
              </div>
              <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Degradation curve derived from Arrhenius-Paris thermal-vibration wear equation.
              </div>
            </div>
          </div>

          <div className={`text-[11px] font-mono pt-2 border-t ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
            Regressors: LSTM Recurrent Net · Weibull · Random Forest
          </div>
        </div>

      </div>

      {/* Anomaly Detection Diagnostic Panel */}
      <div className={`rounded-xl p-6 border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              <ShieldAlert className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <span>Real-Time Anomaly Detection &amp; Root-Cause Isolation</span>
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Identifies which sensor channel deviated from normal operational envelope.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {anomalies.length === 0 ? (
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isDark 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                <CheckCircle className="w-3.5 h-3.5" />
                All Sensors Normal
              </span>
            ) : (
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border animate-pulse ${
                isDark 
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {anomalies.length} Anomaly {anomalies.length > 1 ? 'Signals' : 'Signal'} Detected
              </span>
            )}
          </div>
        </div>

        {anomalies.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <CheckCircle className={`w-10 h-10 mb-2 ${isDark ? 'text-emerald-400/60' : 'text-emerald-500/80'}`} />
            <h4 className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>No Statistical Anomalies Detected</h4>
            <p className={`text-xs max-w-md mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              All 5 telemetry dimensions (Temperature, Vibration, Pressure, Voltage, Current) are operating within nominal baseline bounds.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anomalies.map((anomaly, idx) => (
              <div 
                key={idx}
                className={`rounded-xl p-4 flex flex-col justify-between border transition-colors ${
                  isDark 
                    ? 'bg-slate-950 border-rose-900/40 text-slate-100' 
                    : 'bg-rose-50/70 border-rose-200 text-slate-900 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold flex items-center gap-1.5 uppercase font-mono ${
                      isDark ? 'text-rose-400' : 'text-rose-700'
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      ⚠ Anomaly Detected
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                      anomaly.severity === 'High' 
                        ? (isDark ? 'bg-rose-950 text-rose-300 border-rose-700' : 'bg-rose-200 text-rose-900 border-rose-300')
                        : (isDark ? 'bg-amber-950 text-amber-300 border-amber-700' : 'bg-amber-200 text-amber-900 border-amber-300')
                    }`}>
                      Severity: {anomaly.severity}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className={`flex justify-between py-0.5 border-b ${isDark ? 'border-slate-900' : 'border-rose-100'}`}>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Sensor Channel:</span>
                      <span className={`font-semibold capitalize font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{anomaly.sensor}</span>
                    </div>
                    <div className={`flex justify-between py-0.5 border-b ${isDark ? 'border-slate-900' : 'border-rose-100'}`}>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Current Value:</span>
                      <span className={`font-bold font-mono ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>{anomaly.currentValue}</span>
                    </div>
                    <div className={`flex justify-between py-0.5 border-b ${isDark ? 'border-slate-900' : 'border-rose-100'}`}>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Expected Normal:</span>
                      <span className={`font-mono font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{anomaly.expectedRange}</span>
                    </div>
                  </div>

                  <p className={`text-xs mt-2 p-2 rounded border ${
                    isDark 
                      ? 'bg-slate-900/80 text-slate-300 border-slate-800' 
                      : 'bg-white text-slate-700 border-rose-200/80'
                  }`}>
                    {anomaly.message}
                  </p>
                </div>

                <div className={`mt-3 pt-2 text-[10px] font-mono flex justify-between ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <span>Detection: Multi-Sigma Envelope / Autoencoder</span>
                  <span>{new Date(anomaly.detectedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
