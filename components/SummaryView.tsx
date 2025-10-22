
import React, { useState } from 'react';
import type { Meeting } from '../types';
import SlackIcon from './icons/SlackIcon';
import NotionIcon from './icons/NotionIcon';
import HubspotIcon from './icons/HubspotIcon';

interface SummaryViewProps {
  meeting: Meeting;
}

const SummaryView: React.FC<SummaryViewProps> = ({ meeting }) => {
  const [activeTab, setActiveTab] = useState('summary');

  if (!meeting.summary) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">Generating Summary...</h2>
          <p className="text-slate-400">The AI is analyzing the transcript. This may take a moment.</p>
        </div>
      </div>
    );
  }

  const handleExport = (platform: string) => {
    alert(`Exporting to ${platform}... (This is a demo)`);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">{meeting.title}</h2>
          <p className="text-slate-400">{meeting.date}</p>
        </div>
        <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-300 mr-2">Export to:</span>
            <button onClick={() => handleExport('Slack')} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"><SlackIcon /></button>
            <button onClick={() => handleExport('Notion')} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"><NotionIcon /></button>
            <button onClick={() => handleExport('Hubspot')} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"><HubspotIcon /></button>
        </div>
      </div>

      <div className="border-b border-slate-700 mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-2 px-4 text-lg font-medium transition-colors ${activeTab === 'summary' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`py-2 px-4 text-lg font-medium transition-colors ${activeTab === 'transcript' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            Full Transcript
          </button>
        </nav>
      </div>

      <div className="flex-grow bg-slate-800 rounded-lg p-6 overflow-y-auto">
        {activeTab === 'summary' ? (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-100">Summary</h3>
              <p className="text-slate-300 leading-relaxed">{meeting.summary.summary}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-100">Highlights</h3>
              <ul className="space-y-2 list-disc list-inside">
                {meeting.summary.highlights.map((item, index) => (
                  <li key={index} className="text-slate-300">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-100">Action Items</h3>
              <ul className="space-y-2 list-disc list-inside">
                {meeting.summary.actionItems.map((item, index) => (
                  <li key={index} className="text-slate-300">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-slate-100">Transcript</h3>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{meeting.transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryView;
