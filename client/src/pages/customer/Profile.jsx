import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StarRating } from '../../components/ui/StarRating';
import { Badge } from '../../components/ui/Badge';
import { User, ShieldCheck, Mail, Briefcase, TrendingUp, Heart } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const { customers, employees, updateFeedback } = useAppData();
  const [submitted, setSubmitted] = useState(false);

  const customerData = customers.find(c => c.id === user.id) || user;
  // Local state for instant UI feedback
  const [localFeedback, setLocalFeedback] = useState(customerData.feedback || 0);
  const assignedTrader = employees.find(e => e.id === customerData.assignedTraderId);

  const handleRating = (star) => {
    setLocalFeedback(star); // Immediate UI update
    updateFeedback(customerData.id, star);
    setSubmitted(true);
    
    // Feature: Reset to 0/5 after 4 seconds
    setTimeout(() => {
      setLocalFeedback(0);
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Identity Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="h-24 w-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl font-black shadow-inner">
            {customerData.name?.charAt(0) || '?'}
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">{customerData.name}</h1>
              <Badge className="bg-green-400/20 text-green-300 border-none flex items-center gap-1.5 py-1 px-3">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED ACCOUNT
              </Badge>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-indigo-100 text-sm font-medium">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 opacity-70" /> {customerData.email}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 opacity-70" /> Client ID: {customerData.id?.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Investment DNA Card */}
        <Card className="border-indigo-100 dark:border-indigo-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-gray-500">
              <TrendingUp className="w-4 h-4" /> Investment DNA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Risk Appetite</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{customerData.risk || 'Medium'}</p>
              </div>
              <Badge variant={customerData.risk === 'High' ? 'danger' : customerData.risk === 'Low' ? 'success' : 'warning'} className="h-6">
                {customerData.risk}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Preferred Market</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{customerData.preferredSpecialization || 'Global Equities'}</p>
              </div>
              <Briefcase className="w-5 h-5 text-indigo-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        {/* 3. Service Feedback Card (The "Rating" Fix) */}
        <Card className="border-indigo-100 dark:border-indigo-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-gray-500">
              <Heart className="w-4 h-4" /> Service Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-center">
            <p className="text-xs text-gray-500 px-4">How would you rate your overall experience with our platform and assigned trader?</p>
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              <StarRating
                rating={localFeedback}
                onChange={handleRating}
                interactive={true}
                className="scale-125"
              />
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                {localFeedback} / 5
              </span>
              {submitted ? (
                <p className="text-[10px] font-black text-green-500 uppercase animate-bounce tracking-widest">✓ Appreciation Received</p>
              ) : (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Click a star to record your satisfaction</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
