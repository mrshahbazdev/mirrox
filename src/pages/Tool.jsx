import React, { useState, useRef, useEffect } from 'react';
import {
  Copy, Check, Image as ImageIcon, Loader2, Sparkles,
  Smartphone, Monitor, Tablet, MessageSquare,
  RefreshCw, Download, Palette, History, Lock, Unlock, X,
  ArrowRightLeft, FileCode, Layout, Zap, Code2, Eye,
  ExternalLink, Columns, Layers, Settings, ChevronRight,
  Terminal, MousePointer2, Box, Cpu, HardDrive, Share2,
  Brush, Save, Command, Search, Moon, Sun, MonitorDot,
  BarChart3, ShieldCheck, Accessibility, ZapOff, Clipboardlist,
  FileJson, Package, Grid3X3, Rocket, Fingerprint, Type
} from 'lucide-react';

// ─── CONFIG ────────────────────────────────────────────────────────
const DEFAULT_MODEL = "gemini-2.5-flash-preview-09-2025";
// ───────────────────────────────────────────────────────────────────

// ── Static Data ────────────────────────────────────────────────────
const COMPONENT_SHORTCUTS = [
  { id: 'hero',     label: 'Hero Section',   icon: <Rocket size={12}/>, prompt: 'Add a high-impact hero section with a bold heading, subtext, and primary/secondary CTAs.' },
  { id: 'features', label: 'Feature Grid',   icon: <Grid3X3 size={12}/>, prompt: 'Add a 3-column features section with icons, titles, and short descriptions.' },
  { id: 'pricing',  label: 'Pricing Table',  icon: <BarChart3 size={12}/>, prompt: 'Add a modern 3-tiered pricing table with a "Most Popular" highlight.' },
  { id: 'footer',   label: 'Modern Footer',  icon: <Layout size={12}/>, prompt: 'Add a multi-column footer with links, socials, and newsletter signup.' },
];

const PRESETS = [
  { id: 'dashboard', emoji: '📊', label: 'Dashboard',  prompt: 'Industrial analytics dashboard with dark glass panels, status badges, and data grids.' },
  { id: 'landing',   emoji: '🚀', label: 'Landing',    prompt: 'Premium SaaS landing page with sleek hero, feature sections, and multi-step forms.' },
  { id: 'saas',      emoji: '⚡', label: 'SaaS App',   prompt: 'Enterprise application UI with sidebar, main content area, and user management.' },
];

// ── Helpers ────────────────────────────────────────────────────────
function extractColors(html) {
  const re = /#([0-9A-Fa-f]{6})\b/g;
  return [...new Set([...html.matchAll(re)].map(m => '#' + m[1].toUpperCase()))].slice(0, 8);
}

function buildSystemPrompt(varCount, brand, techTarget) {
  return `You are a Senior UI/UX Engineer. Generate ${varCount} stunning, production-ready layouts.
BRAND IDENTITY (STRICT):
Name: ${brand.name || 'Visionary'}
Primary Color: ${brand.primary || '#FF4D5E'}
Logo URL: ${brand.logo || 'https://bullvera.com/logo.png'}
Font: ${brand.font || 'Inter'}

Tech Stack: Tailwind CSS (CDN), FontAwesome 6, Google Font (${brand.font || 'Inter'}).
Response: RAW JSON ONLY { "Layout Name": "HTML String" }. 
Ensure the design reflects the brand identity above. Use logo and brand colors consistently.
Output format: ${techTarget === 'react' ? 'React (use className)' : 'HTML'}.
Style: High-end, precise spacing (8px grid), 100% responsive.`;
}

