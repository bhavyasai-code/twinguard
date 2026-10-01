import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Menu, 
  X, 
  Play, 
  Pause, 
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { MachineHealthStatus } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  status: MachineHealthStatus;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  status,
  isSimulating,
  onToggleSimulation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'twin', label: 'Digital Twin' },
    { id: 'monitoring', label: 'Live Monitoring' },
    { id: 'predictions', label: 'Predictions' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'dataset', label: 'Dataset' },
    { id: 'performance', label: 'Model Metrics' },
    { id: 'about', label: 'About Project' },
  ];

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-950/95 border-b border-slate-800 text-slate-100' 
        : 'bg-white/90 border-b border-slate-200/80 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Zone */}
        <button
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isDark 
              ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 group-hover:bg-cyan-500/20 shadow-xs shadow-cyan-500/20' 
              : 'bg-sky-100 border border-sky-200 text-sky-600 group-hover:bg-sky-200/60'
          }`}>
            <Cpu className="w-4 h-4" />
          </div>
          <span className={`text-lg font-extrabold tracking-tight whitespace-nowrap ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            AI Digital Twin
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === link.id
                  ? isDark 
                    ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs' 
                    : 'bg-sky-100 text-sky-800 font-semibold border border-sky-200/80 shadow-xs'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Medium-screen Condensed Nav */}
        <nav className="hidden md:flex xl:hidden items-center gap-1">
          {navLinks.slice(0, 5).map((link) => (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === link.id
                  ? isDark
                    ? 'bg-slate-800 text-cyan-400 font-semibold'
                    : 'bg-sky-100 text-sky-800 font-semibold'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="relative group">
            <button className={`px-2 py-1 text-xs flex items-center gap-1 ${
              isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}>
              <span>More</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <div className={`absolute right-0 mt-1 w-40 rounded-lg shadow-xl py-1 hidden group-hover:block z-50 border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {navLinks.slice(5).map((link) => (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`w-full text-left px-3 py-1.5 text-xs block transition-colors ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Zone 3: Primary Action, Theme Toggle & Status Indicator */}
        <div className="flex items-center gap-2.5">
          {/* Quick status pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'Healthy'
                  ? isDark ? 'bg-emerald-400 shadow-xs shadow-emerald-400/50' : 'bg-emerald-500'
                  : status === 'Warning'
                  ? isDark ? 'bg-amber-400 animate-pulse shadow-xs shadow-amber-400/50' : 'bg-amber-500 animate-pulse'
                  : isDark ? 'bg-rose-400 animate-pulse shadow-xs shadow-rose-400/50' : 'bg-rose-500 animate-pulse'
              }`}
            />
            <span className={isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'}>
              {status}
            </span>
          </div>

          {/* Theme Toggle (Dark Bright vs Light Pastel) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800 hover:text-amber-200'
                : 'bg-sky-50 border-sky-200/80 text-slate-700 hover:bg-sky-100 hover:text-slate-900'
            }`}
            title={isDark ? 'Switch to Light Theme (Pastel Palette)' : 'Switch to Dark Theme (Bright Palette)'}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline text-[11px] font-mono text-slate-300">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-sky-600" />
                <span className="hidden lg:inline text-[11px] font-mono text-slate-600">Dark</span>
              </>
            )}
          </button>

          {/* Simulation Toggle Button */}
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              isSimulating
                ? isDark
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 shadow-xs shadow-amber-500/20'
                  : 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200/70'
                : isDark
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/30'
                  : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline">{isSimulating ? 'Pause Stream' : 'Live Stream'}</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg border ${
              isDark ? 'text-slate-400 hover:text-slate-200 bg-slate-900 border-slate-800' : 'text-slate-600 hover:text-slate-900 bg-white border-slate-200'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className={`md:hidden px-4 py-3 space-y-1 border-b ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === link.id
                  ? isDark ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-sky-600 text-white font-bold'
                  : isDark ? 'text-slate-300 hover:bg-slate-900' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
