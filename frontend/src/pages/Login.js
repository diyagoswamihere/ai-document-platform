import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated floating shapes */}
      <div style={styles.shape1}></div>
      <div style={styles.shape2}></div>
      <div style={styles.shape3}></div>
      
      {/* Floating icons */}
      <div style={styles.floatingIcon1}>🌙</div>
      <div style={styles.floatingIcon2}>🌟</div>
      <div style={styles.floatingIcon3}>🐰</div>
      <div style={styles.floatingIcon4}>🍓</div>
      <div style={styles.floatingIcon5}>🦦</div>
      
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.icon}>📄</div>
        </div>
        
        <h1 style={styles.title}>AI Document Platform</h1>
        <p style={styles.tagline}>Where Ideas Transform Into Documents 🪄</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '🔄 Logging in...' : '✨ Login'}
          </button>
        </form>
        
        <p style={styles.link}>
          Don't have an account? <Link to="/register" style={styles.linkText}>Create one now</Link>
        </p>
      </div>
      
      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(-5deg); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-15px) scale(1.05); }
  }
  
  @keyframes floatIcon1 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
    50% { transform: translate(-20px, -30px) rotate(10deg); opacity: 1; }
  }
  
  @keyframes floatIcon2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.7; }
    50% { transform: translate(25px, -25px) rotate(-10deg); opacity: 1; }
  }
  
  @keyframes floatIcon3 {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
    50% { transform: translate(15px, -35px) scale(1.2); opacity: 1; }
  }
  
  @keyframes floatIcon4 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
    50% { transform: translate(-30px, 20px) rotate(15deg); opacity: 0.9; }
  }
  
  @keyframes floatIcon5 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
    50% { transform: translate(20px, 25px) rotate(-12deg); opacity: 1; }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #FFF8DC 0%, #FFE4B5 50%, #FFDAB9 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  shape1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'linear-gradient(135deg, rgba(230, 230, 250, 0.3), rgba(216, 191, 216, 0.3))',
    borderRadius: '50%',
    top: '-100px',
    left: '-100px',
    animation: 'float 6s ease-in-out infinite',
  },
  shape2: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    background: 'linear-gradient(135deg, rgba(221, 160, 221, 0.3), rgba(238, 130, 238, 0.3))',
    borderRadius: '50%',
    bottom: '-50px',
    right: '-50px',
    animation: 'float2 8s ease-in-out infinite',
  },
  shape3: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    background: 'linear-gradient(135deg, rgba(230, 230, 250, 0.4), rgba(221, 160, 221, 0.4))',
    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
    top: '50%',
    right: '10%',
    animation: 'float3 7s ease-in-out infinite',
  },
  floatingIcon1: {
    position: 'absolute',
    fontSize: '40px',
    top: '15%',
    left: '15%',
    animation: 'floatIcon1 5s ease-in-out infinite',
    zIndex: 0,
  },
  floatingIcon2: {
    position: 'absolute',
    fontSize: '35px',
    top: '25%',
    right: '20%',
    animation: 'floatIcon2 6s ease-in-out infinite',
    zIndex: 0,
  },
  floatingIcon3: {
    position: 'absolute',
    fontSize: '45px',
    bottom: '20%',
    left: '10%',
    animation: 'floatIcon3 7s ease-in-out infinite',
    zIndex: 0,
  },
  floatingIcon4: {
    position: 'absolute',
    fontSize: '38px',
    top: '60%',
    right: '15%',
    animation: 'floatIcon4 5.5s ease-in-out infinite',
    zIndex: 0,
  },
  floatingIcon5: {
    position: 'absolute',
    fontSize: '42px',
    bottom: '30%',
    right: '25%',
    animation: 'floatIcon5 6.5s ease-in-out infinite',
    zIndex: 0,
  },
  card: {
    backgroundColor: 'white',
    padding: '50px 40px',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '450px',
    position: 'relative',
    zIndex: 1,
    animation: 'fadeInUp 0.6s ease-out',
  },
  iconContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  icon: {
    fontSize: '60px',
    animation: 'pulse 2s ease-in-out infinite',
  },
  title: {
    textAlign: 'center',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px',
    fontSize: '32px',
  },
  tagline: {
    textAlign: 'center',
    color: '#9370DB',
    marginBottom: '30px',
    fontSize: '16px',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#6B5B95',
    fontSize: '14px',
  },
  input: {
    padding: '14px 16px',
    border: '2px solid #E6E6FA',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  button: {
    padding: '16px',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    marginTop: '10px',
  },
  error: {
    padding: '12px',
    backgroundColor: '#FFE4E4',
    color: '#D8000C',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: '25px',
    color: '#666',
    fontSize: '14px',
  },
  linkText: {
    color: '#9370DB',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default Login;