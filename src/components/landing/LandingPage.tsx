import React from 'react';
import { 
  ArrowRight, 
  Activity, 
  Cpu, 
  Flame, 
  Gauge, 
  Hourglass, 
  Layers, 
  ShieldAlert, 
  Sparkles, 
  Wrench, 
  Zap, 
  CheckCircle,
  Database
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onExploreDigitalTwin: () => void;
  onViewAbout: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onExploreDigitalTwin,
  onViewAbout,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-16 py-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 pb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
          isDark 
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
            : 'bg-sky-100 border-sky-300 text-sky-800'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Industry 4.0 Academic Minor Project</span>
        </div>

        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>
          AI-Powered <span className={`text-transparent bg-clip-text ${
            isDark 
              ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400' 
              : 'bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-600'
          }`}>Digital Twin</span> for Predictive Maintenance
        </h1>

        <p className={`text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Predict machine failures before they happen. Monitor real-time machine health. Estimate remaining useful life with physics-correlated AI models.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onLaunchDashboard}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl transition-all cursor-pointer w-full sm:w-auto ${
              isDark 
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold' 
                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20'
            }`}
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onExploreDigitalTwin}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium rounded-xl border transition-colors cursor-pointer w-full sm:w-auto ${
              isDark 
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
            }`}
          >
            <Cpu className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
            <span>Explore Digital Twin 3D</span>
          </button>
        </div>

        {/* Live System Preview Badge */}
        <div className={`pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${
              isDark ? 'bg-emerald-400' : 'bg-emerald-500'
            }`} />
            Virtual Sensor Stream Active
          </span>
          <span>·</span>
          <span>ISO 10816 Vibration Standard</span>
          <span>·</span>
          <span>AI4I &amp; C-MAPSS Datasets Ingested</span>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className={`rounded-2xl p-8 border transition-colors ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>How It Works</h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            End-to-end data processing workflow from machine sensors to prescriptive work orders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-stretch">
          {[
            { step: '01', title: 'Machine Data', desc: 'Continuous vibration, temperature, pressure & current telemetry.' },
            { step: '02', title: 'AI Analysis', desc: 'Statistical outlier rejection, Z-scaling & ML feature extraction.' },
            { step: '03', title: 'Failure Prediction', desc: 'Multi-class classification evaluating impending failure risks.' },
            { step: '04', title: 'Health Score', desc: 'Composite 0–100% degradation score via non-linear hazard index.' },
            { step: '05', title: 'RUL Prediction', desc: 'Prognostic regression forecasting operating hours to trip.' },
            { step: '06', title: 'Maintenance Alert', desc: 'Rule-based actionable engineering recommendations.' },
          ].map((item, idx) => (
            <div key={idx} className={`rounded-xl p-4 flex flex-col justify-between border transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50/70 border-slate-200'
            }`}>
              <div>
                <span className={`text-xs font-mono font-bold block mb-2 ${
                  isDark ? 'text-cyan-400' : 'text-sky-700'
                }`}>{item.step}</span>
                <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{item.title}</h3>
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features Bento Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Core Capabilities</h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Engineered specifically to solve industrial unplanned downtime and bearing failure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className={`rounded-xl p-6 space-y-3 border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-sky-50/40 border-sky-200/80 shadow-xs'
          }`}>
            <div className={`p-3 w-fit rounded-lg border ${
              isDark ? 'bg-cyan-950 text-cyan-400 border-cyan-800' : 'bg-sky-100 text-sky-700 border-sky-200'
            }`}>
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>3D Interactive Digital Twin</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Spatial visual twin of an industrial motor with dynamic thermal color shifts, physical vibration jitter, and exploded assembly inspection.
            </p>
          </div>

          {/* Card 2 */}
          <div className={`rounded-xl p-6 space-y-3 border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
          }`}>
            <div className={`p-3 w-fit rounded-lg border ${
              isDark ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Machine Health Scoring</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Dynamic 0–100% health score derived from multi-sensor degradation indices with three-tier status engine (Healthy, Warning, Critical).
            </p>
          </div>

          {/* Card 3 */}
          <div className={`rounded-xl p-6 space-y-3 border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-indigo-50/40 border-indigo-200/80 shadow-xs'
          }`}>
            <div className={`p-3 w-fit rounded-lg border ${
              isDark ? 'bg-indigo-950 text-indigo-400 border-indigo-800' : 'bg-indigo-100 text-indigo-700 border-indigo-200'
            }`}>
              <Hourglass className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Remaining Useful Life (RUL)</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Prognostic regression estimating remaining operating days and hours before functional failure, with 95% confidence intervals.
            </p>
          </div>

          {/* Card 4 */}
          <div className={`rounded-xl p-6 space-y-3 border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-rose-50/40 border-rose-200/80 shadow-xs'
          }`}>
            <div className={`p-3 w-fit rounded-lg border ${
              isDark ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-rose-100 text-rose-700 border-rose-200'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Automated Anomaly Detection</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Statistical and autoencoder boundary checks that identify the exact root-cause sensor, expected normal range, and severity level.
            </p>
          </div>

          {/* Card 5 */}
          <div className={`rounded-xl p-6 space-y-3 border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-amber-50/40 border-amber-200/80 shadow-xs'
          }`}>
            <div className={`p-3 w-fit rounded-lg border ${
              isDark ? 'bg-amber-950 text-amber-400 border-amber-800' : 'bg-amber-100 text-amber-700 border-amber-200'
            }`}>
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Prescriptive Maintenance</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Domain-informed decision rules mapping vibration, thermal, or electrical symptoms directly to actionable mechanical work orders.
            </p>
          </div>

          {/* Card 6 */}
          <div className={`rounded-xl p-6 space-y-3 border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-purple-50/40 border-purple-200/80 shadow-xs'
          }`}>
            <div className={`p-3 w-fit rounded-lg border ${
              isDark ? 'bg-purple-950 text-purple-400 border-purple-800' : 'bg-purple-100 text-purple-700 border-purple-200'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Public Benchmark Ingestion</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Built-in support for AI4I 2020 and NASA C-MAPSS datasets, plus custom CSV file upload with automated column mapping.
            </p>
          </div>
        </div>
      </section>

      {/* About Concept Explanation */}
      <section className={`rounded-2xl p-8 space-y-4 border transition-colors ${
        isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          About the Digital Twin Concept
        </h2>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <p>
            A <strong>Digital Twin</strong> is a real-time virtual representation of a physical asset, process, or system. In modern industrial operations, physical machines are subject to fatigue, wear, unbalance, and overheating. Rather than waiting for catastrophic breakdowns (reactive maintenance) or replacing parts prematurely on a fixed calendar (preventive maintenance), digital twins enable <strong>predictive maintenance (PdM)</strong>.
          </p>
          <p>
            By mirroring continuous sensor readings in a physics-calibrated model, operators can detect anomalies before human perception, evaluate remaining useful life with statistical confidence, and schedule precision repairs during scheduled shifts—saving millions in downtime.
          </p>
        </div>
      </section>
    </div>
  );
};
