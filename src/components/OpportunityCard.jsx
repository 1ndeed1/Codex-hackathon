/* src/components/OpportunityCard.jsx */
import React from 'react';

const OpportunityCard = ({ opp, onClick }) => {
    const isMined = opp.type === 'mined';
    const accentColor = isMined ? 'var(--neon-blue)' : 'var(--neon-purple)';

    return (
        <div
            className="glass-panel animate-fade"
            onClick={onClick}
            style={{
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderLeft: `4px solid ${accentColor}`,
                background: isMined
                    ? `linear-gradient(135deg, rgba(0, 242, 255, 0.05) 0%, transparent 100%)`
                    : `linear-gradient(135deg, rgba(188, 19, 254, 0.05) 0%, transparent 100%)`
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.borderColor = accentColor;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
        >
            <div style={{ position: 'absolute', top: '10px', right: '15px', display: 'flex', gap: '8px' }}>
                {isMined && (
                    <span style={{
                        fontSize: '0.6rem',
                        background: 'var(--neon-blue)',
                        color: '#000',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 900
                    }}>PREDICTIVE Signal</span>
                )}
                <span style={{
                    fontSize: '0.6rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${accentColor}`,
                    color: accentColor,
                    fontWeight: 800
                }}>{opp.difficulty}</span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <i className={isMined ? "fas fa-radar" : "fas fa-bolt"} style={{ color: accentColor, marginRight: '6px' }}></i>
                    {opp.source} / {opp.channel}
                </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', lineHeight: '1.4' }}>{opp.title}</h3>

            <div style={{ flex: 1 }}>
                {isMined ? (
                    <>
                        <div style={{
                            background: 'rgba(0,0,0,0.3)',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            border: '1px dashed var(--glass-border)'
                        }}>
                            <label style={{ fontSize: '0.6rem', color: 'var(--neon-blue)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Technical Signal</label>
                            <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{opp.signal}"</p>
                        </div>
                        <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{opp.inference}</p>
                    </>
                ) : (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{opp.content}</p>
                )}
            </div>

            <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {opp.tags.map(tag => (
                        <span key={tag} style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--glass-border)'
                        }}>{tag}</span>
                    ))}

                    <div style={{
                        marginLeft: 'auto',
                        background: 'rgba(255, 140, 0, 0.1)',
                        border: '1px solid var(--neon-orange)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <i className="fas fa-briefcase" style={{ color: 'var(--neon-orange)', fontSize: '0.7rem' }}></i>
                        <span style={{ color: 'var(--neon-orange)', fontWeight: 800, fontSize: '0.75rem' }}>
                            Job Likelihood: {opp.jobProbability}
                        </span>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--glass-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-clock" style={{ color: accentColor, fontSize: '0.8rem' }}></i>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Urgency: {opp.hiringUrgency}
                        </span>
                    </div>
                    <span style={{ color: accentColor, fontSize: '0.8rem', fontWeight: 700 }}>Inspect Opportunity &rarr;</span>
                </div>
            </div>
        </div>
    );
};

export default OpportunityCard;
