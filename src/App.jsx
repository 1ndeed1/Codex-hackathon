/* src/App.jsx */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProfilesDirectory from './components/ProfilesDirectory';
import SponsorDashboard from './components/SponsorDashboard';
import ProducerDashboard from './components/ProducerDashboard';
import ActivityDashboard from './components/ActivityDashboard';
import PathfinderDashboard from './components/PathfinderDashboard';
import PathfinderRoadmap from './components/PathfinderRoadmap';
import PathfinderTrackSelector from './components/PathfinderTrackSelector';
import AssessmentPlatform from './components/AssessmentPlatform';
const GapStartDashboard = React.lazy(() => import('./components/GapStartDashboard'));
import { fetchOpportunities, simulateBackgroundScan } from './services/discovery_service';
import { startBackgroundScanner } from './services/background_scanner';

function App() {
  const [role, setRole] = useState('engineer');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [showSubmission, setShowSubmission] = useState(false);
  const [activeProof, setActiveProof] = useState(null);
  const [showProfile, setShowProfile] = useState(null);
  const [filter, setFilter] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);

  // New States for Auth & Projects
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const [identity, setIdentity] = useState({
    id: null,
    name: '',
    role: 'engineer',
    bio: '',
    location: '',
    experience_years: 0,
    github_url: '',
    portfolio_url: '',
    tier: 'Unranked',
    vouches: 0,
    is_verified: false,
    proofs: []
  });

  const loadProfileAndSolutions = async (user) => {
    try {
      // Fetch base profile
      const { data: profileList, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);

      if (profileError) {
        console.error("Supabase error fetching profile:", profileError);
        // If it's a network error, don't proceed to create a new profile
        return;
      }

      const profileData = (profileList && profileList.length > 0) ? profileList[0] : null;

      if (!profileData) {
        console.log("Profile missing, creating default...");
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: user.email,
            username: user.email.split('@')[0] + '_' + Math.floor(Math.random() * 1000),
            role: 'engineer',
            tier: 'Unranked'
          }])
          .select()
          .single();
        // Use newProfile if created, else fallback to null
      }

      // Fetch accepted solutions as proofs
      const { data: solutionsData } = await supabase
        .from('solutions')
        .select(`*, opportunities!opportunity_id(title)`)
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      const proofs = (solutionsData || []).map(sol => ({
        title: sol.opportunities?.title || "Unknown Mission",
        optimization: sol.content.substring(0, 50) + '...'
      }));

      setIdentity({
        id: user.id,
        name: profileData?.username || user.email.split('@')[0],
        role: profileData?.role || 'engineer',
        bio: profileData?.bio || '',
        location: profileData?.location || '',
        experience_years: profileData?.experience_years || 0,
        github_url: profileData?.github_url || '',
        portfolio_url: profileData?.portfolio_url || '',
        tier: profileData?.tier || 'Unranked',
        vouches: profileData?.vouches || 0,
        is_verified: profileData?.is_verified || false,
        proofs: proofs
      });
    } catch (err) {
      console.error("Failed to load full profile", err);
    }
  };

  useEffect(() => {
    async function loadOpp() {
      setLoading(true);
      const data = await fetchOpportunities();
      setOpportunities(data);
      setLoading(false);
    }
    loadOpp();

    const scanInterval = setInterval(async () => {
      await simulateBackgroundScan();
      const freshData = await fetchOpportunities();
      setOpportunities(freshData);
    }, 120000); // Scan every 2 minutes

    // 24/7 Background Scanner for GapStart
    const stopScanner = startBackgroundScanner();

    return () => {
      clearInterval(scanInterval);
      stopScanner();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAcceptOpportunity = async (oppId) => {
    // Check if solver_count column exists by trying a select
    const { error: checkError } = await supabase.from('opportunities').select('solver_count').eq('id', oppId).single();
    if (checkError) {
      alert("Missing Database Columns: Please run the SQL script in implementation_plan.md to enable the saturation feature.");
      return;
    }

    const { error } = await supabase.rpc('increment_solver_count', { opp_id: oppId });
    if (error) {
      console.error("Failed to increment solver count:", error);
      // Fallback if RPC isn't available
      const { data: current } = await supabase.from('opportunities').select('solver_count').eq('id', oppId).single();
      await supabase.from('opportunities').update({ solver_count: (current?.solver_count || 0) + 1 }).eq('id', oppId);
    }
    const freshData = await fetchOpportunities();
    setOpportunities(freshData);
    setSelectedOpp(null);
    alert("You have been enlisted as a solver! The signal will be hidden once saturation is reached.");
  };

  const refreshOpportunities = async () => {
    setLoading(true);
    const data = await fetchOpportunities();
    // Shuffle the data to make it feel fresh
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setOpportunities(shuffled);
    setLoading(false);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // Supabase Auth Listener
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsLoggedIn(true);
          setCurrentUser(session.user.email);
          loadProfileAndSolutions(session.user);
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setIsLoggedIn(true);
          setCurrentUser(session.user.email);
          loadProfileAndSolutions(session.user);
        } else {
          setIsLoggedIn(false);
          setCurrentUser('');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);


  const handlePublishProblem = async (newOpp) => {
    if (!identity || !identity.id) {
      alert("You must be logged in to broadcast a signal.");
      return;
    }

    const { data, error } = await supabase.from('opportunities').insert([{
      type: newOpp.type,
      source: newOpp.source,
      channel: newOpp.channel,
      title: newOpp.title,
      signal: newOpp.title, // using title as signal for direct posts
      inference: newOpp.inference || "Directly reported by engineer.",
      logic_gap: newOpp.logicGap,
      job_probability: newOpp.jobProbability,
      hiring_urgency: newOpp.hiringUrgency,
      tags: newOpp.tags,
      difficulty: newOpp.difficulty,
      owner_id: identity.id,
      abstract: newOpp.abstract,
      code_snippet: newOpp.codeSnippet,
      is_anonymous: newOpp.isAnonymous,
      source_url: newOpp.sourceUrl
    }]).select(`*, profiles!opportunities_owner_id_fkey(username, email)`);

    if (error) {
      console.error("Failed to publish problem:", error);
      alert("Could not publish problem. " + error.message);
      return;
    }

    if (data && data.length > 0) {
      // Reload all opportunities to get the freshest data
      const freshData = await fetchOpportunities();
      setOpportunities(freshData);
    }
  };

  const handleDeleteOpportunity = async (oppId) => {
    const { error } = await supabase.from('opportunities').delete().eq('id', oppId);
    if (error) {
      console.error("Failed to delete opportunity:", error);
      alert("Could not delete. " + error.message);
      return;
    }
    setOpportunities(opportunities.filter(o => o.id !== oppId));
    setSelectedOpp(null);
  };

  const handleEditOpportunity = async (oppId, updatedFields) => {
    // Map frontend camelCase back to snake_case for Supabase
    const updatePayload = {};
    if (updatedFields.title !== undefined) updatePayload.title = updatedFields.title;
    if (updatedFields.abstract !== undefined) updatePayload.abstract = updatedFields.abstract;
    if (updatedFields.codeSnippet !== undefined) updatePayload.code_snippet = updatedFields.codeSnippet;
    if (updatedFields.isAnonymous !== undefined) updatePayload.is_anonymous = updatedFields.isAnonymous;

    const { data, error } = await supabase
      .from('opportunities')
      .update(updatePayload)
      .eq('id', oppId)
      .select(`*, profiles(username, email)`);

    if (error) {
      console.error("Failed to update opportunity:", error);
      alert("Could not update. " + error.message);
      return;
    }

    if (data && data.length > 0) {
      const freshData = await fetchOpportunities();
      setOpportunities(freshData);

      // Update the currently selected opp so the detail view refreshes
      const updatedOpp = freshData.find(o => o.id === oppId);
      if (updatedOpp) setSelectedOpp(updatedOpp);
    }
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
    return <Auth onLogin={() => {
      setIsLoggedIn(true);
    }} />;
  }

  return (
    <Router>
      <div className="App">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <div className="bg-glow"></div>
        <div className="bg-glow-2"></div>

        <Header
          role={identity.role} // Sync Header with identity role
          setRole={(r) => setIdentity(prev => ({ ...prev, role: r }))}
          identity={identity}
          onProfileClick={() => setShowProfile(identity.id)}
          onLogout={handleLogout}
        />

        <main style={{ padding: '0', maxWidth: '100%', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={
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
                ) : identity.role === 'engineer' ? (
                  <>
                    <div
                      className={isScrolled ? "sticky-sidebar-filters" : ""}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '2.5rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        background: 'var(--glass-bg)',
                        padding: '1.2rem',
                        borderRadius: '20px',
                        border: '1px solid var(--glass-border)',
                        transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                        zIndex: 100,
                        ...(isScrolled ? {
                          position: 'fixed',
                          left: '20px',
                          top: '120px',
                          flexDirection: 'column',
                          width: '70px',
                          height: 'calc(100vh - 160px)',
                          justifyContent: 'flex-start',
                          padding: '1.5rem 0.5rem',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                          backdropFilter: 'blur(30px)',
                          borderRight: '1px solid var(--neon-blue)',
                          overflowY: 'auto'
                        } : {})
                      }}
                    >
                      {!isScrolled && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginRight: '10px', fontWeight: 600 }}>
                          <i className="fas fa-filter" style={{ marginRight: '8px' }}></i>
                          Filter Sources:
                        </span>
                      )}
                      {['All', 'GitHub', 'Reddit', 'StackOverflow', 'Quora', 'AWS Community'].map(f => {
                        const icon = f === 'All' ? 'fas fa-filter' :
                          (f === 'GitHub' ? 'fab fa-github' :
                            (f === 'Reddit' ? 'fab fa-reddit' :
                              (f === 'StackOverflow' ? 'fab fa-stack-overflow' :
                                (f === 'Quora' ? 'fab fa-quora' : 'fab fa-aws'))));
                        return (
                          <button
                            key={f}
                            onClick={() => setFilter(f)}
                            title={f} // Tooltip for icons
                            style={{
                              background: filter === f ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
                              border: filter === f ? 'none' : '1px solid var(--glass-border)',
                              color: filter === f ? 'white' : 'var(--text-main)',
                              padding: isScrolled ? '12px' : '8px 18px',
                              borderRadius: isScrolled ? '50%' : '11px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              width: isScrolled ? '50px' : 'auto',
                              height: isScrolled ? '50px' : 'auto',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: filter === f ? '0 4px 12px rgba(188, 19, 254, 0.3)' : 'none'
                            }}
                          >
                            {isScrolled ? <i className={icon} style={{ fontSize: '1.2rem' }}></i> : f}
                          </button>
                        );
                      })}
                      <button
                        onClick={refreshOpportunities}
                        title="Refresh Radar"
                        style={{
                          marginTop: isScrolled ? 'auto' : '0',
                          marginLeft: isScrolled ? '0' : 'auto',
                          width: isScrolled ? '50px' : 'auto',
                          height: isScrolled ? '50px' : 'auto',
                          background: 'transparent',
                          border: `1px solid ${isScrolled ? 'var(--neon-purple)' : 'var(--neon-blue)'}`,
                          color: isScrolled ? 'var(--neon-purple)' : 'var(--neon-blue)',
                          padding: isScrolled ? '12px' : '10px 20px',
                          borderRadius: isScrolled ? '50%' : '12px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`} style={{ fontSize: isScrolled ? '1.2rem' : 'inherit' }}></i>
                        {!isScrolled && 'Shuffle Radar'}
                      </button>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
                      gap: '2.5rem'
                    }}>
                      {opportunities
                        .filter(opp => filter === 'All' || opp.source?.toLowerCase().includes(filter.toLowerCase()))
                        .map(opp => (
                          <OpportunityCard
                            key={opp.id}
                            opp={opp}
                            onClick={() => setSelectedOpp(opp)}
                          />
                        ))}
                    </div>
                  </>
                ) : identity.role === 'sponsor' ? (
                  <SponsorDashboard identity={identity} />
                ) : identity.role === 'producer' ? (
                  <ProducerDashboard identity={identity} />
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
            } />

            <Route path="/projects" element={<ProjectsBoard onProjectSelect={(proj) => setSelectedProject(proj)} identity={identity} />} />
            <Route path="/community" element={<ProfilesDirectory onProfileSelect={(id) => setShowProfile(id)} />} />
            <Route path="/activity" element={<ActivityDashboard identity={identity} />} />
            <Route path="/pathfinder" element={<PathfinderTrackSelector />} />
            <Route path="/pathfinder/track/:trackId" element={<PathfinderDashboard identity={identity} />} />
            <Route path="/pathfinder/roadmap/:domainId" element={<PathfinderRoadmap identity={identity} />} />
            <Route path="/assessment/:companyName/:weekIndex" element={<AssessmentPlatform identity={identity} />} />
            <Route path="/gapstart" element={<GapStartDashboard identity={identity} />} />
          </Routes>
        </main>

        {selectedProject && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'var(--bg-dark)', zIndex: 1000, overflowY: 'auto' }}>
            <ProjectDetail project={selectedProject} currentUser={currentUser} onClose={() => setSelectedProject(null)} identity={identity} />
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
            identity={identity}
            onClose={() => setSelectedOpp(null)}
            onReward={handleReward}
            onDelete={handleDeleteOpportunity}
            onEdit={handleEditOpportunity}
            onAccept={handleAcceptOpportunity}
          />
        )}

        {activeProof && (
          <IngenuityProofCard
            proof={activeProof}
            onClose={() => setActiveProof(null)}
          />
        )}

        {showProfile && (
          <EngineerProfile
            userId={showProfile}
            currentUser={identity}
            identity={identity}
            onClose={() => setShowProfile(null)}
            onProfileUpdate={(updated) => setIdentity(updated)}
          />
        )}
      </div>
    </Router >
  );
}

export default App;
