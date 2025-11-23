import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, aiAPI, exportAPI } from '../services/api';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingSection, setGeneratingSection] = useState(null);
  const [refiningSection, setRefiningSection] = useState(null);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await projectsAPI.getById(projectId);
      setProject(response.data);
    } catch (error) {
      alert('Failed to load project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async (sectionId) => {
    setGeneratingSection(sectionId);
    try {
      await aiAPI.generateSectionContent(projectId, sectionId);
      await loadProject(); // Reload to get updated content
      alert('✅ Content generated!');
    } catch (error) {
      alert('Failed to generate content');
    } finally {
      setGeneratingSection(null);
    }
  };

  const handleRefineContent = async (sectionId) => {
    if (!refinementPrompt.trim()) {
      alert('Please enter refinement instructions');
      return;
    }

    setRefiningSection(sectionId);
    try {
      await aiAPI.refineContent(sectionId, refinementPrompt);
      await loadProject();
      setRefinementPrompt('');
      alert('✅ Content refined!');
    } catch (error) {
      alert('Failed to refine content');
    } finally {
      setRefiningSection(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await exportAPI.exportDocument(projectId);
      const blob = new Blob([response.data], {
        type: project.document_type === 'docx' 
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name}.${project.document_type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('✅ Document exported successfully!');
    } catch (error) {
      alert('Failed to export document');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return <div style={styles.error}>Project not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            ← Back
          </button>
          <div>
            <h1 style={styles.title}>{project.name}</h1>
            <p style={styles.topic}>{project.main_topic}</p>
          </div>
        </div>
        <button onClick={handleExport} style={styles.exportBtn} disabled={exporting}>
          {exporting ? '⏳ Exporting...' : '📥 Export Document'}
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.infoCard}>
          <span style={styles.badge}>
            {project.document_type === 'docx' ? '📄 Word' : '📊 PowerPoint'}
          </span>
          <span style={styles.badge}>{project.status}</span>
          <span style={styles.badge}>
            {project.sections?.length || 0} sections
          </span>
        </div>

        <div style={styles.sectionsContainer}>
          {project.sections && project.sections.length > 0 ? (
            project.sections
              .sort((a, b) => a.position - b.position)
              .map((section) => (
                <div key={section.id} style={styles.sectionCard}>
                  <div style={styles.sectionHeader}>
                    <div style={styles.sectionTitle}>
                      <span style={styles.sectionNumber}>{section.position}</span>
                      <h3 style={styles.sectionName}>{section.title}</h3>
                    </div>
                    {!section.content && (
                      <button
                        onClick={() => handleGenerateContent(section.id)}
                        style={styles.generateBtn}
                        disabled={generatingSection === section.id}
                      >
                        {generatingSection === section.id ? '⏳ Generating...' : '✨ Generate Content'}
                      </button>
                    )}
                  </div>

                  {section.content ? (
                    <div style={styles.contentArea}>
                      <div style={styles.contentBox}>
                        {section.content}
                      </div>
                      
                      <div style={styles.refineSection}>
                        <h4 style={styles.refineTitle}>🔧 Refine Content</h4>
                        <input
                          type="text"
                          value={refinementPrompt}
                          onChange={(e) => setRefinementPrompt(e.target.value)}
                          style={styles.refineInput}
                          placeholder="e.g., Make it more formal, Add bullet points, Shorten to 100 words..."
                        />
                        <button
                          onClick={() => handleRefineContent(section.id)}
                          style={styles.refineBtn}
                          disabled={refiningSection === section.id}
                        >
                          {refiningSection === section.id ? '⏳ Refining...' : '✨ Refine'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.emptyContent}>
                      <p>No content yet. Click "Generate Content" to create AI-powered content.</p>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <div style={styles.noSections}>
              <p>No sections found in this project.</p>
            </div>
          )}
        </div>
      </div>

      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F0E6FA 0%, #E6E6FA 50%, #DDA0DD 100%)',
  },
  header: {
    backgroundColor: 'white',
    padding: '20px 40px',
    boxShadow: '0 4px 20px rgba(147, 112, 219, 0.15)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  backBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  title: {
    margin: 0,
    color: '#6B5B95',
    fontSize: '28px',
  },
  topic: {
    margin: '5px 0 0 0',
    color: '#9370DB',
    fontSize: '14px',
  },
  exportBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
  },
  content: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(147, 112, 219, 0.15)',
    marginBottom: '30px',
    display: 'flex',
    gap: '15px',
  },
  badge: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #F0E6FA, #E6E6FA)',
    color: '#6B5B95',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  sectionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  sectionCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(147, 112, 219, 0.15)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  sectionNumber: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    color: 'white',
    borderRadius: '50%',
    fontWeight: '600',
    fontSize: '18px',
  },
  sectionName: {
    margin: 0,
    color: '#6B5B95',
    fontSize: '22px',
  },
  generateBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  contentArea: {
    marginTop: '20px',
  },
  contentBox: {
    padding: '20px',
    backgroundColor: '#F9F9F9',
    borderRadius: '12px',
    border: '2px solid #E6E6FA',
    marginBottom: '20px',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.8',
    color: '#333',
  },
  refineSection: {
    padding: '20px',
    background: 'linear-gradient(135deg, #F0E6FA, #E6E6FA)',
    borderRadius: '12px',
  },
  refineTitle: {
    margin: '0 0 15px 0',
    color: '#6B5B95',
    fontSize: '16px',
  },
  refineInput: {
    width: '100%',
    padding: '12px',
    border: '2px solid white',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '10px',
    boxSizing: 'border-box',
  },
  refineBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  emptyContent: {
    padding: '40px',
    textAlign: 'center',
    color: '#9370DB',
    backgroundColor: '#F9F9F9',
    borderRadius: '12px',
    border: '2px dashed #E6E6FA',
  },
  noSections: {
    padding: '60px',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: '20px',
    color: '#9370DB',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #F0E6FA 0%, #E6E6FA 50%, #DDA0DD 100%)',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #E6E6FA',
    borderTop: '5px solid #9370DB',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  error: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#9370DB',
  },
};

export default ProjectDetail;