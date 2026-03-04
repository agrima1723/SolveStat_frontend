import React from 'react';
import { ShieldCheck, Mail, Globe, Code2, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-400 py-16 px-8 border-t border-white/5 mt-20 relative overflow-hidden">
      {/* Decorative background glow for that "Advanced Analytics" feel */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 blur-[120px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section - Matching Header Icons */}
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              {/* This matches the specific ShieldCheck icon box from your header */}
              {/* <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
                <ShieldCheck className="text-white" size={28} />
              </div> */}
              {/* <div>
                <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase">SOLVESTAT</h3>
                <p className="text-indigo-400 text-xs font-bold tracking-[0.3em] uppercase ml-1">Advanced Analytics</p>
              </div> */}
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Transforming your competitive history into a strategic roadmap for success. 
              The ultimate analyst for the modern Codeforces contender.
            </p>
          </div>

          {/* Resources Column */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em] opacity-50">Resources</h4>
            <ul className="space-y-4 font-medium text-sm">
              <li>
                <a href="https://codeforces.com/apiHelp" target="_blank" rel="noreferrer" className="hover:text-indigo-400 flex items-center gap-3 transition-all group">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-indigo-500/10"><Code2 size={16}/></div> 
                  Codeforces API
                </a>
              </li>
              <li>
                <a href="https://codeforces.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 flex items-center gap-3 transition-all group">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-indigo-500/10"><Globe size={16}/></div> 
                  Codeforces Official
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em] opacity-50">Support</h4>
            <ul className="space-y-4 font-medium text-sm">
              <li>
                <a href="mailto:agrimasoni.as2005@gmail.com" className="hover:text-indigo-400 flex items-center gap-3 transition-all group">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-indigo-500/10"><Mail size={16}/></div> 
                  Email Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 flex items-center gap-3 transition-all group">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-indigo-500/10"><Github size={16}/></div> 
                  GitHub Source
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-500 italic">© 2026 SolveStat Analytics Platform</p>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <p className="text-sm text-slate-400">
              Developed by <span className="text-white font-bold hover:text-indigo-400 transition-colors cursor-default">Agrima Soni</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3 px-5 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10 text-[10px] text-emerald-500 font-black tracking-[0.2em] uppercase">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            API Connection: Stable
          </div>
        </div>
      </div>
    </footer>
  );
}