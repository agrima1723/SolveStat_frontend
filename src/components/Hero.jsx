import React from 'react';
import { BarChart3, Users, Trophy, CheckSquare } from 'lucide-react';

export default function Hero() {
  return (
    /* Changed gradient to Green/Emerald */
    <div className="relative w-full py-20 px-6 overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-md">
          Advanced Codeforces <br /> Analytics Platform
        </h1>
        <p className="text-lg md:text-xl text-green-50 font-medium mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
          Transform your competitive history into a strategic roadmap for success. Identify performance gaps, track your technical evolution, and outpace the rating curve.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold text-sm">
            <BarChart3 size={18} /> Real-time Analytics
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold text-sm">
            <Users size={18} /> comeback Trails
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold text-sm">
            <Trophy size={18} /> Contest Tracking
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold text-sm">
            <CheckSquare size={18} /> Problem Checklist
          </div>
        </div>
      </div>
    </div>
  );
}