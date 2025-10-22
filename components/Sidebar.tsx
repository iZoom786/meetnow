
import React, { useState } from 'react';
import type { Workspace, Folder } from '../types';
import { AppView } from '../types';
import FolderIcon from './icons/FolderIcon';
import PlusIcon from './icons/PlusIcon';
import SettingsIcon from './icons/SettingsIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface SidebarProps {
  workspaces: Workspace[];
  setSelectedFolder: (folder: { workspaceId: string; folderId: string } | null) => void;
  addFolder: (workspaceId: string, folderName: string) => void;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ workspaces, setSelectedFolder, addFolder, setView }) => {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(workspaces.length > 0 ? workspaces[0].id : null);
  const [newFolderName, setNewFolderName] = useState('');
  const [addingFolderWorkspaceId, setAddingFolderWorkspaceId] = useState<string | null>(null);

  const handleAddFolder = (workspaceId: string) => {
    if (newFolderName.trim()) {
      addFolder(workspaceId, newFolderName.trim());
      setNewFolderName('');
      setAddingFolderWorkspaceId(null);
    }
  };

  return (
    <div className="w-72 bg-slate-800 h-screen flex flex-col p-4 border-r border-slate-700">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg mr-3"></div>
        <h1 className="text-xl font-bold text-white">EchoNote</h1>
      </div>
      <div className="flex-grow overflow-y-auto">
        {workspaces.map((workspace) => (
          <div key={workspace.id} className="mb-4">
            <button
              className="w-full flex justify-between items-center text-left text-slate-400 hover:text-white transition-colors duration-200"
              onClick={() => setActiveWorkspaceId(activeWorkspaceId === workspace.id ? null : workspace.id)}
            >
              <span className="font-semibold">{workspace.name}</span>
              <ChevronDownIcon className={`w-5 h-5 transition-transform ${activeWorkspaceId === workspace.id ? 'rotate-180' : ''}`} />
            </button>
            {activeWorkspaceId === workspace.id && (
              <ul className="mt-2 space-y-1 pl-2 border-l border-slate-700">
                {workspace.folders.map((folder) => (
                  <li key={folder.id}>
                    <button 
                      onClick={() => setSelectedFolder({ workspaceId: workspace.id, folderId: folder.id })}
                      className="w-full flex items-center p-2 rounded-md text-slate-300 hover:bg-slate-700 transition-colors duration-200 text-left"
                    >
                      <FolderIcon className="mr-3 flex-shrink-0" />
                      <span className="truncate">{folder.name}</span>
                    </button>
                  </li>
                ))}
                {addingFolderWorkspaceId === workspace.id ? (
                    <li className="p-2">
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddFolder(workspace.id)}
                            onBlur={() => setAddingFolderWorkspaceId(null)}
                            placeholder="New folder name..."
                            className="w-full bg-slate-700 text-white p-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />
                    </li>
                ) : (
                    <li>
                      <button 
                        onClick={() => setAddingFolderWorkspaceId(workspace.id)}
                        className="w-full flex items-center p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors duration-200"
                      >
                        <PlusIcon className="mr-3" />
                        <span>Add Folder</span>
                      </button>
                    </li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <button 
            onClick={() => {
                setView(AppView.SETTINGS);
                setSelectedFolder(null);
            }}
            className="w-full flex items-center p-2 rounded-md text-slate-300 hover:bg-slate-700 transition-colors duration-200"
        >
          <SettingsIcon className="mr-3" />
          <span>Admin & Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
