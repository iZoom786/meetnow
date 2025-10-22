

import React, { useState, useRef, useCallback } from 'react';
import { getLiveSession } from '../services/geminiService';
import type { Folder } from '../types';
import { AppView } from '../types';
// FIX: Import audio utility functions for encoding and decoding audio data.
import { encode, decode, decodeAudioData } from '../utils/audio';
import MicIcon from './icons/MicIcon';
import StopIcon from './icons/StopIcon';

interface MeetingViewProps {
  folder: Folder;
  startNewMeeting: (transcript: string) => void;
  setView: (view: AppView) => void;
}

const MeetingView: React.FC<MeetingViewProps> = ({ folder, startNewMeeting, setView }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  // FIX: Add refs for handling audio output as per guidelines.
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  
  const lastMeeting = folder.meetings.length > 0 ? folder.meetings[folder.meetings.length - 1] : null;

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    setIsRecording(false);
    
    sessionPromiseRef.current?.then(session => session.close());
    sessionPromiseRef.current = null;

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    // FIX: Close output audio context and clean up resources on stop.
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      outputAudioContextRef.current.close();
    }
    audioContextRef.current = null;
    outputAudioContextRef.current = null;
    scriptProcessorRef.current?.disconnect();
    mediaStreamSourceRef.current?.disconnect();

    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;


    if(transcript.trim().length > 0) {
        startNewMeeting(transcript);
    } else {
        setView(AppView.FOLDER);
    }
  }, [isRecording, transcript, startNewMeeting, setView]);

  const startRecording = useCallback(async () => {
    setIsRecording(true);
    setTranscript('');
    // FIX: Reset audio playback state on start.
    nextStartTimeRef.current = 0;
    sourcesRef.current.clear();
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // FIX: Add a type assertion to 'window' to fix the 'webkitAudioContext' TypeScript error.
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        sessionPromiseRef.current = getLiveSession({
            onopen: () => {
                console.log('Session opened');
                mediaStreamSourceRef.current = audioContextRef.current!.createMediaStreamSource(stream);
                scriptProcessorRef.current = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
                
                scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    // FIX: Improve performance of audio data conversion and create blob as per guidelines.
                    const l = inputData.length;
                    const int16 = new Int16Array(l);
                    for (let i = 0; i < l; i++) {
                        int16[i] = inputData[i] * 32768;
                    }
                    const pcmBlob = {
                        data: encode(new Uint8Array(int16.buffer)),
                        mimeType: 'audio/pcm;rate=16000',
                    };

                    // FIX: Send data after session promise resolves without extra checks.
                    sessionPromiseRef.current?.then(session => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    });
                };

                mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                scriptProcessorRef.current.connect(audioContextRef.current.destination);
            },
            onmessage: async (message: any) => {
                if (message.serverContent?.inputTranscription) {
                    const text = message.serverContent.inputTranscription.text;
                    setTranscript(prev => prev + text);
                }
                
                // FIX: Add audio output processing as it is required when using the Live API.
                const base64EncodedAudioString =
                    message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                if (base64EncodedAudioString && outputAudioContextRef.current) {
                    nextStartTimeRef.current = Math.max(
                        nextStartTimeRef.current,
                        outputAudioContextRef.current.currentTime,
                    );
                    const audioBuffer = await decodeAudioData(
                        decode(base64EncodedAudioString),
                        outputAudioContextRef.current,
                        24000,
                        1,
                    );
                    const source = outputAudioContextRef.current.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputAudioContextRef.current.destination);
                    source.addEventListener('ended', () => {
                        sourcesRef.current.delete(source);
                    });

                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
                    sourcesRef.current.add(source);
                }

                const interrupted = message.serverContent?.interrupted;
                if (interrupted) {
                    for (const source of sourcesRef.current.values()) {
                        source.stop();
                        sourcesRef.current.delete(source);
                    }
                    nextStartTimeRef.current = 0;
                }
            },
            onerror: (e: Error) => {
                console.error('Session error:', e);
                stopRecording();
            },
            onclose: (e: CloseEvent) => {
                console.log('Session closed');
                stream.getTracks().forEach(track => track.stop());
            }
        });
        
        await sessionPromiseRef.current;

    } catch (err) {
        console.error('Error starting recording:', err);
        setIsRecording(false);
    }
  }, [stopRecording]);

  return (
    <div className="p-8 h-full flex flex-col bg-slate-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">New Meeting</h2>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-slate-400">In folder: <span className="font-semibold text-slate-200">{folder.name}</span></p>
          <button onClick={() => stopRecording()} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
            {isRecording ? 'Finish & Summarize' : 'Cancel'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow h-0">
        {/* Real-time transcript */}
        <div className="bg-slate-800 rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Live Transcript</h3>
          <div className="flex-grow overflow-y-auto pr-2">
            {transcript || <p className="text-slate-400">Waiting for audio...</p>}
          </div>
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
            >
              <MicIcon className="mr-2" /> Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300"
            >
              <StopIcon className="mr-2" /> Stop Recording
            </button>
          )}
        </div>
        
        {/* Previous meeting context */}
        <div className="bg-slate-800 rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Context from Last Meeting</h3>
          <div className="flex-grow overflow-y-auto pr-2">
            {lastMeeting?.summary ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-indigo-400">Summary</h4>
                  <p className="text-slate-300">{lastMeeting.summary.summary}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-400">Action Items</h4>
                  <ul className="list-disc list-inside text-slate-300">
                    {lastMeeting.summary.actionItems.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">No previous meeting notes available in this folder.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingView;