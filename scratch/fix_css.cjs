const fs = require('fs');
let content = fs.readFileSync('c:/sites/mirrox/src/index.css', 'utf8');

// The file currently has a broken state around line 2700. We will just use regex to target the breakage.
// Target 1: Find `.transaction-row` and its surroundings to truncate the broken part until `.finance-action-btn`.
let idx1 = content.indexOf('.transaction-row {');
let idx2 = content.indexOf('.finance-action-btn {');

if (idx1 !== -1 && idx2 !== -1) {
  let goodStr = `.transaction-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.transaction-row:hover {
  background: rgba(255, 255, 255, 0.03);
  transform: translateX(4px);
}

.status-pill {
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-pill::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.status-approved::before { background: #10b981; box-shadow: 0 0 10px #10b981; }

.status-pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.status-pending::before { background: #f59e0b; box-shadow: 0 0 10px #f59e0b; animation: statusPulse 2s infinite; }

.status-rejected { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.status-rejected::before { background: #ef4444; }

@keyframes statusPulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

.mobile-finances {
  background: var(--bg-deep);
  min-height: 100%;
}

.desktop-finances-container {
  background: #020617;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-image: 
    radial-gradient(circle at 0% 0%, rgba(79, 70, 229, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, rgba(219, 39, 119, 0.05) 0%, transparent 50%);
}

.finance-glass-card {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

@media (min-width: 1280px) {
  .finance-glass-card {
    padding: 2.5rem;
  }
}

`;
  
  let before = content.substring(0, idx1);
  let after = content.substring(idx2);
  fs.writeFileSync('c:/sites/mirrox/src/index.css', before + goodStr + after, 'utf8');
  console.log('Restoration success!');
} else {
  console.log('Failed to find indexes.');
}
