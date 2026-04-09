import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useTrading } from '../../context/TradingContext';

const statusConfig = {
  active: { label: 'Active', color: '#00cc88', bg: 'rgba(0,204,136,0.1)', border: 'rgba(0,204,136,0.25)' },
  pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  suspended: { label: 'Suspended', color: '#ff4d4d', bg: 'rgba(255,77,77,0.1)', border: 'rgba(255,77,77,0.25)' },
};

const PAGE_SIZE = 8;

const ClientsList = ({ onAdminLogout }) => {
  const navigate = useNavigate();
  const { allClients } = useTrading();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [staticClients, setStaticClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Merge static API clients with real-time socket data
  const clients = staticClients.map(sc => {
    const rc = allClients.find(c => c.id === sc.id);
    return rc ? { ...sc, ...rc } : sc;
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/clients');
        setStaticClients(res.data);
      } catch (err) {
        showToast('Failed to load clients', 'warn');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.uid.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [clients, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleApprove = async (id) => {
    try {
      await axios.put(\`${import.meta.env.VITE_API_URL}/api/clients/${id}`, { status: 'active' });
      setStaticClients((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'active' } : c)));
      showToast('Client approved successfully');
    } catch (err) {
      showToast('Failed to approve client', 'warn');
    }
  };

  const handleSuspend = async (id) => {
    try {
      await axios.put(\`${import.meta.env.VITE_API_URL}/api/clients/${id}`, { status: 'suspended' });
      setStaticClients((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'suspended' } : c)));
      showToast('Client suspended', 'warn');
    } catch (err) {
      showToast('Failed to suspend client', 'warn');
    }
  };

  const handleExportCSV = () => {
    const headers = ['UID,Name,Email,Contact,Status,Balance,P&L'];
    const rows = filtered.map((c) =>
      `${c.uid},${c.name},${c.email},${c.contact},${c.status},${c.accountSummary.deposit},${c.accountSummary.profitLoss}`
    );
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mirrox_clients.csv';
    a.click();
    showToast('CSV exported!');
  };

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === 'active').length,
    pending: clients.filter((c) => c.status === 'pending').length,
    suspended: clients.filter((c) => c.status === 'suspended').length,
  };

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      {/* Toast */}
      {toast && (
        <div className={`adm-toast ${toast.type}`}>
          <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`} />
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <h2 className="adm-page-title">
            <i className="fa-solid fa-users" /> Client Management
          </h2>
          <p className="adm-page-sub">Manage all registered trading clients</p>
        </div>
        <button className="adm-export-btn" onClick={handleExportCSV}>
          <i className="fa-solid fa-file-csv" /> Export CSV
        </button>
      </div>

      {/* Stats Row */}
      <div className="adm-stats-row">
        {[
          { label: 'Total Clients', value: stats.total, icon: 'fa-users', color: '#3291ff' },
          { label: 'Active', value: stats.active, icon: 'fa-circle-check', color: '#00cc88' },
          { label: 'Pending', value: stats.pending, icon: 'fa-clock', color: '#f59e0b' },
          { label: 'Suspended', value: stats.suspended, icon: 'fa-ban', color: '#ff4d4d' },
        ].map((s) => (
          <div className="adm-stat-card" key={s.label}>
            <div className="adm-stat-icon" style={{ color: s.color, background: `${s.color}15` }}>
              <i className={`fa-solid ${s.icon}`} />
            </div>
            <div>
              <div className="adm-stat-val">{s.value}</div>
              <div className="adm-stat-lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter / Search Bar */}
      <div className="adm-filter-bar">
        <div className="adm-search-wrap">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search by name, UID or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button className="adm-clear-btn" onClick={() => setSearch('')}>
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        <div className="adm-status-filters">
          {['all', 'active', 'pending', 'suspended'].map((s) => (
            <button
              key={s}
              className={`adm-filter-pill ${filterStatus === s ? 'active' : ''}`}
              onClick={() => { setFilterStatus(s); setPage(1); }}
            >
              {s === 'all' ? 'All' : statusConfig[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>UID</th>
              <th>Contact</th>
              <th>Balance</th>
              <th>Margin Level</th>
              <th>P / L</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="adm-no-data">
                  <i className="fa-solid fa-spinner fa-spin" /> Fetching clients...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="8" className="adm-no-data">
                  <i className="fa-solid fa-circle-info" /> No clients found
                </td>
              </tr>
            ) : (
              paginated.map((client) => {
                const st = statusConfig[client.status] || { label: client.status, color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' };
                const pl = client.accountSummary?.profitLoss || 0;
                return (
                  <tr key={client.id} className="adm-table-row">
                    <td>
                      <div className="adm-client-cell">
                        <div className="adm-avatar-circle">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <div className="adm-client-name">{client.name}</div>
                          <div className="adm-client-email">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="adm-uid-badge">{client.uid}</span></td>
                    <td className="adm-contact">{client.contact}</td>
                    <td className="adm-mono">${(client.accountSummary?.deposit || 0).toLocaleString()}</td>
                    <td className="adm-mono">{client.accountSummary?.marginLevel || 0}%</td>
                    <td className={`adm-mono adm-pl ${pl >= 0 ? 'pos' : 'neg'}`}>
                      {pl >= 0 ? '+' : ''}{pl.toFixed(2)}
                    </td>
                    <td>
                      <span
                        className="adm-status-badge"
                        style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}
                      >
                        <span className="adm-status-dot" style={{ background: st.color }} />
                        {st.label}
                      </span>
                    </td>
                    <td>
                      <div className="adm-action-btns">
                        <button
                          className="adm-act-btn view"
                          onClick={() => navigate(`/admin/client/${client.id}`)}
                          title="View Client"
                        >
                          <i className="fa-solid fa-eye" />
                        </button>
                        {client.status !== 'active' && (
                          <button
                            className="adm-act-btn approve"
                            onClick={() => handleApprove(client.id)}
                            title="Approve"
                          >
                            <i className="fa-solid fa-check" />
                          </button>
                        )}
                        {client.status !== 'suspended' && (
                          <button
                            className="adm-act-btn reject"
                            onClick={() => handleSuspend(client.id)}
                            title="Suspend"
                          >
                            <i className="fa-solid fa-ban" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="adm-pagination">
          <span className="adm-page-info">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="adm-page-btns">
            <button
              className="adm-pg-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`adm-pg-btn ${p === page ? 'active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="adm-pg-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .adm-toast {
          position: fixed; top: 24px; right: 24px; z-index: 9999;
          padding: 12px 20px; border-radius: 10px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 600;
          animation: toastIn 0.3s ease;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .adm-toast.success { background: #0f2a1e; border: 1px solid #00cc88; color: #00cc88; }
        .adm-toast.warn { background: #2a1a0a; border: 1px solid #f59e0b; color: #f59e0b; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }

        .adm-page-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 24px;
        }
        .adm-page-title {
          font-size: 22px; font-weight: 800; color: #e0e6ed;
          display: flex; align-items: center; gap: 10px;
        }
        .adm-page-title i { color: #3291ff; }
        .adm-page-sub { font-size: 13px; color: #64748b; margin-top: 4px; }

        .adm-export-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 10px;
          background: rgba(50,145,255,0.1);
          border: 1px solid rgba(50,145,255,0.25);
          color: #3291ff; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .adm-export-btn:hover {
          background: rgba(50,145,255,0.2);
          box-shadow: 0 0 15px rgba(50,145,255,0.15);
        }

        .adm-stats-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 24px;
        }
        .adm-stat-card {
          display: flex; align-items: center; gap: 16px;
          padding: 20px 24px;
          background: #0f1520;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          transition: all 0.2s;
        }
        .adm-stat-card:hover { border-color: rgba(50,145,255,0.15); transform: translateY(-1px); }
        .adm-stat-icon {
          width: 44px; height: 44px;
          border-radius: 10px; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
        }
        .adm-stat-val { font-size: 26px; font-weight: 800; color: #e0e6ed; line-height: 1; }
        .adm-stat-lbl { font-size: 12px; color: #64748b; margin-top: 4px; font-weight: 600; }

        .adm-filter-bar {
          display: flex; gap: 12px; align-items: center;
          margin-bottom: 20px; flex-wrap: wrap;
        }
        .adm-search-wrap {
          position: relative; flex: 1; min-width: 260px;
          background: #0f1520;
          border: 1px solid #2a3341; border-radius: 10px;
          display: flex; align-items: center;
          transition: all 0.2s;
        }
        .adm-search-wrap:focus-within {
          border-color: rgba(50,145,255,0.4);
          box-shadow: 0 0 0 3px rgba(50,145,255,0.08);
        }
        .adm-search-wrap i {
          position: absolute; left: 14px; color: #4a5568; font-size: 13px;
        }
        .adm-search-wrap input {
          width: 100%; padding: 11px 40px 11px 40px;
          background: transparent; border: none; outline: none;
          color: #e0e6ed; font-size: 13px; font-family: 'Inter', sans-serif;
        }
        .adm-search-wrap input::placeholder { color: #4a5568; }
        .adm-clear-btn {
          position: absolute; right: 12px;
          background: none; border: none; color: #4a5568;
          cursor: pointer; padding: 4px; font-size: 12px;
        }
        .adm-clear-btn:hover { color: #e0e6ed; }

        .adm-status-filters { display: flex; gap: 6px; }
        .adm-filter-pill {
          padding: 8px 16px; border-radius: 8px;
          background: #0f1520; border: 1px solid #2a3341;
          color: #64748b; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Inter', sans-serif; text-transform: capitalize;
        }
        .adm-filter-pill:hover { color: #e0e6ed; border-color: #3a4555; }
        .adm-filter-pill.active {
          background: rgba(50,145,255,0.12);
          border-color: rgba(50,145,255,0.35);
          color: #3291ff;
        }

        .adm-table-wrap {
          background: #0f1520;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px; overflow: hidden;
          margin-bottom: 20px;
        }
        .adm-table {
          width: 100%; border-collapse: collapse;
        }
        .adm-table thead tr {
          background: rgba(50,145,255,0.05);
          border-bottom: 1px solid rgba(50,145,255,0.1);
        }
        .adm-table th {
          padding: 14px 20px; text-align: left;
          font-size: 11px; font-weight: 800;
          color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;
        }
        .adm-table-row {
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background 0.15s;
        }
        .adm-table-row:hover { background: rgba(50,145,255,0.04); }
        .adm-table-row:last-child { border-bottom: none; }
        .adm-table td { padding: 16px 20px; font-size: 13px; color: #94a3b8; }

        .adm-client-cell { display: flex; align-items: center; gap: 12px; }
        .adm-avatar-circle {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #3291ff22, #3291ff44);
          border: 1px solid rgba(50,145,255,0.3);
          color: #3291ff; font-size: 15px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .adm-client-name { font-size: 14px; font-weight: 700; color: #e0e6ed; }
        .adm-client-email { font-size: 12px; color: #64748b; margin-top: 2px; }

        .adm-uid-badge {
          padding: 3px 10px; border-radius: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid #2a3341;
          font-size: 12px; font-weight: 700;
          color: #94a3b8; font-family: 'Space Mono', monospace;
        }
        .adm-contact { font-size: 12px; }
        .adm-mono { font-family: 'Space Mono', monospace; font-size: 13px; }
        .adm-pl.pos { color: #00cc88; font-weight: 700; }
        .adm-pl.neg { color: #ff4d4d; font-weight: 700; }

        .adm-status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
        }
        .adm-status-dot { width: 6px; height: 6px; border-radius: 50%; }

        .adm-action-btns { display: flex; gap: 6px; }
        .adm-act-btn {
          width: 30px; height: 30px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid transparent; cursor: pointer;
          font-size: 12px; transition: all 0.2s;
        }
        .adm-act-btn.view { background: rgba(50,145,255,0.1); color: #3291ff; border-color: rgba(50,145,255,0.2); }
        .adm-act-btn.view:hover { background: #3291ff; color: #fff; }
        .adm-act-btn.approve { background: rgba(0,204,136,0.1); color: #00cc88; border-color: rgba(0,204,136,0.2); }
        .adm-act-btn.approve:hover { background: #00cc88; color: #fff; }
        .adm-act-btn.reject { background: rgba(255,77,77,0.1); color: #ff4d4d; border-color: rgba(255,77,77,0.2); }
        .adm-act-btn.reject:hover { background: #ff4d4d; color: #fff; }

        .adm-no-data {
          text-align: center; padding: 48px; color: #4a5568;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 14px;
        }

        .adm-pagination {
          display: flex; align-items: center; justify-content: space-between;
        }
        .adm-page-info { font-size: 13px; color: #64748b; }
        .adm-page-btns { display: flex; gap: 6px; }
        .adm-pg-btn {
          width: 34px; height: 34px; border-radius: 8px;
          background: #0f1520; border: 1px solid #2a3341;
          color: #94a3b8; font-size: 13px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; font-family: 'Inter', sans-serif;
        }
        .adm-pg-btn:hover:not(:disabled) { border-color: #3291ff; color: #3291ff; }
        .adm-pg-btn.active { background: #3291ff; border-color: #3291ff; color: #fff; }
        .adm-pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>
    </AdminLayout>
  );
};

export default ClientsList;
