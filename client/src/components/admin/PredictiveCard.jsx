import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export const PredictiveCard = ({ token }) => {
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboard/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setPrediction(data.prediction);
      } catch (err) {
        console.error('Prediction fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPrediction();
    else setLoading(false);
  }, [token]);

  if (loading || !prediction) return null;

  return (
    <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 border-none overflow-hidden relative mb-8">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <TrendingUp className="w-24 h-24 text-white" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-white font-black uppercase tracking-widest text-xs">✦ AI Predictive Warning</h3>
        </div>
        <p className="text-indigo-50 text-sm font-medium leading-relaxed italic">
          "{prediction}"
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse" />
          <span className="text-[10px] text-indigo-200 uppercase font-bold tracking-tighter">Forecast Confidence: High</span>
        </div>
      </CardContent>
    </Card>
  );
};
