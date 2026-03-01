/* src/services/discovery_service.js */
import { supabase } from './supabase';

export const OPPORTUNITY_TYPES = {
    MINED: 'mined',
    DIRECT: 'direct',
    SCANNED: 'scanned'
};

export const fetchLiveGitHubSignals = async () => {
    try {
        // Searching for open bugs/performance issues in high-traffic areas
        const query = encodeURIComponent('is:issue is:open label:bug "performance" "memory" sort:updated-desc');
        const response = await fetch(`https://api.github.com/search/issues?q=${query}&per_page=3`);
        const data = await response.json();

        if (!data.items) return [];

        return data.items.map(item => ({
            id: `gh-${item.id}`,
            type: OPPORTUNITY_TYPES.MINED,
            source: 'GitHub',
            channel: 'System Analysis',
            title: `[CRITICAL ISSUE] ${item.title.substring(0, 80)}${item.title.length > 80 ? '...' : ''}`,
            signal: item.body?.substring(0, 160) + '...' || "No description provided.",
            inference: "Pattern matches evolving regression in dependency tree or runtime environment.",
            logicGap: "Needs deep-source debugging and potential patch submission to upstream.",
            jobProbability: '95%',
            hiringUrgency: 'High',
            tags: ['Live API', 'GitHub', 'Bug', 'Infrastructure'],
            difficulty: 'Expert',
            sourceUrl: item.html_url,
            isLive: true
        }));
    } catch (err) {
        console.error("GitHub Live Fetch Error:", err);
        return [];
    }
};

export const fetchLiveStackOverflowSignals = async () => {
    try {
        const url = 'https://api.stackexchange.com/2.3/questions?pagesize=3&order=desc&sort=activity&tagged=reactjs;rust;aws;kubernetes&site=stackoverflow';
        const response = await fetch(url);
        const data = await response.json();

        if (!data.items) return [];

        return data.items.map(item => ({
            id: `so-${item.question_id}`,
            type: OPPORTUNITY_TYPES.MINED,
            source: 'StackOverflow',
            channel: 'Market Signal',
            title: `[SOLVER NEEDED] ${item.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'")}`,
            signal: `High-activity question detected with ${item.view_count} views. "How do I resolve ${item.tags.join('/')} logic collisions?"`,
            inference: "High community friction indicates a market gap for specialized consultancy or tooling.",
            logicGap: "Documentation lacks clarity on this specific integration edge case.",
            jobProbability: '88%',
            hiringUrgency: 'Medium',
            tags: ['Live API', 'StackOverflow', 'Troubleshooting'],
            difficulty: 'High',
            sourceUrl: item.link,
            isLive: true
        }));
    } catch (err) {
        console.error("StackOverflow Live Fetch Error:", err);
        return [];
    }
};

export const fetchOpportunities = async () => {
    if (!supabase) {
        console.warn("Supabase client is not initialized. Check your .env file.");
        return [];
    }

    try {
        // 1. Fetch from Supabase (Persistent & Custom Signals)
        const { data: dbData, error } = await supabase
            .from('opportunities')
            .select(`
                *,
                author:profiles!opportunities_owner_id_fkey ( username, email )
            `)
            .lt('solver_count', 10) // Only show if solver_count < max_solvers (10)
            .order('created_at', { ascending: false });

        let results = [];
        if (error) {
            // Distinguish between actual schema mismatch (like missing solver_count) and network/generic errors
            const isMissingColumn = error.message?.includes('column') || error.code === 'PGRST204';

            if (isMissingColumn) {
                console.warn("Supabase schema mismatch (Check if solver_count column exists!):", error);
                const { data: simpleData, error: simpleError } = await supabase
                    .from('opportunities')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!simpleError && simpleData) {
                    results = simpleData.map(item => ({ ...mapDbToFrontend(item), authorProfile: null }));
                } else {
                    console.error("Supabase fallback error:", simpleError);
                }
            } else {
                console.error("Supabase connection or request error:", error);
            }
        } else if (dbData) {
            results = dbData.map(mapDbToFrontend);
        }

        // 2. Fetch Live Signals (Real-time Scraping/API)
        const ghSignals = await fetchLiveGitHubSignals();
        const soSignals = await fetchLiveStackOverflowSignals();

        // 3. Combine and Filter out saturated opportunities
        const allCombined = [...ghSignals, ...soSignals, ...results];
        return allCombined.filter(opp => (opp.solverCount || 0) < (opp.maxSolvers || 3));
    } catch (err) {
        console.error("Unexpected error fetching opportunities:", err);
        return [];
    }
};

