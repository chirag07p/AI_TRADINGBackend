import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { SmartAlertBar } from '../../components/admin/SmartAlertBar';
import { PredictiveCard } from '../../components/admin/PredictiveCard';
import { getDashboardSummary, getAIAdvice, sendMessage as sendMessageAPI, allocateCustomer, finalizeAllocationProposal, rejectAllocationProposal, unassignCustomerTrader, updateUserProfile } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Zap, Cpu, Database, Activity, RefreshCw,
  ArrowRight, CheckCircle, AlertTriangle, Shield, Star, Users, X
} from 'lucide-react';

const RISK_LOGIC = {
  High: { trader: 'Expert', reason: 'High-risk clients need experienced traders with proven success rates above 85%.' },
  Medium: { trader: 'Senior', reason: 'Medium-risk clients benefit from senior traders with balanced portfolios.' },
  Low: { trader: 'Standard', reason: 'Low-risk clients are paired with reliable standard traders for steady returns.' },
};

export const AIAssignmentDashboard = () => {
  const { user } = useAuth();
  const { customers, employees, simulateAIAssignment } = useAppData();
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [processStage, setProcessStage] = useState('');

  const handleRerun = async () => {
    setRunning(true);
    setProcessStage('Analyzing trader performance & capacity...');
    await new Promise(resolve => setTimeout(resolve, 800));

    setProcessStage('Matching client risk profiles with specialist nodes...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProcessStage('Generating system reasoning...');
    await simulateAIAssignment();

    setProcessStage('Finalizing optimal pairings...');
    await new Promise(resolve => setTimeout(resolve, 600));

    setRunning(false);
    setProcessStage('');
    setLastRun(new Date().toLocaleTimeString());
  };

  const totalMatches = customers.filter(c => c.assignedTraderId).length;
  const unmatched = customers.length - totalMatches;

  const riskBreakdown = ['High', 'Medium', 'Low'].map(risk => ({
    risk,
    count: customers.filter(c => c.risk === risk).length,
    matched: customers.filter(c => c.risk === risk && c.assignedTraderId).length,
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Processing Overlay */}
      {running && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/20 backdrop-blur-md transition-all duration-500">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl border border-indigo-100 dark:border-indigo-800 flex flex-col items-center max-w-sm text-center animate-in zoom-in-95 duration-300">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-indigo-100 dark:border-indigo-900 rounded-full" />
              <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
              <Zap className="w-8 h-8 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">System Link Active</h3>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm h-10 flex items-center justify-center">
              {processStage}
            </p>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-indigo-500 animate-[progress_3s_ease-in-out_infinite]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Smart Analysis Layer (Feature 3 & 6) */}
      <PredictiveCard token={user?.token} />
      <SmartAlertBar token={user?.token} />

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-violet-900 to-purple-900 rounded-2xl p-8 text-white shadow-2xl shadow-indigo-900/40">
        <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none">
          <Zap className="w-96 h-96" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">System Engine Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">System Assignment Engine</h1>
            <p className="text-indigo-200 text-sm max-w-lg leading-relaxed">
              Our proprietary matching algorithm analyzes client risk profiles, historical feedback, and trader success rates to create optimal pairings.
            </p>
            {lastRun && (
              <p className="text-xs text-indigo-300 mt-2">Last run: {lastRun}</p>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 text-center min-w-[110px]">
                <Cpu className="w-5 h-5 text-indigo-300 mx-auto mb-1" />
                <p className="text-2xl font-black">{totalMatches}</p>
                <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Matched</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 text-center min-w-[110px]">
                <Database className="w-5 h-5 text-purple-300 mx-auto mb-1" />
                <p className="text-2xl font-black">{employees.length}</p>
                <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Traders</p>
              </div>
            </div>
            <Button
              onClick={handleRerun}
              disabled={running}
              className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-6"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${running ? 'animate-spin' : ''}`} />
              {running ? 'Processing...' : 'Rerun System Match'}
            </Button>
          </div>
        </div>

        {/* Progress Visual */}
        {running && (
          <div className="relative z-10 mt-6">
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full animate-pulse" style={{ width: '75%' }} />
            </div>
            <p className="text-xs text-indigo-200 mt-1">Matching in progress...</p>
          </div>
        )}
      </div>

      {/* Logic explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {riskBreakdown.map(({ risk, count, matched }) => {
          const logic = RISK_LOGIC[risk];
          const color = risk === 'High' ? 'red' : risk === 'Medium' ? 'yellow' : 'green';
          return (
            <Card key={risk} className={`border-${color}-100 dark:border-${color}-900/30 bg-${color}-50/30 dark:bg-${color}-500/5`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={risk === 'High' ? 'danger' : risk === 'Medium' ? 'warning' : 'success'}>
                    {risk} Risk
                  </Badge>
                  <span className="text-xs text-gray-500">{matched}/{count} matched</span>
                </div>
                <div className={`text-3xl font-black text-${color}-700 dark:text-${color}-400 mb-1`}>{count}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{logic.reason}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <ArrowRight className="w-3 h-3" />
                  Assigned to: <span className="capitalize text-gray-700 dark:text-gray-300">{logic.trader} traders</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Live Assignments */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Node Assignments</h2>
          <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ml-auto">
            {totalMatches} active · {unmatched} pending
          </Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {customers.map((customer, idx) => {
            const trader = employees.find(e => e.id === customer.assignedTraderId);
            const isExpanded = expandedId === customer.id;
            const color = customer.risk === 'High' ? 'red' : customer.risk === 'Medium' ? 'yellow' : 'green';

            return (
              <div
                key={customer.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-800 transition-all animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className="p-5 cursor-pointer flex items-center gap-4"
                  onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                >
                  {/* Client */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl bg-${color}-100 dark:bg-${color}-500/20 flex items-center justify-center text-${color}-700 dark:text-${color}-400 font-black text-lg flex-shrink-0`}>
                      {customer.name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{customer.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={customer.risk === 'High' ? 'danger' : customer.risk === 'Low' ? 'success' : 'warning'} className="text-[10px]">
                          {customer.risk}
                        </Badge>
                        {customer.matchScore && (
                          <Badge variant="outline" className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-indigo-200">
                            {customer.matchScore}% Match
                          </Badge>
                        )}
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map(i => <Star key={i} className={`w-2.5 h-2.5 ${i <= (customer.feedback || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center px-2">
                    <Zap className="w-4 h-4 text-indigo-500 mb-1" />
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>

                  {/* Trader */}
                    <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                      {trader ? (
                        <div className="flex items-center gap-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[10px] h-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Unassign ${trader.name} from ${customer.name}?`)) {
                                unassignCustomerTrader(user.token, customer.id).then(() => window.location.reload());
                              }
                            }}
                          >
                            <X className="w-3 h-3 mr-1" /> DISMISS
                          </Button>
                          <div className="text-right min-w-0">
                            <p className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{trader.name}</p>
                            <p className="text-xs text-indigo-500 capitalize">{trader.experience}</p>
                          </div>
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                            {trader.name?.charAt(0) || '?'}
                          </div>
                        </div>
                      ) : (
                      <div className="flex items-center gap-2 text-amber-500">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Unmatched</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 bg-gray-50 dark:bg-gray-800/30">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Client Profile</p>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Risk</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{customer.risk}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Feedback</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{customer.feedback || 0}/5 ★</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Coins</span>
                            <span className="font-semibold font-mono text-gray-800 dark:text-gray-200">{customer.coins || 0}</span>
                          </div>
                        </div>
                      </div>
                      {trader && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Trader Stats</p>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Success</span>
                              <span className="font-semibold text-green-600 dark:text-green-400">{trader.successRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Specialization</span>
                              <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{trader.specialization}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Match Reason</span>
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400 capitalize">{RISK_LOGIC[customer.risk]?.trader}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                      <div className="text-xs text-indigo-700 dark:text-indigo-300 flex items-start gap-1.5 prose prose-sm dark:prose-invert max-w-none">
                        <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-indigo-500" />
                        <div className="flex-1">
                          <span className="font-semibold">Match Reasoning:</span> 
                          <ReactMarkdown className="inline-block ml-1">{customer.aiExplanation || RISK_LOGIC[customer.risk]?.reason}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
