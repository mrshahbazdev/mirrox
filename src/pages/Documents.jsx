import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';

const Documents = () => {
  const { currentClientExtended } = useTrading();
  const [docType, setDocType] = useState('id_card');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  const kyc = currentClientExtended?.kyc || {};
  const isApproved = kyc?.status === 'approved';
  const isPending = kyc?.status === 'pending';
  const isRejected = kyc?.status === 'rejected';

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      await axios.post(\`${import.meta.env.VITE_API_URL}/api/clients/${currentClientExtended.id}/kyc/submit`, {
        docType,
        docName: file.name
      });
      setSuccess(true);
    } catch (err) {
      console.error('Failed to submit KYC', err);
      alert('Error submitting documents.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      gridColumn: '1 / -1', 
      height: '100%', 
      overflowY: 'auto', 
      padding: '32px 24px', 
      width: '100%',
      background: 'var(--bg-deep)',
      color: '#e0e6ed' 
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
         <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
           Verification Center
         </h2>
         <p style={{ margin: 0, color: '#94a3b8', fontSize: '15px' }}>Verify your identity to unlock live trading and withdrawals.</p>
      </div>

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '24px', 
        alignItems: 'flex-start' 
      }}>
        
        {/* Helper / Guidelines Column */}
        <div style={{ flex: '1 1 280px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
           <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>Document Guidelines</h3>
           
           <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', color: '#94a3b8', fontSize: '14px' }}>
             <li style={{ display: 'flex', gap: '12px' }}>
               <i className="fa-solid fa-check" style={{ color: '#10b981', marginTop: '3px' }}></i>
               <div><strong>Clear and Readable:</strong> Ensure all text and the photo are clearly visible without blur.</div>
             </li>
             <li style={{ display: 'flex', gap: '12px' }}>
               <i className="fa-solid fa-check" style={{ color: '#10b981', marginTop: '3px' }}></i>
               <div><strong>Valid Document:</strong> Must not be expired. Use a government-issued ID.</div>
             </li>
             <li style={{ display: 'flex', gap: '12px' }}>
               <i className="fa-solid fa-check" style={{ color: '#10b981', marginTop: '3px' }}></i>
               <div><strong>Full Edges Visible:</strong> Do not crop the document. All 4 corners must be in the frame.</div>
             </li>
             <li style={{ display: 'flex', gap: '12px' }}>
               <i className="fa-solid fa-xmark" style={{ color: '#ef4444', marginTop: '3px' }}></i>
               <div><strong>No Flash Glare:</strong> Avoid taking photos with direct flash that obscures information.</div>
             </li>
           </ul>
        </div>

        {/* Upload Form Column */}
        <div className="card glass" style={{ flex: '2 1 400px', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', minWidth: 0 }}>
          {isApproved ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                 <i className="fa-solid fa-check" style={{ fontSize: '36px', color: '#10b981' }}></i>
               </div>
               <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>Identity Verified</h3>
               <p style={{ color: '#94a3b8', fontSize: '14px' }}>You have full access to live trading and unlimited withdrawals.</p>
            </div>
          ) : isPending || success ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                 <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: '32px', color: '#f59e0b' }}></i>
               </div>
               <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>Action Pending</h3>
               <p style={{ color: '#94a3b8', fontSize: '14px' }}>Your documents are currently under review. This usually takes 1-2 business days. We will notify you once approved.</p>
            </div>
          ) : (
            <div>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                 <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ef4444', fontSize: '20px', marginTop: '2px' }}></i>
                 <div>
                   <h4 style={{ color: '#ef4444', margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700 }}>Verification Required</h4>
                   <p style={{ margin: 0, fontSize: '13px', color: '#f87171', lineHeight: '1.5' }}>Currently you are trading via a <strong>Demo Account</strong>. Upload your identification documents to unlock Real Trading mode.</p>
                 </div>
              </div>

              {isRejected && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #ef4444' }}>
                   <p style={{ margin: 0, color: '#f87171', fontSize: '13px' }}><strong>Rejected:</strong> {kyc?.rejectionReason || 'Document was unclear or invalid. Please try again.'}</p>
                 </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Document Type</label>
                  <select 
                    value={docType} 
                    onChange={(e) => setDocType(e.target.value)}
                    style={{ 
                      width: '100%', padding: '14px 16px', 
                      background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '10px', color: '#fff', fontSize: '15px',
                      outline: 'none', cursor: 'pointer'
                    }}
                  >
                    <option value="id_card">National ID Card</option>
                    <option value="passport">Passport</option>
                    <option value="driving_license">Driving License</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Upload Front & Back</label>
                  
                  <div 
                    onClick={() => !file && fileInputRef.current?.click()}
                    style={{ 
                      border: file ? '2px solid var(--accent)' : '2px dashed rgba(255,255,255,0.15)', 
                      background: file ? 'rgba(50, 145, 255, 0.05)' : 'rgba(0,0,0,0.2)',
                      padding: '32px 20px', textAlign: 'center', borderRadius: '12px', 
                      position: 'relative', cursor: file ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                     <input 
                       type="file" 
                       ref={fileInputRef}
                       onChange={handleFileChange} 
                       accept="image/*,.pdf" 
                       style={{ display: 'none' }} 
                     />
                     
                     {file ? (
                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                           <i className="fa-solid fa-file-image" style={{ fontSize: '24px', color: '#10b981' }}></i>
                         </div>
                         <p style={{ margin: '0 0 4px', color: '#fff', fontWeight: 600, fontSize: '14px', wordBreak: 'break-all' }}>{file.name}</p>
                         <p style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: '12px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                         <button 
                           type="button" 
                           onClick={clearFile}
                           style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                         >
                           Remove / Change File
                         </button>
                       </div>
                     ) : (
                       <>
                         <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(50, 145, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                           <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '24px', color: '#3291ff' }}></i>
                         </div>
                         <p style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '15px', fontWeight: 600 }}>Click to upload or drag and drop</p>
                         <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>SVG, PNG, JPG or PDF (max. 5MB)</p>
                       </>
                     )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!file || loading}
                  style={{ 
                    background: (!file || loading) ? 'rgba(255,255,255,0.1)' : 'var(--accent)', 
                    color: (!file || loading) ? '#64748b' : '#fff',
                    width: '100%', padding: '16px', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: (!file || loading) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', boxShadow: file ? '0 4px 12px rgba(50, 145, 255, 0.3)' : 'none'
                  }}
                >
                  {loading ? (
                    <><i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '8px' }}></i> Uploading...</>
                  ) : (
                    'Submit Documents'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
