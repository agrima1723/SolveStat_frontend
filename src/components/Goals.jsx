import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Target, ExternalLink, Plus, Trash2, CheckCircle2, Circle, Calendar, Zap, Trophy, RefreshCw, Lock } from 'lucide-react';

export default function GoalsPage({ handle, targetRank = "Specialist" }) {
  const [goals, setGoals] = useState([]);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [tier, setTier] = useState('Silver');
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchGoals = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/goals/${handle}`);
      setGoals(res.data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  }, [handle]);

  // AUTO-VERIFICATION LOGIC (Universal Matcher)
  const verifySubmissions = useCallback(async () => {
    if (!handle || goals.length === 0) return;
    
    const pendingGoals = goals.filter(g => g.link && !g.completed);
    if (pendingGoals.length === 0) return;

    setIsSyncing(true);
    try {
      // Fetching 100 to ensure we don't miss the 'OK' among 'WRONG ANSWER' attempts
      const cfRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100`);
      const submissions = cfRes.data.result;

      for (let goal of pendingGoals) {
        // Updated Regex: Handles /contest/, /problemset/problem/, and /gym/ links
        const match = goal.link.match(/(?:contest|problemset\/problem|gym)\/(\d+)\/(?:problem\/)?([A-Z][0-9]*)/i);
        
        if (match) {
          const [_, contestId, index] = match;
          
          const isSolved = submissions.find(s => {
            const sContestId = s.problem.contestId || s.contestId;
            const sIndex = s.problem.index.toUpperCase();
            return (
              sContestId === parseInt(contestId) && 
              sIndex === index.toUpperCase() && 
              s.verdict === "OK"
            );
          });

          if (isSolved) {
            // This triggers the backend update
            await axios.patch(`http://localhost:5000/api/goals/${goal._id}`);
          }
        }
      }
      fetchGoals();
    } catch (err) {
      console.error("Auto-verification failed:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [handle, goals, fetchGoals]);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  // Automatic Background Polling (Every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => verifySubmissions(), 10000);
    return () => clearInterval(interval);
  }, [verifySubmissions]);

  const groupedGoals = goals.reduce((groups, goal) => {
    const date = new Date(goal.createdAt).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(goal);
    return groups;
  }, {});

  const addGoal = async () => {
    if (!text || !link.includes('codeforces.com')) {
      alert("Mission Deployment Error: A valid Codeforces Problem URL is required.");
      return;
    }
    await axios.post('http://localhost:5000/api/goals', { handle, text, link, tier });
    setText(''); setLink(''); setTier('Silver');
    fetchGoals();
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/goals/${id}`);
      setGoals(goals.filter(g => g._id !== id));
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const todaysGoals = groupedGoals[todayStr] || [];
  const completedToday = todaysGoals.filter(g => g.completed).length;
  const progressPercent = todaysGoals.length > 0 ? Math.round((completedToday / todaysGoals.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Trophy size={120} /></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest mb-4">
                <Lock size={12} /> Strict Verification Mode
              </div> */}
              
              
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Mission Control</h2>
            <p className="text-slate-500 font-medium mt-2 italic">Solve on Codeforces to complete missions.</p>
          </div>

          {/* Fixed Positioning for the Sync Button */}
<button 
  onClick={verifySubmissions}
  disabled={isSyncing}
  className={`absolute top-24 right-10 z-20 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
    isSyncing 
      ? 'bg-slate-100 text-slate-400' 
      : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200 active:scale-95'
  }`}
>
  <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
  {isSyncing ? "Syncing..." : "Sync CF"}
</button>
        </div>
        
        <div className="w-full lg:w-80 bg-slate-900 p-8 rounded-[3rem] shadow-xl text-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Verified Progress</span>
            <Trophy size={20} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-4xl font-black mb-2 italic text-emerald-400">{progressPercent}%</div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MANDATORY URL INPUT AREA */}
      <div className="bg-white border-2 border-slate-900 p-3 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-2">
        <select 
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="bg-slate-50 text-slate-900 font-black text-xs uppercase px-6 py-4 rounded-[2rem] outline-none cursor-pointer"
        >
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
        </select>
        
        <input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="What are you solving?" 
          className="flex-1 px-6 py-4 bg-transparent text-slate-800 font-bold outline-none" 
        />
        
        <input 
          value={link} 
          onChange={e => setLink(e.target.value)} 
          placeholder="Paste CF Link (Required)" 
          className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl text-indigo-600 font-bold outline-none border border-transparent focus:border-indigo-300 placeholder:text-slate-300" 
        />

        <button 
          onClick={addGoal} 
          disabled={!link.includes('codeforces.com')}
          className={`w-full md:w-auto px-10 py-4 rounded-[2.5rem] font-black transition-all flex items-center justify-center gap-2 ${link.includes('codeforces.com') ? 'bg-slate-900 hover:bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
        >
          <Plus size={20} /> DEPLOY
        </button>
      </div>

      {/* MISSION LOG */}
      <div className="space-y-12">
        {Object.entries(groupedGoals).reverse().map(([date, missions]) => (
          <div key={date} className="space-y-6">
            <div className="flex items-center gap-4 ml-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">
                {date === todayStr ? "Current Objectives" : date}
              </h3>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {missions.map(goal => (
                <div 
                  key={goal._id} 
                  className={`group flex items-center justify-between p-7 bg-white border-2 transition-all duration-500 ${goal.completed ? 'border-emerald-500/20 bg-emerald-50/5' : 'border-slate-100' } rounded-[2.5rem]`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`${goal.completed ? 'text-emerald-500' : 'text-slate-100'}`}>
                      {goal.completed ? <CheckCircle2 size={40} /> : <Circle size={40} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${goal.tier === 'Gold' ? 'text-amber-500 bg-amber-50 border-amber-200' : 'text-slate-500 bg-slate-50 border-slate-100'}`}>
                          {goal.tier || 'Silver'} Tier
                        </span>
                        {!goal.completed && (
                          <span className="text-[8px] font-black text-rose-500 flex items-center gap-1">
                            <RefreshCw size={8} className="animate-spin" /> Awaiting CF Submission
                          </span>
                        )}
                        {goal.completed && (
                          <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            Verified 
                          </span>
                        )}
                      </div>
                      <p className={`text-xl font-black tracking-tight ${goal.completed ? 'text-slate-400' : 'text-slate-800'}`}>
                        {goal.text}
                      </p>
                      <a href={goal.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-500 mt-2 uppercase tracking-widest hover:underline">
                        <ExternalLink size={12} /> Open in Codeforces
                      </a>
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteGoal(goal._id)} 
                    className="p-4 text-slate-100 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}