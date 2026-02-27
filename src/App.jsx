/* src/App.jsx */
import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import Header from './components/Header';
import OpportunityCard from './components/OpportunityCard';
import IngenuityDetail from './components/IngenuityDetail';
import ProblemSubmission from './components/ProblemSubmission';
import IngenuityProofCard from './components/IngenuityProofCard';
import DiscoveryRadar from './components/DiscoveryRadar';
import EngineerProfile from './components/EngineerProfile';
import Auth from './components/Auth';
import ProjectsBoard from './components/ProjectsBoard';
import ProjectDetail from './components/ProjectDetail';
import { fetchOpportunities } from './services/discovery_service';

function App() {
  const [role, setRole] = useState('engineer');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [showSubmission, setShowSubmission] = useState(false);
  const [activeProof, setActiveProof] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // New States for Auth & Projects
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [activeTab, setActiveTab] = useState('radar'); // 'radar', 'projects'
  const [selectedProject, setSelectedProject] = useState(null);

  // Refactored Identity (Non-monetary)
  const [identity, setIdentity] = useState({
    tier: 'Gold',
    vouches: 12,
    proofs: [
      { title: "Virtual Grid Memory Leak", optimization: "+64% Efficiency" }
    ]
  });

  useEffect(() => {
    async function loadOpp() {
      setLoading(true);
      const data = await fetchOpportunities();
      setOpportunities(data);
      setLoading(false);
    }
    loadOpp();

    // Supabase Auth Listener
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsLoggedIn(true);
          setCurrentUser(session.user.email);
          setIdentity(prev => ({ ...prev, name: session.user.email.split('@')[0] }));
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setIsLoggedIn(true);
          setCurrentUser(session.user.email);
          setIdentity(prev => ({ ...prev, name: session.user.email.split('@')[0] }));
        } else {
          setIsLoggedIn(false);
          setCurrentUser('');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      setIsLoggedIn(false);
    }
  };

  const handlePublishProblem = (newOpp) => {
    setOpportunities([newOpp, ...opportunities]);
  };

  const handleReward = ({ proof }) => {
    setIdentity(prev => ({
      ...prev,
      tier: prev.proofs.length + 1 > 2 ? 'Diamond' : 'Gold',
      proofs: [proof, ...prev.proofs]
    }));
    setActiveProof(proof);
  };

  if (!isLoggedIn) {
    return <Auth onLogin={(user) => {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setIdentity(prev => ({ ...prev, name: user.split('@')[0] }));
    }} />;
  }

  return (
    <div className="App">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>

      <Header
        role={role}
        setRole={setRole}
        identity={identity}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onProfileClick={() => setShowProfile(true)}
        onLogout={handleLogout}
      />

      <main style={{ padding: '0', maxWidth: '100%', margin: '0 auto' }}>
        {activeTab === 'radar' && (
          <div style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
            <section style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>Job Prediction Engine</h1>
                <p style={{ color: 'var(--text-muted)' }}>Discovery Radar: Predicting technical role openings before they hit the market.</p>
              </div>
              <DiscoveryRadar />
            </section>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <i className="fas fa-radar fa-spin" style={{ fontSize: '3rem', color: 'var(--neon-blue)', marginBottom: '1rem' }}></i>
                <h3>Scanning Global Market Signals...</h3>
                <p>Connecting to Supabase and analyzing live network data.</p>
              </div>
            ) : role === 'engineer' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
                gap: '2.5rem'
              }}>
                {opportunities.map(opp => (
                  <OpportunityCard
                    key={opp.id}
                    opp={opp}
                    onClick={() => setSelectedOpp(opp)}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderStyle: 'dashed',
                borderRadius: '20px',
                padding: '4rem',
                textAlign: 'center'
              }}>
                <i className="fas fa-satellite-dish" style={{ fontSize: '3rem', color: 'var(--neon-purple)', marginBottom: '1.5rem' }}></i>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Deploy a Signal Pulse</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
                  Broadcast technical pain to predict hiring needs. AI will benchmark your urgency against the broader market.
                </p>
                <button
                  onClick={() => setShowSubmission(true)}
                  style={{
                    background: 'var(--accent-gradient)',
                    border: 'none',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(188, 19, 254, 0.2)'
                  }}>
                  Broadcast Signal
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <ProjectsBoard onProjectSelect={(proj) => setSelectedProject(proj)} />
        )}
      </main>

      {selectedProject && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'var(--bg-dark)', zIndex: 1000, overflowY: 'auto' }}>
          <ProjectDetail project={selectedProject} currentUser={currentUser} onClose={() => setSelectedProject(null)} />
        </div>
      )}

      {showSubmission && (
        <ProblemSubmission
          onClose={() => setShowSubmission(false)}
          onPublish={handlePublishProblem}
        />
      )}

      {selectedOpp && (
        <IngenuityDetail
          task={selectedOpp}
          role={role}
          onClose={() => setSelectedOpp(null)}
          onReward={handleReward}
        />
      )}

      {activeProof && (
        <IngenuityProofCard
          proof={activeProof}
          onClose={() => setActiveProof(null)}
        />
      )}

      {showProfile && (
        <EngineerProfile identity={identity} onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

export default App;
