import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FileText, Download, Shield, ExternalLink,
    CheckCircle2, ArrowRight, Lock, Globe
} from 'lucide-react';

const Legal = () => {
    const navigate = useNavigate();

    const docs = [
        "CLIENT AGREEMENT", "PRIVACY POLICY", "BONUS TERMS", 
        "AML POLICY", "GENERAL FEES", "COMPLAINTS HANDLING PROCEDURE",
        "RISK DISCLOSURE", "MARGIN INFORMATION", "TERMS OF USE",
        "REFUND & CANCELLATION POLICY", "RENEWAL CERTIFICATE"
    ];

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1>Legal <span style={{ color: 'var(--pub-red)' }}>Documents</span></h1>
                    <p style={{ margin: '0 auto', maxWidth: '800px' }}>
                        Access all legal documents, trading terms, and regulatory information required for secure trading.
                    </p>
                </div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {docs.map((doc, idx) => (
                        <div key={idx} style={{ background: 'white', padding: '48px', borderRadius: '48px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '32px', transition: 'all 0.3s' }}>
                            <div style={{ width: '56px', height: '56px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText size={28} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase', lineHeight: '1.4' }}>{doc}</h3>
                                <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Official PDF Document</p>
                            </div>
                            <button style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#f8fafc', border: 'none', color: '#1a1a1a', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s' }}>
                                <Download size={14} /> View Document
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2 style={{ textAlign: 'center' }}>Join Bulvera and Start Trading</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Start Now</button>
                </div>
            </section>

            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', padding: '16px 32px', background: '#f8fafc', borderRadius: '100px', border: '1px solid #e2e8f0' }}>
                    <Shield size={20} style={{ color: '#94a3b8' }}/>
                    <p style={{ fontSize: '11px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capital Crest Ltd is regulated by the MISA — License Number BFX2024064.</p>
                 </div>
            </div>
        </div>
    );
};

export default Legal;
