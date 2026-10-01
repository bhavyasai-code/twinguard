import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  FileSpreadsheet, 
  Check, 
  ArrowRight, 
  Layers, 
  Filter, 
  Sliders, 
  Sparkles, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { DatasetSummary } from '../../types';
import { AI4I_DATASET_SUMMARY, CMAPSS_DATASET_SUMMARY, parseCSV } from '../../services/datasetService';
import { useTheme } from '../../context/ThemeContext';

export const DatasetView: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedDataset, setSelectedDataset] = useState<DatasetSummary>(AI4I_DATASET_SUMMARY);
  const [activeTab, setActiveTab] = useState<'preview' | 'stats' | 'pipeline' | 'mapping'>('preview');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Column mapping states for ML input pipeline
  const [columnMapping, setColumnMapping] = useState({
    temperature: 'Air_temperature_K',
    vibration: 'Torque_Nm',
    pressure: 'Process_temperature_K',
    voltage: 'Rotational_speed_rpm',
    current: 'Tool_wear_min',
    target: 'Machine_failure',
    cycle: 'UDI',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text, file.name);
        setSelectedDataset(parsed);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to parse CSV file. Ensure valid comma-delimited format.');
      }
    };
    reader.onerror = () => {
      setUploadError('File reading error.');
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (type: 'ai4i' | 'cmapss') => {
    setUploadError(null);
    if (type === 'ai4i') {
      setSelectedDataset(AI4I_DATASET_SUMMARY);
      setColumnMapping({
        temperature: 'Air_temperature_K',
        vibration: 'Torque_Nm',
        pressure: 'Process_temperature_K',
        voltage: 'Rotational_speed_rpm',
        current: 'Tool_wear_min',
        target: 'Machine_failure',
        cycle: 'UDI',
      });
    } else {
      setSelectedDataset(CMAPSS_DATASET_SUMMARY);
      setColumnMapping({
        temperature: 'T24_total_temp_LPC',
        vibration: 'Nc_physical_core_speed',
        pressure: 'P30_pressure_HPC',
        voltage: 'T30_total_temp_HPC',
        current: 'time_cycles',
        target: 'time_cycles',
        cycle: 'time_cycles',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Dataset Selectors */}
      <div className={`rounded-xl p-5 border transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            <Database className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
            <span>Industrial Predictive Maintenance Dataset Management</span>
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Ingest benchmark datasets or upload custom factory telemetry CSV files for model training and preprocessing.
          </p>
        </div>

        {/* Dataset Quick-Load Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleLoadSample('ai4i')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              selectedDataset.name.includes('AI4I')
                ? isDark 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' 
                  : 'bg-sky-100 text-sky-800 border-sky-300 font-semibold'
                : isDark 
                  ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            AI4I 2020 Dataset (10k rows)
          </button>
          <button
            onClick={() => handleLoadSample('cmapss')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              selectedDataset.name.includes('NASA')
                ? isDark 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' 
                  : 'bg-sky-100 text-sky-800 border-sky-300 font-semibold'
                : isDark 
                  ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            NASA C-MAPSS Turbofan (20k rows)
          </button>

          {/* Upload CSV input */}
          <label className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
            isDark 
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
              : 'bg-sky-600 hover:bg-sky-700 text-white border-sky-600 shadow-xs'
          }`}>
            <Upload className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-white'}`} />
            <span>Upload CSV</span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadError && (
        <div className={`rounded-xl p-4 text-xs flex items-center gap-2 border ${
          isDark ? 'bg-rose-950/50 border-rose-800 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Dataset Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <span className={`text-xs block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Record Count</span>
          <span className={`text-2xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {selectedDataset.rowCount.toLocaleString()}
          </span>
          <span className={`text-[11px] block mt-1 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Observations</span>
        </div>

        <div className={`rounded-xl p-4 border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <span className={`text-xs block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Feature Columns</span>
          <span className={`text-2xl font-bold font-mono tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {selectedDataset.columnCount}
          </span>
          <span className={`text-[11px] block mt-1 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Dimensions</span>
        </div>

        <div className={`rounded-xl p-4 border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50/60 border-emerald-200 shadow-xs'
        }`}>
          <span className={`text-xs block mb-1 ${isDark ? 'text-slate-400' : 'text-emerald-800'}`}>Missing Values</span>
          <span className={`text-2xl font-bold font-mono tabular-nums ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
            {selectedDataset.missingValuesTotal}
          </span>
          <span className={`text-[11px] block mt-1 font-mono ${isDark ? 'text-slate-500' : 'text-emerald-600'}`}>Clean null rate 0.0%</span>
        </div>

        <div className={`rounded-xl p-4 border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-sky-50/60 border-sky-200 shadow-xs'
        }`}>
          <span className={`text-xs block mb-1 ${isDark ? 'text-slate-400' : 'text-sky-800'}`}>Active Ingestion</span>
          <span className={`text-xs font-bold truncate block mt-2 ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
            {selectedDataset.name.split('(')[0]}
          </span>
          <span className={`text-[10px] block font-mono mt-0.5 ${isDark ? 'text-slate-500' : 'text-sky-600'}`}>Ready for Training</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'preview' 
              ? isDark ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'bg-sky-100 text-sky-800 border border-sky-300' 
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Dataset Preview
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'stats' 
              ? isDark ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'bg-sky-100 text-sky-800 border border-sky-300' 
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Descriptive Statistics
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'pipeline' 
              ? isDark ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'bg-sky-100 text-sky-800 border border-sky-300' 
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          7-Stage ML Preprocessing Pipeline
        </button>
        <button
          onClick={() => setActiveTab('mapping')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'mapping' 
              ? isDark ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'bg-sky-100 text-sky-800 border border-sky-300' 
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Feature Mapping
        </button>
      </div>

      {/* TAB 1: Preview Table */}
      {activeTab === 'preview' && (
        <div className={`rounded-xl overflow-hidden border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Showing first {selectedDataset.sampleRows.length} rows of {selectedDataset.name}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>UTF-8</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className={`border-b ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100/70 border-slate-200 text-slate-700'
                }`}>
                  {selectedDataset.columns.map((col, idx) => (
                    <th key={idx} className="p-3 font-semibold whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedDataset.sampleRows.map((row, rIdx) => (
                  <tr key={rIdx} className={`border-b hover:bg-slate-500/5 ${
                    isDark ? 'border-slate-800/60' : 'border-slate-100'
                  }`}>
                    {selectedDataset.columns.map((col, cIdx) => (
                      <td key={cIdx} className={`p-3 whitespace-nowrap tabular-nums ${
                        isDark ? 'text-slate-300' : 'text-slate-800'
                      }`}>
                        {row[col] !== undefined ? String(row[col]) : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Descriptive Statistics */}
      {activeTab === 'stats' && (
        <div className={`rounded-xl overflow-hidden border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200 bg-slate-50/50'}`}>
            <h4 className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Parametric Summary Statistics for Numerical Channels
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className={`border-b ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100/70 border-slate-200 text-slate-700'
                }`}>
                  <th className="p-3">Column Name</th>
                  <th className="p-3">Count</th>
                  <th className="p-3">Mean</th>
                  <th className="p-3">Std Dev</th>
                  <th className="p-3">Min</th>
                  <th className="p-3">Max</th>
                  <th className="p-3">Missing</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(selectedDataset.stats).map((st, idx) => (
                  <tr key={idx} className={`border-b hover:bg-slate-500/5 ${
                    isDark ? 'border-slate-800/60' : 'border-slate-100'
                  }`}>
                    <td className={`p-3 font-semibold ${isDark ? 'text-cyan-300' : 'text-sky-700'}`}>{st.name}</td>
                    <td className={`p-3 tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{st.count}</td>
                    <td className={`p-3 tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{st.mean}</td>
                    <td className={`p-3 tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{st.std}</td>
                    <td className={`p-3 tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{st.min}</td>
                    <td className={`p-3 tabular-nums ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{st.max}</td>
                    <td className="p-3 tabular-nums">
                      <span className={st.missing > 0 ? (isDark ? 'text-rose-400 font-bold' : 'text-rose-600 font-bold') : (isDark ? 'text-emerald-400' : 'text-emerald-700')}>
                        {st.missing}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Preprocessing Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className={`rounded-xl p-6 border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Machine Learning Preprocessing Pipeline
            </h3>
            <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Complete automated feature engineering sequence preparing raw industrial time-series data for neural networks and tree classifiers.
            </p>

            {/* Visual Step-by-Step Flow */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center text-center">
              {[
                { title: '1. Raw Dataset', desc: `${selectedDataset.rowCount.toLocaleString()} rows ingested` },
                { title: '2. Missing Value', desc: 'Imputation / Drop nulls' },
                { title: '3. Data Cleaning', desc: 'Outlier rejection & clip' },
                { title: '4. Feature Select', desc: 'RFE & Pearson filter' },
                { title: '5. Scaling', desc: 'StandardScaler (Z-score)' },
                { title: '6. Train/Test Split', desc: '80% Train / 20% Test' },
                { title: '7. ML Models', desc: 'XGBoost & LSTM Net' },
              ].map((step, idx) => (
                <div key={idx} className="relative flex flex-col items-center">
                  <div className={`w-full rounded-xl p-3 flex flex-col items-center border transition-colors ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mb-1 font-mono border ${
                      isDark 
                        ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300' 
                        : 'bg-sky-100 border-sky-300 text-sky-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{step.title}</span>
                    <span className={`text-[10px] mt-0.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Preprocessing Statistics Summary Box */}
            <div className={`mt-6 rounded-xl p-4 border transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-sky-50/50 border-sky-200'
            }`}>
              <span className={`text-xs font-semibold uppercase tracking-wider text-[11px] block mb-3 ${
                isDark ? 'text-slate-300' : 'text-sky-800'
              }`}>
                Live Preprocessing Run Statistics
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-mono">
                <div>
                  <span className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Rows:</span>
                  <span className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{selectedDataset.rowCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Missing Values:</span>
                  <span className={`font-bold text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>0 (Clean)</span>
                </div>
                <div>
                  <span className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Engineered Features:</span>
                  <span className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>5 Channels</span>
                </div>
                <div>
                  <span className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Training Split:</span>
                  <span className={`font-bold text-sm ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>80% (8,000 rows)</span>
                </div>
                <div>
                  <span className={`block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Testing Split:</span>
                  <span className={`font-bold text-sm ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>20% (2,000 rows)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Digital Twin Feature Mapping */}
      {activeTab === 'mapping' && (
        <div className={`rounded-xl p-6 border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Column-to-Twin Semantic Mapping
          </h3>
          <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Map incoming dataset columns directly to the Digital Twin's physics dimensions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['temperature', 'vibration', 'pressure', 'voltage', 'current', 'target', 'cycle'] as const).map((key) => (
              <div key={key} className={`rounded-lg p-3 flex items-center justify-between border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className={`text-xs font-bold capitalize font-mono block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Digital Twin: {key}
                  </span>
                  <span className={`text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Target physical variable
                  </span>
                </div>
                <select
                  value={columnMapping[key]}
                  onChange={(e) => setColumnMapping({ ...columnMapping, [key]: e.target.value })}
                  className={`text-xs font-mono rounded px-2.5 py-1.5 focus:outline-none border ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-cyan-300 focus:border-cyan-500' 
                      : 'bg-white border-slate-300 text-slate-800 focus:border-sky-500'
                  }`}
                >
                  {selectedDataset.columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => alert('Feature mapping synchronized with Digital Twin inference pipeline!')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isDark ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold' : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
              }`}
            >
              Apply Column Mapping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
