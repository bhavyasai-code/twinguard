import { DatasetColumnStats, DatasetSummary } from '../types';

export const AI4I_DATASET_SUMMARY: DatasetSummary = {
  name: 'AI4I 2020 Predictive Maintenance Dataset (UCI / Mathes)',
  description: 'Synthetic dataset reflecting real industrial milling machine operational parameters with 5 independent failure modes (Tool Wear, Heat Dissipation, Power Failure, Overstrain, Random Failures).',
  rowCount: 10000,
  columnCount: 14,
  columns: [
    'UDI',
    'Product_ID',
    'Type',
    'Air_temperature_K',
    'Process_temperature_K',
    'Rotational_speed_rpm',
    'Torque_Nm',
    'Tool_wear_min',
    'Machine_failure',
    'TWF',
    'HDF',
    'PWF',
    'OSF',
    'RNF'
  ],
  missingValuesTotal: 0,
  stats: {
    Air_temperature_K: { name: 'Air_temperature_K', count: 10000, mean: 300.0, std: 2.0, min: 295.3, max: 304.5, missing: 0, type: 'numeric' },
    Process_temperature_K: { name: 'Process_temperature_K', count: 10000, mean: 310.0, std: 1.48, min: 305.7, max: 313.8, missing: 0, type: 'numeric' },
    Rotational_speed_rpm: { name: 'Rotational_speed_rpm', count: 10000, mean: 1538.7, std: 179.2, min: 1168.0, max: 2886.0, missing: 0, type: 'numeric' },
    Torque_Nm: { name: 'Torque_Nm', count: 10000, mean: 39.98, std: 9.96, min: 3.8, max: 76.6, missing: 0, type: 'numeric' },
    Tool_wear_min: { name: 'Tool_wear_min', count: 10000, mean: 107.9, std: 63.6, min: 0.0, max: 253.0, missing: 0, type: 'numeric' },
    Machine_failure: { name: 'Machine_failure', count: 10000, mean: 0.0339, std: 0.181, min: 0, max: 1, missing: 0, type: 'numeric' },
  },
  sampleRows: [
    { UDI: 1, Product_ID: 'M14860', Type: 'M', Air_temperature_K: 298.1, Process_temperature_K: 308.6, Rotational_speed_rpm: 1551, Torque_Nm: 42.8, Tool_wear_min: 0, Machine_failure: 0 },
    { UDI: 2, Product_ID: 'L47181', Type: 'L', Air_temperature_K: 298.2, Process_temperature_K: 308.7, Rotational_speed_rpm: 1408, Torque_Nm: 46.3, Tool_wear_min: 3, Machine_failure: 0 },
    { UDI: 3, Product_ID: 'L47182', Type: 'L', Air_temperature_K: 298.1, Process_temperature_K: 308.5, Rotational_speed_rpm: 1498, Torque_Nm: 49.4, Tool_wear_min: 5, Machine_failure: 0 },
    { UDI: 4, Product_ID: 'L47183', Type: 'L', Air_temperature_K: 298.2, Process_temperature_K: 308.6, Rotational_speed_rpm: 1433, Torque_Nm: 39.5, Tool_wear_min: 7, Machine_failure: 0 },
    { UDI: 5, Product_ID: 'L47184', Type: 'L', Air_temperature_K: 298.2, Process_temperature_K: 308.7, Rotational_speed_rpm: 1408, Torque_Nm: 40.0, Tool_wear_min: 9, Machine_failure: 0 },
    { UDI: 6, Product_ID: 'M14865', Type: 'M', Air_temperature_K: 298.1, Process_temperature_K: 308.6, Rotational_speed_rpm: 1425, Torque_Nm: 41.9, Tool_wear_min: 11, Machine_failure: 0 },
    { UDI: 7, Product_ID: 'L47186', Type: 'L', Air_temperature_K: 298.1, Process_temperature_K: 308.6, Rotational_speed_rpm: 1558, Torque_Nm: 35.7, Tool_wear_min: 13, Machine_failure: 0 },
    { UDI: 8, Product_ID: 'L47187', Type: 'L', Air_temperature_K: 298.1, Process_temperature_K: 308.6, Rotational_speed_rpm: 1527, Torque_Nm: 40.2, Tool_wear_min: 16, Machine_failure: 0 },
    { UDI: 51, Product_ID: 'B50012', Type: 'H', Air_temperature_K: 303.4, Process_temperature_K: 312.2, Rotational_speed_rpm: 1320, Torque_Nm: 62.4, Tool_wear_min: 198, Machine_failure: 1 },
    { UDI: 69, Product_ID: 'L47248', Type: 'L', Air_temperature_K: 304.1, Process_temperature_K: 313.2, Rotational_speed_rpm: 1210, Torque_Nm: 71.5, Tool_wear_min: 224, Machine_failure: 1 },
  ]
};

