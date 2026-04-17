import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useModal } from '../../context/ModalContext';

const categoryColors = {
  Forex: { color: '#FF4D5E', bg: 'rgba(255, 77, 94, 0.1)' },
  Metals: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Crypto: { color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  Indices: { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
};

const SymbolsManager = ({ onAdminLogout }) => {
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showConfirm } = useModal();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSym, setNewSym] = useState({
    symbol: '',
    name: '',
    category: 'Forex',
    spread: 10,
    commission: 5
  });

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/symbols');
        setSymbols(res.data);
      } catch (err) {
        console.error('Failed to load symbols', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSymbols();
  }, []);

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const categories = ['all', ...new Set(symbols.map((s) => s.category))];

  const filtered = symbols.filter((s) => {
    const matchCat = filterCat === 'all' || s.category === filterCat;
    const matchSearch =
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const startEdit = (sym) => {
    setEditingId(sym.id);
    setEditData({
      spread: sym.spread,
      commission: sym.commission,
      lotMin: sym.lotMin,
      lotStep: sym.lotStep,
      lotMax: sym.lotMax,
      swapRate: sym.swapRate || 0,
    });
  };

  const handleAddSymbol = async () => {
    try {
       const res = await axios.post(import.meta.env.VITE_API_URL + '/api/symbols', newSym);
       setSymbols([...symbols, res.data]);
       setShowAddModal(false);
       setNewSym({ symbol: '', name: '', category: 'Forex', spread: 10, commission: 5 });
       showToast('New instrument active!');
    } catch (err) {
       console.error('Add failed', err);
       showToast('Failed to list new symbol.');
    }
  };

  const deleteSymbol = async (id) => {
    showConfirm(
      'Delist this symbol? All current trades for this pair will remain but no new ones can be opened.',
      'Delist Instrument',
      async () => {
        try {
           await axios.delete(`${import.meta.env.VITE_API_URL}/api/symbols/${id}`);
           setSymbols(prev => prev.filter(s => s.id !== id));
           showToast('Symbol delisted.');
        } catch (err) {
           console.error('Delete failed', err);
           showToast('Failed to delist.');
        }
      }
    );
  };

  const saveEdit = async (id) => {
    try {
      const payload = {
         spread: +editData.spread,
         commission: +editData.commission,
         lotMin: +editData.lotMin,
         lotStep: +editData.lotStep,
         lotMax: +editData.lotMax,
         swapRate: +editData.swapRate
      };
      
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/symbols/${id}`, payload);
      
      setSymbols((prev) => prev.map((s) => s.id === id ? res.data : s));
      setEditingId(null);
      showToast('Symbol updated successfully!');
    } catch (err) {
      console.error('Failed to save symbol edit', err);
      showToast('Failed to update symbol.');
    }
  };

  if (loading) {
     return (
       <AdminLayout onAdminLogout={onAdminLogout}>
         <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
           <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 40, marginBottom: 16, display: 'block' }} />
           <p style={{ fontSize: 18, fontWeight: 700, color: '#e0e6ed' }}>Loading Symbols Config...</p>
         </div>
       </AdminLayout>
     );
  }

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      {toast && (
        <div className="adm-toast success">
          <i className="fa-solid fa-circle-check" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="adm-page-header">
        <div>
          <h2 className="adm-page-title">
            <i className="fa-solid fa-coins" /> Instruments & Symbols
          </h2>
          <p className="adm-page-sub">Manage spread, commission and lot sizes per instrument</p>
        </div>
        <button className="adm-btn-create" onClick={() => setShowAddModal(true)}>
           <i className="fa-solid fa-plus" /> Add New Instrument
        </button>
      </div>

      {/* ADD SYMBOL MODAL */}
      {showAddModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal glass" style={{ width: 500 }}>
             <div className="adm-modal-header">
                <h3>Create New Instrument</h3>
                <button className="close-btn" onClick={() => setShowAddModal(false)}><i className="fa-solid fa-xmark" /></button>
             </div>
             <div className="adm-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                   <div>
                      <label>Symbol (e.g. USOIL)</label>
                      <input type="text" value={newSym.symbol} onChange={(e) => setNewSym({...newSym, symbol: e.target.value.toUpperCase()})} />
                   </div>
                   <div>
                      <label>Category</label>
                      <select value={newSym.category} onChange={(e) => setNewSym({...newSym, category: e.target.value})}>
                         <option value="Forex">Forex</option>
                         <option value="Crypto">Crypto</option>
                         <option value="Metals">Metals</option>
                         <option value="Indices">Indices</option>
                      </select>
                   </div>
                </div>
                <div style={{ marginTop: 12 }}>
                   <label>Common Name (e.g. Crude Oil)</label>
                   <input type="text" value={newSym.name} onChange={(e) => setNewSym({...newSym, name: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                   <div><label>Spread (pts)</label><input type="number" value={newSym.spread} onChange={(e) => setNewSym({...newSym, spread: +e.target.value})} /></div>
                   <div><label>Commission</label><input type="number" value={newSym.commission} onChange={(e) => setNewSym({...newSym, commission: +e.target.value})} /></div>
                </div>
                <div style={{ marginTop: 16 }}>
                   <button className="adm-btn-submit" onClick={handleAddSymbol} style={{ width: '100%', padding: 14 }}>Create Symbol</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="adm-filter-bar">
        <div className="adm-search-wrap">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search symbol or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="adm-status-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`adm-filter-pill ${filterCat === cat ? 'active' : ''}`}
              onClick={() => setFilterCat(cat)}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Symbols Table */}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Category</th>
              <th>Spread (pts)</th>
              <th>Commission</th>
              <th>Lot Min</th>
              <th>Lot Step</th>
              <th>Lot Max</th>
              <th>Swap Rate</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sym) => {
              const isEditing = editingId === sym.id;
              const catStyle = categoryColors[sym.category] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
              return (
                <tr className="adm-table-row" key={sym.id}>
                  <td>
                    <div className="sym-name-cell">
                      <div className="sym-icon-box" style={{ background: catStyle.bg, color: catStyle.color }}>
                        {sym.symbol.substring(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#e0e6ed', fontSize: 14 }}>{sym.symbol}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{sym.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="sym-cat-badge" style={{ color: catStyle.color, background: catStyle.bg }}>
                      {sym.category}
                    </span>
                  </td>

                  {/* Editable Fields */}
                  {['spread', 'commission', 'lotMin', 'lotStep', 'lotMax', 'swapRate'].map((field) => (
                    <td key={field}>
                      {isEditing ? (
                        <input
                          type="number"
                          className="sym-edit-input"
                          value={editData[field]}
                          onChange={(e) => setEditData((prev) => ({ ...prev, [field]: e.target.value }))}
                          step={field.startsWith('lot') || field === 'swapRate' ? 0.01 : 1}
                          min={0}
                        />
                      ) : (
                        <span className="adm-mono" style={{ fontSize: 13, color: field === 'swapRate' ? '#f59e0b' : 'inherit' }}>
                          {sym[field]}
                        </span>
                      )}
                    </td>
                  ))}

                  <td>
                    <span className={`cd-trade-status ${sym.commissionType === 'spread-only' ? 'open' : 'approved'}`}>
                      {sym.commissionType === 'spread-only' ? 'Spread Only' : 'Standard'}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="adm-act-btn approve" onClick={() => saveEdit(sym.id)}>
                          <i className="fa-solid fa-check" />
                        </button>
                        <button className="adm-act-btn reject" onClick={() => setEditingId(null)}>
                          <i className="fa-solid fa-xmark" />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="adm-act-btn view" onClick={() => startEdit(sym)}>
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button className="adm-act-btn reject" onClick={() => deleteSymbol(sym.id)}>
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Panel - Like image shows for Gold */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 20 }}>
        {filtered.slice(0, 3).map((sym) => {
          const catStyle = categoryColors[sym.category] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
          return (
            <div className="sym-detail-card" key={sym.id}>
              <div className="sym-detail-header">
                <div className="sym-icon-box lg" style={{ background: catStyle.bg, color: catStyle.color }}>
                  {sym.symbol.substring(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#e0e6ed', fontSize: 16 }}>{sym.symbol}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{sym.name}</div>
                </div>
              </div>
              <div className="sym-detail-grid">
                <div className="sym-detail-item">
                  <div className="cd-acc-label">Spread</div>
                  <div className="cd-acc-value" style={{ fontSize: 14 }}>{sym.spread.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Val: {(sym.spread * 0.1).toFixed(0)}</div>
                </div>
                <div className="sym-detail-item">
                  <div className="cd-acc-label">Commission</div>
                  <div className="cd-acc-value" style={{ fontSize: 14 }}>
                    {sym.commissionType === 'spread-only' ? (
                      <span style={{ color: '#64748b', fontSize: 12 }}>0 (spread-only)</span>
                    ) : sym.commission.toLocaleString()}
                  </div>
                </div>
                <div className="sym-detail-item" style={{ background: 'rgba(245,158,11,0.07)', borderColor: 'rgba(245,158,11,0.2)' }}>
                  <div className="cd-acc-label" style={{ color: '#f59e0b' }}>Lot Sizes</div>
                  <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: 14 }}>
                    {sym.lotMax} / {sym.lotStep} / {sym.lotMin}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>max / step / min</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
        @keyframes toastIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }

        .adm-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .adm-page-title { font-size: 22px; font-weight: 800; color: #e0e6ed; display: flex; align-items: center; gap: 10px; }
        .adm-page-title i { color: #FF4D5E; }
        .adm-page-sub { font-size: 13px; color: #64748b; margin-top: 4px; }

        .adm-filter-bar { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
        .adm-search-wrap {
          position: relative; flex: 1; min-width: 220px;
          background: #0f1520; border: 1px solid #2a3341; border-radius: 10px;
          display: flex; align-items: center; transition: all 0.2s;
        }
        .adm-search-wrap:focus-within { border-color: rgba(255, 77, 94, 0.4); }
        .adm-search-wrap i { position: absolute; left: 14px; color: #4a5568; font-size: 13px; }
        .adm-search-wrap input {
          width: 100%; padding: 11px 14px 11px 40px;
          background: transparent; border: none; outline: none;
          color: #e0e6ed; font-size: 13px; font-family: 'Inter', sans-serif;
        }
        .adm-search-wrap input::placeholder { color: #4a5568; }

        .adm-status-filters { display: flex; gap: 6px; }
        .adm-filter-pill {
          padding: 8px 16px; border-radius: 8px;
          background: #0f1520; border: 1px solid #2a3341;
          color: #64748b; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;
        }
        .adm-filter-pill:hover { color: #e0e6ed; }
        .adm-filter-pill.active { background: rgba(255, 77, 94, 0.12); border-color: rgba(255, 77, 94, 0.35); color: #FF4D5E; }

        .adm-table-wrap {
          background: #0f1520; border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px; overflow: hidden; margin-bottom: 0;
        }
        .adm-table { width: 100%; border-collapse: collapse; }
        .adm-table thead tr { background: rgba(255, 77, 94, 0.05); border-bottom: 1px solid rgba(255, 77, 94, 0.1); }
        .adm-table th { padding: 14px 18px; text-align: left; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; }
        .adm-table-row { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.15s; }
        .adm-table-row:hover { background: rgba(255, 77, 94, 0.03); }
        .adm-table-row:last-child { border-bottom: none; }
        .adm-table td { padding: 14px 18px; font-size: 13px; color: #94a3b8; }

        .sym-name-cell { display: flex; align-items: center; gap: 12px; }
        .sym-icon-box {
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; flex-shrink: 0;
        }
        .sym-icon-box.lg { width: 48px; height: 48px; font-size: 14px; }

        .sym-cat-badge {
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
        }

        .sym-edit-input {
          width: 80px; padding: 6px 10px;
          background: rgba(255, 77, 94, 0.08);
          border: 1px solid rgba(255, 77, 94, 0.3);
          border-radius: 6px; color: #e0e6ed;
          font-size: 13px; font-family: 'Space Mono', monospace;
          outline: none;
        }
        .sym-edit-input:focus { border-color: #FF4D5E; box-shadow: 0 0 0 2px rgba(255, 77, 94, 0.15); }

        .adm-act-btn {
          width: 30px; height: 30px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid transparent; cursor: pointer; font-size: 12px; transition: all 0.2s;
        }
        .adm-act-btn.view { background: rgba(255, 77, 94, 0.1); color: #FF4D5E; border-color: rgba(255, 77, 94, 0.2); }
        .adm-act-btn.view:hover { background: #FF4D5E; color: #fff; }
        .adm-act-btn.approve { background: rgba(0,204,136,0.1); color: #00cc88; border-color: rgba(0,204,136,0.2); }
        .adm-act-btn.approve:hover { background: #00cc88; color: #fff; }
        .adm-act-btn.reject { background: rgba(255,77,77,0.1); color: #ff4d4d; border-color: rgba(255,77,77,0.2); }
        .adm-act-btn.reject:hover { background: #ff4d4d; color: #fff; }

        .adm-btn-create {
          display: flex; align-items: center; gap: 8px;
          background: #FF4D5E; color: #fff; border: none;
          padding: 10px 18px; border-radius: 8px; font-weight: 700;
          font-size: 13px; cursor: pointer; transition: all 0.2s;
        }
        .adm-btn-create:hover { transform: translateY(-1px); background: #D43A4A; }

        .adm-modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 10000;
        }
        .adm-modal {
          background: #0a0e17; border-radius: 20px; padding: 24px;
        }
        .adm-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .adm-modal-header h3 { margin: 0; font-size: 20px; font-weight: 800; color: #fff; }
        .adm-modal-header .close-btn { background: none; border: none; color: #64748b; cursor: pointer; font-size: 18px; }
        .adm-modal-body label { display: block; font-size: 12px; color: #64748b; margin-bottom: 6px; font-weight: 700; }
        .adm-modal-body input, .adm-modal-body select {
          width: 100%; padding: 12px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          color: #fff; font-size: 14px; outline: none; margin-bottom: 12px;
        }
        .adm-btn-submit { background: #FF4D5E; color: #fff; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .adm-btn-submit:hover { background: #D43A4A; }

        .cd-trade-status {
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
        }
        .cd-trade-status.open { background: rgba(255, 77, 94, 0.1); color: #FF4D5E; }
        .cd-trade-status.approved { background: rgba(0,204,136,0.1); color: #00cc88; }

        .adm-mono { font-family: 'Space Mono', monospace; }

        /* Bottom detail cards */
        .sym-detail-card {
          background: #0f1520; border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px; padding: 20px;
        }
        .sym-detail-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .sym-detail-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .sym-detail-item {
          padding: 12px; border-radius: 8px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
        }
        .cd-acc-label { font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 4px; }
        .cd-acc-value { font-size: 16px; font-weight: 800; color: #e0e6ed; font-family: 'Space Mono', monospace; }
      `}</style>
    </AdminLayout>
  );
};

export default SymbolsManager;
