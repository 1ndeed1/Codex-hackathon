import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('engineer');
    const [bio, setBio] = useState('');
    const [experienceYears, setExperienceYears] = useState('0');
    const [location, setLocation] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.user) {
                    onLogin(data.user.email);
                }
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.user) {
                    if (data.session) {
                        // If a session is returned immediately, email confirmations are disabled/bypassed.
                        // It is safe to create the profile right now.
                        const { error: profileError } = await supabase
                            .from('profiles')
                            .insert([
                                {
                                    id: data.user.id,
                                    email: data.user.email,
                                    username,
                                    role,
                                    bio,
                                    experience_years: parseInt(experienceYears),
                                    location,
                                    github_url: githubUrl,
                                    portfolio_url: portfolioUrl,
                                    tier: 'Unranked',
                                    vouches: 0
                                }
                            ]);

                        if (profileError) {
                            console.error("Profile creation error:", profileError);
                            // If profile creation fails but auth succeeded, still log in the user
                            onLogin(email);
                        } else {
                            onLogin(email);
                        }
                    } else {
                        // Supabase has Email Confirmations enabled by default!
                        setSuccessMsg("Signup successful! Please check your email for the confirmation link to login. (Or disable Email Confirmations in Supabase Settings -> Auth -> Email)");
                    }
                }
            }
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'block',
            minHeight: '100vh',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'var(--bg-dark)',
            zIndex: 9999,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '2rem 1rem',
            boxSizing: 'border-box'
        }}>
            <div className="bg-glow"></div>
            <div className="bg-glow-2"></div>

            <div style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--glass-border)',
                padding: '3rem',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 0 40px rgba(188, 19, 254, 0.1)',
                margin: '2rem auto',
                flexShrink: 0
            }}>
                <i className="fas fa-lock" style={{ fontSize: '3rem', color: 'var(--neon-purple)', marginBottom: '1.5rem' }}></i>
                <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem', letterSpacing: '-1px' }}>
                    {isLogin ? 'Secure Access' : 'Create Identity'}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {isLogin ? 'Authenticate to access the discovery network.' : 'Register to solve problems and showcase skills.'}
                </p>

                {errorMsg && (
                    <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid var(--neon-orange)', color: 'var(--neon-orange)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div style={{ background: 'rgba(0,255,0,0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.8)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'var(--text-main)',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Passkey</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.8)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'var(--text-main)',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    {!isLogin && (
                        <>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--neon-purple)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Alias / Username</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="NeuralNinja"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{
                                        width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                                        borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--neon-orange)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Account Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    style={{
                                        width: '100%', padding: '14px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)',
                                        borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', cursor: 'pointer'
                                    }}
                                >
                                    <option value="engineer">Engineer (Problem Solver / Finder)</option>
                                    <option value="producer">Producer (Agreements & Sourcing)</option>
                                    <option value="sponsor">Sponsor (Funding / Investments)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--neon-green)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Professional Bio</label>
                                <textarea
                                    placeholder="Briefly describe your expertise or goals..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows="3"
                                    style={{
                                        width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                                        borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', resize: 'vertical'
                                    }}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--neon-blue)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Years of EXP</label>
                                    <input
                                        type="number"
                                        value={experienceYears}
                                        onChange={(e) => setExperienceYears(e.target.value)}
                                        style={{
                                            width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                                            borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--neon-orange)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Location (Remote/City)</label>
                                    <input
                                        type="text"
                                        placeholder="San Francisco, CA"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        style={{
                                            width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                                            borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '1rem'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--neon-blue)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>GitHub Profile URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/..."
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        style={{
                                            width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                                            borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem'
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--neon-purple)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Portfolio / Site</label>
                                    <input
                                        type="url"
                                        placeholder="https://myportfolio.com"
                                        value={portfolioUrl}
                                        onChange={(e) => setPortfolioUrl(e.target.value)}
                                        style={{
                                            width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                                            borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem'
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" disabled={loading} style={{
                        background: 'var(--accent-gradient)',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: '0 4px 15px rgba(188, 19, 254, 0.3)',
                        opacity: loading ? 0.7 : 1
                    }}>
                        {loading ? 'Processing...' : (isLogin ? 'Authenticate' : 'Register Profile')}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? "Don't have an identity?" : "Already registered?"}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--neon-blue)',
                            marginLeft: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textDecoration: 'underline'
                        }}
                    >
                        {isLogin ? 'Create one' : 'Login here'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
