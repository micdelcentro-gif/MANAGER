
import React, { useState, useRef } from 'react';
import { editImageWithAI } from '../services/geminiService';

const ImageStudio: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyEdit = async () => {
    if (!image || !prompt) return;
    setIsProcessing(true);
    try {
      const edited = await editImageWithAI(image, prompt);
      if (edited) setImage(edited);
      setPrompt('');
    } catch (err) {
      console.error(err);
      alert('Error processing image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 min-h-[500px] flex items-center justify-center relative overflow-hidden">
          {image ? (
            <img src={image} className="max-w-full max-h-[600px] rounded-xl object-contain" alt="Current" />
          ) : (
            <div className="text-center p-12">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fa-solid fa-image"></i>
              </div>
              <p className="text-slate-400">Sube una fotografía de obra para editarla con AI</p>
            </div>
          )}
          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-blue-600">Procesando con Gemini...</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-4">Controles</h3>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 mb-4"
          >
            <i className="fa-solid fa-upload"></i>
            Cambiar Imagen
          </button>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instrucción AI</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: 'Añade un filtro retro' o 'Remueve a la persona del fondo'"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none min-h-[120px] resize-none"
            ></textarea>
            <button 
              disabled={!image || !prompt || isProcessing}
              onClick={handleApplyEdit}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              Procesar con Gemini
            </button>
          </div>
        </div>

        <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-200">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <i className="fa-solid fa-circle-info"></i>
            Tips de Edición
          </h4>
          <ul className="text-sm text-blue-100 space-y-2">
            <li>• Se específico con los objetos</li>
            <li>• Puedes pedir cambios de iluminación</li>
            <li>• "Remueve [objeto]" funciona mejor en áreas simples</li>
            <li>• Funciona mejor con fotos de alta resolución</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
