import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useModal } from '../../context/ModalContext';

const Verifications = ({ onAdminLogout }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { showPrompt } = useModal();
  
  // Filtering & Pagination
  const [filterTab, setFilterTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/clients', { headers: { Authorization: `Bearer ${localStorage.getItem('bullvera_admin_token')}` }});
      setClients(res.data);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleReview = async (clientId, action, category, reason = null) => {
    if (action === 'reject' && !reason) {
      showPrompt(
        `Enter reason for rejecting ${category.toUpperCase()}:`,
        `Reject ${category.toUpperCase()}`,
        (val) => {
          if (val) handleReview(clientId, action, category, val);
        },
        "Reason for rejection..."
      );
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${clientId}/kyc/review`, {
        action,
        rejectionReason: reason,
        category
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('bullvera_admin_token')}` }});
      showToast(`${category.toUpperCase()} successfully ${action}ed!`);
      fetchClients(); // Refresh list
    } catch (err) {
      showToast('Error updating KYC status', 'error');
    }
  };

  // Flatten the documents into a request pipeline
  let allRequests = [];
  clients.forEach(c => {
    if (c.kyc?.poi?.status && c.kyc.poi.status !== 'none') {
        allRequests.push({ client: c, type: 'Proof of Identity', category: 'poi', data: c.kyc.poi });
    }
    if (c.kyc?.por?.status && c.kyc.por.status !== 'none') {
        allRequests.push({ client: c, type: 'Proof of Residence', category: 'por', data: c.kyc.por });
    }
    if (c.kyc?.selfie?.status && c.kyc.selfie.status !== 'none') {
        allRequests.push({ client: c, type: 'Selfie with ID', category: 'selfie', data: c.kyc.selfie });
    }
    // Backward compatibility for legacy clients before split
    if (c.kyc?.documentUrl && (!c.kyc?.poi || c.kyc.poi.status === 'none')) {
        allRequests.push({ 
            client: c, type: 'Legacy Document', category: 'poi', 
            data: { url: c.kyc.documentUrl, status: c.kyc.status, submittedAt: c.kyc.submittedAt, rejectionReason: c.kyc.rejectionReason } 
        });
    }
  });

  const filteredRequests = allRequests.filter(req => {
    if (filterTab === 'all') return true;
    return req.data.status === filterTab;
  }).sort((a,b) => new Date(b.data.submittedAt || 0) - new Date(a.data.submittedAt || 0));

  // Calculate Pagination
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE) || 1;
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Auto reset page if out of bounds after a filter change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filterTab, totalPages, currentPage]);

  if (loading) {
    return (
      <AdminLayout onAdminLogout={onAdminLogout}>
        <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 40, marginBottom: 16, display: 'block' }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: '#e0e6ed' }}>Loading KYC Queue...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      {toast && (
        <div className={`adm-toast ${toast.type}`}>
          <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`} />
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="adm-page-header">
        <div>
          <h2 className="adm-page-title">
            <i className="fa-solid fa-address-card" /> Verification Center
          </h2>
          <p className="adm-page-sub">Review POI, POR and Selfie documents to activate live accounts</p>
        </div>
        <div className="adm-stat-pill">
          <span className="dot pulse" /> {allRequests.filter(r => r.data.status === 'pending').length} Pending
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="kyc-tabs">
        {['pending', 'approved', 'rejected', 'all'].map(tab => (
          <button 
            key={tab} 
            className={`kyc-tab ${filterTab === tab ? 'active' : ''}`}
            onClick={() => setFilterTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'pending' && <span className="kyc-badge">{allRequests.filter(r => r.data.status === 'pending').length}</span>}
          </button>
        ))}
      </div>

      {/* Main List Area */}
      <div className="kyc-container">
        {filteredRequests.length === 0 ? (
          <div className="kyc-empty">
            <i className="fa-solid fa-folder-open empty-icon" />
            <p>No document submissions found for '{filterTab}'.</p>
          </div>
        ) : (
          <div className="kyc-list">
            {paginatedRequests.map((req, idx) => (
              <div className="kyc-card" key={req.client.id + req.category + idx}>
                {/* Client Info Left */}
                <div className="kyc-card-left">
                  <div className="kyc-avatar">{req.client.name.charAt(0)}</div>
                  <div className="kyc-user-info">
                    <h4>{req.client.name}</h4>
                    <span className="kyc-uid">{req.client.uid}</span>
                  </div>
                  <div className="kyc-doc-info">
                    <div className="doc-label">Document Type</div>
                    <div className="doc-type" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className={`fa-solid ${req.category === 'selfie' ? 'fa-camera-retro' : 'fa-file-lines'}`} style={{ color: req.category === 'poi' ? '#FF4D5E' : (req.category === 'por' ? '#f59e0b' : '#10b981') }} /> 
                      <strong style={{ color: '#fff' }}>{req.type}</strong>
                      {req.data.url && (
                        <a href={req.data.url} target="_blank" rel="noreferrer" style={{ marginLeft: 6, color: '#FF4D5E', fontSize: 11, textDecoration: 'none', background: 'rgba(255, 77, 94, 0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          <i className="fa-solid fa-external-link-alt" /> View Image
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="kyc-doc-info">
                    <div className="doc-label">Date</div>
                    <div className="doc-date">{new Date(req.data.submittedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Status / Actions Right */}
                <div className="kyc-card-right">
                  <span className={`kyc-status-badge ${req.data.status}`}>
                    {req.data.status}
                  </span>
                  
                  {req.data.status === 'pending' && (
                    <div className="kyc-actions">
                      <button className="kyc-btn approve" onClick={() => handleReview(req.client.id, 'approve', req.category)}>
                        <i className="fa-solid fa-check" /> Approve
                      </button>
                      <button className="kyc-btn reject" onClick={() => handleReview(req.client.id, 'reject', req.category)}>
                        <i className="fa-solid fa-xmark" /> Reject
                      </button>
                    </div>
                  )}

                  {req.data.status === 'rejected' && (
                    <div className="kyc-reason">
                      <i className="fa-solid fa-circle-info" /> {req.data.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="kyc-pagination">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <i className="fa-solid fa-chevron-left" /> Prev
          </button>
          
          <div className="page-indicator">
            Page {currentPage} of {totalPages}
          </div>

          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}

      {/* Scoped Styling */}
      <style>{`
        .adm-toast {
          position: fixed; top: 24px; right: 24px; z-index: 9999;
          padding: 12px 20px; border-radius: 10px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 600;
          animation: toastIn 0.3s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .adm-toast.success { background: #0f2a1e; border: 1px solid #00cc88; color: #00cc88; }
        .adm-toast.error { background: #3a1515; border: 1px solid #ff4d4d; color: #ff4d4d; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }

        .adm-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .adm-page-title { font-size: 22px; font-weight: 800; color: #e0e6ed; display: flex; align-items: center; gap: 10px; }
        .adm-page-title i { color: #FF4D5E; }
        .adm-page-sub { font-size: 13px; color: #64748b; margin-top: 4px; }
        
        .adm-stat-pill {
          display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700;
          color: #ff4d4d; background: rgba(255,77,77,0.1); padding: 8px 16px; border-radius: 20px;
          border: 1px solid rgba(255,77,77,0.25);
        }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #ff4d4d; }
        .dot.pulse { animation: pulseRed 2s infinite; }
        @keyframes pulseRed { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .kyc-tabs {
          display: flex; gap: 12px; margin-bottom: 24px;
        }
        .kyc-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; background: #0f1520; border: 1px solid #2a3341;
          border-radius: 10px; color: #94a3b8; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;
        }
        .kyc-tab:hover { background: rgba(255, 77, 94, 0.05); color: #e0e6ed; }
        .kyc-tab.active { background: rgba(255, 77, 94, 0.1); border-color: rgba(255, 77, 94, 0.4); color: #FF4D5E; }
        
        .kyc-badge {
          background: #ff4d4d; color: #fff; padding: 2px 6px;
          border-radius: 6px; font-size: 10px; font-weight: 800;
        }

        .kyc-container {
          background: #0f1520; border: 1px solid #1e293b;
          border-radius: 16px; padding: 24px; min-height: 400px;
        }
        
        .kyc-empty {
          display: flex; flexDirection: column; align-items: center; justify-content: center;
          height: 300px; color: #64748b; font-size: 14px; font-weight: 600; text-align: center;
        }
        .empty-icon { font-size: 48px; opacity: 0.5; margin-bottom: 16px; }

        .kyc-list { display: flex; flex-direction: column; gap: 16px; }
        .kyc-card {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px; background: #1e293b; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .kyc-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }

        .kyc-card-left { display: flex; align-items: center; gap: 24px; flex: 1; }
        .kyc-avatar {
          width: 48px; height: 48px; border-radius: 10px; background: rgba(255, 77, 94, 0.1);
          color: #FF4D5E; display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 800;
        }
        .kyc-user-info h4 { margin: 0 0 4px 0; color: #e0e6ed; font-size: 15px; }
        .kyc-uid { font-size: 12px; color: #94a3b8; font-family: monospace; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px; }

        .kyc-doc-info { display: flex; flex-direction: column; gap: 4px; min-width: 140px; }
        .doc-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; }
        .doc-type { font-size: 13px; color: #e0e6ed; font-weight: 600; }
        .doc-date { font-size: 13px; color: #94a3b8; }

        .kyc-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
        .kyc-status-badge {
          padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .kyc-status-badge.pending { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }
        .kyc-status-badge.approved { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }
        .kyc-status-badge.rejected { background: rgba(2ef,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }

        .kyc-actions { display: flex; gap: 8px; }
        .kyc-btn {
          border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;
        }
        .kyc-btn.approve { background: #10b981; color: #fff; }
        .kyc-btn.approve:hover { background: #0d9668; }
        .kyc-btn.reject { background: transparent; border: 1px solid #ef4444; color: #ef4444; }
        .kyc-btn.reject:hover { background: rgba(239,68,68,0.1); }

        .kyc-reason { font-size: 12px; color: #ef4444; background: rgba(239,68,68,0.1); padding: 6px 12px; border-radius: 6px; max-width: 250px; text-align: right; }

        .kyc-pagination {
          display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 24px;
        }
        .kyc-pagination button {
          background: #1e293b; border: 1px solid #2a3341; color: #e0e6ed;
          padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 8px; transition: all 0.2s;
        }
        .kyc-pagination button:hover:not(:disabled) { background: #2a3341; border-color: #FF4D5E; color: #FF4D5E; }
        .kyc-pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
        .page-indicator { color: #94a3b8; font-size: 13px; font-weight: 600; }
      `}</style>
    </AdminLayout>
  );
};

export default Verifications;
