import React from 'react';
import { Cpu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t py-8 px-4 sm:px-6 lg:px-8 mt-16 text-xs transition-colors ${
      isDark 
        ? 'border-slate-900 bg-slate-950 text-slate-500' 
        : 'border-slate-200 bg-slate-50/80 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded flex items-center justify-center border ${
            isDark ? 'bg-cyan-950 border-cyan-800 text-cyan-400' : 'bg-sky-100 border-sky-300 text-sky-700'
          }`}>
            <Cpu className="w-3 h-3" />
          </div>
          <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
            AI Digital Twin Platform
          </span>
          <span>·</span>
          <span>Predictive Maintenance &amp; Machine Health Scoring</span>
        </div>

        <div className={`flex items-center gap-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <button 
            onClick={() => onSelectTab('about')} 
            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-cyan-400' : 'hover:text-sky-600'}`}
          >
            Viva Documentation
          </button>
          <span>·</span>
          <button 
            onClick={() => onSelectTab('dataset')} 
            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-cyan-400' : 'hover:text-sky-600'}`}
          >
            AI4I / C-MAPSS Datasets
          </button>
          <span>·</span>
          <button 
            onClick={() => onSelectTab('performance')} 
            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-cyan-400' : 'hover:text-sky-600'}`}
          >
            Model Benchmarks
          </button>
        </div>
      </div>
    </footer>
  );
};
