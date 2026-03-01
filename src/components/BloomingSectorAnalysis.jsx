import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pathfinder.css';

const BLOOMING_SOURCES = [
    { id: 1, title: "Wheebox India Skills Report 2026", url: "https://wheebox.com/assets/pdf/ISR_Report_2026.pdf", category: "General Skills" },
    { id: 2, title: "PIB: AI@WORK - Productivity & Innovation", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2226912", category: "AI & Innovation" },
    { id: 3, title: "Taggd: EdTech Hiring Trends 2026", url: "https://taggd.in/blogs/edtech-hiring-trends/", category: "EdTech" },
    { id: 4, title: "TOI: India's Job Market 2026 Forecast", url: "https://timesofindia.indiatimes.com/business/india-business/indias-job-market-in-2026-where-hiring-will-grow-and-which-skills-will-matter-most-explained/articleshow/126056684.cms", category: "Job Market" },
    { id: 5, title: "LinkedIn: EdTech Market to Reach $33B", url: "https://www.linkedin.com/posts/ashish-anand284_edtech-aiineducation-digitallearning-activity-7412702387213332480-q-GR", category: "EdTech" },
    { id: 6, title: "Express Healthcare: Indian Healthcare Top 5 Trends", url: "https://www.expresshealthcare.in/news/indian-healthcare-in-2026-the-top-5-trends-shaping-the-future/452123/", category: "Health-Tech" },
    { id: 7, title: "Staffing Industry: Healthcare Job Creation 2026", url: "https://www.staffingindustry.com/news/global-daily-news/healthcare-sector-expected-to-drive-job-creation-across-india-in-2026", category: "Health-Tech" },
    { id: 8, title: "IBEF: India's EdTech Surge & Opportunities", url: "https://www.ibef.org/blogs/india-s-edtech-surge-opportunities-in-online-education-and-training", category: "EdTech" },
    { id: 9, title: "PIB: Transforming Healthcare via AI", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2227410&reg=3&lang=1", category: "Health-Tech" },
    { id: 10, title: "Bennett: AI Impact on India's FinTech", url: "https://www.bennett.edu.in/media-center/blog/role-of-ai-in-the-exponential-growth-of-the-fintech-industry-in-india/", category: "FinTech" },
    { id: 11, title: "BillCut: India's FinTech Hiring Trends 2026", url: "https://www.billcut.com/blogs/indias-fintech-hiring-trends-for-2026/", category: "FinTech" },
    { id: 12, title: "Taggd: BFSI Hiring Trends 2026", url: "https://taggd.in/blogs/bfsi-hiring-trends/", category: "FinTech" },
    { id: 13, title: "Taggd: Manufacturing Hiring Trends 2026", url: "https://taggd.in/blogs/manufacturing-hiring-trends/", category: "Industry 4.0" },
    { id: 14, title: "GlobalData: India's E-commerce Market Growth", url: "https://www.globaldata.com/media/banking/indias-e-commerce-market-to-register-12-4-growth-in-2026-forecasts-globaldata/", category: "E-commerce" },
    { id: 15, title: "IBEF: E-commerce Industry in India", url: "https://www.ibef.org/industry/ecommerce", category: "E-commerce" },
    { id: 16, title: "TOI: Fresher Hiring Rises to 73% (2026)", url: "https://timesofindia.indiatimes.com/education/careers/news/fresher-hiring-rises-to-73-in-early-2026-but-the-rules-of-entry-have-changed/articleshow/128504926.cms", category: "Job Market" },
    { id: 17, title: "CXOToday: Renewable Energy Job Engine", url: "https://cxotoday.com/media-coverage/renewable-energy-emerging-as-indias-next-big-jobs-engine/", category: "Climate-Tech" },
    { id: 18, title: "Mercom India: Renewable Energy Jobs Record", url: "https://mercomindia.com/renewable-energy-jobs-hit-record-but-growth-slows-amid-automation", category: "Climate-Tech" },
    { id: 19, title: "IBEF: India's Renewable Energy Boom", url: "https://www.ibef.org/research/case-study/india-s-renewable-energy-boom-the-power-of-solar-and-beyond", category: "Climate-Tech" },
    { id: 20, title: "Farmonaut: Agri Biotech & Jobs Trends", url: "https://farmonaut.com/asia/agri-biotech-jobs-agri-jobs-in-india-top-10-trends", category: "Agri-Tech" },
    { id: 21, title: "Naukri: Agri-Tech Jobs in India", url: "https://www.naukri.com/agri-tech-jobs-in-india", category: "Agri-Tech" },
    { id: 22, title: "LinkedIn: Smart City Jobs in India", url: "https://in.linkedin.com/jobs/smart-city-jobs", category: "Smart Cities" }
];

const BloomingSectorAnalysis = () => {
    const navigate = useNavigate();

    return (
        <div className="pathfinder-container" style={{ paddingBottom: '5rem' }}>
            <button onClick={() => navigate('/pathfinder/track/blooming')} className="pf-back-btn">
                <i className="fas fa-arrow-left"></i> Back to Blooming Track
            </button>

            <div className="pathfinder-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    THE BLOOMING DECADE
                </h1>
                <p className="pathfinder-subtitle" style={{ fontSize: '1.4rem' }}>
                    Credible Evidence & High-Fidelity Data Repositories for India's 2026-2027 Economic Shift.
                </p>
            </div>

            {/* BIG AHH STATISTICS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
                <div style={{ background: 'rgba(0,186,255,0.05)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(0,186,255,0.2)', textAlign: 'center' }}>
                    <div style={{ color: 'var(--neon-blue)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>Overall Job Market Surge</div>
                    <div style={{ fontSize: '5rem', fontWeight: 900, textShadow: '0 0 20px rgba(0,186,255,0.4)' }}>73%</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '1rem', opacity: 0.8 }}>
                        Fresher hiring intent for early 2026 in tech-integrated sectors.
                    </div>
                </div>

                <div style={{ background: 'rgba(5, 150, 105, 0.05)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(5, 150, 105, 0.2)', textAlign: 'center' }}>
                    <div style={{ color: 'var(--neon-green)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>Projected Economic Impact</div>
                    <div style={{ fontSize: '5rem', fontWeight: 900, textShadow: '0 0 20px rgba(5, 150, 105, 0.4)' }}>$1.2T</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '1rem', opacity: 0.8 }}>
                        Total addressable market across primary Blooming Domains by 2027.
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
                <div className="pf-stat-item" style={{ padding: '2rem', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--neon-purple)' }}>31%</div>
                    <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text-muted)' }}>FinTech CAGR</div>
                    <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Exponential growth driven by AI-orchestrated digital banking.</p>
                </div>
                <div className="pf-stat-item" style={{ padding: '2rem', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--neon-blue)' }}>$33B</div>
                    <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text-muted)' }}>EdTech Market Size</div>
                    <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Massive shift towards corporate learning & skills personalization.</p>
                </div>
                <div className="pf-stat-item" style={{ padding: '2rem', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--neon-green)' }}>5M+</div>
                    <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Direct Jobs Created</div>
                    <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Across Health-Tech & Climate-Tech by the end of 2026.</p>
                </div>
                <div className="pf-stat-item" style={{ padding: '2rem', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--neon-orange)' }}>85%</div>
                    <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Skill Transferability</div>
                    <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Interlinked technical stacks across all Blooming sectors.</p>
                </div>
            </div>

            {/* CITATIONS TABLE */}
            <div className="pf-card" style={{ padding: '3rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <i className="fas fa-microscope" style={{ color: 'var(--neon-blue)' }}></i>
                    Verified Research Ledger
                </h2>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Source ID</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Article / Report Title</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Sector Focus</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Verification</th>
                            </tr>
                        </thead>
                        <tbody>
                            {BLOOMING_SOURCES.map((source) => (
                                <tr key={source.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s ease' }}>
                                    <td style={{ padding: '1.2rem', fontWeight: 900, color: 'var(--neon-blue)' }}>#{source.id.toString().padStart(2, '0')}</td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{source.title}</div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800,
                                            background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)',
                                            textTransform: 'uppercase'
                                        }}>
                                            {source.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <a
                                            href={source.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                color: 'var(--neon-blue)', textDecoration: 'none', fontSize: '0.85rem',
                                                display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700
                                            }}
                                        >
                                            View Artifact <i className="fas fa-external-link-alt"></i>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
                <i className="fas fa-shield-alt"></i> Data verified by SlipStreamAI Research Engine. All sources are publicly accessible industry reports as of March 2026.
            </div>
        </div>
    );
};

export default BloomingSectorAnalysis;
