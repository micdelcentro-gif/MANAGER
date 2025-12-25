
import React, { useState } from 'react';
import { AppView, Project, DailyReport } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import DailyReports from './components/DailyReports';
import RiskAnalysis from './components/RiskAnalysis';
import ISO9001 from './components/ISO9001';
import AIAssistant from './components/AIAssistant';
import ImageStudio from './components/ImageStudio';
import VideoLab from './components/VideoLab';

// Added Risk Analysis interface
export interface RiskAPR {
  id: string;
  activity: string;
  responsible: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  score: number;
  type: string;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  
  // Centralized State
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Mantenimiento Planta A', client: 'PEMEX', status: 'active', progress: 65, startDate: '2023-10-12' },
    { id: '2', name: 'Instalación Sensores', client: 'Cemex', status: 'active', progress: 90, startDate: '2023-10-15' },
    { id: '3', name: 'Limpieza Industrial', client: 'Grupo Alfa', status: 'on-hold', progress: 10, startDate: '2023-10-20' },
  ]);

  const [reports, setReports] = useState<DailyReport[]>([]);
  
  const [riskAnalyses, setRiskAnalyses] = useState<RiskAPR[]>([
    { id: 'APR-001', activity: 'Instalación de tubería 12"', responsible: 'Ing. Roberto Gómez', status: 'Approved', score: 92, type: 'Trabajos en Altura' },
  ]);

  const renderContent = () => {
    switch (activeView) {
      case AppView.DASHBOARD: 
        return <Dashboard projects={projects} riskAnalyses={riskAnalyses} />;
      case AppView.PROJECTS: 
        return <Projects projects={projects} setProjects={setProjects} />;
      case AppView.DAILY_REPORTS: 
        return <DailyReports projects={projects} reports={reports} setReports={setReports} />;
      case AppView.RISK_ANALYSIS: 
        return <RiskAnalysis riskAnalyses={riskAnalyses} setRiskAnalyses={setRiskAnalyses} />;
      case AppView.ISO_9001: 
        return <ISO9001 />;
      case AppView.AI_ASSISTANT: 
        return <AIAssistant />;
      case AppView.IMAGE_STUDIO: 
        return <ImageStudio />;
      case AppView.VIDEO_LAB: 
        return <VideoLab />;
      default: 
        return <Dashboard projects={projects} riskAnalyses={riskAnalyses} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 ml-64 p-8 transition-all duration-300 bg-slate-50">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {activeView.replace('_', ' ')}
            </h1>
            <p className="text-slate-500 font-medium">MICSA SIGO • Sistema Integrado de Gestión Operativa</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 w-10 h-10 rounded-full hover:bg-slate-200 text-slate-600 transition-all flex items-center justify-center relative">
              <i className="fa-solid fa-bell"></i>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-4 ml-2">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-10 h-10 rounded-full border border-slate-200 bg-white" alt="Avatar" />
              <div>
                <p className="text-sm font-bold text-slate-800">Admin User</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Gerente de Operaciones</p>
              </div>
            </div>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
