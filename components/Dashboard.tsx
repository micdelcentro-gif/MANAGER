
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Project } from '../types';
import { RiskAPR } from '../App';

interface DashboardProps {
  projects: Project[];
  riskAnalyses: RiskAPR[];
}

const data = [
  { name: 'Lun', proyectos: 12, incidentes: 1 },
  { name: 'Mar', proyectos: 15, incidentes: 0 },
  { name: 'Mie', proyectos: 10, incidentes: 2 },
  { name: 'Jue', proyectos: 18, incidentes: 0 },
  { name: 'Vie', proyectos: 22, incidentes: 1 },
  { name: 'Sab', proyectos: 8, incidentes: 0 },
  { name: 'Dom', proyectos: 5, incidentes: 0 },
];

const Dashboard: React.FC<DashboardProps> = ({ projects, riskAnalyses }) => {
  const activeCount = projects.filter(p => p.status === 'active').length;
  const avgScore = riskAnalyses.length > 0 
    ? Math.round(riskAnalyses.reduce((acc, curr) => acc + curr.score, 0) / riskAnalyses.length) 
    : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Proyectos Activos', value: activeCount.toString(), icon: 'fa-helmet-safety', color: 'blue' },
          { label: 'Horas Hombre', value: '12.5k', icon: 'fa-clock', color: 'emerald' },
          { label: 'Cumplimiento ISO', value: '98%', icon: 'fa-check-double', color: 'amber' },
          { label: 'Seguridad (APR)', value: `${avgScore}%`, icon: 'fa-circle-exclamation', color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black mt-1 text-slate-800">{stat.value}</h3>
            </div>
            <div className={`w-14 h-14 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Actividad de Proyectos
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="proyectos" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
            Tendencia de Riesgo
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorIncidentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="incidentes" stroke="#f43f5e" fillOpacity={1} fill="url(#colorIncidentes)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Resumen de Proyectos</h3>
          <button className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="pb-4 font-bold">Proyecto</th>
                <th className="pb-4 font-bold">Cliente</th>
                <th className="pb-4 font-bold">Estatus</th>
                <th className="pb-4 font-bold">Progreso</th>
                <th className="pb-4 font-bold">Fecha Inicio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {projects.slice(0, 5).map((project) => (
                <tr key={project.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs">
                        <i className="fa-solid fa-helmet-safety"></i>
                      </div>
                      <span className="font-bold text-slate-700">{project.name}</span>
                    </div>
                  </td>
                  <td className="py-5 text-slate-500 font-medium">{project.client}</td>
                  <td className="py-5">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${project.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {project.status === 'active' ? 'En Curso' : 'En Pausa'}
                    </span>
                  </td>
                  <td className="py-5 w-48">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="py-5 text-slate-400 text-xs font-bold">{project.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
