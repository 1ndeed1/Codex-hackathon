import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PathfinderService from '../services/pathfinder_service';
import { generateCompanyRoadmaps } from '../services/pseudo_ai_generator';
import { DOMAIN_DATA } from '../services/liveDataService';
import './Pathfinder.css';

function PathfinderRoadmap({ identity }) {
    const { domainId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Core State
    const [domainName, setDomainName] = useState("Loading...");
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isCustom, setIsCustom] = useState(false);
    const [isSaturated, setIsSaturated] = useState(false);

    // Interactive State
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolledTargetId, setEnrolledTargetId] = useState(null);
    const [quizState, setQuizState] = useState({
        active: false,
        weekIndex: null,
        currentQuestion: 0,
        score: 0,
        correct: 0,
        wrong: 0,
        attempts: 0,
        finished: false
    });
    const [overallFitness, setOverallFitness] = useState(null); // 'Not Fit', 'Developing', 'Highly Fit'

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setIsSaturated(false);

            if (domainId === 'custom') {
                const searchParams = new URLSearchParams(location.search);
                const companyName = searchParams.get('company') || "Unknown Company";

                setDomainName(`${companyName} Target Roadmap`);
                setIsCustom(true);

                const customRoadmaps = generateCompanyRoadmaps(companyName);

                setRoadmaps(customRoadmaps);
                setSelectedCompany(customRoadmaps[0]);
                setLoading(false);
                return;
            }

            // Define "Low Demand" domains that shouldn't have roadmaps (as requested)
            const lowDemandIds = ['manual-qa', 'desktop-dev'];
            if (lowDemandIds.includes(domainId)) {
                setIsSaturated(true);
                setDomainName(domainId === 'manual-qa' ? "Manual QA Tester" : "Native Desktop Developer");
                setLoading(false);
                return;
            }

            // Normal Domain fetching
            const allDomains = await PathfinderService.getTrendingDomains();
            const currentDomain = allDomains.find(d => d.id === domainId);
            if (currentDomain) {
                setDomainName(currentDomain.name);
            } else if (DOMAIN_DATA[domainId]) {
                setDomainName(DOMAIN_DATA[domainId].title);
            } else {
                setDomainName("Domain Roadmap");
            }

            let roadmapData = await PathfinderService.getRoadmapsForDomain(domainId);

            // Fallback for domains added via mock/liveDataService but not in DB yet
            if (roadmapData.length === 0 && DOMAIN_DATA[domainId]) {
                const fallback = DOMAIN_DATA[domainId];
                roadmapData = [{
                    id: `fallback-${fallback.id}`,
                    company_name: "Industry Standard",
                    company_target: "Global Market Entry",
                    market_context: `This roadmap aggregates requirements from current high-growth firms in the ${fallback.title} sector.`,
                    required_skills: [...new Set([
                        ...(fallback.roadmap.month1_2.skills || []),
                        ...(fallback.roadmap.month3_4.skills || []),
                        ...(fallback.roadmap.month5_6?.skills || [])
                    ])],
                    weekly_plan: [
                        { phase: "1", duration: "Months 1-2", focus: fallback.roadmap.month1_2.focus, tasks: fallback.roadmap.month1_2.skills },
                        { phase: "2", duration: "Months 3-4", focus: fallback.roadmap.month3_4.focus, tasks: fallback.roadmap.month3_4.skills },
                        { phase: "3", duration: "Months 5-6", focus: fallback.roadmap.month5_6?.focus || "Advanced Skills", tasks: fallback.roadmap.month5_6?.skills || [] }
                    ]
                }];
            }

            // Inject mock resources, quizzes, and internships into roadmaps
            roadmapData = roadmapData.map(rm => ({
                ...rm,
                internships: rm.internships || [
                    { role: `${domainName} Intern`, link: "#", term: "Ongoing" }
                ],
                weekly_plan: (rm.weekly_plan || []).map(wp => ({
                    ...wp,
                    resources: wp.resources || [
                        { type: "youtube", title: `${wp.focus} Tutorial`, link: "https://youtube.com" },
                        { type: "doc", title: "Official Documentation", link: "#" }
                    ],
                    quiz: wp.quiz || [
                        { q: `What is the most critical concept in ${wp.focus}?`, options: ["Concept A", "Concept B", "System Design", "Testing"], ans: 2 }
                    ]
                }))
            }));

            setRoadmaps(roadmapData);
            if (roadmapData.length > 0) {
                setSelectedCompany(roadmapData[0]);
            }
            setLoading(false);
        }

        loadData();
    }, [domainId, location.search, domainName]);

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
        alert(`The Proctored Industry Assessment for Week ${weekIndex + 1} has been opened in a new secure tab. \n\nPlease navigate to that tab. Keep in mind that leaving that tab or minimizing it will result in an automatic failure warning.`);
    };

    if (loading) {
        return (
            <div className="pf-loader">
                <div className="pf-spinner"></div>
                <span>Analyzing Market Data for {domainId === 'custom' ? 'Target Company' : 'Domain'}...</span>
            </div>
        );
    }

    if (isSaturated) {
        return (
            <div className="pathfinder-container">
                <button onClick={() => navigate('/pathfinder')} className="pf-back-btn">
                    <i className="fas fa-arrow-left"></i> Back to Domains
                </button>
                <div className="pf-card" style={{ textAlign: 'center', padding: '4rem', marginTop: '2rem' }}>
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '4rem', color: '#f59e0b', marginBottom: '1.5rem' }}></i>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{domainName}: Market Alert</h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        Our 24/7 market scanner identifies this domain as <strong>High Saturation / Low Hiring Demand</strong>.
                        Pursuing this path may lead to significant job vacancy challenges.
                    </p>
                    <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-xl mb-6 inline-block">
                        <p style={{ fontWeight: 'bold', color: 'var(--neon-blue)', margin: 0 }}>
                            <i className="fas fa-lightbulb mr-2"></i> Strategy: Pivot to a High Demand or Core Engineering domain.
                        </p>
                    </div>
                    <div>
                        <button onClick={() => navigate('/pathfinder')} className="pf-btn-generate">
                            Browse High Growth Domains
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pathfinder-container">
            <button onClick={() => navigate('/pathfinder')} className="pf-back-btn">
                <i className="fas fa-arrow-left"></i> Back to Domains
            </button>

            <div className="pathfinder-header" style={{ marginBottom: '2rem' }}>
                <h1 className="pathfinder-title">{domainName}</h1>
                <p className="pathfinder-subtitle">
                    {isCustom
                        ? `A custom-generated battle plan based on real-time data from ${selectedCompany?.company_name}.`
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PathfinderRoadmap;
