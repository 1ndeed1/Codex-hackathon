import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
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
                    onLogin(data.user.email);
                    if (data.session === null) {
                        setErrorMsg("Check your email for the confirmation link!");
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'var(--bg-dark)',
            zIndex: 9999
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
                boxShadow: '0 0 40px rgba(188, 19, 254, 0.1)'
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
                                background: 'rgba(0,0,0,0.5)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'white',
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
                                background: 'rgba(0,0,0,0.5)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'white',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

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
