/* src/App.jsx */
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OpportunityCard from './components/OpportunityCard';
import IngenuityDetail from './components/IngenuityDetail';
import ProblemSubmission from './components/ProblemSubmission';
import IngenuityProofCard from './components/IngenuityProofCard';
import DiscoveryRadar from './components/DiscoveryRadar';
import EngineerProfile from './components/EngineerProfile';
import { fetchOpportunities } from './services/discovery_service';

function App() {
  const [role, setRole] = useState('engineer');
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [showSubmission, setShowSubmission] = useState(false);
  const [activeProof, setActiveProof] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Refactored Identity (Non-monetary)
  const [identity, setIdentity] = useState({
    tier: 'Gold',
    vouches: 12,
    proofs: [
      { title: "Virtual Grid Memory Leak", optimization: "+64% Efficiency" }
    ]
  });

  useEffect(() => {
    setOpportunities(fetchOpportunities());
  }, []);

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

  return (
    <div className="App">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>

      <Header
        role={role}
        setRole={setRole}
        identity={identity}
        onProfileClick={() => setShowProfile(true)}
      />

      <main style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
        <section style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>Job Prediction Engine</h1>
            <p style={{ color: 'var(--text-muted)' }}>Discovery Radar: Predicting technical role openings before they hit the market.</p>
          </div>
          <DiscoveryRadar />
        </section>

        {role === 'engineer' ? (
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
      </main>

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
