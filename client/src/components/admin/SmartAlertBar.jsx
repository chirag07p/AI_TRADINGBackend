import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '../ui/Card';
import { AlertTriangle, ChevronRight, UserMinus } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

import { API_URL } from '../../services/api';

export const SmartAlertBar = ({ token }) => {
  const [triggers, setTriggers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTriggers = async () => {
    try {
      const res = await fetch(`${API_URL}/allocate/triggers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTriggers(data || []);
    } catch (err) {
      console.error('Trigger fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTriggers();
    else setLoading(false);
  }, [token]);

  if (loading || triggers.length === 0) return null;

  return (
    <div className="space-y-3 mb-8">
      <div className="flex items-center gap-2 px-1">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Efficiency Flags ({triggers.length})</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {triggers.map((alert, i) => (
          <Card key={i} className="border-amber-100 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-900/10">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{alert.clientName}</p>
                    <Badge variant="warning" className="text-[10px]">{alert.type}</Badge>
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-400 font-medium prose prose-sm max-w-none">
                    <span className="font-bold">Under {alert.currentTrader}: </span>
                    <ReactMarkdown className="inline">{alert.reason}</ReactMarkdown>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs border-amber-200 hover:bg-amber-100 dark:border-amber-800">
                <UserMinus className="w-3 h-3 mr-1" /> Reassign
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