export const CMAPSS_DATASET_SUMMARY: DatasetSummary = {
  name: 'NASA C-MAPSS Turbofan Engine Degradation Dataset (FD001)',
  description: 'Simulated run-to-failure degradation trajectory of 100 aircraft gas turbine engines under sea-level conditions. Standard benchmark for Remaining Useful Life (RUL) prognostic modeling.',
  rowCount: 20631,
  columnCount: 26,
  columns: [
    'unit_number',
    'time_cycles',
    'setting_1',
    'setting_2',
    'setting_3',
    'T2_total_temp_fan',
    'T24_total_temp_LPC',
    'T30_total_temp_HPC',
    'T50_total_temp_LPT',
    'P2_pressure_fan',
    'P15_pressure_bypass',
    'P30_pressure_HPC',
    'Nf_physical_fan_speed',
    'Nc_physical_core_speed',
    'epr_engine_pressure_ratio',
    'Ps30_static_pressure_HPC',
    'phi_fuel_flow_ratio',
    'NRf_corrected_fan_speed',
    'NRc_corrected_core_speed',
    'BPR_bypass_ratio',
    'farB_burner_fuel_ratio',
    'htBleed_bleed_enthalpy',
    'Nf_dmd_demanded_fan_speed',
    'PCNfR_dmd_demanded_core_speed',
    'W31_HPT_coolant_bleed',
    'W32_LPT_coolant_bleed'
  ],
  missingValuesTotal: 0,
  stats: {
    unit_number: { name: 'unit_number', count: 20631, mean: 51.5, std: 29.2, min: 1, max: 100, missing: 0, type: 'numeric' },
    time_cycles: { name: 'time_cycles', count: 20631, mean: 108.8, std: 68.8, min: 1, max: 362, missing: 0, type: 'numeric' },
    T24_total_temp_LPC: { name: 'T24_total_temp_LPC', count: 20631, mean: 642.68, std: 0.50, min: 641.21, max: 644.53, missing: 0, type: 'numeric' },
    T30_total_temp_HPC: { name: 'T30_total_temp_HPC', count: 20631, mean: 1590.52, std: 6.13, min: 1571.04, max: 1616.91, missing: 0, type: 'numeric' },
    P30_pressure_HPC: { name: 'P30_pressure_HPC', count: 20631, mean: 553.37, std: 0.88, min: 549.85, max: 556.06, missing: 0, type: 'numeric' },
    Nc_physical_core_speed: { name: 'Nc_physical_core_speed', count: 20631, mean: 9065.24, std: 22.08, min: 9021.73, max: 9145.02, missing: 0, type: 'numeric' },
  },
  sampleRows: [
    { unit_number: 1, time_cycles: 1, T24_total_temp_LPC: 641.82, T30_total_temp_HPC: 1589.70, P30_pressure_HPC: 554.36, Nc_physical_core_speed: 9046.19 },
    { unit_number: 1, time_cycles: 2, T24_total_temp_LPC: 642.15, T30_total_temp_HPC: 1591.82, P30_pressure_HPC: 553.75, Nc_physical_core_speed: 9044.07 },
    { unit_number: 1, time_cycles: 3, T24_total_temp_LPC: 642.35, T30_total_temp_HPC: 1587.99, P30_pressure_HPC: 554.26, Nc_physical_core_speed: 9052.94 },
    { unit_number: 1, time_cycles: 50, T24_total_temp_LPC: 642.48, T30_total_temp_HPC: 1592.11, P30_pressure_HPC: 553.44, Nc_physical_core_speed: 9054.12 },
    { unit_number: 1, time_cycles: 150, T24_total_temp_LPC: 643.12, T30_total_temp_HPC: 1598.45, P30_pressure_HPC: 552.18, Nc_physical_core_speed: 9071.25 },
    { unit_number: 1, time_cycles: 192, T24_total_temp_LPC: 644.21, T30_total_temp_HPC: 1608.92, P30_pressure_HPC: 550.91, Nc_physical_core_speed: 9098.40 },
  ]
};

export function parseCSV(csvText: string, datasetName = 'Uploaded_Dataset.csv'): DatasetSummary {
  const lines = csvText.trim().split(/\r\n|\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV file must have a header row and at least one data row.');
  }

  const columns = lines[0].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
  const rawRows: Record<string, any>[] = [];
  const stats: Record<string, DatasetColumnStats> = {};
  let missingValuesTotal = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const rowObj: Record<string, any> = {};
    for (let c = 0; c < columns.length; c++) {
      const colName = columns[c];
      const rawVal = values[c] !== undefined ? values[c].trim() : '';
      if (rawVal === '' || rawVal === 'NaN' || rawVal === 'null' || rawVal === 'NA') {
        rowObj[colName] = null;
        missingValuesTotal++;
      } else {
        const num = Number(rawVal);
        rowObj[colName] = isNaN(num) ? rawVal : num;
      }
    }
    rawRows.push(rowObj);
  }

  // Compute stats for numeric columns
  for (const col of columns) {
    const nonNulls = rawRows.map(r => r[col]).filter(v => v !== null && typeof v === 'number') as number[];
    const missingCount = rawRows.length - nonNulls.length;

    if (nonNulls.length > 0) {
      const sum = nonNulls.reduce((a, b) => a + b, 0);
      const mean = sum / nonNulls.length;
      const variance = nonNulls.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nonNulls.length;
      const std = Math.sqrt(variance);
      const min = Math.min(...nonNulls);
      const max = Math.max(...nonNulls);

      stats[col] = {
        name: col,
        count: nonNulls.length,
        mean: Number(mean.toFixed(2)),
        std: Number(std.toFixed(2)),
        min: Number(min.toFixed(2)),
        max: Number(max.toFixed(2)),
        missing: missingCount,
        type: 'numeric'
      };
    } else {
      stats[col] = {
        name: col,
        count: rawRows.length - missingCount,
        mean: 0,
        std: 0,
        min: 0,
        max: 0,
        missing: missingCount,
        type: 'string'
      };
    }
  }

  return {
    name: datasetName,
    description: `User-provided dataset with ${rawRows.length} rows and ${columns.length} columns.`,
    rowCount: rawRows.length,
    columnCount: columns.length,
    columns,
    missingValuesTotal,
    stats,
    sampleRows: rawRows.slice(0, 10),
  };
}
