import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Settings, Globe, Bell, Lock, Database, RefreshCw, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const PlatformSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Global Platform Settings</h1>
          <p className="text-sm text-gray-500 font-medium">Control tower for AI weights, matching logic, and system configurations</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-black text-xs uppercase tracking-widest">
          <Save className="w-4 h-4 mr-2" /> Commit Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center gap-2 mb-6">
            <RefreshCw className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">AI Allocation Logic</h3>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Auto-Allocation Interval', value: '15 mins', desc: 'How often the AI re-checks trader loads' },
              { label: 'Minimum Match Score', value: '70%', desc: 'Clients below this score are flagged for review' },
              { label: 'Max Clients per Trader', value: '25', desc: 'Hard limit for trader capacity' },
            ].map((s) => (
              <div key={s.label} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="max-w-[70%]">
                  <p className="text-sm font-black text-gray-900 dark:text-white">{s.label}</p>
                  <p className="text-[10px] text-gray-500 font-medium leading-tight mt-1">{s.desc}</p>
                </div>
                <Badge className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 border-none font-black">{s.value}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Security & Compliance</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">Audit Logging</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Immutable Storage</p>
                </div>
              </div>
              <Badge className="bg-green-500 text-white border-none font-bold">ENABLED</Badge>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between opacity-50 grayscale">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">Geo-Fencing</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Multi-region access</p>
                </div>
              </div>
              <Badge className="bg-gray-300 text-gray-600 border-none font-bold">DISABLED</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Helper for consistency
const ShieldCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);
