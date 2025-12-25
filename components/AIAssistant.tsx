
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiInstance, decodePCM, encodePCM, decodeAudioDataToBuffer } from '../services/geminiService';
import { Modality } from '@google/genai';

const AIAssistant: React.FC = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      const ai = getGeminiInstance();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsSessionActive(true);
            setStatus('Active');
            
            const source = inputContext.createMediaStreamSource(stream);
            const scriptProcessor = inputContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encodePCM(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContext.destination);
          },
          onmessage: async (message) => {
            if (message.serverContent?.outputTranscription) {
               setTranscripts(prev => [...prev, `AI: ${message.serverContent.outputTranscription.text}`]);
            }
            if (message.serverContent?.inputTranscription) {
               setTranscripts(prev => [...prev, `You: ${message.serverContent.inputTranscription.text}`]);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const audioBuffer = await decodeAudioDataToBuffer(
                decodePCM(base64Audio),
                audioContextRef.current,
                24000,
                1
              );
              
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current.destination);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Gemini Error:', e);
            setStatus('Error');
          },
          onclose: () => {
            setIsSessionActive(false);
            setStatus('Disconnected');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'Eres el asistente experto de MICSA SIGO. Ayudas a los ingenieros con dudas sobre proyectos, seguridad e ISO 9001.',
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Failed to start');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsSessionActive(false);
    setStatus('Idle');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl transition-all duration-500 ${isSessionActive ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
          <i className="fa-solid fa-microphone"></i>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-bold">Asistente de Voz MICSA</h2>
          <p className="text-slate-500">Conversa en tiempo real con el sistema experto</p>
          <div className="mt-2 flex justify-center items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{status}</span>
          </div>
        </div>

        <div className="flex gap-4">
          {!isSessionActive ? (
            <button 
              onClick={startSession}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-play"></i>
              Iniciar Conversación
            </button>
          ) : (
            <button 
              onClick={stopSession}
              className="px-8 py-3 bg-rose-600 text-white rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-stop"></i>
              Terminar Sesión
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-96 overflow-y-auto space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest sticky top-0 bg-white pb-4">Transcripción en tiempo real</h3>
        {transcripts.length === 0 && <p className="text-slate-400 italic text-center py-12">Inicia la sesión para ver la transcripción...</p>}
        {transcripts.map((t, i) => (
          <div key={i} className={`p-4 rounded-2xl max-w-[80%] ${t.startsWith('AI:') ? 'bg-blue-50 text-blue-800 self-start' : 'bg-slate-100 text-slate-800 self-end ml-auto'}`}>
            <p className="text-sm font-medium">{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIAssistant;
