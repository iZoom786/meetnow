

import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Summary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getLiveSession = (callbacks: {
    onopen: () => void;
    onmessage: (message: any) => void;
    onerror: (e: any) => void;
    onclose: (e: any) => void;
}) => {
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks,
        config: {
            inputAudioTranscription: {},
            // FIX: responseModalities is required for the Live API and must be set to AUDIO.
            responseModalities: [Modality.AUDIO],
        },
    });
};

export const generateSummary = async (transcript: string): Promise<Summary> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following meeting transcript, please provide a concise summary, a list of key highlights, and a list of action items.
            
            Transcript:
            ---
            ${transcript}
            ---
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: {
                            type: Type.STRING,
                            description: 'A concise summary of the meeting.'
                        },
                        highlights: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of key highlights and decisions.'
                        },
                        actionItems: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of action items with assigned owners if mentioned.'
                        }
                    },
                    required: ["summary", "highlights", "actionItems"]
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as Summary;

    } catch (error) {
        console.error("Error generating summary:", error);
        throw new Error("Failed to generate summary.");
    }
};