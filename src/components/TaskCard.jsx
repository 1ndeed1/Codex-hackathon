/* src/components/TaskCard.jsx */
import React from 'react';

const TaskCard = ({ task, onClick }) => {
    const getDifficultyColor = () => {
        switch (task.difficulty.toLowerCase()) {
            case 'critical': return 'var(--neon-orange)';
            case 'high': return 'var(--neon-purple)';
            default: return 'var(--neon-blue)';
        }
    };

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
                height: '100%'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.borderColor = 'var(--neon-blue)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 242, 255, 0.1)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    <i className={`fab fa-${task.source.toLowerCase()}`} style={{ marginRight: '6px' }}></i>
                    {task.source} / {task.channel}
                </span>
                <span style={{
                    fontSize: '0.65rem',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: getDifficultyColor(),
                    border: `1px solid ${getDifficultyColor()}`,
                    fontWeight: 800,
                    textTransform: 'uppercase'
                }}>
                    {task.difficulty}
                </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', lineHeight: '1.4' }}>{task.title}</h3>

            <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1
            }}>
                {task.content}
            </p>

            <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {task.tags.map(tag => (
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
                        <i className="fas fa-bolt" style={{ color: 'var(--neon-orange)', fontSize: '0.7rem' }}></i>
                        <span style={{ color: 'var(--neon-orange)', fontWeight: 800, fontSize: '0.75rem' }}>
                            {task.bounty || 300} <small>ST</small>
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
                        {task.human_ingenuity_required && (
                            <i className="fas fa-brain" style={{ color: 'var(--neon-blue)', fontSize: '0.9rem' }} title="Human Ingenuity Required"></i>
                        )}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Resistance: 100%</span>
                    </div>
                    <span style={{ color: 'var(--neon-blue)', fontSize: '0.8rem', fontWeight: 700 }}>View Logic &rarr;</span>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
