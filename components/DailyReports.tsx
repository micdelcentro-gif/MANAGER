
import React, { useState } from 'react';
import { Project, DailyReport } from '../types';

interface DailyReportsProps {
  projects: Project[];
  reports: DailyReport[];
  setReports: React.Dispatch<React.SetStateAction<DailyReport[]>>;
}

const DailyReports: React.FC<DailyReportsProps> = ({ projects, reports, setReports }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    shift: 'Matutino',
    activities: '',
    personnel: 0,
    manHours: 0,
    incidents: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) return alert('Selecciona un proyecto');
    
    const newReport: DailyReport = {
      id: Math.random().toString(36).substr(2, 9),
      projectId: formData.projectId,
      date: new Date().toLocaleDateString(),
      activities: formData.activities,
      safetyObservations: formData.incidents > 0 ? `Se reportaron ${formData.incidents} incidentes.` : 'Sin incidentes reportados.',
      images: []
    };

    setReports(prev => [newReport, ...prev]);
    setShowForm(false);
    setFormData({ projectId: '', shift: 'Matutino', activities: '', personnel: 0, manHours: 0, incidents: 0 });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-800">Bitácora de Obra</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Gestión de reportes diarios y avances</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center gap-2"
        >
          <i className="fa-solid fa-file-circle-plus"></i>
          Nuevo Reporte
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left"></i>
            Historial Reciente
          </h3>
          {reports.length === 0 ? (
            <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                <i className="fa-solid fa-folder-open"></i>
              </div>
              <p className="text-slate-400 font-bold">No hay reportes registrados hoy</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => {
                const project = projects.find(p => p.id === report.projectId);
                return (
                  <div key={report.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                      <i className="fa-solid fa-file-invoice"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{project?.name || 'Proyecto Desconocido'}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{report.date}</span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{report.activities}</p>
                      <div className="flex gap-4">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-1 rounded-lg">ISO COMPLIANT</span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-1 rounded-lg">AUDITADO</span>
                      </div>
                    </div>
                    <button className="self-center p-3 text-slate-300 hover:text-blue-600 transition-colors">
                      <i className="fa-solid fa-circle-chevron-right text-2xl"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Resumen de Métricas</h3>
          <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl shadow-slate-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Reportes Semanales</p>
                <p className="text-4xl font-black">124</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Horas Totales</p>
                  <p className="text-lg font-black">982h</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Incidentes</p>
                  <p className="text-lg font-black text-rose-400">02</p>
                </div>
              </div>
              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
                Descargar Reporte Global
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800">Nuevo Reporte de Campo</h2>
              <button type="button" onClick={() => setShowForm(false)} className="w-10 h-10 text-slate-400 hover:bg-white hover:text-slate-600 rounded-full transition-all flex items-center justify-center border border-slate-200"><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seleccionar Proyecto</label>
                  <select 
                    required
                    value={formData.projectId}
                    onChange={e => setFormData({...formData, projectId: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-700"
                  >
                    <option value="">Seleccione un proyecto...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Turno de Trabajo</label>
                  <div className="flex gap-2">
                    {['Matutino', 'Vespertino', 'Nocturno'].map(t => (
                      <button 
                        key={t} 
                        type="button" 
                        onClick={() => setFormData({...formData, shift: t})}
                        className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all ${formData.shift === t ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Actividades Detalladas</label>
                <textarea 
                  required
                  value={formData.activities}
                  onChange={e => setFormData({...formData, activities: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-3xl min-h-[120px] outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all resize-none" 
                  placeholder="Detalla los avances, retos y hallazgos del turno..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Personal (Pax)</label>
                  <input 
                    type="number" 
                    value={formData.personnel}
                    onChange={e => setFormData({...formData, personnel: parseInt(e.target.value) || 0})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Horas Hombre</label>
                  <input 
                    type="number" 
                    value={formData.manHours}
                    onChange={e => setFormData({...formData, manHours: parseInt(e.target.value) || 0})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Incidentes</label>
                  <input 
                    type="number" 
                    value={formData.incidents}
                    onChange={e => setFormData({...formData, incidents: parseInt(e.target.value) || 0})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evidencia (Carga simulada)</label>
                <div className="grid grid-cols-4 gap-4">
                  <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-slate-100 group transition-all">
                    <i className="fa-solid fa-camera text-2xl text-slate-200 group-hover:text-blue-500 transition-colors"></i>
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-square rounded-3xl overflow-hidden relative group border border-slate-100 shadow-sm">
                      <img src={`https://picsum.photos/seed/evidencia${i}/400/400`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Evidencia" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <i className="fa-solid fa-eye text-white"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600">Descartar</button>
              <button type="submit" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95">
                Enviar a Revisión
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DailyReports;
