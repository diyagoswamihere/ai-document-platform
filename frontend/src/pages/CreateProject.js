import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI, aiAPI } from '../services/api';

function CreateProject() {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [documentType, setDocumentType] = useState('docx');
  const [mainTopic, setMainTopic] = useState('');
  const [numSections, setNumSections] = useState(5);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateOutline = async () => {
    if (!mainTopic) {
      alert('Please enter a topic');
      return;
    }
    
    setLoading(true);
    try {
      const response = await aiAPI.generateOutline(mainTopic, documentType, numSections);
      const titles = response.data.titles;
      const newSections = titles.map((title, index) => ({
        title,
        position: index + 1,
        content: null,
      }));
      setSections(newSections);
      setStep(3);
    } catch (error) {
      alert('Failed to generate outline');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSections = () => {
    const newSections = Array.from({ length: numSections }, (_, i) => ({
      title: '',
      position: i + 1,
      content: null,
    }));
    setSections(newSections);
    setStep(3);
  };

  const handleSectionTitleChange = (index, value) => {
    const updated = [...sections];
    updated[index].title = value;
    setSections(updated);
  };

  const handleCreateProject = async () => {
  if (!projectName || sections.some(s => !s.title)) {
    alert('Please fill in all fields');
    return;
  }

  setLoading(true);
  try {
    const response = await projectsAPI.create({
      name: projectName,
      document_type: documentType,
      main_topic: mainTopic,
      sections: sections,
    });
    
    alert('✅ Project created successfully!');
    // Changed: Navigate to dashboard instead of project detail
    navigate('/dashboard');
  } catch (error) {
    alert('Failed to create project');
  } finally {
    setLoading(false);
  }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>✨ Create New Project</h1>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </div>

      <div style={styles.content}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div style={styles.card}>
            <h2 style={styles.stepTitle}>Step 1: Project Details</h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Project Name *</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={styles.input}
                placeholder="My Amazing Document"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Document Type *</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="docx"
                    checked={documentType === 'docx'}
                    onChange={(e) => setDocumentType(e.target.value)}
                  />
                  <span style={styles.radioText}>📄 Word Document (.docx)</span>
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="pptx"
                    checked={documentType === 'pptx'}
                    onChange={(e) => setDocumentType(e.target.value)}
                  />
                  <span style={styles.radioText}>📊 PowerPoint (.pptx)</span>
                </label>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Main Topic *</label>
              <textarea
                value={mainTopic}
                onChange={(e) => setMainTopic(e.target.value)}
                style={styles.textarea}
                placeholder="What is your document about?"
                rows={3}
              />
            </div>

            <button onClick={() => setStep(2)} style={styles.nextBtn}>
              Next →
            </button>
          </div>
        )}

        {/* Step 2: Choose Outline Method */}
        {step === 2 && (
          <div style={styles.card}>
            <h2 style={styles.stepTitle}>Step 2: Create Outline</h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Number of {documentType === 'docx' ? 'Sections' : 'Slides'}</label>
              <input
                type="number"
                value={numSections}
                onChange={(e) => setNumSections(Number(e.target.value))}
                style={styles.input}
                min={1}
                max={20}
              />
            </div>

            <div style={styles.choiceContainer}>
              <div style={styles.choiceCard}>
                <div style={styles.choiceIcon}>🤖</div>
                <h3 style={styles.choiceTitle}>AI-Generated Outline</h3>
                <p style={styles.choiceText}>Let AI suggest section titles based on your topic</p>
                <button onClick={handleGenerateOutline} style={styles.choiceBtn} disabled={loading}>
                  {loading ? '⏳ Generating...' : '✨ Generate with AI'}
                </button>
              </div>

              <div style={styles.choiceCard}>
                <div style={styles.choiceIcon}>✍️</div>
                <h3 style={styles.choiceTitle}>Manual Outline</h3>
                <p style={styles.choiceText}>Create your own section titles</p>
                <button onClick={handleManualSections} style={styles.choiceBtn}>
                  📝 Create Manually
                </button>
              </div>
            </div>

            <button onClick={() => setStep(1)} style={styles.backStepBtn}>
              ← Back
            </button>
          </div>
        )}

        {/* Step 3: Edit Sections */}
        {step === 3 && (
          <div style={styles.card}>
            <h2 style={styles.stepTitle}>Step 3: Review & Edit Outline</h2>
            
            <div style={styles.sectionsContainer}>
              {sections.map((section, index) => (
                <div key={index} style={styles.sectionItem}>
                  <span style={styles.sectionNumber}>{index + 1}</span>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleSectionTitleChange(index, e.target.value)}
                    style={styles.sectionInput}
                    placeholder={`${documentType === 'docx' ? 'Section' : 'Slide'} ${index + 1} title`}
                  />
                </div>
              ))}
            </div>

            <div style={styles.actionButtons}>
              <button onClick={() => setStep(2)} style={styles.backStepBtn}>
                ← Back
              </button>
              <button onClick={handleCreateProject} style={styles.createBtn} disabled={loading}>
                {loading ? '⏳ Creating...' : '🚀 Create Project'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
  title: {
    margin: 0,
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
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
  content: {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(147, 112, 219, 0.15)',
  },
  stepTitle: {
    color: '#6B5B95',
    marginBottom: '30px',
    fontSize: '24px',
  },
  inputGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#6B5B95',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '14px',
    border: '2px solid #E6E6FA',
    borderRadius: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    border: '2px solid #E6E6FA',
    borderRadius: '10px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    border: '2px solid #E6E6FA',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  radioText: {
    marginLeft: '10px',
    fontSize: '16px',
    color: '#6B5B95',
    fontWeight: '500',
  },
  nextBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '10px',
  },
  choiceContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '30px',
  },
  choiceCard: {
    padding: '30px',
    border: '2px solid #E6E6FA',
    borderRadius: '15px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  choiceIcon: {
    fontSize: '50px',
    marginBottom: '15px',
  },
  choiceTitle: {
    color: '#6B5B95',
    marginBottom: '10px',
  },
  choiceText: {
    color: '#9370DB',
    fontSize: '14px',
    marginBottom: '20px',
  },
  choiceBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  sectionsContainer: {
    marginBottom: '30px',
  },
  sectionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
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
    flexShrink: 0,
  },
  sectionInput: {
    flex: 1,
    padding: '14px',
    border: '2px solid #E6E6FA',
    borderRadius: '10px',
    fontSize: '16px',
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
  },
  backStepBtn: {
    flex: 1,
    padding: '16px',
    background: 'white',
    color: '#9370DB',
    border: '2px solid #9370DB',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  createBtn: {
    flex: 2,
    padding: '16px',
    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default CreateProject;