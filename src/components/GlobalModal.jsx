import React from 'react';
import { useModal } from '../context/ModalContext';

const GlobalModal = () => {
  const { modal, closeModal, setModal } = useModal();
  const { isOpen, type, title, message, status, onConfirm, onCancel, placeholder, inputValue } = modal;

  if (!isOpen) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--danger)';
      case 'warning': return 'var(--warning)';
      case 'info':
      default: return 'var(--accent)';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return 'fa-circle-check';
      case 'error': return 'fa-circle-xmark';
      case 'warning': return 'fa-triangle-exclamation';
      case 'info':
      default: return 'fa-circle-info';
    }
  };

  return (
    <div className="glb-modal-overlay">
      <div className={`glb-modal ${type === 'prompt' ? 'prompt' : ''}`}>
        <div className="glb-modal-glow" style={{ background: `radial-gradient(circle at center, ${getStatusColor()}15 0%, transparent 70%)` }} />
        
        <div className="glb-modal-content">
          <div className="glb-modal-header">
            <div className="glb-status-icon" style={{ color: getStatusColor(), background: `${getStatusColor()}10` }}>
              <i className={`fa-solid ${getStatusIcon()}`} />
            </div>
            <h3>{title}</h3>
          </div>

          <div className="glb-modal-body">
            <p>{message}</p>
            {type === 'prompt' && (
              <div className="glb-input-wrap">
                <input 
                  type="text" 
                  autoFocus
                  placeholder={placeholder || 'Type here...'}
                  value={modal.inputValue || ''}
                  onChange={(e) => {
                    setModal(prev => ({ ...prev, inputValue: e.target.value }));
                  }} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onConfirm(modal.inputValue);
                  }}
                  id="glb-prompt-input"
                  className="glb-prompt-input"
                />
              </div>
            )}
          </div>

          <div className="glb-modal-footer">
            {(type === 'confirm' || type === 'prompt') && (
              <button className="glb-btn glb-btn-cancel" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button 
              className="glb-btn glb-btn-confirm" 
              style={{ background: getStatusColor() }}
              onClick={() => {
                if (type === 'prompt') {
                  onConfirm(modal.inputValue);
                } else {
                  onConfirm();
                }
              }}
            >
              {type === 'confirm' ? 'Confirm' : 'OK'}
            </button>
          </div>
        </div>

        <style>{`
          .glb-modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(12px);
            display: flex; align-items: center; justify-content: center;
            z-index: 99999; animation: glbFadeIn 0.3s ease;
          }
          .glb-modal {
            background: var(--bg-card); border: 1px solid var(--border);
            width: 90%; max-width: 400px; border-radius: 28px;
            position: relative; overflow: hidden;
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.1);
            animation: glbPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .glb-modal-glow {
            position: absolute; top: -50%; left: -50%; right: -50%; bottom: -50%;
            pointer-events: none; z-index: 0;
          }
          .glb-modal-content { position: relative; z-index: 1; padding: 32px; }
          .glb-modal-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 24px; }
          .glb-status-icon {
            width: 64px; height: 64px; border-radius: 20px;
            display: flex; align-items: center; justify-content: center;
            font-size: 28px; margin-bottom: 16px;
          }
          .glb-modal-header h3 { margin: 0; font-size: 22px; color: var(--text-main); font-weight: 800; }
          .glb-modal-body { text-align: center; margin-bottom: 32px; }
          .glb-modal-body p { color: var(--text-muted); line-height: 1.6; font-size: 15px; margin: 0; }
          
          .glb-input-wrap { margin-top: 20px; }
          .glb-prompt-input {
            width: 100%; background: var(--bg-hover); border: 1px solid var(--border);
            padding: 14px; border-radius: 12px; color: var(--text-main); font-family: inherit; font-size: 14px;
            outline: none; transition: 0.2s;
          }
          .glb-prompt-input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-muted); }

          .glb-modal-footer { display: flex; gap: 12px; }
          .glb-btn {
            flex: 1; padding: 14px; border-radius: 14px; border: none;
            font-weight: 700; cursor: pointer; transition: 0.2s; font-size: 14px;
          }
          .glb-btn-cancel { background: var(--bg-hover); color: var(--text-muted); }
          .glb-btn-cancel:hover { background: var(--border); color: var(--text-main); }
          .glb-btn-confirm { color: #fff; }
          .glb-btn-confirm:hover { filter: brightness(1.1); transform: translateY(-1px); }

          @keyframes glbFadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes glbPop { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        `}</style>
      </div>
    </div>
  );
};

export default GlobalModal;
