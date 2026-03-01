import { supabase } from './supabase';

/**
 * Service to handle fetching and interacting with Pathfinder Domain and Roadmap data.
 */
class PathfinderService {
    /**
     * Fetches the current high-demand domains.
     * @returns {Promise<Array>} List of active domains sorted by demand score
     */
    static async getTrendingDomains() {
        try {
            const { data, error } = await supabase
                .from('pathfinder_domains')
                .select('*')
                .eq('is_active', true)
                .order('demand_score', { ascending: false });

            if (error) throw error;
            return data;
        } catch (err) {
            console.error("Error fetching trending domains:", err);
            return [];
        }
    }

    /**
     * Fetches the roadmap details for a specific domain across various companies.
     * @param {string} domainId - UUID of the domain
     * @returns {Promise<Array>} List of roadmaps for the domain
     */
    static async getRoadmapsForDomain(domainId) {
        // Regex to validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        if (!uuidRegex.test(domainId)) {
            console.warn(`Invalid UUID format for domainId: ${domainId}. Skipping database fetch.`);
            return [];
        }

        try {
            const { data, error } = await supabase
                .from('pathfinder_roadmaps')
                .select('*')
                .eq('domain_id', domainId);

            if (error) throw error;
            return data;
        } catch (err) {
            console.error("Error fetching roadmaps for domain:", err);
            return [];
        }
    }
}

export default PathfinderService;
