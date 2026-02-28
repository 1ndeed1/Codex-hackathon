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
            .lt('solver_count', 3) // Only show if solver_count < max_solvers (3)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase error fetching with profiles (Check if solver_count column exists!):", error);

            // Fallback: fetch without profiles AND without the solver_count filter
            // This ensures the app still works even if the SQL migration hasn't been run.
            const { data: simpleData, error: simpleError } = await supabase
                .from('opportunities')
                .select('*')
                .order('created_at', { ascending: false });

            if (simpleError) {
                console.error("Supabase fallback error:", simpleError);
                return [];
            }
            return simpleData.map(item => ({ ...mapDbToFrontend(item), authorProfile: null }));
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
            type: 'scanned',
            source: 'Medium - Engineering Blog',
            channel: 'System Architecture',
            title: 'Latency Spikes in Distributed Caching',
            signal: 'Several reports of 500ms+ latency in the Redis cluster during peak hours.',
            inference: 'Likely a synchronization bottleneck or hot key issue.',
            logic_gap: 'Needs a more efficient cache invalidation strategy.',
            job_probability: 'High',
            hiring_urgency: 'Critical',
            tags: ['Redis', 'Distributed Systems', 'Performance'],
            difficulty: 'High'
        },
        {
            type: 'mined',
            source: 'StackOverflow - Trending',
            channel: 'Frontend Frameworks',
            title: 'Memory Leaks in Large-scale React Apps',
            signal: 'Rising number of queries regarding heap overflow in Vite-based monorepos.',
            inference: 'Possibly due to incorrect cleanup in useEffect or closure traps.',
            logic_gap: 'Unified state management memory profiling tool needed.',
            job_probability: '85%',
            hiring_urgency: 'Medium',
            tags: ['React', 'Vite', 'Memory Management'],
            difficulty: 'Medium'
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
