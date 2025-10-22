
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FolderView from './components/FolderView';
import MeetingView from './components/MeetingView';
import SummaryView from './components/SummaryView';
import SettingsView from './components/SettingsView';
import { AppView } from './types';
import type { Workspace, Folder, Meeting, Summary } from './types';
import { generateSummary } from './services/geminiService';

// Initial dummy data
const initialWorkspaces: Workspace[] = [
  {
    id: 'ws1',
    name: 'Product Team',
    folders: [
      {
        id: 'f1',
        name: 'Q3 Sprint Planning',
        meetings: [],
      },
      {
        id: 'f2',
        name: 'User Research',
        meetings: [],
      }
    ]
  },
  {
    id: 'ws2',
    name: 'Marketing',
    folders: [
      {
        id: 'f3',
        name: 'Campaign Launch',
        meetings: []
      }
    ]
  }
];

const App: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [selectedFolder, setSelectedFolder] = useState<{ workspaceId: string; folderId: string } | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [view, setView] = useState<AppView>(AppView.FOLDER);

  const getActiveFolder = (): Folder | null => {
    if (!selectedFolder) return null;
    const workspace = workspaces.find(w => w.id === selectedFolder.workspaceId);
    return workspace?.folders.find(f => f.id === selectedFolder.folderId) || null;
  };

  const addFolder = (workspaceId: string, folderName: string) => {
    setWorkspaces(prev =>
      prev.map(ws => {
        if (ws.id === workspaceId) {
          const newFolder: Folder = {
            id: `f-${Date.now()}`,
            name: folderName,
            meetings: [],
          };
          return { ...ws, folders: [...ws.folders, newFolder] };
        }
        return ws;
      })
    );
  };
  
  const startNewMeeting = (transcript: string) => {
      if (!selectedFolder) return;

      const newMeeting: Meeting = {
          id: `m-${Date.now()}`,
          title: `Meeting - ${new Date().toLocaleDateString()}`,
          date: new Date().toLocaleString(),
          transcript: transcript,
          summary: null,
      };

      setWorkspaces(prev => prev.map(ws => {
          if (ws.id === selectedFolder.workspaceId) {
              return {
                  ...ws,
                  folders: ws.folders.map(f => {
                      if (f.id === selectedFolder.folderId) {
                          return { ...f, meetings: [...f.meetings, newMeeting] };
                      }
                      return f;
                  })
              };
          }
          return ws;
      }));
      
      setSelectedMeeting(newMeeting);
      setView(AppView.SUMMARY);
  };
  
  useEffect(() => {
    const updateSummary = async (meetingToUpdate: Meeting) => {
        if (!selectedFolder || !meetingToUpdate || meetingToUpdate.summary) return;
        
        try {
            const summaryResult = await generateSummary(meetingToUpdate.transcript);
            
            setWorkspaces(prev => prev.map(ws => {
                if (ws.id === selectedFolder.workspaceId) {
                    return {
                        ...ws,
                        folders: ws.folders.map(f => {
                            if (f.id === selectedFolder.folderId) {
                                const updatedMeetings = f.meetings.map(m => {
                                    if (m.id === meetingToUpdate.id) {
                                        const updatedMeeting = { ...m, summary: summaryResult };
                                        setSelectedMeeting(updatedMeeting);
                                        return updatedMeeting;
                                    }
                                    return m;
                                });
                                return { ...f, meetings: updatedMeetings };
                            }
                            return f;
                        })
                    };
                }
                return ws;
            }));
        } catch (error) {
            console.error("Failed to update summary:", error);
            // Optionally, handle the error in the UI
        }
    };
    
    if (view === AppView.SUMMARY && selectedMeeting && !selectedMeeting.summary) {
        updateSummary(selectedMeeting);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, selectedMeeting]);


  const handleSetSelectedFolder = (folderIdentifier: { workspaceId: string; folderId: string } | null) => {
    setSelectedFolder(folderIdentifier);
    setSelectedMeeting(null);
    setView(AppView.FOLDER);
  };

  const activeFolder = getActiveFolder();

  const renderContent = () => {
    if (view === AppView.SETTINGS) {
        return <SettingsView />;
    }
      
    if (!activeFolder) {
      return <div className="p-8 text-slate-400">Select a folder to get started.</div>;
    }

    switch (view) {
      case AppView.FOLDER:
        return <FolderView folder={activeFolder} setView={setView} setSelectedMeeting={setSelectedMeeting} />;
      case AppView.MEETING:
        return <MeetingView folder={activeFolder} startNewMeeting={startNewMeeting} setView={setView} />;
      case AppView.SUMMARY:
        return selectedMeeting ? <SummaryView meeting={selectedMeeting} /> : <div className="p-8">No meeting selected.</div>;
      default:
        return <div className="p-8">Welcome to EchoNote</div>;
    }
  };

  return (
    <div className="flex h-screen font-sans bg-slate-900 text-white">
      <Sidebar
        workspaces={workspaces}
        setSelectedFolder={handleSetSelectedFolder}
        addFolder={addFolder}
        setView={setView}
      />
      <main className="flex-1 h-full overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
