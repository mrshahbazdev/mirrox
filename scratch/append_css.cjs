const fs = require('fs');
let content = fs.readFileSync('c:/sites/mirrox/src/index.css', 'utf8');

const newCSS = \`
/* =========================================
   DASHBOARD - Mobile Equity Card
   ========================================= */

.dashboard-equity-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  padding: 1.25rem;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.2);
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
}

.dashboard-equity-card::before {
  content: '';
  position: absolute;
  top: -3rem;
  right: -3rem;
  width: 8rem;
  height: 8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  filter: blur(20px);
  pointer-events: none;
}

.equity-card-subtitle {
  font-size: 10px;
  color: rgba(224, 231, 255, 0.8);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.equity-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.025em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.equity-card-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 0.5rem;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  flex-shrink: 0;
}

.equity-card-pl {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.equity-card-pl.positive {
  color: #6ee7b7;
}

.equity-card-pl.negative {
  color: #fda4af;
}

.equity-btn-primary {
  flex: 1;
  min-width: 0;
  background: #fff;
  color: #4f46e5;
  font-weight: 700;
  padding: 0.75rem;
  border-radius: 1rem;
  text-align: center;
  font-size: 0.875rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  display: block;
}

.equity-btn-secondary {
  flex: 1;
  min-width: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 700;
  padding: 0.75rem;
  border-radius: 1rem;
  text-align: center;
  font-size: 0.875rem;
  transition: transform 0.2s;
  display: block;
}

.equity-btn-primary:active,
.equity-btn-secondary:active {
  transform: scale(0.95);
}
\`;

if (!content.includes('DASHBOARD - Mobile Equity Card')) {
  fs.writeFileSync('c:/sites/mirrox/src/index.css', content + newCSS, 'utf8');
  console.log('Appended CSS correctly!');
} else {
  console.log('Already appended.');
}
