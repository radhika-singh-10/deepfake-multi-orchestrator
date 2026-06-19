import React, { useState, useRef } from 'react';
import { UploadCloud, ShieldAlert, ShieldCheck, Activity } from 'lucide-react';
import './index.css';

interface AgentLog {
  agent_name: string;
  anomaly_detected: boolean;
  confidence_score: number;
  reasoning: string;
}

interface AnalysisResult {
  verdict: string;
  overall_confidence: number;
  agent_logs: AgentLog[];
}

function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const startAnalysis = async () => {
    if (!videoFile) return;
    setIsAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', videoFile);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Error connecting to analysis server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Deepfake Multi-Agent Orchestrator</h1>
        <p>Advanced Liveness & Synthetic Media Detection</p>
      </header>

      <div className="glass-panel">
        {!videoFile ? (
          <div 
            className="upload-area" 
            onDragOver={handleDragOver} 
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={48} className="upload-icon" />
            <div className="upload-text">Click or Drag & Drop Video Here</div>
            <div className="upload-hint">Supports MP4, MOV, WEBM (Max 50MB recommended)</div>
            <input 
              type="file" 
              accept="video/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div>
            {/* Status Indicator */}
            <div className={`status-indicator ${
              isAnalyzing ? 'status-analyzing' : 
              result?.verdict === 'SYNTHETIC MEDIA DETECTED' ? 'status-fake' : 
              result?.verdict === 'REAL HUMAN' ? 'status-real' : ''
            }`}>
              {isAnalyzing && <><span className="loader"></span> ANALYZING MULTI-MODAL VECTORS...</>}
              {!isAnalyzing && result && (
                <>
                  {result.verdict === 'REAL HUMAN' ? <ShieldCheck size={28} style={{marginRight: '10px', verticalAlign: 'bottom'}} /> : <ShieldAlert size={28} style={{marginRight: '10px', verticalAlign: 'bottom'}} />}
                  {result.verdict} {(result.overall_confidence * 100).toFixed(1)}% Confidence
                </>
              )}
              {!isAnalyzing && !result && 'READY FOR ANALYSIS'}
            </div>

            <div className="dashboard-grid">
              <div className="video-section">
                <div className="video-container">
                  <video src={videoUrl || ''} controls autoPlay muted loop />
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <button 
                    className="btn" 
                    onClick={startAnalysis} 
                    disabled={isAnalyzing}
                    style={{ flex: 1 }}
                  >
                    {isAnalyzing ? 'Running Agents...' : 'Run Agentic Analysis'}
                  </button>
                  <button 
                    className="btn" 
                    onClick={() => { setVideoFile(null); setVideoUrl(null); setResult(null); }}
                    disabled={isAnalyzing}
                    style={{ background: '#475569' }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="logs-container">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Activity size={20} color="var(--accent-color)" /> Agent Diagnostics
                </h3>
                
                {!result && !isAnalyzing && (
                  <div className="log-card" style={{ opacity: 0.5 }}>
                    <p style={{ margin: 0 }}>Waiting for analysis to begin...</p>
                  </div>
                )}
                
                {isAnalyzing && (
                  <div className="log-card">
                    <p style={{ margin: 0 }}><span className="loader"></span> Orchestrating Biometric, Temporal, and Context Agents...</p>
                  </div>
                )}

                {result && result.agent_logs.map((log, idx) => (
                  <div key={idx} className={`log-card ${log.anomaly_detected ? 'danger' : 'safe'}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div className="log-header">
                      <div className="log-title">{log.agent_name}</div>
                      <div className={`log-score ${log.anomaly_detected ? 'danger' : 'safe'}`}>
                        {(log.confidence_score * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="log-reasoning">
                      <strong>Verdict:</strong> {log.anomaly_detected ? 'Anomaly Detected' : 'Clear'}<br/>
                      <strong>Reasoning:</strong> {log.reasoning}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
