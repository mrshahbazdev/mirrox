import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

const Verifications = ({ onAdminLogout }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
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
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/clients');
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

  const handleReview = async (clientId, action) => {
    const reason = action === 'reject' ? window.prompt('Enter reason for rejection:') : null;
    if (action === 'reject' && reason === null) return; // User cancelled

    try {
      await axios.put(\`${import.meta.env.VITE_API_URL}/api/clients/${clientId}/kyc/review`, {
        action,
        rejectionReason: reason
      });
      showToast(`KYC successfully ${action}ed!`);
      fetchClients(); // Refresh list
    } catch (err) {
      showToast('Error updating KYC status', 'error');
    }
  };

  // Filter clients based on KYC status
  const filteredClients = clients.filter(c => {
    if (filterTab === 'all') return c.kyc?.status; // only those who applied at least once
    if (filterTab === 'pending') return c.kyc?.status === 'pending';
    if (filterTab === 'approved') return c.kyc?.status === 'approved';
    if (filterTab === 'rejected') return c.kyc?.status === 'rejected';
    return false;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE) || 1;
  const paginatedClients = filteredClients.slice(
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
          <p className="adm-page-sub">Review and verify client KYC documents to activate live accounts</p>
        </div>
        <div className="adm-stat-pill">
          <span className="dot pulse" /> {clients.filter(c => c.kyc?.status === 'pending').length} Pending
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
            {tab === 'pending' && <span className="kyc-badge">{clients.filter(c => c.kyc?.status === 'pending').length}</span>}
          </button>
        ))}
      </div>

      {/* Main List Area */}
      <div className="kyc-container">
        {filteredClients.length === 0 ? (
          <div className="kyc-empty">
            <i className="fa-solid fa-folder-open empty-icon" />
            <p>No KYC applications found for '{filterTab}' status.</p>
          </div>
        ) : (
          <div className="kyc-list">
            {paginatedClients.map(client => (
              <div className="kyc-card" key={client.id}>
                {/* Client Info Left */}
                <div className="kyc-card-left">
                  <div className="kyc-avatar">{client.name.charAt(0)}</div>
                  <div className="kyc-user-info">
                    <h4>{client.name}</h4>
                    <span className="kyc-uid">{client.uid}</span>
                  </div>
                  <div className="kyc-doc-info">
                    <div className="doc-label">Document Submitted</div>
                    <div className="doc-type"><i className="fa-solid fa-file-lines" /> {client.kyc.docType}</div>
                  </div>
                  <div className="kyc-doc-info">
                    <div className="doc-label">Date</div>
                    <div className="doc-date">{new Date(client.kyc.submittedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Status / Actions Right */}
                <div className="kyc-card-right">
                  <span className={`kyc-status-badge ${client.kyc.status}`}>
                    {client.kyc.status}
                  </span>
                  
                  {client.kyc.status === 'pending' && (
                    <div className="kyc-actions">
                      <button className="kyc-btn approve" onClick={() => handleReview(client.id, 'approve')}>
                        <i className="fa-solid fa-check" /> Approve
                      </button>
                      <button className="kyc-btn reject" onClick={() => handleReview(client.id, 'reject')}>
                        <i className="fa-solid fa-xmark" /> Reject
                      </button>
                    </div>
                  )}

                  {client.kyc.status === 'rejected' && (
                    <div className="kyc-reason">
                      <i className="fa-solid fa-circle-info" /> {client.kyc.rejectionReason}
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
        .adm-page-title i { color: #3291ff; }
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
        .kyc-tab:hover { background: rgba(50,145,255,0.05); color: #e0e6ed; }
        .kyc-tab.active { background: rgba(50,145,255,0.1); border-color: rgba(50,145,255,0.4); color: #3291ff; }
        
        .kyc-badge {
          background: #ff4d4d; color: #fff; padding: 2px 6px;
          border-radius: 6px; font-size: 10px; font-weight: 800;
        }

        .kyc-container {
          background: #0f1520; border: 1px solid #2a3341;
          border-radius: 14px; min-height: 400px;
        }
        
        .kyc-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          height: 400px; color: #64748b; font-size: 14px; font-weight: 600;
        }
        .empty-icon { font-size: 48px; color: #1c222d; margin-bottom: 16px; }

        .kyc-list { display: flex; flex-direction: column; }
        
        .kyc-card {
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
        }
        .kyc-card:last-child { border-bottom: none; }
        .kyc-card:hover { background: rgba(50,145,255,0.02); }

        .kyc-card-left { display: flex; align-items: center; gap: 32px; }
        .kyc-avatar {
          width: 48px; height: 48px; border-radius: 12px;
          background: rgba(50,145,255,0.1); border: 1px solid rgba(50,145,255,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #3291ff; font-size: 18px; font-weight: 800; text-transform: uppercase;
        }
        .kyc-user-info h4 { margin: 0 0 4px 0; font-size: 15px; color: #e0e6ed; font-weight: 700; }
        .kyc-uid { font-size: 12px; color: #64748b; font-family: 'Space Mono', monospace; }
        
        .kyc-doc-info { display: flex; flex-direction: column; gap: 4px; padding-left: 32px; border-left: 1px solid rgba(255,255,255,0.05); }
        .doc-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .doc-type { font-size: 13px; color: #e0e6ed; font-weight: 600; display: flex; align-items: center; gap: 6px; }
        .doc-date { font-size: 13px; color: #94a3b8; font-family: 'Space Mono', monospace; }

        .kyc-card-right { display: flex; align-items: center; gap: 20px; }
        
        .kyc-status-badge {
          padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .kyc-status-badge.pending { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }
        .kyc-status-badge.approved { background: rgba(0,204,136,0.1); color: #00cc88; border: 1px solid rgba(0,204,136,0.2); }
        .kyc-status-badge.rejected { background: rgba(255,77,77,0.1); color: #ff4d4d; border: 1px solid rgba(255,77,77,0.2); }

        .kyc-actions { display: flex; gap: 8px; }
        .kyc-btn {
          display: flex; align-items: center; gap: 6px; padding: 8px 16px;
          border-radius: 8px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s;
        }
        .kyc-btn.approve { background: rgba(0,204,136,0.15); color: #00cc88; }
        .kyc-btn.approve:hover { background: #00cc88; color: #fff; }
        .kyc-btn.reject { background: rgba(255,77,77,0.15); color: #ff4d4d; }
        .kyc-btn.reject:hover { background: #ff4d4d; color: #fff; }

        .kyc-reason { color: #ff4d4d; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; }

        .kyc-pagination {
          display: flex; align-items: center; justify-content: center; gap: 16px;
          margin-top: 24px; padding: 16px; background: #0f1520;
          border: 1px solid #2a3341; border-radius: 12px;
        }
        .kyc-pagination button {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: #e0e6ed; padding: 8px 16px; border-radius: 8px;
          font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 8px;
        }
        .kyc-pagination button:hover:not(:disabled) { background: #3291ff; border-color: #3291ff; color: #fff; }
        .kyc-pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
        .page-indicator { color: #94a3b8; font-size: 13px; font-weight: 700; }
      `}</style>
    </AdminLayout>
  );
};

export default Verifications;
