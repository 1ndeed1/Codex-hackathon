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
        const { data, error } = await supabase
            .from('opportunities')
            .select(`
                *,
                author:profiles!owner_id ( username, email )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase error fetching opportunities:", error);
            return [];
        }

        // Map DB snake_case columns back to frontend camelCase expectations
        return data.map(item => ({
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
            authorProfile: item.author
        }));
    } catch (err) {
        console.error("Unexpected error fetching opportunities:", err);
        return [];
    }
};