// ╔══════════════════════════════════════════════════════════╗
//   VISION2UI ULTIMATE STUDIO (ADVANCED)
// ╚══════════════════════════════════════════════════════════╝
export default function Tool() {

  // --- Persistent Settings ---
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('bull_studio_api_key') || '');
  const [brand, setBrand] = useState(() => {
    const saved = localStorage.getItem('bull_studio_brand');
    return saved ? JSON.parse(saved) : { name: 'Bullvera Finance', logo: '', primary: '#FF4D5E', font: 'Outfit' };
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('api'); // api, brand

  // --- Input States ---
  const [image,               setImage]               = useState(null);
  const [base64Image,         setBase64Image]         = useState(null);
  const [prompt,              setPrompt]              = useState('');
  const [variationCount,      setVariationCount]      = useState(1);
  const [preset,              setPreset]              = useState(null);
  const [techTarget,          setTechTarget]          = useState('html');
  const [inputMode,           setInputMode]           = useState('prompt');

  // --- Live Style Mixer States ---
  const [liveStyles, setLiveStyles] = useState({ primary: brand.primary, radius: '12', font: brand.font });

  // --- Output States ---
  const [variations,           setVariations]           = useState(() => {
    const saved = localStorage.getItem('v2ui_last_variations');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [history,              setHistory]              = useState([]);
  const [tokens,               setTokens]               = useState([]);

  // --- UI States ---
  const [isLoading,   setIsLoading]   = useState(false);
  const [isIterating, setIsIterating] = useState(false);
  const [error,       setError]       = useState(null);
  const [copied,      setCopied]      = useState(false);
  const [activeTab,   setActiveTab]   = useState('preview');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [previewKey,  setPreviewKey]  = useState(0);
  const [iterInput,   setIterInput]   = useState('');

  const fileInputRef  = useRef(null);
  const iframeRef     = useRef(null);
  const currentHTML   = variations[activeIndex]?.html || '';

  // Persistence Effects
  useEffect(() => { localStorage.setItem('bull_studio_api_key', apiKey); }, [apiKey]);
  useEffect(() => { localStorage.setItem('bull_studio_brand', JSON.stringify(brand)); }, [brand]);
  useEffect(() => { localStorage.setItem('bull_studio_last_vars', JSON.stringify(variations)); }, [variations]);

  // Sync Live Styles with Brand when brand changes
  useEffect(() => { setLiveStyles(s => ({ ...s, primary: brand.primary, font: brand.font })); }, [brand]);

  // Live Style Injection
  useEffect(() => {
    if (activeTab === 'preview' && iframeRef.current && variations.length > 0) {
      const doc = iframeRef.current.contentDocument;
      if (doc && doc.body) {
        let tag = doc.getElementById('v2ui-live-s') || doc.createElement('style');
        tag.id = 'v2ui-live-s';
        if (!doc.head.contains(tag)) doc.head.appendChild(tag);
        tag.innerHTML = `
          :root { --p: ${liveStyles.primary}; --r: ${liveStyles.radius}px; --f: '${liveStyles.font}', sans-serif; }
          * { font-family: var(--f) !important; }
          .rounded-xl, .rounded-2xl, .bg-brand, .bg-primary { border-radius: var(--r) !important; }
          .bg-brand, .bg-primary, .bg-accent { background-color: var(--p) !important; }
          .text-brand, .text-primary, .text-accent { color: var(--p) !important; }
        `;
      }
    }
  }, [liveStyles, variations, activeIndex, activeTab, previewKey]);

  // Handlers
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => { setImage(URL.createObjectURL(file)); setBase64Image(reader.result.split(',')[1]); };
                    reader.readAsDataURL(file);
                  };

                  const generateUI = async (retryCount = 0) => {
    if (!apiKey) { setShowSettings(true); return; }
    setIsLoading(true); setError(null);
    const parts = [{ text: `Generate ${variationCount} layouts. App: ${preset || 'Professional UI'}. Prompt: ${prompt}. Mode: ${techTarget}.` }];
    if (base64Image) parts.push({ inlineData: { mimeType: 'image/png', data: base64Image } });

    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          systemInstruction: { parts: [{ text: buildSystemPrompt(variationCount, brand, techTarget) }] },
          generationConfig: { responseMimeType: 'application/json', temperature: 0.8 }
        })
      });
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = JSON.parse(text);
      const vars = Object.entries(parsed).map(([name, html]) => ({ name, html }));

      setVariations(vars);
      setActiveIndex(0);
      setHistory(prev => [{ id: Date.now(), vars, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 5)]);
      setPreviewKey(k => k + 1);
      setActiveTab('preview');
    } catch (err) { if (retryCount < 1) setTimeout(() => generateUI(1), 2000); else setError(err.message); } finally { setIsLoading(false); }
  };

  const iterate = async (inst) => {
    if (!inst.trim() || !currentHTML || isIterating) return;
    setIsIterating(true);
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Instruction: "${inst}". Update this ${techTarget === 'react' ? 'React' : 'HTML'} code. Return only code.\n\n${currentHTML}` }] }]
        })
      });
      const data = await resp.json();
      const html = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const upd = [...variations];
      upd[activeIndex].html = html;
      setVariations(upd);
      setPreviewKey(k => k + 1);
      setIterInput('');
    } catch (e) { setError(e.message); } finally { setIsIterating(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-dim)] flex flex-col font-sans overflow-hidden">
      
      {/* ── Dynamic Blobs ── */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#FF4D5E]/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#FF4D5E]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* ── Header ── */}
      <header className="h-16 border-b border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-3xl flex items-center justify-between px-8 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FF4D5E] rounded-2xl flex items-center justify-center shadow-xl shadow-[#FF4D5E]/20 active:scale-95 transition-all">
            <Sparkles size={20} className="text-white fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[var(--text-main)] font-black tracking-tighter text-2xl uppercase italic leading-none">STUDIO</span>
              <span className="px-2 py-0.5 bg-[#FF4D5E]/10 rounded-md text-[9px] font-black text-[#FF4D5E] border border-[#FF4D5E]/10 uppercase tracking-widest">Bullvera Creative</span>
            </div>
            {brand.name && <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1 opacity-80">Syncing with {brand.name}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {variations.length > 0 && (
             <button onClick={() => { navigator.clipboard.writeText(currentHTML); setCopied(true); setTimeout(()=>setCopied(false),2000); }} 
              className={`px-5 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all flex items-center gap-2 ${copied ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-black/10'}`}>
              {copied ? <Check size={14}/> : <Share2 size={14}/>} {copied ? 'Project Synced' : `Copy ${techTarget.toUpperCase()}`}
            </button>
          )}
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-xl hover:bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-muted)] border border-transparent hover:border-[var(--border)] transition-all">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        
        {/* SIDEBAR */}
        <aside className="w-[340px] bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col no-scrollbar overflow-y-auto">
          <div className="p-6 flex flex-col gap-6">
            
            {/* Input Toggle */}
            <div className="bg-[var(--bg-hover)] p-1 rounded-2xl border border-[var(--border)] grid grid-cols-2 gap-1 mb-2">
               <button onClick={() => setInputMode('prompt')} className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${inputMode === 'prompt' ? 'bg-white text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-dim)]'}`}>Prompt</button>
               <button onClick={() => setInputMode('convert')} className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${inputMode === 'convert' ? 'bg-white text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-dim)]'}`}>Vision</button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map(p => (
                <button key={p.id} onClick={() => { setPreset(p.id); setPrompt(p.prompt); }} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${preset === p.id ? 'bg-[#FF4D5E]/5 border-[#FF4D5E]/20' : 'bg-slate-50 border-slate-100 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'}`}>
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-[9px] font-black uppercase tracking-tight text-[var(--text-main)]">{p.label}</span>
                </button>
              ))}
            </div>

            {/* Prompt */}
            <div className="space-y-3">
              <Label icon={<Terminal size={12}/>}>Project Constraints</Label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-32 bg-slate-50 border border-slate-100 rounded-3xl p-4 text-sm text-[var(--text-main)] outline-none focus:border-[#FF4D5E]/30 transition-all resize-none shadow-inner" placeholder="Analyze and build the future..." />
            </div>

            {/* Components */}
            <div>
               <Label icon={<Package size={12}/>}>Smart Sections</Label>
               <div className="flex flex-wrap gap-2">
                 {COMPONENT_SHORTCUTS.map(c => (
                   <button key={c.id} onClick={() => setPrompt(p => p + (p ? ' ' : '') + c.prompt)} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-[var(--text-dim)] hover:text-[var(--text-main)] hover:border-slate-300 transition-all">
                     <span className="text-[#FF4D5E]">{c.icon}</span> {c.label}
                   </button>
                 ))}
               </div>
            </div>

            {/* Vision Upload */}
            {inputMode === 'convert' && (
              <div onClick={() => fileInputRef.current?.click()} className={`aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${image ? 'border-[#FF4D5E]/30 bg-[#FF4D5E]/5' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                {image ? <img src={image} className="w-full h-full object-contain p-4" /> : <div className="text-center text-slate-400 font-black uppercase text-[10px] tracking-widest"><ImageIcon size={24} className="mx-auto mb-2 opacity-30" />Upload UI Source</div>}
              </div>
            )}

            {/* Run */}
            <button onClick={generateUI} disabled={isLoading} className="w-full py-5 bg-[#FF4D5E] hover:bg-[#ff7582] text-white font-black text-base rounded-3xl shadow-2xl shadow-[#FF4D5E]/30 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3">
              {isLoading ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
              {isLoading ? 'THINKING...' : 'RUN GENERATION'}
            </button>

            {/* Live Styles */}
            {variations.length > 0 && (
              <div className="mt-2 pt-6 border-t border-[var(--border)] space-y-6">
                 <Label icon={<Palette size={12}/>}>Live Brand Mixer</Label>
                 <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-5">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-black text-[var(--text-muted)] uppercase mb-3">Accent <span>{liveStyles.primary}</span></div>
                      <input type="color" value={liveStyles.primary} onChange={e => setLiveStyles({...liveStyles, primary: e.target.value})} className="w-full h-8 rounded-xl bg-transparent border-0 cursor-pointer" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-black text-[var(--text-muted)] uppercase mb-3">Radius <span>{liveStyles.radius}px</span></div>
                      <input type="range" min="0" max="32" value={liveStyles.radius} onChange={e => setLiveStyles({...liveStyles, radius: e.target.value})} className="w-full h-1 bg-slate-200 rounded-full appearance-none accent-[#FF4D5E] cursor-pointer" />
                    </div>
                 </div>
              </div>
            )}
          </div>
        </aside>

        {/* VIEWPORT */}
        <section className="flex-1 flex flex-col relative bg-[var(--bg-deep)]">
          <div className="h-16 border-b border-[var(--border)] flex items-center justify-between px-8 bg-[var(--bg-card)] backdrop-blur-md">
             <div className="flex items-center gap-6">
                <div className="flex bg-[var(--bg-hover)] p-1 rounded-2xl border border-[var(--border)]">
                  {['preview', 'code', 'history'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-dim)]'}`}>{t}</button>
                  ))}
                </div>
                {variations.length > 0 && activeTab === 'preview' && (
                  <div className="flex gap-1.5 p-1 bg-[var(--bg-hover)] rounded-2xl border border-[var(--border)]">
                    {variations.map((v, i) => (
                      <button key={i} onClick={() => { setActiveIndex(i); setPreviewKey(k=>k+1); }} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeIndex === i ? 'bg-[#FF4D5E] text-white shadow-lg shadow-[#FF4D5E]/10' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>V{i+1}</button>
                    ))}
                  </div>
                )}
             </div>
             <div className="flex bg-[var(--bg-hover)] p-1.5 rounded-2xl border border-[var(--border)] gap-1">
               {[{ id:'mobile', icon: Smartphone, label: '390px' }, { id:'tablet', icon: Tablet, label: '768px' }, { id:'desktop', icon: MonitorDot, label: 'Full Display' }].map(pm => (
                 <button key={pm.id} onClick={() => setPreviewMode(pm.id)} className={`p-2.5 rounded-xl transition-all ${previewMode === pm.id ? 'bg-[#FF4D5E] text-white shadow-lg' : 'text-[var(--text-muted)] hover:bg-white/40'}`}><pm.icon size={16}/></button>
               ))}
             </div>
          </div>

          <div className="flex-1 p-10 flex items-center justify-center relative overflow-hidden">
             {isLoading && <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center transition-all backdrop-blur-xl animate-in fade-in duration-500">
               <div className="relative">
                 <div className="w-24 h-24 border-[3px] border-slate-100 border-t-[#FF4D5E] rounded-full animate-spin" />
                 <Sparkles size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FF4D5E] animate-pulse" />
               </div>
               <h2 className="text-xl font-black uppercase tracking-widest text-[var(--text-main)] mt-8 italic italic">Synthesizing Creative</h2>
             </div>}

             {activeTab === 'code' && (
               <div className="absolute inset-0 bg-[#070709] p-12 overflow-auto scrollbar-thin scrollbar-thumb-white/10 font-mono text-xs text-[#FF4D5E]/80 leading-relaxed">{currentHTML}</div>
             )}
             
             {activeTab === 'preview' && variations.length > 0 && (
               <div className={`transition-all duration-700 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative group ${previewMode === 'mobile' ? 'w-[375px] h-[760px] rounded-[3.5rem] border-[14px] border-[#0a0a0c] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.05)]' : previewMode === 'tablet' ? 'w-[768px] h-[600px] rounded-[2rem] border-[10px] border-[#0a0a0c] overflow-hidden' : 'w-full h-full rounded-[2.5rem] overflow-hidden'}`}>
                  {previewMode === 'mobile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#0a0a0c] rounded-b-3xl z-[100]" />}
                  <iframe ref={iframeRef} key={previewKey} srcDoc={currentHTML} className="w-full h-full border-none bg-white" />
               </div>
             )}
             
             {!variations.length && !isLoading && <div className="text-slate-800 text-lg font-black uppercase tracking-[1em] italic opacity-10">Studio Standby</div>}
          </div>

          {variations.length > 0 && (
            <div className="h-16 border-t border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-xl flex items-center px-8 gap-5 shrink-0 shadow-lg">
               <div className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest border-r border-[var(--border)] pr-6 h-8 flex items-center gap-2"><Fingerprint size={12} className="text-[#FF4D5E]"/> Refine Design</div>
               <input value={iterInput} onChange={e => setIterInput(e.target.value)} onKeyDown={e => e.key==='Enter' && iterate(iterInput)} placeholder="Describe any micro-adjustment..." className="flex-1 bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:opacity-50" />
               <button onClick={() => iterate(iterInput)} disabled={isIterating || !iterInput.trim()} className="w-10 h-10 flex items-center justify-center bg-[#FF4D5E] rounded-2xl text-white active:scale-90 transition-all shadow-xl shadow-[#FF4D5E]/20">{isIterating ? <Loader2 className="animate-spin" size={16}/> : <ChevronRight size={22}/>}</button>
            </div>
          )}
        </section>
      </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setShowSettings(false)} />
               <div className="w-[500px] bg-white border border-slate-200 rounded-[3rem] p-10 relative z-10 shadow-[0_40px_100px_rgba(0,0,0,0.15)] animate-in zoom-in-95">
                  <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 mb-8">
                    {['api', 'brand'].map(t => (
                      <button key={t} onClick={()=>setSettingsTab(t)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settingsTab === t ? 'bg-[#FF4D5E] text-white shadow-lg shadow-[#FF4D5E]/10' : 'text-slate-400'}`}>{t === 'api' ? 'Intelligence Core' : 'Brand Identity'}</button>
                    ))}
                  </div>

                  {settingsTab === 'api' ? (
                    <div className="space-y-6">
                      <div>
                        <Label>Gemini Pro API Key</Label>
                        <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[var(--text-main)] font-mono text-sm focus:ring-1 focus:ring-[#FF4D5E] outline-none" placeholder="AIZA..." />
                        <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-widest leading-loose">Saved locally. Powers the entire design synthesis engine.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                       <div>
                         <Label>Brand Identity Name</Label>
                         <input type="text" value={brand.name} onChange={e=>setBrand({...brand, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-[var(--text-main)] outline-none" placeholder="E.g. Bullvera Finance" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <Label>Primary Color</Label>
                           <input type="color" value={brand.primary} onChange={e=>setBrand({...brand, primary: e.target.value})} className="w-full h-12 rounded-2xl bg-white border border-slate-200 p-1 cursor-pointer" />
                         </div>
                         <div>
                           <Label>Radius</Label>
                           <select value={liveStyles.radius} onChange={e=>setLiveStyles({...liveStyles, radius: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-[var(--text-main)] outline-none appearance-none font-bold">
                             <option value="4">Small</option>
                             <option value="12">Modern</option>
                             <option value="24">Rounded</option>
                             <option value="99">Capsule</option>
                           </select>
                         </div>
                       </div>
                       <div>
                         <Label>Logo Asset URL</Label>
                         <input type="text" value={brand.logo} onChange={e=>setBrand({...brand, logo: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-[var(--text-main)] outline-none" placeholder="https://..." />
                       </div>
                       <div>
                         <Label>Typography Base</Label>
                         <select value={brand.font} onChange={e=>setBrand({...brand, font: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-[var(--text-main)] outline-none appearance-none font-bold">
                           {['Plus Jakarta Sans', 'Inter', 'Outfit', 'Montserrat', 'Playfair Display'].map(f => <option key={f} value={f}>{f}</option>)}
                         </select>
                       </div>
                    </div>
                  )}

               <button onClick={() => setShowSettings(false)} className="w-full mt-10 py-5 bg-[#FF4D5E] rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-[#ff7582] shadow-2xl shadow-[#FF4D5E]/20 transition-all">Synchronize Studio</button>
            </div>
         </div>
      )}
      
      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 99px; }
        .scrollbar-thin::-webkit-scrollbar { width: 3px; }
      `}</style>
    </div>
  );
}

function Label({ icon, children }) {
  return (
    <div className="text-[10px] font-black uppercase text-slate-500 tracking-[0.15em] mb-3 flex items-center gap-2">
      {icon}
      {children}
    </div>
  );
}
