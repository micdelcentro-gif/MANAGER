
import React, { useState, useRef } from 'react';

interface DocumentInfo {
  name: string;
  type: string;
  size: string;
}

const ISO9001: React.FC = () => {
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<DocumentInfo[]>([
    { name: 'Manual de Calidad V.4', type: 'PDF', size: '12MB' },
    { name: 'Procedimiento Soldadura', type: 'PDF', size: '4.5MB' },
    { name: 'Política de Calidad 2024', type: 'DOCX', size: '1.2MB' },
    { name: 'Matriz de Capacitación', type: 'XLSX', size: '2.8MB' },
    { name: 'Control de Cambios V.2', type: 'PDF', size: '3.1MB' },
    { name: 'Formato de No Conformidad', type: 'DOCX', size: '0.8MB' },
  ]);

  const handleDownload = (docName: string) => {
    setDownloadingDoc(docName);
    setPreviewDoc(null);
    setTimeout(() => {
      setDownloadingDoc(null);
    }, 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc: DocumentInfo = {
        name: file.name.split('.').slice(0, -1).join('.') || file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
      };
      setDocuments(prev => [newDoc, ...prev]);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Documentación del Sistema</h3>
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-cloud-arrow-up"></i>
                Subir Documento
              </button>
            </div>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {documents.map((doc, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setPreviewDoc(doc)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors text-lg">
                    <i className={`fa-solid ${doc.type === 'PDF' ? 'fa-file-pdf text-rose-500' : 'fa-file-lines text-blue-500'}`}></i>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-700 truncate max-w-[150px] md:max-w-[200px]">{doc.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(doc.name);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
                  title="Descarga directa"
                >
                  <i className="fa-solid fa-download"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-6">Auditorías e Inspecciones</h3>
          <div className="space-y-6">
            <div className="p-6 border border-slate-100 rounded-3xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Próxima Auditoría Interna</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">EN 14 DÍAS</span>
              </div>
              <h4 className="font-bold text-xl mb-1">Auditoría Trimestral Q2</h4>
              <p className="text-sm text-slate-500 mb-6">Enfoque: Procesos operativos y registros de capacitación en planta.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded-full" alt="Auditor" />
                  <p className="text-xs font-semibold text-slate-600">Auditor: M. Sandoval</p>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black">Ver Agenda</button>
              </div>
            </div>

            <div className="p-6 border border-slate-100 rounded-3xl bg-slate-50/50 border-dashed">
              <h4 className="font-bold mb-1">No Conformidades Abiertas</h4>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-rose-600">03</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Mayores</p>
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-amber-600">12</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Menores</p>
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-blue-600">45</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Resueltas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center text-xs">
                  <i className={`fa-solid ${previewDoc.type === 'PDF' ? 'fa-file-pdf' : 'fa-file-lines'}`}></i>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{previewDoc.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Vista Previa • {previewDoc.type} • {previewDoc.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDownload(previewDoc.name)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-download"></i>
                  Descargar
                </button>
                <button 
                  onClick={() => setPreviewDoc(null)}
                  className="w-10 h-10 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-200 overflow-y-auto p-8 flex justify-center">
              {/* Mock PDF Viewer Representation */}
              <div className="bg-white w-full max-w-[800px] shadow-lg rounded-sm p-16 flex flex-col gap-8 min-h-[1000px]">
                <div className="flex justify-between items-start border-b-4 border-blue-600 pb-8">
                  <div>
                    <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">MICSA</h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Soluciones Industriales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Documento ID</p>
                    <p className="font-mono text-sm">SIGO-ISO-{previewDoc.name.substring(0, 3).toUpperCase()}-2024</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-64 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 italic text-sm text-center px-4">
                    [ Vista previa del documento: {previewDoc.name} ]<br/>
                    Este es un visor simulado para documentos {previewDoc.type}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-slate-50 border border-slate-100 rounded-xl"></div>
                    <div className="h-32 bg-slate-50 border border-slate-100 rounded-xl"></div>
                  </div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-11/12"></div>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Confidencial • Solo uso interno</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Página 1 de 12</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-center gap-4 text-slate-500">
               <button className="w-8 h-8 rounded hover:bg-slate-200"><i className="fa-solid fa-magnifying-glass-plus"></i></button>
               <button className="w-8 h-8 rounded hover:bg-slate-200"><i className="fa-solid fa-magnifying-glass-minus"></i></button>
               <div className="h-8 w-px bg-slate-300 mx-2"></div>
               <button className="w-8 h-8 rounded hover:bg-slate-200"><i className="fa-solid fa-chevron-left"></i></button>
               <span className="flex items-center text-xs font-bold px-4">1 / 12</span>
               <button className="w-8 h-8 rounded hover:bg-slate-200"><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Modal */}
      {downloadingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Preparando descarga</h3>
            <p className="text-slate-500 mb-1 font-medium">Cargando documento...</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{downloadingDoc}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ISO9001;
