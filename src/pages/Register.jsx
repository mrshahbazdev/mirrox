import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTrading } from '../context/TradingContext';

const Register = ({ onRegister }) => {
  const navigate = useNavigate();
  const { setClientId } = useTrading();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', contact: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/register', formData);
      
      // Automatically log the user in
      setClientId(res.data.client.id, res.data.token);
      onRegister(res.data.client);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <div className="login-card glass animate-fade" style={{ width: '480px' }}>
        <div className="logo-area">
          <i className="fa-solid fa-cube main-logo"></i>
          <h1>Join mirrox</h1>
          <p>Start your premium trading journey today.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-field">
            <i className="fa-solid fa-user field-icon"></i>
            <input 
              type="text" 
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <i className="fa-solid fa-envelope field-icon"></i>
            <input 
              type="email" 
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <i className="fa-solid fa-lock field-icon"></i>
            <input 
              type="password" 
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <div className="input-field">
            <i className="fa-solid fa-phone field-icon"></i>
            <input 
              type="text" 
              name="contact"
              placeholder="Contact Number (Optional)"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
          
          {error && <div className="error-text animate-fade">{error}</div>}

          <div className="form-utils">
            <label className="checkbox-wrap">
              <input type="checkbox" required />
              <span>I agree to the <a href="#">Terms & Conditions</a></span>
            </label>
          </div>

          <button type="submit" className="btn-primary login-cta" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'} <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <p className="signup-link">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>

      <style>{`
        .login-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, #0f172a, #020617);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 2000;
        }
        .login-card {
          padding: 48px;
          text-align: center;
        }
        .main-logo {
          font-size: 48px;
          color: var(--accent-color);
          margin-bottom: 20px;
          filter: drop-shadow(0 0 15px rgba(0, 210, 255, 0.4));
        }
        .logo-area h1 {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 8px;
        }
        .logo-area p {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 30px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .input-field {
          position: relative;
        }
        .field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .input-field input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s;
        }
        .input-field input:focus {
          border-color: var(--accent-color);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.1);
        }
        .form-utils {
          display: flex;
          font-size: 13px;
          margin: 8px 0;
        }
        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .form-utils a {
          color: var(--accent-color);
          font-weight: 600;
        }
        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .btn-primary {
          background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 210, 255, 0.5);
        }
        .animate-fade {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-cta {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 12px;
        }
        .signup-link {
          margin-top: 32px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .signup-link a {
          color: var(--accent-color);
          font-weight: 600;
        }
        .error-text {
          color: #ff4d4d;
          font-size: 13px;
          text-align: left;
          margin-top: -8px;
          margin-bottom: 8px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Register;