export const simulateBackgroundScan = async () => {
    if (!supabase) return;

    // Occasionally create a DB record from a Live signal to "persist" the discovery
    if (Math.random() > 0.7) {
        const liveSignals = await fetchLiveGitHubSignals();
        if (liveSignals.length > 0) {
            const sig = liveSignals[0];
            const { data: existing } = await supabase.from('opportunities').select('id').eq('title', sig.title).limit(1);
            if (!existing || existing.length === 0) {
                await supabase.from('opportunities').insert([{
                    type: sig.type,
                    source: sig.source,
                    channel: sig.channel,
                    title: sig.title,
                    signal: sig.signal,
                    inference: sig.inference,
                    logic_gap: sig.logicGap,
                    job_probability: sig.jobProbability,
                    hiring_urgency: sig.hiringUrgency,
                    tags: sig.tags,
                    difficulty: sig.difficulty,
                    source_url: sig.sourceUrl
                }]);
                return;
            }
        }
    }

    const mockScans = [
        {
            type: 'pulse',
            source: 'Reddit',
            channel: 'r/webdev',
            title: 'Technical Debt in Micro-frontends',
            signal: 'Rising frustration with overlapping dependencies in module federation. Teams seeking local-first orchestration patterns.',
            inference: 'Market need for lightweight micro-frontend governance tools.',
            job_probability: '80%',
            hiring_urgency: 'Medium',
            tags: ['React', 'Architecture', 'Micro-frontends'],
            difficulty: 'High',
            source_url: 'https://reddit.com/r/webdev/mfe-debt'
        },
        {
            type: 'coding',
            source: 'GitHub',
            channel: 'Optimization Watch',
            title: 'Global Inefficiency: Unoptimized Docker Images',
            signal: 'Scan of 10k public repos shows 65% of node apps use default heavy images instead of Alpine/Distroless, wasting PB of registry space.',
            inference: 'Wasted CI/CD costs and slow deployment cycles across the industry.',
            job_probability: '75%',
            hiring_urgency: 'High',
            tags: ['Docker', 'DevOps', 'GreenTech'],
            difficulty: 'Medium',
            source_url: 'https://github.com/analysis/docker-bloat'
        },
        {
            type: 'service',
            source: 'MNC Internal Scan',
            channel: 'Enterprise Gaps',
            title: 'Automated Compliance Drift Detection',
            signal: 'Fortune 500 fintechs lack real-time visibility into SOC2 compliance drift during fast-paced feature releases.',
            inference: 'High risk of audit failure; massive manual overhead for compliance teams.',
            job_probability: '95%',
            hiring_urgency: 'Critical',
            tags: ['Fintech', 'Compliance', 'Security'],
            difficulty: 'High',
            source_url: 'https://internal-reports.com/compliance-gap'
        },
        {
            type: 'mined',
            source: 'Reddit',
            channel: 'r/devops',
            title: "Autonomous Pipeline Failure: Self-Healing Agent Enters Infinite Loop",
            signal: "Emergency: Our new Agentic AIOps tool tried to 'auto-fix' a latency spike by scaling the cluster to 500 nodes. It's ignoring manual overrides. AWS bill is skyrocketing.",
            inference: "Agent logic lacks guardrails for recursive scaling actions. Likely a feedback loop in the observability integration.",
            logic_gap: "Needs immediate circuit breaker implementation for autonomous infrastructure agents.",
            job_probability: '98%',
            hiring_urgency: 'Critical',
            tags: ['AIOps', 'AWS', 'Autonomous Systems', 'DevOps'],
            difficulty: 'Expert',
            sourceUrl: 'https://www.reddit.com/r/devops/'
        },
        {
            type: 'mined',
            source: 'StackOverflow',
            channel: 'Rust - Performance',
            title: "Performance Regression in Rust 1.82: Memory Safety vs. Compile Time",
            signal: "Large increase in compile times for crates using heavy generic abstractions. 'Is the new borrow checker pass actually worth the 30% dev-loop slowdown?'",
            inference: "Potential bottleneck in the new incremental compilation logic or LLVM 19 backend integration.",
            logic_gap: "Requires optimization of the crate's internal trait architecture to reduce monomorphization overhead.",
            job_probability: '75%',
            hiring_urgency: 'Medium',
            tags: ['Rust', 'Compiler', 'Performance'],
            difficulty: 'High',
            sourceUrl: 'https://stackoverflow.com/questions/tagged/rust'
        },
        {
            type: 'mined',
            source: 'AWS Community',
            channel: 'FinOps & Cost Management',
            title: "Unpredictable LLM Costs Traceable to Recursive API Retries",
            signal: "We spent $12,000 in one night because our Bedrock agent kept retrying a malformed prompt. No budget alert triggered until it was too late.",
            inference: "Missing token-per-session limiters and failure to catch 'hallucinated' retry logic in the wrapper.",
            logic_gap: "Needs a centralized LLM proxy layer with strict cost-attribution and rate-limiting per user identity.",
            job_probability: '90%',
            hiring_urgency: 'High',
            tags: ['AWS', 'Bedrock', 'FinOps', 'LLMOps'],
            difficulty: 'High',
            sourceUrl: 'https://community.aws/'
        }
    ];

    const randomScan = mockScans[Math.floor(Math.random() * mockScans.length)];

    // Check if this title already exists to avoid duplicates
    const { data: existing } = await supabase
        .from('opportunities')
        .select('id')
        .eq('title', randomScan.title)
        .limit(1);

    if (existing && existing.length > 0) return;

    console.log("Background scanner found new opportunity:", randomScan.title);
    await supabase.from('opportunities').insert([{
        type: randomScan.type,
        source: randomScan.source,
        channel: randomScan.channel,
        title: randomScan.title,
        signal: randomScan.signal,
        inference: randomScan.inference,
        logic_gap: randomScan.logic_gap || randomScan.inference,
        job_probability: randomScan.job_probability,
        hiring_urgency: randomScan.hiring_urgency,
        tags: randomScan.tags,
        difficulty: randomScan.difficulty,
        source_url: randomScan.sourceUrl || randomScan.source_url
    }]);
};

const mapDbToFrontend = (item) => ({
    id: item.id,
    type: item.type,
    source: item.source,
    channel: item.channel,
    title: item.title,
    signal: item.signal,
    inference: item.inference,
    logicGap: item.logic_gap,
    jobProbability: item.job_probability,
    hiringUrgency: item.hiring_urgency,
    tags: item.tags || [],
    difficulty: item.difficulty,
    sourceUrl: item.source_url,
    ownerId: item.owner_id,
    abstract: item.abstract,
    codeSnippet: item.code_snippet,
    isAnonymous: item.is_anonymous,
    authorProfile: item.author,
    solverCount: item.solver_count,
    maxSolvers: item.max_solvers
});
