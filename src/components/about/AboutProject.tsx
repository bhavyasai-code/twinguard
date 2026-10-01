import React from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Code, 
  Cpu, 
  Database, 
  ExternalLink, 
  FileText, 
  HelpCircle, 
  Layers, 
  Server, 
  Terminal 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AboutProject: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Title Header */}
      <div className={`rounded-2xl p-6 sm:p-8 space-y-3 border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-mono border ${
          isDark ? 'bg-cyan-950 text-cyan-400 border-cyan-800' : 'bg-sky-100 text-sky-800 border-sky-300'
        }`}>
          Academic Minor Project Documentation
        </div>
        <h1 className={`text-2xl sm:text-3xl font-extrabold leading-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          AI-Powered Digital Twin for Predictive Maintenance with Machine Health Scoring and Remaining Useful Life Prediction
        </h1>
        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          An engineering simulation platform fusing real-time multi-channel telemetry ingestion, degradation modeling, physics-informed digital twinning, and rule-based prescriptive maintenance.
        </p>
      </div>

      {/* Project Goal & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 space-y-3 border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            <Cpu className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
            <span>Project Objectives &amp; Scope</span>
          </h2>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            The primary goal of this minor project is to create an end-to-end framework simulating an industrial machine and its software twin. The concept follows the rigorous Industry 4.0 data stream:
          </p>
          <div className={`p-3 rounded-lg text-xs font-mono border ${
            isDark 
              ? 'bg-slate-950 border-slate-800 text-cyan-300' 
              : 'bg-sky-50 border-sky-200 text-sky-800'
          }`}>
            Sensor Data → Data Processing → AI/ML Models → Prediction → Digital Twin Dashboard → Maintenance Decision
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Since physical IoT testbenches are often cost-prohibitive in academic environments, the system features a correlated physics simulator alongside ingestion support for real-world benchmarks (AI4I and C-MAPSS) and custom factory CSV uploads.
          </p>
        </div>

        {/* Technologies Used */}
        <div className={`rounded-xl p-6 space-y-3 border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            <Layers className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <span>Technologies &amp; Libraries</span>
          </h2>
          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className={`p-2.5 rounded border ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <strong className={`block ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>Frontend / Twin</strong>
              React 19, TypeScript, Three.js, Tailwind CSS
            </div>
            <div className={`p-2.5 rounded border ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <strong className={`block ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>Prognostic Models</strong>
              Python, Scikit-Learn, TensorFlow/Keras
            </div>
            <div className={`p-2.5 rounded border ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <strong className={`block ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>Data Processing</strong>
              NumPy, Pandas, Standard Scaler, RFE
            </div>
            <div className={`p-2.5 rounded border ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <strong className={`block ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>Persistence / IoT</strong>
              RESTful Proxy, SQLite Schema, In-Memory Ring
            </div>
          </div>
        </div>
      </div>

      {/* Datasets Used */}
      <div className={`rounded-xl p-6 space-y-4 border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          <Database className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <span>Industrial Datasets Incorporated</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`rounded-lg p-4 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              1. AI4I 2020 Predictive Maintenance Dataset
            </h3>
            <p className={`text-xs leading-relaxed mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              UCI Machine Learning Repository dataset consisting of 10,000 data points reflecting real milling machine parameters. Incorporates 5 distinct failure categories:
            </p>
            <ul className={`text-xs space-y-1 list-disc list-inside font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <li>Tool Wear Failure (TWF)</li>
              <li>Heat Dissipation Failure (HDF)</li>
              <li>Power Failure (PWF)</li>
              <li>Overstrain Failure (OSF)</li>
              <li>Random Failure (RNF)</li>
            </ul>
          </div>

          <div className={`rounded-lg p-4 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              2. NASA C-MAPSS Turbofan Degradation (FD001)
            </h3>
            <p className={`text-xs leading-relaxed mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Benchmark dataset developed by NASA Ames Research Center simulating gas turbine operational cycles with degradation to functional failure.
            </p>
            <ul className={`text-xs space-y-1 list-disc list-inside font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <li>100 run-to-failure engine trajectories</li>
              <li>21 sensor channels (temperatures, pressures, fan speeds)</li>
              <li>Ground truth RUL cycles for regression benchmarking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mathematical Formulations for Viva Defense */}
      <div className={`rounded-xl p-6 space-y-4 border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          <BookOpen className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
          <span>Mathematical Formulation Guide (Viva Review Reference)</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div className={`rounded-lg p-4 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className={`font-bold mb-1 font-mono ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
              1. Machine Health Score Penalty Function
            </h4>
            <p className={`leading-relaxed mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Composite health score $H \in [0, 100]$ computed via weighted summation of non-linear piecewise penalty functions across thermal, mechanical vibration, and electrical load domains:
            </p>
            <pre className={`p-2.5 rounded font-mono overflow-x-auto ${
              isDark ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-800 border border-slate-200'
            }`}>
{`H = 100 - (w_temp * P_temp + w_vib * P_vib + w_press * P_press + w_elec * P_elec)
where:
P_temp = max(0, (T_curr - T_warn) / (T_crit - T_warn) * 30)
P_vib  = max(0, (V_curr - V_warn) / (V_crit - V_warn) * 35)`}
            </pre>
          </div>

          <div className={`rounded-lg p-4 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className={`font-bold mb-1 font-mono ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
              2. Arrhenius-Paris Degradation Law for RUL Estimation
            </h4>
            <p className={`leading-relaxed mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Accelerated physical degradation rate governed by thermal Arrhenius kinetics and mechanical cyclic fatigue (Paris' Law):
            </p>
            <pre className={`p-2.5 rounded font-mono overflow-x-auto ${
              isDark ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-800 border border-slate-200'
            }`}>
{`RUL_hours = RUL_baseline * (H / 100)^1.7 * [ (T_ref / T)^1.4 * (V_ref / V)^1.8 ]
Confidence Interval: [ RUL * (1 - 1.96 * sigma), RUL * (1 + 1.96 * sigma) ]`}
            </pre>
          </div>

          <div className={`rounded-lg p-4 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className={`font-bold mb-1 font-mono ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
              3. ISO 10816 Vibration Severity Standard Reference
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono mt-2">
              <div className={`p-2 rounded border ${
                isDark ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <span className={`font-bold block ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>&lt; 2.5 mm/s</span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Zone A: Good / New</span>
              </div>
              <div className={`p-2 rounded border ${
                isDark ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-emerald-50/50 border-emerald-200'
              }`}>
                <span className={`font-bold block ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>2.5 - 4.5 mm/s</span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Zone B: Acceptable</span>
              </div>
              <div className={`p-2 rounded border ${
                isDark ? 'bg-amber-950/40 border-amber-800/60' : 'bg-amber-50 border-amber-200'
              }`}>
                <span className={`font-bold block ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>4.5 - 7.1 mm/s</span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Zone C: Warning</span>
              </div>
              <div className={`p-2 rounded border ${
                isDark ? 'bg-rose-950/40 border-rose-800/60' : 'bg-rose-50 border-rose-200'
              }`}>
                <span className={`font-bold block ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>&gt; 7.1 mm/s</span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Zone D: Damage Imminent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Viva Questions */}
      <div className={`rounded-xl p-6 space-y-4 border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          <HelpCircle className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
          <span>Faculty Review &amp; Viva Q&amp;A Cheat Sheet</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className={`rounded-lg p-3.5 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <strong className={`block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Q1: How can this system transition from simulated data to real IoT sensors without refactoring?
            </strong>
            <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <strong>Answer:</strong> The architecture decouples the data ingestion layer through the <code className={`font-mono ${isDark ? 'text-cyan-300' : 'text-sky-700'}`}>SensorReading</code> contract. An MQTT broker or WebSocket client (e.g. from an ESP32 or Raspberry Pi reading an ADXL345 accelerometer and MAX6675 thermocouple) feeds the identical state store without altering the digital twin renderer or health scoring modules.
            </p>
          </div>

          <div className={`rounded-lg p-3.5 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <strong className={`block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Q2: What machine learning models are best suited for RUL prediction vs Failure Classification?
            </strong>
            <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <strong>Answer:</strong> For binary/multi-class failure classification, Random Forest and XGBoost achieve high recall on tabular imbalanced data like AI4I. For RUL regression, LSTM (Long Short-Term Memory) recurrent networks or Temporal Convolutional Networks (TCN) excel by modeling temporal degradation sequences across operational cycles.
            </p>
          </div>

          <div className={`rounded-lg p-3.5 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <strong className={`block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Q3: Why is Anomaly Detection separated from Failure Classification?
            </strong>
            <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <strong>Answer:</strong> In industrial settings, failures are rare events (&lt;2% of lifetime data), making supervised classification difficult due to lack of failure labels. Unsupervised anomaly detection (Isolation Forest / Autoencoders) trains solely on healthy normal operation and flags any deviation, catching novel fault signatures before catastrophic damage occurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
