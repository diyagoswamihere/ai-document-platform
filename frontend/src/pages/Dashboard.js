import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../services/api';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateProject = () => {
    navigate('/create-project');
  };

  const handleViewProject = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(projectId);
        loadProjects();
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated background shapes */}
      <div style={styles.bgShape1}></div>
      <div style={styles.bgShape2}></div>
      
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>✨</div>
          <h1 style={styles.title}>My Projects</h1>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.userBadge}>
            <span style={styles.userIcon}>👤</span>
            <span style={styles.userName}>{user?.full_name || user?.email}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.topSection}>
          <div style={styles.welcomeCard}>
            <h2 style={styles.welcomeTitle}>Welcome back! 👋</h2>
            <p style={styles.welcomeText}>Create amazing documents with AI assistance</p>
          </div>
          <button onClick={handleCreateProject} style={styles.createBtn}>
            ✨ Create New Project
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📄</div>
            <h3 style={styles.emptyTitle}>No projects yet</h3>
            <p style={styles.emptyText}>Start creating your first AI-powered document!</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {projects.map((project, index) => (
              <div key={project.id} style={{...styles.card, animationDelay: `${index * 0.1}s`}}>
                <div style={styles.cardHeader}>
                  <div style={styles.docTypeContainer}>
                    <span style={styles.docIcon}>
                      {project.document_type === 'docx' ? '📄' : '📊'}
                    </span>
                    <span style={styles.docType}>
                      {project.document_type === 'docx' ? 'Word' : 'PowerPoint'}
                    </span>
                  </div>
                  <span style={styles.status}>{project.status}</span>
                </div>
                
                <h3 style={styles.projectName}>{project.name}</h3>
                <p style={styles.projectTopic}>{project.main_topic}</p>
                
                <div style={styles.projectInfo}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>📑</span>
                    <span>{project.sections?.length || 0} sections</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>📅</span>
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div style={styles.actions}>
                  <button
                    onClick={() => handleViewProject(project.id)}
                    style={styles.viewBtn}
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    style={styles.deleteBtn}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(5deg); }
    66% { transform: translate(-20px, 20px) rotate(-5deg); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(-25px, 25px) rotate(-3deg); }
    66% { transform: translate(25px, -25px) rotate(3deg); }
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
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F0E6FA 0%, #E6E6FA 50%, #DDA0DD 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  bgShape1: {
    position: 'fixed',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(186, 85, 211, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    top: '-100px',
    right: '-100px',
    animation: 'float 20s ease-in-out infinite',
    zIndex: 0,
  },
  bgShape2: {
    position: 'fixed',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(147, 112, 219, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    bottom: '-50px',
    left: '-50px',
    animation: 'float2 25s ease-in-out infinite',
    zIndex: 0,
  },
  header: {
    backgroundColor: 'white',
    padding: '20px 40px',
    boxShadow: '0 4px 20px rgba(147, 112, 219, 0.15)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logo: {
    fontSize: '32px',
    animation: 'scaleIn 0.5s ease-out',
  },
  title: {
    margin: 0,
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '28px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #F0E6FA, #E6E6FA)',
    borderRadius: '25px',
  },
  userIcon: {
    fontSize: '20px',
  },
  userName: {
    color: '#6B5B95',
    fontWeight: '600',
  },
  logoutBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #FF6B9D, #C9184A)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s ease',
  },
  content: {
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  topSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    gap: '20px',
  },
  welcomeCard: {
    flex: 1,
    padding: '30px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(147, 112, 219, 0.15)',
    animation: 'fadeInUp 0.6s ease-out',
  },
  welcomeTitle: {
    margin: '0 0 10px 0',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '24px',
  },
  welcomeText: {
    margin: 0,
    color: '#9370DB',
    fontSize: '16px',
  },
  createBtn: {
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    color: 'white',
    border: 'none',
    borderRadius: '15px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(147, 112, 219, 0.3)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    animation: 'fadeInUp 0.6s ease-out 0.2s backwards',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '60px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #E6E6FA',
    borderTop: '5px solid #9370DB',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#9370DB',
    fontSize: '18px',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(147, 112, 219, 0.15)',
    animation: 'fadeInUp 0.6s ease-out',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  emptyTitle: {
    color: '#9370DB',
    marginBottom: '10px',
  },
  emptyText: {
    color: '#9370DB',
    fontSize: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '25px',
  },
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(147, 112, 219, 0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    animation: 'fadeInUp 0.6s ease-out backwards',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  docTypeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #F0E6FA, #E6E6FA)',
    borderRadius: '20px',
  },
  docIcon: {
    fontSize: '18px',
  },
  docType: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6B5B95',
  },
  status: {
    fontSize: '12px',
    padding: '6px 12px',
    background: 'linear-gradient(135deg, #DDA0DD, #BA55D3)',
    color: 'white',
    borderRadius: '15px',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  projectName: {
    margin: '0 0 12px 0',
    color: '#6B5B95',
    fontSize: '20px',
  },
  projectTopic: {
    color: '#9370DB',
    fontSize: '14px',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  projectInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    paddingTop: '15px',
    borderTop: '2px solid #F0E6FA',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#9370DB',
  },
  infoIcon: {
    fontSize: '16px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  viewBtn: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s ease',
  },
  deleteBtn: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #FF6B9D, #C9184A)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s ease',
  },
};

export default Dashboard;