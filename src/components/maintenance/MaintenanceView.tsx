import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  HelpCircle, 
  Plus, 
  ShieldAlert, 
  Wrench,
  Check,
  RotateCcw
} from 'lucide-react';
import { MaintenanceAlert, SensorReading } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface MaintenanceViewProps {
  alerts: MaintenanceAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onResolveAlert: (id: string) => void;
  sensor: SensorReading;
  healthScore: number;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
  sensor,
  healthScore,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'Critical' | 'Warning' | 'Info'>('All');

  const filteredAlerts = alerts.filter(
    (a) => filterSeverity === 'All' || a.severity === filterSeverity
  );

  return (
    <div className="space-y-6">
      {/* Top Header Summary */}
      <div className={`rounded-xl p-5 border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            <Wrench className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
            <span>Predictive Maintenance &amp; Automated Recommendation Engine</span>
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Rule-based engineering heuristics automatically converting telemetry anomalies into prioritized work orders.
          </p>
        </div>

        {/* Status Count Badges */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-100 border-rose-300 text-rose-800'
          }`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{alerts.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length} Critical</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-100 border-amber-300 text-amber-800'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{alerts.filter(a => a.severity === 'Warning' && a.status !== 'Resolved').length} Warning</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-800'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{alerts.filter(a => a.status === 'Resolved').length} Resolved</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1 border rounded-lg p-1 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          {(['All', 'Critical', 'Warning'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                filterSeverity === sev 
                  ? isDark ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' : 'bg-sky-600 text-white font-bold shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev} Alerts
            </button>
          ))}
        </div>
        <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Showing {filteredAlerts.length} maintenance tickets
        </span>
      </div>

      {/* Maintenance Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className={`rounded-xl p-8 text-center border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <CheckCircle2 className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-emerald-400/50' : 'text-emerald-500/70'}`} />
            <h4 className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>No Active Maintenance Alerts</h4>
            <p className={`text-xs max-w-md mx-auto mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Machine telemetry is running inside nominal safety parameters. Switch Condition State to "Warning" or "Critical" in the simulation to trigger automated recommendation work orders.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl p-5 border transition-all ${
                alert.status === 'Resolved'
                  ? isDark ? 'bg-slate-900/60 border-slate-800 opacity-60' : 'bg-slate-50 border-slate-200 opacity-60'
                  : alert.severity === 'Critical'
                  ? isDark 
                    ? 'border-rose-900/60 bg-gradient-to-r from-rose-950/20 to-slate-900' 
                    : 'border-rose-200 bg-rose-50/60 text-slate-900 shadow-xs'
                  : isDark 
                    ? 'border-amber-900/50 bg-gradient-to-r from-amber-950/20 to-slate-900' 
                    : 'border-amber-200 bg-amber-50/60 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  {/* Alert Header */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold uppercase font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border ${
                        alert.severity === 'Critical'
                          ? isDark ? 'bg-rose-950 text-rose-300 border-rose-700' : 'bg-rose-200 text-rose-900 border-rose-300'
                          : isDark ? 'bg-amber-950 text-amber-300 border-amber-700' : 'bg-amber-200 text-amber-900 border-amber-300'
                      }`}
                    >
                      {alert.severity === 'Critical' ? <ShieldAlert className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      {alert.severity} Alert
                    </span>

                    <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{alert.sensor}</span>
                    <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                      Status: <strong className={alert.status === 'Resolved' ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : (isDark ? 'text-slate-300' : 'text-slate-800')}>{alert.status}</strong>
                    </span>
                  </div>

                  {/* Telemetry Reading vs Expected */}
                  <div className={`flex flex-wrap items-center gap-4 text-xs font-mono p-2.5 rounded-lg border ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Current Reading: </span>
                      <span className={`font-bold ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>{alert.currentReading}</span>
                    </div>
                    <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</span>
                    <div>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Expected Normal: </span>
                      <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{alert.expectedReading}</span>
                    </div>
                  </div>

                  {/* Prescribed Action */}
                  <div className="text-xs">
                    <span className={`font-semibold uppercase tracking-wider text-[11px] block mb-1 ${
                      isDark ? 'text-cyan-400' : 'text-sky-800'
                    }`}>
                      Prescribed Engineering Action:
                    </span>
                    <p className={`font-medium p-3 rounded-lg leading-relaxed border ${
                      isDark 
                        ? 'bg-cyan-950/30 border-cyan-800/40 text-slate-200' 
                        : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                    }`}>
                      {alert.recommendation}
                    </p>
                  </div>
                </div>

                {/* Maintenance Action Buttons */}
                <div className="flex flex-col gap-2 shrink-0 lg:w-48">
                  {alert.status !== 'Resolved' ? (
                    <>
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className={`flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          isDark 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Sign-off &amp; Resolve</span>
                      </button>
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className={`flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          isDark 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    </>
                  ) : (
                    <div className={`flex items-center justify-center gap-1 text-xs font-semibold py-2 ${
                      isDark ? 'text-emerald-400' : 'text-emerald-700'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Work Order Closed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rule-Based Decision Logic Matrix */}
      <div className={`rounded-xl p-6 border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          Rule-Based Maintenance Decision Matrix (ISO Standard Mapping)
        </h3>
        <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Heuristic mappings connecting anomalous physical symptoms to corrective maintenance instructions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className={`rounded-lg p-3.5 border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-orange-50/60 border-orange-200 text-slate-800'
          }`}>
            <span className={`font-bold block mb-1 ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
              If Temperature &gt; 65°C:
            </span>
            <p>
              Trigger Stator Thermal Warning. Recommendation: Inspect cooling fan blades, vacuum ventilation cowl, check thermal grease on sensor well.
            </p>
          </div>

          <div className={`rounded-lg p-3.5 border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-sky-50/60 border-sky-200 text-slate-800'
          }`}>
            <span className={`font-bold block mb-1 ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
              If Vibration &gt; 4.5 mm/s:
            </span>
            <p>
              Trigger ISO 10816 Zone C/D Warning. Recommendation: Check dynamic rotor unbalance, inspect inner raceway bearing fatigue, re-torque holding bolts.
            </p>
          </div>

          <div className={`rounded-lg p-3.5 border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-purple-50/60 border-purple-200 text-slate-800'
          }`}>
            <span className={`font-bold block mb-1 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
              If Current &gt; 6.8 A:
            </span>
            <p>
              Trigger Overcurrent Alert. Recommendation: Check electrical phase-to-phase insulation resistance, verify load gearbox for mechanical binding.
            </p>
          </div>

          <div className={`rounded-lg p-3.5 border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-rose-50/60 border-rose-200 text-slate-800'
          }`}>
            <span className={`font-bold block mb-1 ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>
              Compound: High Vibration + High Temperature:
            </span>
            <p>
              Trigger Immediate Critical Trip Protocol. Recommendation: Severe bearing seizure risk. Schedule immediate graceful machine shutdown within 15 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
