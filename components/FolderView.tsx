
import React from 'react';
import type { Folder, Meeting } from '../types';
import { AppView } from '../types';

interface FolderViewProps {
  folder: Folder;
  setView: (view: AppView) => void;
  setSelectedMeeting: (meeting: Meeting) => void;
}

const FolderView: React.FC<FolderViewProps> = ({ folder, setView, setSelectedMeeting }) => {
    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">{folder.name}</h2>
                <button
                    onClick={() => setView(AppView.MEETING)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    Start New Meeting
                </button>
            </div>

            <div className="flex-grow bg-slate-800 rounded-lg p-6 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4 text-slate-200">Meeting History</h3>
                {folder.meetings.length === 0 ? (
                    <div className="text-center text-slate-400 py-10">
                        <p>No meetings recorded in this folder yet.</p>
                        <p>Click "Start New Meeting" to begin.</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {folder.meetings.map((meeting) => (
                            <li key={meeting.id}>
                                <button
                                    onClick={() => {
                                        setSelectedMeeting(meeting);
                                        setView(AppView.SUMMARY);
                                    }}
                                    className="w-full text-left bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <p className="font-semibold text-lg text-white">{meeting.title}</p>
                                    <p className="text-sm text-slate-400">{meeting.date}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FolderView;
