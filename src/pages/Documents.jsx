import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';
import { useModal } from '../context/ModalContext';

const KYCBox = ({ title, desc, category, options, clientData }) => {
  const { showAlert } = useModal();
  const [docType, setDocType] = useState(options[0].value);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  // Extract the specific category (poi or por) from client's KYC object
  const kycData = clientData?.kyc?.[category] || { status: 'none' };
  
  // Backward compatibility: If the old layout set global status instead of POI, migrate it virtually
  const legacyStatus = clientData?.kyc?.status;
  const activeStatus = kycData.status !== 'none' ? kycData.status : 
                       (category === 'poi' && (legacyStatus === 'pending' || legacyStatus === 'approved' || legacyStatus === 'rejected') ? legacyStatus : 'none');

  const isApproved = activeStatus === 'approved';
  const isPending = activeStatus === 'pending';
  const isRejected = activeStatus === 'rejected';

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
      const formData = new FormData();
      formData.append('document', file);
      formData.append('docType', docType);
      formData.append('docCategory', category);

      if (!clientData?.id) {
        throw new Error("Client session not fully initialized. Please try again in a moment.");
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/clients/${clientData.id}/kyc/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
    } catch (err) {
      console.error(`Failed to submit ${category} KYC`, err);
      showAlert('Error submitting documents. Please try again or contact support.', 'Upload Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass" style={{ flex: '1 1 350px', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', minWidth: 0 }}>
      {isApproved ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
           <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
             <i className="fa-solid fa-check" style={{ fontSize: '36px', color: '#10b981' }}></i>
           </div>
           <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>{title} Verified</h3>
           <p style={{ color: '#94a3b8', fontSize: '14px' }}>Document safely verified and accepted.</p>
        </div>
      ) : isPending || success ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
           <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
             <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: '32px', color: '#f59e0b' }}></i>
           </div>
           <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>Action Pending</h3>
           <p style={{ color: '#94a3b8', fontSize: '14px' }}>Your document is currently under review. This usually takes 1-2 business days.</p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '24px' }}>
             <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, color: '#fff' }}>{title} Required</h4>
             <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>{desc}</p>
          </div>

          {isRejected && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #ef4444' }}>
               <p style={{ margin: 0, color: '#f87171', fontSize: '13px' }}><strong>Rejected:</strong> {kycData?.rejectionReason || clientData?.kyc?.rejectionReason || 'Document was unclear or invalid. Please try again.'}</p>
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
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Upload Document</label>
              
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
                     <p style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '15px', fontWeight: 600 }}>Click to upload file</p>
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
                'Submit Document'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const Documents = () => {
  const { currentClientExtended } = useTrading();

  const isFullyVerified = currentClientExtended?.kyc?.status === 'verified' || currentClientExtended?.accountType === 'live';

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-verification no-scrollbar">
        <header className="m-kyc-header">
            <h1>Verification</h1>
            <p className={`m-kyc-status-badge ${isFullyVerified ? 'verified' : ''}`}>
              Status: {isFullyVerified ? 'Verified' : 'Action Required'}
            </p>
        </header>

        {isFullyVerified ? (
          <section className="px-4">
            <div className="m-kyc-success-view">
                <div className="m-kyc-icon-box">
                    <i className="fa-solid fa-shield-check"></i>
                </div>
                <h3>Account Verified</h3>
                <p>Your identity has been successfully confirmed. You have full access to all platform features.</p>
            </div>
          </section>
        ) : (
          <div className="m-kyc-box-container px-4">
             {/* Verification Boxes */}
             <KYCBox 
                title="Identity" 
                desc="ID card, Driving license, or Passport." 
                category="poi"
                clientData={currentClientExtended}
                options={[
                    { value: 'id_card', label: 'ID Card' },
                    { value: 'passport', label: 'Passport' },
                    { value: 'driving_license', label: 'Driving License' }
                ]}
            />
            
            <KYCBox 
                title="Residence" 
                desc="Bill or Statement (max 3 months old)." 
                category="por"
                clientData={currentClientExtended}
                options={[
                    { value: 'utility_bill', label: 'Utility Bill' },
                    { value: 'bank_statement', label: 'Bank Statement' },
                    { value: 'tax_document', label: 'Tax Document' }
                ]}
            />

            <KYCBox 
                title="Selfie" 
                desc="Selfie holding your document." 
                category="selfie"
                clientData={currentClientExtended}
                options={[
                    { value: 'selfie_with_id', label: 'Selfie with ID' }
                ]}
            />

            {/* Mobile Guidelines */}
            <section className="pb-10">
                <div className="m-kyc-guidelines">
                    <h4>Guidelines</h4>
                    <div className="m-kyc-list">
                        <div className="m-kyc-list-item">
                            <i className="fa-solid fa-check"></i>
                            <p>Ensure all text on documents is clearly readable and not blurred.</p>
                        </div>
                        <div className="m-kyc-list-item">
                            <i className="fa-solid fa-check"></i>
                            <p>Use official government-issued documents only.</p>
                        </div>
                    </div>
                </div>
            </section>
          </div>
        )}

        <style>{`
          .mobile-verification {
            display: flex;
            flex-direction: column;
            gap: 8px;
            overflow-x: hidden;
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
      width: '100%',
      background: 'var(--bg-deep)',
      color: '#e0e6ed' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
         <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Verification Center
         </h2>
         <p style={{ margin: 0, color: '#94a3b8', fontSize: '15px' }}>Verify your identity to unlock live trading and withdrawals.</p>
      </div>

      {isFullyVerified ? (
        <div className="card glass" style={{ textAlign: 'center', padding: '64px', borderRadius: '16px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <i className="fa-solid fa-shield-check" style={{ fontSize: '48px', color: '#10b981' }}></i>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', marginBottom: '12px' }}>Account Fully Verified</h2>
            <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '400px', margin: '0 auto' }}>You have completed all mandatory KYC steps. Your account has full access to unlimited Live Trading operations.</p>
        </div>
      ) : (
        <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '24px', 
            alignItems: 'stretch' 
        }}>
            <KYCBox 
                title="Proof of Identity" 
                desc="Upload an official government ID card, driving license, or passport. Your photo and name must exactly match your registration details." 
                category="poi"
                clientData={currentClientExtended}
                options={[
                    { value: 'id_card', label: 'National ID Card' },
                    { value: 'passport', label: 'Passport' },
                    { value: 'driving_license', label: 'Driving License' }
                ]}
            />
            
            <KYCBox 
                title="Proof of Residence" 
                desc="Upload a recent utility bill, bank statement, or tax document containing your full name and physical address (not older than 3 months)." 
                category="por"
                clientData={currentClientExtended}
                options={[
                    { value: 'utility_bill', label: 'Utility Bill (Electricity/Water)' },
                    { value: 'bank_statement', label: 'Bank Statement' },
                    { value: 'tax_document', label: 'Tax Document' }
                ]}
            />

            <KYCBox 
                title="Selfie Verification" 
                desc="Upload a clear selfie holding your ID document next to your face. Ensure both your face and ID details are clearly visible without glare." 
                category="selfie"
                clientData={currentClientExtended}
                options={[
                    { value: 'selfie_with_id', label: 'Selfie with ID Document' }
                ]}
            />
        </div>
      )}

      {/* Helper / Guidelines Row */}
      {!isFullyVerified && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
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
                <i className="fa-solid fa-xmark" style={{ color: '#ef4444', marginTop: '3px' }}></i>
                <div><strong>No Flash Glare:</strong> Avoid taking photos with direct flash that obscures information.</div>
                </li>
            </ul>
        </div>
      )}

      </div>
    </div>
  );
};

export default Documents;
