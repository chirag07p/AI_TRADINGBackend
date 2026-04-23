import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Terminal, Cpu, Database, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export const SystemLogs = () => {
  const logs = [
    { id: 1, type: 'INFO', module: 'Auth', message: 'User login detected from 192.168.1.1', time: '2 mins ago' },
    { id: 2, type: 'WARN', module: 'API', message: 'OpenRouter API latency above threshold (400ms)', time: '5 mins ago' },
    { id: 3, type: 'ERROR', module: 'DB', message: 'Connection timeout on cluster-0-shard-1', time: '12 mins ago' },
    { id: 4, type: 'INFO', module: 'AI', message: 'Re-allocation engine triggered for high-risk clients', time: '18 mins ago' },
    { id: 5, type: 'SUCCESS', module: 'Sys', message: 'Automatic backup completed successfully', time: '1 hour ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">System Health & Logs</h1>
          <p className="text-sm text-gray-500 font-medium">Real-time infrastructure monitoring and event logging</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-500/10 text-green-500 border-none font-black flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> ALL SYSTEMS GO
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'CPU Usage', value: '42%', icon: Cpu, color: 'text-indigo-500' },
          { label: 'DB Latency', value: '24ms', icon: Database, color: 'text-green-500' },
          { label: 'Active Tasks', value: '1,204', icon: Activity, color: 'text-purple-500' },
        ].map((s) => (
          <Card key={s.label} className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
            </div>
            <s.icon className={`w-8 h-8 ${s.color} opacity-20`} />
          </Card>
        ))}
      </div>

      <Card className="bg-gray-900 border-none overflow-hidden shadow-2xl">
        <div className="p-4 bg-gray-800/50 border-b border-gray-800 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Console Output</span>
        </div>
        <div className="p-6 font-mono text-sm space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 border-l-2 border-gray-800 pl-4 py-1 hover:bg-gray-800/30 transition-colors">
              <span className="text-gray-500 min-w-[80px] text-[10px]">{log.time}</span>
              <span className={`font-bold text-[10px] min-w-[60px] ${
                log.type === 'ERROR' ? 'text-red-500' : 
                log.type === 'WARN' ? 'text-yellow-500' : 
                log.type === 'SUCCESS' ? 'text-green-500' : 'text-blue-400'
              }`}>[{log.type}]</span>
              <span className="text-gray-400 font-bold">[{log.module}]</span>
              <span className="text-gray-300">{log.message}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
