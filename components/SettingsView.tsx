
import React from 'react';

const SettingsView: React.FC = () => {
  return (
    <div className="p-8 h-full">
      <h2 className="text-3xl font-bold text-white mb-8">Admin & Settings</h2>

      <div className="space-y-10">
        {/* User Management */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">User Management</h3>
          <p className="text-slate-400">Manage team members, roles, and permissions.</p>
          <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
            Invite Users
          </button>
        </div>

        {/* Billing */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Billing</h3>
          <p className="text-slate-400">Current Plan: <span className="text-green-400">Pro Tier</span></p>
          <p className="text-slate-400">View invoices and manage your subscription.</p>
          <button className="mt-4 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
            Manage Billing
          </button>
        </div>
        
        {/* Integrations */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Integrations</h3>
          <p className="text-slate-400">Connect EchoNote to your favorite tools.</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between bg-slate-700 p-3 rounded-md">
                <span className="font-medium">Slack</span>
                <button className="bg-green-500 text-white text-sm py-1 px-3 rounded-full">Connected</button>
            </div>
             <div className="flex items-center justify-between bg-slate-700 p-3 rounded-md">
                <span className="font-medium">Notion</span>
                 <button className="bg-slate-500 hover:bg-slate-400 text-white text-sm py-1 px-3 rounded-full">Connect</button>
            </div>
             <div className="flex items-center justify-between bg-slate-700 p-3 rounded-md">
                <span className="font-medium">Hubspot</span>
                <button className="bg-slate-500 hover:bg-slate-400 text-white text-sm py-1 px-3 rounded-full">Connect</button>
            </div>
          </div>
        </div>
        
        {/* Support */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Support</h3>
          <p className="text-slate-400">Need help? Visit our help center or contact support.</p>
          <button className="mt-4 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
