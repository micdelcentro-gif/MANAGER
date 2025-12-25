
import React, { useState } from 'react';
import { RiskAPR } from '../App';

interface RiskAnalysisProps {
  riskAnalyses: RiskAPR[];
  setRiskAnalyses: React.Dispatch<React.SetStateAction<RiskAPR[]>>;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ riskAnalyses, setRiskAnalyses }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    activity: '',
    responsible: '',
    type: 'Trabajos en Altura',
    status: 'Pending' as const
  });

  const categories = [
    { title: 'Trabajos en Altura', icon: 'fa-ladder-water', risk: 'Alto' },
    { title: 'Espacios Confinados', icon: 'fa-door-closed', risk: 'Crítico' },
    { title: 'Riesgo Eléctrico', icon: 'fa-bolt', risk: 'Medio' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAPR: RiskAPR = {
      id: `APR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...formData,
      score: 0, // In a real app this would be calculated from a checklist
    };
    setRiskAnalyses(prev => [newAPR, ...prev]);
    setShowModal(false);
    setFormData({ activity: '', responsible: '', type: 'Trabajos en Altura', status: 'Pending' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-amber-50 border-2 border-amber-100 p-8 rounded-[40px] flex items-center gap-8 relative overflow-hidden group shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-amber-300/30 transition-all duration-700"></div>
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-4xl shrink-0 shadow-inner relative z-10">
          <i className="fa-solid fa-triangle-exclamation animate-pulse"></i>
        </div>
        <div className="relative z-10">
          <h3 className="font-black text-amber-900 text-2xl tracking-tight">Protocolo APR (Análisis de Riesgo Preventivo)</h3>
          <p className="text-amber-800/70 font-medium max-w-2xl mt-1 italic">
            "Ninguna tarea es tan importante ni tan urgente que no pueda ser realizada con seguridad."
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((item, i) => {
          const count = riskAnalyses.filter(a => a.type === item.title).length;
          return (
            <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group border-b-4 border-b-slate-50 hover:border-b-blue-500">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.risk === 'Crítico' ? 'bg-rose-500 text-white' : item.risk === 'Alto' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'} shadow-lg`}>
                  {item.risk}
                </span>
              </div>
              <h4 className="font-black text-xl text-slate-800 mb-1">{item.title}</h4>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">{count} Análisis realizados este mes</p>
              <button 
                onClick={() => {
                  setFormData({...formData, type: item.title});
                  setShowModal(true);
                }}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200"
              >
                Nuevo Análisis
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Historial de Análisis APR
          </h3>
          <button className="px-6 py-2 bg-white text-blue-600 font-black text-xs uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-blue-50 transition-all">
            Exportar SIGO (CSV)
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Identificador</th>
                <th className="px-8 py-5">Actividad Crítica</th>
                <th className="px-8 py-5">Categoría</th>
                <th className="px-8 py-5">Responsable HSE</th>
                <th className="px-8 py-5">Estatus</th>
                <th className="px-8 py-5 text-center">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {riskAnalyses.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-xs font-black text-slate-300">#{item.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">{item.activity}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{item.type}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.responsible}`} className="w-7 h-7 rounded-full" alt="HSE" />
                      <span className="text-sm font-medium text-slate-600">{item.responsible}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'Approved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse'}`}></div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.status === 'Approved' ? 'Aprobado' : 'Pendiente'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-sm font-black ${item.score >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {item.score > 0 ? `${item.score}/100` : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-2xl text-slate-800">Generar Análisis APR</h3>
              <button type="button" onClick={() => setShowModal(false)} className="w-10 h-10 text-slate-400 hover:bg-white hover:text-slate-600 rounded-full transition-all flex items-center justify-center border border-slate-200 shadow-sm"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Actividad Crítica</label>
                <input 
                  required 
                  type="text" 
                  value={formData.activity}
                  onChange={e => setFormData({...formData, activity: e.target.value})}
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all font-bold" 
                  placeholder="Ej: Soldadura en rack de 15 metros" 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría de Riesgo</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all font-bold"
                  >
                    {categories.map(c => <option key={c.title} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ing. Responsable HSE</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.responsible}
                    onChange={e => setFormData({...formData, responsible: e.target.value})}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all font-bold" 
                    placeholder="Nombre del ingeniero" 
                  />
                </div>
              </div>
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2">Checklist Rápido</p>
                <div className="space-y-2">
                  {[
                    'EPP Completo y en buen estado',
                    'Permiso de trabajo autorizado',
                    'Entorno de trabajo señalizado',
                    'Plan de rescate establecido'
                  ].map((check, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 rounded-lg border-amber-200 text-amber-600 focus:ring-amber-500" />
                      <span className="text-sm font-medium text-amber-900/70">{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
              <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-colors">Abortar</button>
              <button type="submit" className="px-10 py-4 bg-amber-500 text-white rounded-[20px] font-black shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all active:scale-95">
                Certificar APR
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RiskAnalysis;
