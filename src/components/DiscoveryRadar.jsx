/* src/components/DiscoveryRadar.jsx */
import React, { useState, useEffect } from 'react';

const DiscoveryRadar = () => {
    const [activeSource, setActiveSource] = useState('GitHub');
    const sources = ['GitHub', 'Career Pages', 'Startup Blogs', 'Twitter (X)', 'Discord', 'Quora'];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSource(sources[Math.floor(Math.random() * sources.length)]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            background: 'rgba(0, 242, 255, 0.05)',
            border: '1px solid var(--neon-blue)',
            borderRadius: '12px',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        }}>
            <div style={{
                width: '10px',
                height: '10px',
                background: 'var(--neon-blue)',
                borderRadius: '50%',
                boxShadow: '0 0 10px var(--neon-blue)',
                animation: 'pulse 1.5s infinite'
            }}></div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-muted)' }}>Discovery Radar Active:</span>
                <span style={{ color: 'var(--neon-blue)', marginLeft: '8px' }}>Scanning {activeSource}...</span>
            </div>

            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default DiscoveryRadar;
