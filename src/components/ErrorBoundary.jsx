import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid var(--danger)', 
          borderRadius: '12px',
          color: 'var(--danger)',
          textAlign: 'center'
        }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
          <h4>Component Error</h4>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>Something went wrong in this section. Please try refreshing.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{ 
              marginTop: '10px', 
              padding: '6px 12px', 
              background: 'var(--danger)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
