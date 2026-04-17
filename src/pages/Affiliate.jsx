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
        <header className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-black text-[var(--text-main)]">Affiliate</h1>
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Level: Silver Agent</p>
        </header>

        {/* Affiliate Link Card */}
        <section className="py-4 px-4">
            <div className="glass-card p-6 bg-gradient-to-br from-[var(--accent-muted)] to-transparent">
                <h3 className="text-lg font-black text-[var(--text-main)] mb-2">Invite Friends</h3>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed mb-6 font-bold uppercase tracking-tight">Earn <span className="text-[var(--success)]">${bonusAmount}</span> for every successful signup through your network.</p>
                
                <div className="space-y-3">
                   <div className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-2xl p-4 overflow-hidden">
                      <code className="text-[10px] text-[var(--accent)] font-mono break-all">{referralLink}</code>
                   </div>
                    <button 
                      onClick={handleCopy}
                      className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${copied ? 'bg-[var(--success)] text-white' : 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-muted)]'}`}
                    >
                       {copied ? 'Copied to Clipboard' : 'Copy referral link'}
                   </button>
                </div>
            </div>
        </section>

        {/* Stats Grid */}
        <section className="py-4 px-4 grid grid-cols-2 gap-4">
            <div className="glass-card p-5">
                <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-1">Invites</p>
                <h4 className="text-2xl font-black text-[var(--text-main)]">{stats.totalInvites}</h4>
            </div>
            <div className="glass-card p-5">
                <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-1">Earned</p>
                <h4 className="text-2xl font-black text-[var(--success)]">${stats.totalEarnings.toLocaleString()}</h4>
            </div>
        </section>

        {/* Referral List */}
        <section className="py-4 px-4 space-y-3">
            <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-[0.2em] ml-1">Your Network</h3>
            {referrals.length === 0 ? (
               <div className="glass-card p-8 text-center">
                  <p className="text-xs text-[var(--text-muted)]">No referrals yet.</p>
               </div>
            ) : (
                <div className="space-y-3">
                   {referrals.map((r, i) => (
                      <div key={i} className="glass-card p-4 flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center font-black text-[var(--accent)] text-xs">{r.name.charAt(0)}</div>
                            <div>
                               <p className="text-xs font-bold text-[var(--text-main)] uppercase">{r.name}</p>
                               <p className="text-[9px] text-[var(--text-muted)] tracking-tighter">{new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div className="text-right">
                             <p className="text-xs font-black text-[var(--success)]">+${bonusAmount}</p>
                             <span className="text-[8px] font-black uppercase text-[var(--text-dim)]">{r.status}</span>
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
            background: var(--bg-deep);
            min-height: 100vh;
          }
          .glass-card {
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border);
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
      color: 'var(--text-main)' 
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
         <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>Affiliate Partnership</h2>
         <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Grow the Bullvera network and earn rewards for every referral.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
         {/* Referral Link Card */}
         <div className="card glass" style={{ gridColumn: '1 / -1', padding: '32px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--accent-muted), transparent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
               <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-main)' }}>Invite your friends</h3>
                  <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                     Your friends get a premium trading experience, and you earn <strong style={{ color: 'var(--success)' }}>${bonusAmount}</strong> for every successful signup.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-hover)', padding: '8px', borderRadius: '14px', border: '1px solid var(--border)' }}>
                     <code style={{ flex: 1, padding: '12px', fontSize: '14px', color: 'var(--accent)', overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{referralLink}</code>
                     <button onClick={handleCopy} style={{ background: copied ? 'var(--success)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '0 24px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                        {copied ? 'Copied!' : 'Copy Link'}
                     </button>
                  </div>
               </div>
               
               <div style={{ background: 'var(--accent-muted)', padding: '24px', borderRadius: '20px', textAlign: 'center', minWidth: '180px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Partner Level</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)' }}>Silver Agent</div>
               </div>
            </div>
         </div>

         {/* Stats */}
         <div className="card glass" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid var(--border)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--accent-muted)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
               <i className="fa-solid fa-users" />
            </div>
            <div>
               <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL INVITES</div>
               <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-main)' }}>{stats.totalInvites}</div>
            </div>
         </div>

         <div className="card glass" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid var(--border)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--success-muted)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
               <i className="fa-solid fa-sack-dollar" />
            </div>
            <div>
               <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL EARNINGS</div>
               <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--success)' }}>${stats.totalEarnings.toLocaleString()}</div>
            </div>
         </div>
      </div>

      <div className="card glass" style={{ padding: '32px', borderRadius: '24px', border: '1px solid var(--border)' }}>
         <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: 'var(--text-main)' }}>Referral Network</h3>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                     <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Client</th>
                     <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Join Date</th>
                     <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                     <th style={{ textAlign: 'right', padding: '12px', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Reward</th>
                  </tr>
               </thead>
               <tbody>
                  {referrals.length === 0 ? (
                     <tr><td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No referrals found yet. Share your link to start earning!</td></tr>
                  ) : (
                     referrals.map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                           <td style={{ padding: '16px 12px' }}>
                              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{r.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.uid}</div>
                           </td>
                           <td style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--text-main)' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                           <td style={{ padding: '16px 12px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 800, background: r.status === 'active' ? 'var(--success-muted)' : 'var(--warning-muted)', color: r.status === 'active' ? 'var(--success)' : 'var(--warning)' }}>
                                 {r.status.toUpperCase()}
                              </span>
                           </td>
                           <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: 800, color: 'var(--success)' }}>+${bonusAmount}</td>
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
