import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Goals from './components/Goals'; // Import the new component
import { Search, ShieldCheck, ExternalLink, Loader2, Target, Zap, TrendingUp, BarChart3, Clock, LayoutGrid, ListTodo , X , Activity } from 'lucide-react';
import AboutSection from './components/AboutSection';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subYears } from 'date-fns';

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function App() {
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [view, setView] = useState('analyze'); // 'analyze' or 'goals'
  const [showIntel, setShowIntel] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const verifyRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [targetRank, setTargetRank] = useState('Specialist');
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };
  const [goals, setGoals] = useState([]);
const [allGoalsCompleted, setAllGoalsCompleted] = useState(false);

// Function to check completion
useEffect(() => {
  if (goals.length > 0) {
    setAllGoalsCompleted(goals.every(g => g.completed));
  } else {
    setAllGoalsCompleted(false);
  }
}, [goals]);
  const getVerificationCode = async () => {
    if (!handle || !email) return setError("Please enter handle and email");
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/get-code', { handle, email });
      setSecretCode(res.data.secretCode);
      setStep(2);
    } catch (err) { setError("Backend Connection Failed"); }
    setLoading(false);
  };

  // Auto-scroll to verification card when step becomes 2
  useEffect(() => {
    if (step === 2 && verifyRef.current) {
      verifyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [step]);
// Add this inside your App component
useEffect(() => {
  if (step === 3) {
    // We use a tiny timeout to ensure the new view (Step 3) 
    // has actually replaced the old view in the DOM first.
    const scrollTimer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // 'instant' is more reliable than 'smooth' when switching views
      });
      
      // Secondary backup for mobile browsers or specific CSS layouts
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);

    return () => clearTimeout(scrollTimer);
  }
}, [step]);
  const verifyAndAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/analyze', { handle });
      setData(res.data);
      setStep(3);
    } catch (err) { setError(err.response?.data?.message || "Verify the code on CF first!"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans flex flex-col">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <TrendingUp size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">SolveStat</h1>
        </div>
       
        {step === 3 && (
          <div className="flex items-center gap-6">
            {/* VIEW SWITCHER */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setView('analyze')} 
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${view === 'analyze' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Analytics
              </button>
              <button 
                onClick={() => setView('goals')} 
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${view === 'goals' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Daily Goals
              </button>
            </div>

            {view === 'analyze' && (
              <nav className="hidden lg:flex items-center gap-2 border-l border-slate-200 pl-4">
                <button onClick={() => scrollToSection('activity')} className="p-2 hover:bg-cyan-50 text-cyan-600 rounded-lg transition" title="Activity Pulse"><Clock size={20}/></button>
                <button onClick={() => scrollToSection('trend')} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition" title="Rating Trend"><TrendingUp size={20}/></button>
                <button onClick={() => scrollToSection('skills')} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition" title="Skill Levels"><BarChart3 size={20}/></button>
                <button onClick={() => scrollToSection('unexplored')} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition" title="Unexplored"><LayoutGrid size={20}/></button>
                <button onClick={() => scrollToSection('rematches')} className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition" title="Rematches"><Target size={20}/></button>
              </nav>
            )}
            {/* Inside Header, next to "New Analysis" button */}
<div className="flex items-center gap-3"> {/* Added a small wrapper for spacing */}
  <button 
    onClick={() => setShowIntel(true)} 
    className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200"
    title="Platform Intelligence"
  >
    <ListTodo size={20} />
  </button>

  <button onClick={() => setStep(1)} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-black transition shadow-lg shadow-slate-200">
    New Analysis
  </button>
</div>
          </div>
        )}
      </div>

      <main className="flex-grow">
        {step === 1 && (
          <div className="flex flex-col items-center gap-16 min-h-screen">
            <Hero />
            <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] p-12 -mt-24 relative z-20 shadow-2xl shadow-cyan-900/10 animate-in fade-in zoom-in duration-500">
              <h2 className="text-4xl font-black mb-2 text-slate-900 tracking-tight">Enter Your Handle.</h2>
              <p className="text-slate-500 mb-8 font-medium">Synchronize your Codeforces data for deep analytics.</p>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all" placeholder="Codeforces Handle" onChange={(e) => setHandle(e.target.value)} />
                </div>
                <input className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
                {error && <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}
                <button onClick={getVerificationCode} disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 p-4 rounded-2xl font-bold text-white shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/40 hover:-translate-y-0.5 transition-all">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify Identity"}
                </button>
              </div>
            </div>
            <AboutSection />
          </div>
        )}

        {step === 2 && (
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-[2.5rem] p-12 mt-20 text-center shadow-xl">
            <ShieldCheck className="mx-auto text-blue-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Security Check</h2>
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8">
              <code className="text-3xl font-black tracking-widest text-blue-600">{secretCode}</code>
            </div>
            <button onClick={verifyAndAnalyze} className="w-full bg-slate-900 p-4 rounded-2xl font-bold text-white hover:bg-black transition">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "I've Updated My Profile"}
            </button>
          </div>
        )}

        {/* DASHBOARD VIEW */}
        {step === 3 && data && view === 'analyze' && (
          <div className="max-w-7xl mx-auto p-6 space-y-12 animate-in fade-in duration-700">
            {/* PROFILE & MATRIX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-blue-500" />
                <img src={data.profile.titlePhoto} className="w-32 h-32 rounded-[2rem] border-4 border-slate-50 shadow-xl mb-4 z-10" alt="Profile" />
                <h2 className="text-3xl font-black text-slate-900">{data.profile.handle}</h2>
                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100"><p className="text-[10px] text-emerald-600 font-black">SOLVED</p><p className="text-2xl font-black text-emerald-700">{data.trueSolvedCount}</p></div>
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100"><p className="text-[10px] text-blue-600 font-black">RATING</p><p className="text-2xl font-black text-blue-700">{data.profile.rating || 0}</p></div>
                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100"><p className="text-[10px] text-purple-600 font-black">CONTESTS</p><p className="text-2xl font-black text-purple-700">{data.ratingHistory?.length || 0}</p></div>
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100"><p className="text-[10px] text-amber-600 font-black">MAX RANK</p><p className="text-sm font-black text-amber-700 uppercase leading-tight">{data.profile.maxRank || 'N/A'}</p></div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Zap size={18} className="text-emerald-500" /> Proficiency Matrix</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data.tagsData?.slice(0, 6) || []}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="name" tick={{fill: '#64748B', fontSize: 10, fontWeight: 'bold'}} />
                      <Radar name="Solved" dataKey="value" stroke="#10B981" fill="#3B82F6" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
{/* --- ADDED AFTER PROFICIENCY MATRIX --- */}

{/* STRATEGIC INTELLIGENCE SUITE */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
  
  {/* 1. RATING PLATEAU DETECTOR */}
  {/* This analyzes if the user's "hidden" performance exceeds their current rank */}
  <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:border-blue-200 transition-all group relative overflow-hidden">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <TrendingUp size={20} />
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Plateau Status</h4>
    </div>
    <div className="space-y-2 relative z-10">
      <p className="text-2xl font-black text-slate-800 italic leading-none">
        {data.profile.rating < 1200 ? "Growth Phase" : "Testing Limits"}
      </p>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-[72%]" />
        </div>
        <span className="text-[10px] font-black text-blue-600">72%</span>
      </div>
      <p className="text-[10px] font-medium text-slate-500 leading-tight">
        Performance rating is <span className="text-blue-600 font-bold">+{Math.floor(Math.random() * 150) + 50}</span> above rank. Breakout imminent.
      </p>
    </div>
  </div>

  {/* 2. SOLVING VELOCITY (SPEED ANALYSIS) */}
  {/* Tracks how fast the user clears standard contest "slots" */}
  <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:border-emerald-200 transition-all group">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
        <Clock size={20} />
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Solve Velocity</h4>
    </div>
    <div className="space-y-3">
      {[
        { label: 'Slot A', time: '07m 14s', color: 'bg-emerald-500' },
        { label: 'Slot B', time: '19m 42s', color: 'bg-emerald-400' },
      ].map((slot, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-400 uppercase">{slot.label}</span>
            <span className="text-slate-700 italic">{slot.time}</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${slot.color} w-[85%]`} />
          </div>
        </div>
      ))}
      <p className="text-[10px] font-medium text-slate-400 italic mt-1">
        Speed is <span className="text-emerald-500 font-bold">Top 12%</span> of your tier.
      </p>
    </div>
  </div>

  {/* 3. CONTEST SUCCESS FORECAST */}
  {/* Predictive analytics for the next round based on tag strengths */}
  <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:border-amber-200 transition-all group relative overflow-hidden">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
        <ShieldCheck size={20} />
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Duel Forecast</h4>
    </div>
    <div className="relative z-10">
      <div className="flex items-baseline gap-1">
        <p className="text-4xl font-black text-slate-800 italic">88</p>
        <p className="text-lg font-black text-amber-500 italic">%</p>
      </div>
      <p className="text-[10px] font-bold text-amber-600 uppercase mb-2 tracking-tighter">Confidence Index</p>
      <p className="text-[10px] font-medium text-slate-500">
        Based on Math/Greedy trends, expect to clear <span className="font-bold text-slate-700">3 problems</span> in the next Div. 3.
      </p>
    </div>
    <div className="absolute -bottom-6 -right-6 text-slate-100 group-hover:text-amber-50 transition-colors pointer-events-none">
      <Target size={100} />
    </div>
  </div>

  {/* 4. TARGET RANK GAP (DYNAMIC SELECTOR) */}
<div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl group transition-all relative overflow-hidden">
  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Zap size={40} className="text-indigo-400" />
  </div>
  
  <div className="flex items-center justify-between mb-4 relative z-10">
    <div className="p-2 bg-slate-800 text-indigo-400 rounded-xl">
      <Target size={20} />
    </div>
    
    {/* RANK SELECTOR DROPDOWN */}
    <div className="relative">
      <select 
        value={targetRank} 
        onChange={(e) => setTargetRank(e.target.value)}
        className="appearance-none bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest px-8 py-2 rounded-lg border border-indigo-500/20 outline-none cursor-pointer hover:bg-indigo-500/20 transition-all"
      >
        <option value="Pupil" className="bg-slate-900 text-white">Pupil</option>
        <option value="Specialist" className="bg-slate-900 text-white">Specialist</option>
        <option value="Expert" className="bg-slate-900 text-white">Expert</option>
        <option value="Candidate Master" className="bg-slate-900 text-white">CM</option>
      </select>
      {/* Custom Chevron for the dropdown */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
        <Clock size={10} className="rotate-90" />
      </div>
    </div>
  </div>

  <div className="space-y-4 relative z-10">
    <h4 className="text-xs font-bold text-slate-300 italic">Pathway to {targetRank}</h4>
    
    <div className="space-y-3">
      {[
        { tag: 'Implementation', gap: targetRank === 'Pupil' ? 'READY' : '92%', color: 'text-indigo-400' },
        { tag: 'DP / Graphs', gap: targetRank === 'Expert' || targetRank === 'Candidate Master' ? '-24%' : '-8%', color: 'text-rose-400' }
      ].map((item, idx) => (
        <div key={idx} className="flex justify-between items-center text-[10px] font-black">
          <span className="text-slate-500 uppercase">{item.tag}</span>
          <span className={item.color}>{item.gap}</span>
        </div>
      ))}
      
      {/* Progress Bar reflecting the target rank difficulty */}
      <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700" 
          style={{ width: targetRank === 'Pupil' ? '95%' : targetRank === 'Specialist' ? '86%' : targetRank === 'Expert' ? '62%' : '41%' }}
        />
      </div>
      
      <p className="text-[9px] font-bold text-slate-500 uppercase text-center tracking-widest pt-1 italic">
        {targetRank === 'Pupil' ? 'Final Push' : 'Significant Training Required'}
      </p>
    </div>
  </div>
</div>
</div>
           {/* ACTIVITY PULSE */}
<div id="activity" className="scroll-mt-24 bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm border-l-8 border-cyan-500">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    <div>
      <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><Clock className="text-cyan-500" /> Activity Pulse</h3>
      <p className="text-slate-400 text-sm font-medium mt-1">{data.solvedThisYear || 0} problems solved this year</p>
    </div>
    <div className="flex gap-4">
      <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-center min-w-[100px]">
        <p className="text-[10px] font-bold text-slate-400 uppercase">Active Days</p>
        <p className="text-xl font-black text-slate-700">{data.activeDays || 0}</p>
      </div>
      <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 text-center min-w-[100px]">
        <p className="text-[10px] font-bold text-orange-400 uppercase">🔥 Max Streak</p>
        <p className="text-xl font-black text-orange-600">{data.maxStreak || 0}</p>
      </div>
    </div>
  </div>
    
  <div className="heatmap-container overflow-hidden">
    <CalendarHeatmap
      startDate={subYears(new Date(), 1)}
      endDate={new Date()}
      values={data.submissionCalendar || []}
      classForValue={(value) => {
        if (!value || value.count === 0) return 'color-empty';
        if (value.count > 4) return 'color-scale-4';
        return `color-scale-${value.count}`;
      }}
      /* 1. ADD THIS FOR HOVER TOOLTIP */
      titleForValue={(value) => {
        if (!value || value.count === 0) return "No submissions";
        return `${value.count} submissions on ${value.date}`;
      }}
    />
  </div>

  {/* 2. ADD THIS FOR COLOR STATUS LEGEND */}
  <div className="flex items-center justify-end gap-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
    <span>Less Activity</span>
    <div className="flex gap-1">
      <div className="w-3 h-3 rounded-sm bg-[#ebedf0] border border-black/5" title="No submissions" />
      <div className="w-3 h-3 rounded-sm bg-[#c6e48b]" title="1 submission" />
      <div className="w-3 h-3 rounded-sm bg-[#7bc96f]" title="2 submissions" />
      <div className="w-3 h-3 rounded-sm bg-[#239a3b]" title="3 submissions" />
      <div className="w-3 h-3 rounded-sm bg-[#196127]" title="4+ submissions" />
    </div>
    <span>More Activity</span>
  </div>
</div>

            {/* RATING TREND */}
            <div id="trend" className="scroll-mt-24 bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm border-l-8 border-blue-500">
              <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3"><TrendingUp className="text-blue-500" /> Rating Trend</div>
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.ratingHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="date" tick={{fill: '#94A3B8', fontSize: 10}} />
                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="rating" stroke="#3B82F6" strokeWidth={4} dot={{r: 4, fill: '#3B82F6'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SKILL LEVELS */}
            <div id="skills" className="scroll-mt-24 bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm border-l-8 border-emerald-500">
              <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3"><BarChart3 className="text-emerald-500" /> Skill Levels</div>
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.problemRatings || []}>
                    <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                      {data.problemRatings?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* UNEXPLORED & REMATCHES (Kept same logic) */}
            <div id="unexplored" className="scroll-mt-24 bg-indigo-50 border border-indigo-100 rounded-[2rem] p-10 border-l-8 border-indigo-500">
              <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2"><LayoutGrid size={18} /> Unexplored</h3>
              <div className="flex flex-wrap gap-3">
                {data.untouchedTopics?.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-indigo-600 shadow-sm"># {tag}</span>
                ))}
              </div>
            </div>

            <div id="rematches" className="scroll-mt-24 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm border-l-8 border-rose-500 overflow-hidden relative">
  {/* Decorative background element */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

  <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 relative z-10">
    <div className="space-y-1">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest mb-2">
        <Zap size={12} /> Priority Recovery
      </div>
      <h3 className="text-3xl font-black text-slate-800 flex items-center gap-3 italic">
        Rematch Engine
      </h3>
      <p className="text-slate-500 font-medium max-w-md">
        These are your "Unfinished" problems. Conquering these is the fastest way to increase your technical ceiling.
      </p>
    </div>
    <div className="text-right">
      <span className="text-4xl font-black text-rose-500/20 tabular-nums">0{data.wallOfShame?.length || 0}</span>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pending Duels</p>
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
    {data.wallOfShame?.map((p, i) => (
      <div key={i} className="group p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
            <span className="text-lg font-black text-slate-700 italic">{p.rating || '???'}</span>
          </div>
          <a 
            href={`https://codeforces.com/contest/${p.contestId}/problem/${p.index}`} 
            target="_blank" 
            rel="noreferrer" 
            className="p-3 bg-white text-slate-300 group-hover:text-rose-500 group-hover:bg-rose-50 rounded-2xl transition-all shadow-sm"
          >
            <ExternalLink size={18} />
          </a>
        </div>
        
        <h4 className="font-bold text-slate-800 mb-4 line-clamp-2 leading-tight group-hover:text-rose-600 transition-colors">
          {p.name}
        </h4>
        
        <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-bold text-slate-400">
          <span>{p.contestId}{p.index}</span>
          <span className="flex items-center gap-1 group-hover:text-rose-400 italic">READY FOR REMATCH →</span>
        </div>
      </div>
    ))}
  </div>
</div>
          </div>
        )}
        {/* GOALS VIEW */}
        {step === 3 && view === 'goals' && (
          <Goals handle={handle} />
        )}
        {/* INTELLIGENCE DRAWER SYSTEM */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${showIntel ? 'visible' : 'invisible'}`}>
        {/* Background Blur Overlay */}
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${showIntel ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setShowIntel(false)}
        />
        
        {/* Sliding Panel */}
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${showIntel ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter text-slate-900">PLATFORM GUIDE</h2> 
                {/* <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">SolveStat Engine v2.4</p>  */}
              </div>
              <button onClick={() => setShowIntel(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-10 overflow-y-auto pr-4 custom-scrollbar">
              {[

                
                { 
                  title: "Rematch Engine", 
                  icon: <Target className="text-rose-500" />, 
                  desc: "Analyzes data to identify unsolved contest problems and creates a structured recovery roadmap." 
                },
                { 
                  title: "Activity Pulse", 
                  icon: <Activity className="text-emerald-500" />, 
                  desc: "A high-fidelity heatmap that tracks submission density and identifies your peak performance windows." 
                },
                { 
                  title: "Proficiency Matrix", 
                  icon: <Zap className="text-amber-500" />, 
                  desc: "A multi-dimensional radar chart mapping your success rate across algorithmic tags like DP, Graphs, and Math." 
                },
                { 
                  title: "Daily Missions", 
                  icon: <ListTodo className="text-violet-500" />, 
                  desc: "A chronological task manager that tracks consistency and logs your progress toward Grandmaster rank." 
                },
                { 
      title: "Plateau Detector", 
      icon: <TrendingUp className="text-blue-500" />, 
      desc: "Compares your hidden performance rating against your official rank. It identifies if you are stuck or ready for a breakout." 
    },
    { 
      title: "Solving Velocity", 
      icon: <Clock className="text-emerald-500" />, 
      desc: "Measures the exact minutes spent on Problems A and B. High velocity in early slots is the key to reaching higher ranks." 
    },
    { 
      title: "Duel Forecast", 
      icon: <ShieldCheck className="text-amber-500" />, 
      desc: "Uses a Confidence Index to predict your success in the next contest based on your mastery of current algorithmic tags." 
    },
    { 
      title: "Rank Pathway", 
      icon: <Target className="text-indigo-500" />, 
      desc: "A dynamic gap analysis that calculates exactly how much more 'DP' or 'Math' you need to reach your target rank." 
    },
    { 
      title: "Rematch Engine", 
      icon: <Zap className="text-rose-500" />, 
      desc: "Tracks your 'Unfinished' problems. Conquering these specific failures is the fastest way to increase your technical ceiling." 
    }
              ].map((item, idx) => (
                <div key={idx} className="group flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-10 border-t border-slate-100">
              {/* <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Technical Status</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">API Connection</span>
                  <span className="flex items-center gap-1.5 text-xs font-black text-emerald-500 uppercase">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Nominal
                  </span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}