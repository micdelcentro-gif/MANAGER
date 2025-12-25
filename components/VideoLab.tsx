
import React, { useState, useRef } from 'react';
import { getGeminiInstance } from '../services/geminiService';

const VideoLab: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!image) return;

    // Check for API key selection state as per guidelines
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
      // Proceed assuming success as per guidelines race condition note
    }

    setIsGenerating(true);
    setGenerationStep('Inicializando motor Veo 3.1...');
    
    try {
      const ai = getGeminiInstance();
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Animate this industrial scene with subtle movements',
        image: {
          imageBytes: image.split(',')[1],
          mimeType: 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setGenerationStep('Renderizando fotogramas (esto puede tardar unos minutos)...');

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setGenerationStep('Descargando resultado final...');
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error(err);
      alert('Error generando video. Verifica tu API Key.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <h3 className="font-bold text-lg">Entrada: Fotografía</h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors overflow-hidden"
            >
              {image ? (
                <img src={image} className="w-full h-full object-cover" alt="Source" />
              ) : (
                <div className="text-center p-6">
                  <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-300 mb-2"></i>
                  <p className="text-sm text-slate-400">Sube una imagen para animar</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
          </div>

          <div className="flex-1 space-y-4">
            <h3 className="font-bold text-lg">Instrucciones de Animación</h3>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: 'Muestra movimiento de maquinaria lenta y humo saliendo de las chimeneas'"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none min-h-[120px] resize-none"
            ></textarea>
            <button 
              disabled={!image || isGenerating}
              onClick={handleGenerateVideo}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-clapperboard"></i>
                  Animar con Veo
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 text-center">Requiere API Key con facturación activa en Google AI Studio</p>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="bg-blue-600 p-8 rounded-3xl text-white text-center animate-pulse">
          <h2 className="text-2xl font-bold mb-2">Estamos creando tu video</h2>
          <p className="text-blue-100">{generationStep}</p>
          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}}></div>)}
          </div>
        </div>
      )}

      {videoUrl && !isGenerating && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-4">Resultado Generado</h3>
          <video src={videoUrl} controls className="w-full rounded-2xl shadow-2xl border border-slate-100" />
          <div className="mt-4 flex justify-end">
            <a href={videoUrl} download="micsa-video.mp4" className="px-6 py-2 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
              <i className="fa-solid fa-download"></i>
              Descargar MP4
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLab;
