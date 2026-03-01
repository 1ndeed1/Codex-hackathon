import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PathfinderService from '../services/pathfinder_service';
import { fetchLiveDomainDetails } from '../services/liveDataService';
import { generateCompanyRoadmaps } from '../services/pseudo_ai_generator';
import './Pathfinder.css';

function PathfinderRoadmap({ identity }) {
    const { domainId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Core State
    const [domainData, setDomainData] = useState(null);
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isCustom, setIsCustom] = useState(false);

    // Interactive State
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolledTargetId, setEnrolledTargetId] = useState(null);

    useEffect(() => {
        async function loadData() {
            setLoading(true);

            if (domainId === 'custom') {
                const searchParams = new URLSearchParams(location.search);
                const companyName = searchParams.get('company') || "Unknown Company";

                setIsCustom(true);
                const customRoadmaps = generateCompanyRoadmaps(companyName);

                setRoadmaps(customRoadmaps);
                setSelectedCompany(customRoadmaps[0]);
                setLoading(false);
                return;
            }

            try {
                // Try fetching from high-fidelity liveDataService first
                const liveDomain = await fetchLiveDomainDetails(domainId);
                setDomainData(liveDomain);

                const simulatedRoadmap = {
                    id: liveDomain.id,
                    company_name: "Industry Standard",
                    company_target: liveDomain.title,
                    market_context: liveDomain.gapAnalysis,
                    required_skills: [
                        ...(liveDomain.roadmap.month1_2?.skills || []),
                        ...(liveDomain.roadmap.month3_4?.skills || []),
                        ...(liveDomain.roadmap.month5_6?.skills || [])
                    ],
                    weekly_plan: [
                        { phase: "1-2 Months", duration: "8 Weeks", focus: liveDomain.roadmap.month1_2?.focus, tasks: liveDomain.roadmap.month1_2?.skills },
                        { phase: "3-4 Months", duration: "8 Weeks", focus: liveDomain.roadmap.month3_4?.focus, tasks: liveDomain.roadmap.month3_4?.skills },
                        { phase: "5-6 Months", duration: "8 Weeks", focus: liveDomain.roadmap.month5_6?.focus, tasks: liveDomain.roadmap.month5_6?.skills }
                    ],
                    internships: liveDomain.projects ? liveDomain.projects.map(p => ({ role: p.name, link: "#", term: "Project Based" })) : [
                        { role: `${liveDomain.title} Intern`, link: "#", term: "Upcoming Summer" }
                    ]
                };

                setRoadmaps([simulatedRoadmap]);
                setSelectedCompany(simulatedRoadmap);
            } catch {
                // Fallback to Supabase if not in liveDataService
                const dbDomains = await PathfinderService.getTrendingDomains();
                const currentDBDomain = dbDomains.find(d => d.id === domainId);
                setDomainData(currentDBDomain ? { title: currentDBDomain.name, ...currentDBDomain } : null);

                let dbRoadmaps = await PathfinderService.getRoadmapsForDomain(domainId);
                dbRoadmaps = dbRoadmaps.map(rm => ({
                    ...rm,
                    internships: rm.internships || [{ role: "Technical Intern", link: "#", term: "Flexible" }],
                    weekly_plan: rm.weekly_plan.map(wp => ({
                        ...wp,
                        resources: wp.resources || [
                            { type: "youtube", title: `${wp.focus} Overview`, link: "https://youtube.com" }
                        ],
                        quiz: wp.quiz || [{ q: `Primary goal of ${wp.focus}?`, options: ["A", "B", "C", "D"], ans: 0 }]
                    }))
                }));

                setRoadmaps(dbRoadmaps);
                if (dbRoadmaps.length > 0) setSelectedCompany(dbRoadmaps[0]);
            }

            setLoading(false);
        }

        loadData();
    }, [domainId, location.search]);

    const handleBack = () => {
        if (domainData?.track) {
            navigate(`/pathfinder/track/${domainData.track}`);
        } else {
            navigate('/pathfinder');
        }
    };

    const handleEnroll = () => {
        if (!identity || !identity.id) {
            alert("You must be logged in to enroll in a Pathfinder roadmap.");
            return;
        }
        setIsEnrolled(true);
        setEnrolledTargetId(selectedCompany.id);
        alert(`Successfully enrolled in the ${selectedCompany.company_name} track!`);
    };

    const startProctoredExam = (weekIndex) => {
        if (!selectedCompany) return;
        const encodeName = encodeURIComponent(selectedCompany.company_name);
        const examUrl = `/assessment/${encodeName}/${weekIndex}`;

        window.open(examUrl, '_blank', 'noopener,noreferrer');
        alert(`The Proctored Industry Assessment for Week ${weekIndex + 1} has been opened in a new secure tab.`);
    };

    if (loading) {
        return (
            <div className="pf-loader">
                <div className="pf-spinner"></div>
                <span>Analyzing Market Data for {domainId === 'custom' ? 'Target Company' : 'Domain'}...</span>
            </div>
        );
    }

    const domainTitle = isCustom ? selectedCompany?.company_name + " Target" : (domainData?.title || domainData?.name || "Domain Roadmap");

    return (
        <div className="pathfinder-container">
            <button onClick={handleBack} className="pf-back-btn">
                <i className="fas fa-arrow-left"></i> Back to {domainData?.track ? 'Track' : 'Domains'}
            </button>

            <div className="pathfinder-header" style={{ marginBottom: '2rem' }}>
                <h1 className="pathfinder-title">{domainTitle}</h1>
                <p className="pathfinder-subtitle">
                    {isCustom
                        ? `A custom-generated battle plan based on real-time data from ${selectedCompany?.company_name}.`
                        : domainData?.track === 'blooming'
                            ? `Strategic roadmap for India's high-growth ${domainData.title} sector. Focus on the hybrid skills gap.`
                            : `Tailored learning strategies based on hiring requirements. Choose a profile below.`}
                </p>

                {selectedCompany && !isEnrolled && (
                    <button onClick={handleEnroll} className="pf-btn-generate" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                        <i className="fas fa-rocket"></i> Enroll & Begin Training
                    </button>
                )}
                {isEnrolled && enrolledTargetId === selectedCompany?.id && (
                    <div className="mt-4 px-4 py-2 bg-teal-900/30 border border-teal-500 text-teal-300 rounded-xl inline-block font-semibold">
                        <i className="fas fa-check-circle mr-2"></i> Actively Enrolled
                    </div>
                )}
            </div>

            <div className="pf-layout">
                {/* Sidebar */}
                <div className="pf-sidebar">
                    <div className="pf-company-list">
                        <h3 className="pf-company-list-title">{isCustom ? 'Generated Targets' : 'Target Profiles'}</h3>
                        {roadmaps.map((rm) => (
                            <button
                                key={rm.id}
                                onClick={() => {
                                    setSelectedCompany(rm);
                                    if (enrolledTargetId !== rm.id) setIsEnrolled(false);
                                    else setIsEnrolled(true);
                                }}
                                className={`pf-company-btn ${selectedCompany?.id === rm.id ? 'active' : ''}`}
                            >
                                <div className="pf-company-btn-title">{rm.company_name}</div>
                                <div className="pf-company-btn-target">{rm.company_target}</div>
                            </button>
                        ))}
                    </div>

                    {/* Internships Section */}
                    {selectedCompany?.internships && (
                        <div className="pf-company-list" style={{ marginTop: '2rem' }}>
                            <h3 className="pf-company-list-title" style={{ fontSize: '1rem' }}><i className="fas fa-briefcase text-neon-blue mr-2"></i> Top Internships</h3>
                            <div className="space-y-3">
                                {selectedCompany.internships.map((intern, i) => (
                                    <div key={i} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                        <div className="font-bold text-sm text-white">{intern.role}</div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-gray-400">{intern.term}</span>
                                            <a href={intern.link} className="text-xs text-teal-400 hover:underline">Apply</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="pf-content">
                    {selectedCompany && (
                        <div>
                            {/* Market Context Banner */}
                            {!isEnrolled && (
                                <div className="pf-market-context">
                                    <h4 className="pf-market-context-header"><i className="fas fa-chart-line"></i> Market & Hiring Intelligence</h4>
                                    <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                        {selectedCompany.market_context}
                                    </p>
                                </div>
                            )}

                            {/* WARNING if not recommended */}
                            {isCustom && selectedCompany.is_recommended === false && (
                                <div className="p-5 mb-6 bg-red-900/20 border border-red-500/50 rounded-xl">
                                    <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                                        <i className="fas fa-exclamation-triangle"></i> Hiring Freeze / Saturated Role
                                    </h4>
                                    <p className="text-gray-300 text-sm">
                                        Based on real-time analysis, preparing specifically for this role at {selectedCompany.company_name} is currently high-risk. We strongly advise pivoting to a different track or focusing on a different company.
                                    </p>
                                </div>
                            )}

                            {/* Skills Tag Section */}
                            <div className="pf-card">
                                <h4 className="pf-card-title"><i className="fas fa-laptop-code"></i> Required Technologies</h4>
                                <div className="pf-tags">
                                    {selectedCompany.required_skills?.map((skill, idx) => (
                                        <span key={idx} className="pf-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Weekly Plan Stepper */}
                            <div className="pf-card" style={{ marginTop: '2rem' }}>
                                <h4 className="pf-card-title"><i className="fas fa-calendar-alt"></i> Execution Timeline</h4>

                                <div className="pf-timeline">
                                    {selectedCompany.weekly_plan?.map((week, idx) => (
                                        <div key={idx} className="pf-timeline-item">
                                            <div className="pf-timeline-dot"></div>
                                            <div className="pf-timeline-content">
                                                <h5 className="pf-week-title">Phase {week.phase} ({week.duration}): <span>{week.focus}</span></h5>

                                                <ul className="pf-task-list mb-4">
                                                    {week.tasks?.map((task, tIdx) => (
                                                        <li key={tIdx}>{task}</li>
                                                    ))}
                                                </ul>

                                                {/* Resources Section */}
                                                {week.resources && (
                                                    <div className="mb-4 pt-3 border-t border-gray-200">
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Learning Resources</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {week.resources.map((res, rIdx) => (
                                                                <a key={rIdx} href={res.link} target="_blank" rel="noreferrer" className="pf-resource-link">
                                                                    <i className={`fab fa-${res.type === 'youtube' ? 'youtube text-red-500' : res.type === 'git' ? 'github text-gray-800' : 'file-alt text-blue-500'}`}></i>
                                                                    {res.title}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Assessment Trigger */}
                                                {isEnrolled && week.quiz && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                                        <span className="text-sm text-gray-400">Prove your knowledge to advance.</span>
                                                        <button
                                                            onClick={() => startProctoredExam(idx)}
                                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors shadow-md"
                                                        >
                                                            <i className="fas fa-external-link-alt mr-2"></i> Take Proctored Exam
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Authoritative Sources Section */}
                            {domainData?.sources && domainData.sources.length > 0 && (
                                <div className="pf-card" style={{ marginTop: '2rem' }}>
                                    <h4 className="pf-card-title">
                                        <i className="fas fa-file-invoice" style={{ color: 'var(--neon-blue)' }}></i>
                                        Research & Authoritative Sources
                                    </h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                        The roadmap and market statistics above are derived from the following industry reports and government releases.
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                                        {domainData.sources.map((source, sIdx) => (
                                            <a
                                                key={sIdx}
                                                href={source.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '1rem',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '12px',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                                    e.currentTarget.style.borderColor = 'var(--neon-blue)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                                                }}
                                            >
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '8px',
                                                    background: 'rgba(0,186,255,0.1)', color: 'var(--neon-blue)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    <i className="fas fa-link"></i>
                                                </div>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                                    {source.name}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PathfinderRoadmap;
