import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateCompanyRoadmaps } from '../services/pseudo_ai_generator';

function AssessmentPlatform({ identity }) {
    const { companyName, weekIndex } = useParams();
    const navigate = useNavigate();

    // Core State
    const [loading, setLoading] = useState(true);
    const [assessmentData, setAssessmentData] = useState(null);
    const [examStarted, setExamStarted] = useState(false);
    const [examFinished, setExamFinished] = useState(false);

    // Proctoring State
    const [permissionsGranted, setPermissionsGranted] = useState({ mic: false, cam: false, screen: false });
    const [warnings, setWarnings] = useState(0);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const screenStreamRef = useRef(null);

    // Exam State
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({}); // { 0: { type: 'mcq', ans: 1 }, 1: { type: 'text', text: "my reasoning..." } }
    const [scoreResult, setScoreResult] = useState(null);

    useEffect(() => {
        // Fetch/Generate the strict exam questions based on the route params
        // Note: For demo stability, we generate the roadmap dynamically based on the company name 
        // passed in the URL, then select the specific week's quiz.
        const roadmaps = generateCompanyRoadmaps(decodeURIComponent(companyName));
        // Pick the first track for the exam context
        const roadmap = roadmaps[0];

        if (roadmap && roadmap.weekly_plan && roadmap.weekly_plan[weekIndex]) {
            setAssessmentData({
                company: roadmap.company_name,
                role: roadmap.company_target,
                weekLabel: `Phase ${roadmap.weekly_plan[weekIndex].phase} (${roadmap.weekly_plan[weekIndex].duration}): ${roadmap.weekly_plan[weekIndex].focus}`,
                questions: roadmap.weekly_plan[weekIndex].quiz
            });
        }
        setLoading(false);

        return () => {
            // Cleanup streams on unmount
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(t => t.stop());
        };
    }, [companyName, weekIndex]);

    // Proctoring Enforcement
    useEffect(() => {
        if (!examStarted || examFinished) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                issueWarning("Tab switching detected! You must remain on this tab.");
            }
        };

        const handleBlur = () => {
            issueWarning("Window loss of focus detected! Do not open other applications.");
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.addEventListener("blur", handleBlur);
        };
    }, [examStarted, examFinished]);

    const issueWarning = (msg) => {
        setWarnings(prev => {
            const newCount = prev + 1;
            alert(`PROCTORING WARNING (${newCount}/3): ${msg}\n\nThree warnings will result in auto-failure.`);
            if (newCount >= 3) {
                forceFail("Exceeded maximum proctoring warnings.");
            }
            return newCount;
        });
    };

    const forceFail = (reason) => {
        setExamFinished(true);
        setScoreResult({ score: 0, status: "FAILED", reason });
        stopRecording();
    };

    const requestPermissions = async () => {
        try {
            // Request Camera & Mic
            const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = userStream;
            if (videoRef.current) videoRef.current.srcObject = userStream;

            setPermissionsGranted(prev => ({ ...prev, cam: true, mic: true }));

            // Request Screen Share
            const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenStreamRef.current = displayStream;

            // If they stop sharing mid-exam
            displayStream.getVideoTracks()[0].onended = () => {
                if (examStarted && !examFinished) {
                    forceFail("Screen sharing was terminated manually.");
                }
            };

            setPermissionsGranted(prev => ({ ...prev, screen: true }));
        } catch (err) {
            console.error("Proctoring Permissions Error:", err);
            alert("You must explicitly grant Camera, Microphone, and Screen Sharing permissions to take this industry assessment.");
        }
    };

    const startExam = () => {
        if (!permissionsGranted.cam || !permissionsGranted.mic || !permissionsGranted.screen) {
            alert("All proctoring permissions must be granted before starting the exam.");
            return;
        }
        // Force Fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(e => console.log(e));
        }
        setExamStarted(true);
    };

    const handleAnswerSelection = (qType, value) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion]: { type: qType, value }
        }));
    };

    const nextQuestion = () => {
        if (currentQuestion < assessmentData.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            submitExam();
        }
    };

    const stopRecording = () => {
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(t => t.stop());
        if (document.exitFullscreen && document.fullscreenElement) {
            document.exitFullscreen().catch(e => console.log(e));
        }
    };

    const submitExam = () => {
        setExamFinished(true);
        stopRecording();

        // Calculate Score pseudo-logic
        let correctCount = 0;
        let totalWeight = assessmentData.questions.length;

        assessmentData.questions.forEach((q, idx) => {
            const userAns = answers[idx];
            if (q.type === 'scenario') {
                // For scenario text base, if they wrote more than 20 chars, give them credit (Demo Logic)
                if (userAns && userAns.value && userAns.value.length > 20) correctCount += 1;
            } else {
                if (userAns && userAns.value === q.ans) correctCount += 1;
            }
        });

        const percentage = Math.round((correctCount / totalWeight) * 100);

        let status = "FAILED";
        if (percentage >= 85) status = "EXPERT - PASSED";
        else if (percentage >= 60) status = "PROFICIENT - PASSED";

        const result = { score: percentage, status, reason: "Exam completed normally." };
        setScoreResult(result);

        // Save to global Profile / LocalStorage
        if (identity && identity.id) {
            const history = JSON.parse(localStorage.getItem(`assessment_history_${identity.id}`) || "[]");

            const prevAttempts = history.filter(h => h.company === assessmentData.company && h.role === assessmentData.role && h.week === assessmentData.weekLabel).length;
            const currentAttempt = prevAttempts + 1;

            let remark = "";
            if (status.includes("FAILED")) {
                if (currentAttempt >= 3) {
                    remark = "System Insight: High failure rate detected. Recommendation: Step back to prerequisite fundamentals and heavily review System Design documentation before re-attempting.";
                } else {
                    remark = "System Insight: Exam failed. Please review your incorrect answers and allocate additional study time before retrying.";
                }
            } else {
                remark = `System Insight: Passed successfully on attempt #${currentAttempt}. Solid engineering mindset.`;
            }

            history.push({
                company: assessmentData.company,
                role: assessmentData.role,
                week: assessmentData.weekLabel,
                score: percentage,
                status,
                date: new Date().toISOString(),
                correct: correctCount,
                wrong: totalWeight - correctCount,
                total: totalWeight,
                attempt: currentAttempt,
                remark,
                questions: assessmentData.questions,
                userAnswers: answers
            });
            localStorage.setItem(`assessment_history_${identity.id}`, JSON.stringify(history));
        }
    };

    if (loading) return <div className="p-10 text-center text-white font-bold">Loading Assessment Data...</div>;

    if (!assessmentData) return <div className="p-10 text-center text-red-500 font-bold">Error loading assessment. Invalid parameters.</div>;

    // --- RENDER EXAM FINISHED ---
    if (examFinished) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
                <div className="bg-gray-800 p-10 rounded-2xl border border-gray-700 max-w-2xl w-full text-center shadow-2xl">
                    <h1 className="text-3xl font-black mb-6">Assessment Concluded</h1>

                    <div className={`text-6xl font-black mb-4 ${scoreResult.score >= 60 ? 'text-green-500' : 'text-red-500'}`}>
                        {scoreResult.score}%
                    </div>
                    <div className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-8">
                        {scoreResult.status}
                    </div>

                    <div className="text-left bg-gray-900 p-6 rounded-xl border border-gray-700 mb-8">
                        <div className="text-sm text-gray-500 mb-1">Target Context</div>
                        <div className="font-bold text-lg mb-4">{assessmentData.company} - {assessmentData.role}</div>
                        <div className="text-sm text-gray-500 mb-1">Termination Reason</div>
                        <div className="font-medium text-gray-300">{scoreResult.reason}</div>
                    </div>

                    <p className="text-gray-400 text-sm mb-6">Your results have been securely recorded and attached to your public profile.</p>

                    <button
                        onClick={() => window.close()}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                    >
                        Close Tab & Return
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER PRE-EXAM SETUP ---
    if (!examStarted) {
        return (
            <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center font-sans">
                <div className="max-w-3xl w-full">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
                            Strict Proctoring Setup
                        </h1>
                        <p className="text-xl text-gray-300">
                            {assessmentData.company} - {assessmentData.role}
                        </p>
                        <p className="text-md text-gray-500 mt-2">{assessmentData.weekLabel}</p>
                    </div>

                    <div className="bg-gray-900 border border-red-900/50 rounded-2xl p-8 mb-8">
                        <h3 className="text-xl font-bold text-red-500 mb-6 flex items-center">
                            <i className="fas fa-shield-alt mr-3 pb-1"></i> Exam Rules & Enforcement
                        </h3>
                        <ul className="space-y-4 text-gray-300 font-medium">
                            <li className="flex items-start"><i className="fas fa-times text-red-500 mr-3 mt-1"></i> Switching tabs or exiting Fullscreen will issue a warning.</li>
                            <li className="flex items-start"><i className="fas fa-times text-red-500 mr-3 mt-1"></i> Clicking completely outside the browser window will issue a warning.</li>
                            <li className="flex items-start"><i className="fas fa-video text-blue-400 mr-3 mt-1"></i> Camera, Microphone, and entire Screen must be shared continuousy.</li>
                            <li className="flex items-start"><i className="fas fa-exclamation-triangle text-orange-500 mr-3 mt-1"></i> 3 Warnings = Automatic Failure.</li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                            <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-4">
                                <i className={`fas fa-video text-3xl ${permissionsGranted.cam ? 'text-green-500' : 'text-gray-500'}`}></i>
                            </div>
                            <h4 className="font-bold mb-2">Camera & Mic</h4>
                            {permissionsGranted.cam ? (
                                <span className="text-green-500 font-bold text-sm">Granted</span>
                            ) : (
                                <button onClick={requestPermissions} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-bold">Enable Access</button>
                            )}
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                            <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-4">
                                <i className={`fas fa-desktop text-3xl ${permissionsGranted.screen ? 'text-green-500' : 'text-gray-500'}`}></i>
                            </div>
                            <h4 className="font-bold mb-2">Screen Share</h4>
                            {permissionsGranted.screen ? (
                                <span className="text-green-500 font-bold text-sm">Granted</span>
                            ) : (
                                <span className="text-gray-600 text-sm">Waiting for permission grant...</span>
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={startExam}
                            disabled={!permissionsGranted.cam || !permissionsGranted.screen}
                            className={`px-10 py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all ${(!permissionsGranted.cam || !permissionsGranted.screen) ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer'}`}
                        >
                            <i className="fas fa-play mr-2"></i> Enter Secure Environment
                        </button>
                    </div>

                    {/* Hidden video element just for holding the stream to keep light on */}
                    <video ref={videoRef} autoPlay muted className="hidden"></video>
                </div>
            </div>
        );
    }

    // --- RENDER ACTIVE EXAM ---
    const qData = assessmentData.questions[currentQuestion];
    const userCurrentAns = answers[currentQuestion]?.value || "";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none">
            {/* Header / Proctoring Bar */}
            <header className="bg-red-700 text-white p-4 flex justify-between items-center shadow-md z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <video ref={videoRef} autoPlay muted className="w-24 h-16 object-cover bg-black rounded border-2 border-white/20"></video>
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                        <div className="font-black tracking-wider text-sm uppercase opacity-80">Proctored Assessment Active</div>
                        <div className="font-bold">{assessmentData.company} - {assessmentData.role}</div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-red-800/50 px-3 py-1.5 rounded text-sm font-bold">
                        <i className="fas fa-exclamation-triangle text-orange-400"></i>
                        Warnings: <span className={warnings > 0 ? 'text-orange-400' : 'text-white'}>{warnings}/3</span>
                    </div>
                    <div className="font-mono font-bold text-xl tracking-widest bg-black/20 px-4 py-2 rounded">
                        Q {currentQuestion + 1} / {assessmentData.questions.length}
                    </div>
                </div>
            </header>

            {/* Main Question Area */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-8 flex flex-col mt-8">

                <div className="mb-6 flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded font-bold text-xs uppercase tracking-widest">
                        {qData.type === 'scenario' ? 'Real-World Scenario' : 'Technical Evaluation'}
                    </span>
                </div>

                <h2 className="text-2xl font-medium text-gray-900 leading-relaxed mb-8">
                    {qData.q}
                </h2>

                {qData.type === 'scenario' ? (
                    <div className="flex-1 flex flex-col">
                        <label className="font-bold text-gray-700 mb-3">Provide your engineering reasoning:</label>
                        <textarea
                            className="flex-1 w-full bg-white border-2 border-gray-300 rounded-xl p-6 text-gray-800 font-medium text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none resize-none"
                            placeholder="Type your detailed reasoning here..."
                            value={userCurrentAns}
                            onChange={(e) => handleAnswerSelection('scenario', e.target.value)}
                            onPaste={(e) => e.preventDefault()} // Block pasting
                        ></textarea>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {qData.options.map((opt, oIdx) => (
                            <button
                                key={oIdx}
                                onClick={() => handleAnswerSelection('mcq', oIdx)}
                                className={`w-full text-left p-6 rounded-xl border-2 transition-all font-medium text-lg ${userCurrentAns === oIdx
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md transform scale-[1.01]'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${userCurrentAns === oIdx ? 'border-indigo-600' : 'border-gray-400'}`}>
                                        {userCurrentAns === oIdx && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                                    </div>
                                    {opt}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-10 flex justify-end">
                    <button
                        onClick={nextQuestion}
                        disabled={userCurrentAns === ""}
                        className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center transition-all ${userCurrentAns === ""
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
                            }`}
                    >
                        {currentQuestion < assessmentData.questions.length - 1 ? (
                            <>Next Question <i className="fas fa-arrow-right ml-2"></i></>
                        ) : (
                            <>Submit Examination <i className="fas fa-check-circle ml-2"></i></>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}

export default AssessmentPlatform;
