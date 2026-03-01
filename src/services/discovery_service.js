/* src/services/discovery_service.js */
import { supabase } from './supabase';

export const OPPORTUNITY_TYPES = {
    MINED: 'mined',
    DIRECT: 'direct',
    SCANNED: 'scanned'
};

export const fetchOpportunities = async () => {
    if (!supabase) {
        console.warn("Supabase client is not initialized. Check your .env file.");
        return [];
    }

    try {
        // Fetch with profiles join and visibility filter
        const { data, error } = await supabase
            .from('opportunities')
            .select(`
                *,
                author:profiles!opportunities_owner_id_fkey ( username, email )
            `)
            .lt('solver_count', 10) // Only show if solver_count < max_solvers (10)
            .order('created_at', { ascending: false });

        if (error) {
            // Distinguish between actual schema mismatch (like missing solver_count) and network/generic errors
            const isMissingColumn = error.message?.includes('column') || error.code === 'PGRST204';

            if (isMissingColumn) {
                console.error("Supabase schema mismatch (Check if solver_count column exists!):", error);

                // Fallback: fetch without profiles AND without the solver_count filter
                const { data: simpleData, error: simpleError } = await supabase
                    .from('opportunities')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (simpleError) {
                    console.error("Supabase fallback error:", simpleError);
                    return [];
                }
                return simpleData.map(item => ({ ...mapDbToFrontend(item), authorProfile: null }));
            } else {
                // Network error or other Supabase error
                console.error("Supabase connection or request error:", error);
                return [];
            }
        }

        return data.map(mapDbToFrontend);
    } catch (err) {
        console.error("Unexpected error fetching opportunities:", err);
        return [];
    }
};

export const simulateBackgroundScan = async () => {
    if (!supabase) return;

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

    console.log("Background scanner found new GapStart opportunity:", randomScan.title);
    await supabase.from('opportunities').insert([randomScan]);
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
