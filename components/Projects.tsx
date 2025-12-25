
import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const Projects: React.FC<ProjectsProps> = ({ projects, setProjects }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    client: '',
    location: '',
    description: '',
    progress: 0,
    status: 'active' as const
  });

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({ name: '', client: '', location: '', description: '', progress: 0, status: 'active' });
    setShowModal(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      client: project.client,
      location: '', // In a real app location would be in the model
      description: '',
      progress: project.progress,
      status: project.status
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...formData } : p));
    } else {
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        startDate: new Date().toISOString().split('T')[0]
      };
      setProjects(prev => [newProject, ...prev]);
    }
    setShowModal(false);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative w-72">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Buscar por nombre o cliente..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none text-sm transition-all"
          />
        </div>
        <button 
          onClick={handleOpenCreate}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-95"
        >
          <i className="fa-solid fa-plus"></i>
          Nuevo Proyecto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${project.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${project.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <i className="fa-solid fa-helmet-safety"></i>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleOpenEdit(project)} className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all flex items-center justify-center">
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button onClick={() => handleDelete(project.id)} className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all flex items-center justify-center">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>

            <h4 className="font-black text-xl mb-1 text-slate-800 leading-tight">{project.name}</h4>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{project.client}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Progreso Operativo</span>
                <span className="text-blue-600">{project.progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(u => (
                  <img key={u} src={`https://api.dicebear.com/7.x/initials/svg?seed=Staff${u+project.id}`} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" alt="Team" />
                ))}
                <div className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">+5</div>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${project.status === 'active' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-amber-500 text-white shadow-lg shadow-amber-200'}`}>
                {project.status === 'active' ? 'Activo' : 'Pausa'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-2xl text-slate-800">{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="w-10 h-10 text-slate-400 hover:bg-white hover:text-slate-600 rounded-full transition-all flex items-center justify-center border border-slate-200 shadow-sm"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Proyecto</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all" 
                    placeholder="Ej: Mantenimiento Ducto A" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cliente</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.client}
                    onChange={e => setFormData({...formData, client: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all" 
                    placeholder="Empresa mandante" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Progreso Actual (%)</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={formData.progress}
                    onChange={e => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estatus Inicial</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all"
                  >
                    <option value="active">Activo</option>
                    <option value="on-hold">En Pausa</option>
                    <option value="completed">Finalizado</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción de Alcance</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none h-28 resize-none transition-all" 
                  placeholder="Detalles técnicos del proyecto..."
                ></textarea>
              </div>
            </div>
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
              <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-colors">Cancelar</button>
              <button type="submit" className="px-10 py-4 bg-blue-600 text-white rounded-[20px] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                {editingProject ? 'Actualizar Proyecto' : 'Crear Proyecto'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Projects;
