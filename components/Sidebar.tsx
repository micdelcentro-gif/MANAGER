
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, icon: 'fa-gauge-high', label: 'Dashboard' },
    { id: AppView.PROJECTS, icon: 'fa-briefcase', label: 'Proyectos' },
    { id: AppView.DAILY_REPORTS, icon: 'fa-file-signature', label: 'Reportes Diarios' },
    { id: AppView.RISK_ANALYSIS, icon: 'fa-triangle-exclamation', label: 'Análisis de Riesgo' },
    { id: AppView.ISO_9001, icon: 'fa-certificate', label: 'ISO 9001:2015' },
    { id: 'divider-1', label: 'AI TOOLS', type: 'header' },
    { id: AppView.AI_ASSISTANT, icon: 'fa-microphone', label: 'Asistente de Voz (Live)' },
    { id: AppView.IMAGE_STUDIO, icon: 'fa-wand-magic-sparkles', label: 'Estudio de Imagen' },
    { id: AppView.VIDEO_LAB, icon: 'fa-clapperboard', label: 'Video Lab (Veo)' },
  ];

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 fixed left-0 top-0 z-50 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">M</div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-tight">MICSA SIGO</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Gestión Industrial</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          if (item.type === 'header') {
            return (
              <p key={item.id} className="text-[10px] font-bold text-slate-500 mt-6 mb-2 px-3 tracking-widest uppercase">
                {item.label}
              </p>
            );
          }
          
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as AppView)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-3 rounded-xl">
          <p className="text-xs text-slate-400 mb-1">Status del Sistema</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-semibold text-emerald-500">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
