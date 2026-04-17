import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';

const Affiliate = () => {
  const { currentClientExtended } = useTrading();
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [referrals, setReferrals] = useState([]);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentClientExtended?.id) return;
      try {
        const [refRes, confRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/clients/${currentClientExtended.id}/referrals`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/config`)
        ]);
        setReferrals(refRes.data);
        setBonusAmount(confRes.data.referral_bonus || 0);
      } catch (err) {
        console.error('Failed to fetch affiliate data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentClientExtended?.id]);

  const referralLink = `${window.location.origin}/register?ref=${currentClientExtended?.refCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
     return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}><i className="fa-solid fa-spinner fa-spin" /> Syncing Affiliate Network...</div>;
  }

  const stats = currentClientExtended?.affiliateStats || { totalInvites: 0, totalEarnings: 0 };

  if (isMobile) {
    return (
      <div className="mobile-affiliate no-scrollbar pb-10">
        <header className="px-2 pt-6 pb-4">
            <h1 className="text-2xl font-black text-white">Affiliate</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Level: Silver Agent</p>
        </header>

        {/* Affiliate Link Card */}
        <section className="py-4">
            <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-transparent">
                <h3 className="text-lg font-black text-white mb-2">Invite Friends</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-6 font-bold uppercase tracking-tight">Earn <span className="text-emerald-400">${bonusAmount}</span> for every successful signup through your network.</p>
                
                <div className="space-y-3">
                   <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 overflow-hidden">
                      <code className="text-[10px] text-indigo-300 font-mono break-all">{referralLink}</code>
                   </div>
                   <button 
                     onClick={handleCopy}
                     className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'}`}
                   >
                       {copied ? 'Copied to Clipboard' : 'Copy referral link'}
                   </button>
                </div>
            </div>
        </section>

        {/* Stats Grid */}
        <section className="py-4 grid grid-cols-2 gap-4">
            <div className="glass-card p-5">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Invites</p>
                <h4 className="text-2xl font-black text-white">{stats.totalInvites}</h4>
            </div>
            <div className="glass-card p-5">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Earned</p>
                <h4 className="text-2xl font-black text-emerald-400">${stats.totalEarnings.toLocaleString()}</h4>
            </div>
        </section>

        {/* Referral List */}
        <section className="py-4 space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] ml-1">Your Network</h3>
            {referrals.length === 0 ? (
               <div className="glass-card p-8 text-center">
                  <p className="text-xs text-slate-500">No referrals yet.</p>
               </div>
            ) : (
                <div className="space-y-3">
                   {referrals.map((r, i) => (
                      <div key={i} className="glass-card p-4 flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-indigo-400 text-xs">{r.name.charAt(0)}</div>
                            <div>
                               <p className="text-xs font-bold text-white uppercase">{r.name}</p>
                               <p className="text-[9px] text-slate-500 tracking-tighter">{new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div className="text-right">
                             <p className="text-xs font-black text-emerald-400">+${bonusAmount}</p>
                             <span className="text-[8px] font-black uppercase text-slate-600">{r.status}</span>
                         </div>
                      </div>
                   ))}
                </div>
            )}
        </section>

        <style>{`
          .mobile-affiliate {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .glass-card {
            background: rgba(30, 41, 59, 0.4);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
          }
        `}</style>
      </div>
    );
  }

  // Desktop View
  return (
    <div style={{ 
      gridColumn: '1 / -1', 
      height: '100%', 
      overflowY: 'auto',
      padding: '32px 24px', 
      maxWidth: '100%', 
      width: '100%',
      margin: '0 auto', 
      color: '#e0e6ed' 
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
         <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>Affiliate Partnership</h2>
         <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Grow the Bullvera network and earn rewards for every referral.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
         {/* Referral Link Card */}
         <div className="card glass" style={{ gridColumn: '1 / -1', padding: '32px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(50,145,255,0.05), rgba(0,0,0,0))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
               <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Invite your friends</h3>
                  <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#94a3b8' }}>
                     Your friends get a premium trading experience, and you earn <strong style={{ color: '#00cc88' }}>${bonusAmount}</strong> for every successful signup.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <code style={{ flex: 1, padding: '12px', fontSize: '14px', color: '#3291ff', overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{referralLink}</code>
                     <button onClick={handleCopy} style={{ background: copied ? '#00cc88' : '#3291ff', color: '#fff', border: 'none', borderRadius: '10px', padding: '0 24px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                        {copied ? 'Copied!' : 'Copy Link'}
                     </button>
                  </div>
               </div>
               
               <div style={{ background: 'rgba(50,145,255,0.1)', padding: '24px', borderRadius: '20px', textAlign: 'center', minWidth: '180px' }}>
                  <div style={{ fontSize: '11px', color: '#3291ff', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Partner Level</div>
                  <div style={{ fontSize: '24px', fontWeight: 900 }}>Silver Agent</div>
               </div>
            </div>
         </div>

         {/* Stats */}
         <div className="card glass" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(50,145,255,0.1)', color: '#3291ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
               <i className="fa-solid fa-users" />
            </div>
            <div>
               <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>TOTAL INVITES</div>
               <div style={{ fontSize: '28px', fontWeight: 900 }}>{stats.totalInvites}</div>
            </div>
         </div>

         <div className="card glass" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(0,204,136,0.1)', color: '#00cc88', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
               <i className="fa-solid fa-sack-dollar" />
            </div>
            <div>
               <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>TOTAL EARNINGS</div>
               <div style={{ fontSize: '28px', fontWeight: 900, color: '#00cc88' }}>${stats.totalEarnings.toLocaleString()}</div>
            </div>
         </div>
      </div>

      <div className="card glass" style={{ padding: '32px', borderRadius: '24px' }}>
         <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Referral Network</h3>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Client</th>
                     <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Join Date</th>
                     <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                     <th style={{ textAlign: 'right', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Reward</th>
                  </tr>
               </thead>
               <tbody>
                  {referrals.length === 0 ? (
                     <tr><td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>No referrals found yet. Share your link to start earning!</td></tr>
                  ) : (
                     referrals.map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                           <td style={{ padding: '16px 12px' }}>
                              <div style={{ fontWeight: 700 }}>{r.name}</div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>{r.uid}</div>
                           </td>
                           <td style={{ padding: '16px 12px', fontSize: '13px' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                           <td style={{ padding: '16px 12px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 800, background: r.status === 'active' ? 'rgba(0,204,136,0.1)' : 'rgba(245,158,11,0.1)', color: r.status === 'active' ? '#00cc88' : '#f59e0b' }}>
                                 {r.status.toUpperCase()}
                              </span>
                           </td>
                           <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: 800, color: '#00cc88' }}>+${bonusAmount}</td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
      </div>
    </div>
  );
};

export default Affiliate;
