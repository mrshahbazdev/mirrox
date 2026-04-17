import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTrading } from '../context/TradingContext';

const Register = ({ onRegister }) => {
  const navigate = useNavigate();
  const { setClientId } = useTrading();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', contact: '' });
  const [refCode, setRefCode] = useState(searchParams.get('ref') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/register', { ...formData, ref: refCode });
      
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
    <div className="auth-container">
      <div className="auth-card animate-fade">
        <div className="auth-logo-area">
          <i className="fa-solid fa-cube main-logo"></i>
          <h1>Join mirrox</h1>
          <p>Start your premium trading journey today.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-field">
            <i className="fa-solid fa-user auth-field-icon"></i>
            <input 
              type="text" 
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-input-field">
            <i className="fa-solid fa-envelope auth-field-icon"></i>
            <input 
              type="email" 
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-input-field">
            <i className="fa-solid fa-lock auth-field-icon"></i>
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
          <div className="auth-input-field">
            <i className="fa-solid fa-phone auth-field-icon"></i>
            <input 
              type="text" 
              name="contact"
              placeholder="Contact Number (Optional)"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>

          <div className="auth-input-field">
            <i className="fa-solid fa-user-plus auth-field-icon"></i>
            <input 
              type="text" 
              placeholder="Referral Code (Optional)"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value)}
            />
          </div>
          
          {error && <div className="auth-error animate-fade">{error}</div>}

          <div className="auth-utils">
            <label className="auth-checkbox-wrap">
              <input type="checkbox" required />
              <span>I agree to the <a href="#">Terms & Conditions</a></span>
            </label>
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'} <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <p className="auth-footer-link">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
    </div>
  );
};

export default Register;
