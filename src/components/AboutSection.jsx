import React from 'react';
import { 
  BarChart3, 
  Target, 
  Trophy, 
  Activity, 
  CheckSquare, 
  ShieldCheck, 
  Zap,
  TrendingUp 
} from 'lucide-react';

export default function AboutSection() {
  const features = [
    {
      title: "Activity Pulse",
      desc: "A high-fidelity heatmap tracking your daily submission density. Colors shift from emerald to deep forest green based on your output, with orange highlighting peak performance days.",
      icon: <Activity className="text-emerald-500" size={24} />,
      gradient: "from-emerald-500/10 to-teal-500/10"
    },
    {
      title: "Daily Missions",
      desc: "A chronological task manager designed for consistency. Deploy goals, track real-time completion percentages, and build a historical log of your journey to Grandmaster.",
      icon: <Target className="text-violet-500" size={24} />,
      gradient: "from-violet-500/10 to-fuchsia-500/10"
    },
    {
      title: "Comeback Trails",
      desc: "Advanced logic that identifies 'Wall of Shame' problems—tasks you attempted but haven't conquered yet—turning failures into a structured recovery roadmap.",
      icon: <TrendingUp className="text-blue-500" size={24} />,
      gradient: "from-blue-500/10 to-indigo-500/10"
    },
    {
      title: "Problem Checklist",
      desc: "A curated list of high-priority problems tailored to your current rating. Features one-click access to the Codeforces problem set for immediate action.",
      icon: <CheckSquare className="text-amber-500" size={24} />,
      gradient: "from-amber-500/10 to-orange-500/10"
    }
  ];

  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-10 border-t border-slate-100">
      <div className="flex flex-col items-center text-center mb-1 space-y-4">
        {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <ShieldCheck size={14} /> Intelligence Briefing
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
          Every Tool You Need to <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Outpace the Curve.</span>
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
          SolveStat isn't just a tracker; it's a proprietary engine designed to eliminate guesswork in competitive programming.
        </p> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((f, i) => (
          <div key={i} className={`p-6 rounded-[3rem] bg-gradient-to-br ${f.gradient} border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
            <div className="flex items-start gap-6">
              <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-sm">
                  {f.desc}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Full-width "Engine" feature */}
        {/* <div className="md:col-span-2 bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase tracking-widest">
                <Zap size={16} /> Real-Time Engine
              </div>
              <h3 className="text-3xl font-black italic tracking-tighter uppercase">Solvestat Core v2.4</h3>
              <p className="text-slate-400 font-medium">
                Our backend directly interfaces with the Codeforces API, processing thousands of submission data points in milliseconds to provide you with the most accurate technical evolution roadmap possible.
              </p>
            </div>
            <div className="flex gap-4">
               <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 text-center">
                  <p className="text-3xl font-black text-white italic">0.2s</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Latency</p>
               </div>
               <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 text-center">
                  <p className="text-3xl font-black text-white italic">100%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Accuracy</p>
               </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}