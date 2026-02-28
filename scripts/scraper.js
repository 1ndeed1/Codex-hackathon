import 'dotenv/config';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    console.error('❌ Missing or default Supabase configuration in .env');
    console.log('Please fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SUBREDDITS = ['reactjs', 'FlutterDev', 'webdev', 'javascript', 'programming'];
const POSTS_LIMIT = 30;

/**
 * Enhanced Heuristic Analysis
 */
function analyzePost(title, selftext) {
    const text = (title + " " + (selftext || "")).toLowerCase();

    // Filter for "Significant" problems - looking for scale and impact
    const isSignificant = 
        text.includes('global') || 
        text.includes('everyone') || 
        text.includes('widespread') || 
        text.includes('critical') || 
        text.includes('production') || 
        text.includes('outage') || 
        text.includes('security') || 
        text.includes('data loss') ||
        text.includes('broken for all');

    if (!isSignificant) return null;

    // Ignore trivial/common setup problems
    if (text.includes('how to install') || text.includes('beginner help') || text.includes('tutorial')) {
        return null;
    }

    // Determine Tags
    const tags = [];
    if (text.includes('react')) tags.push('React');
    if (text.includes('flutter')) tags.push('Flutter');
    if (text.includes('node')) tags.push('Node.js');
    if (text.includes('database') || text.includes('sql')) tags.push('Database');
    if (text.includes('ui') || text.includes('css')) tags.push('Frontend');
    if (text.includes('ios') || text.includes('android') || text.includes('app store') || text.includes('play store')) tags.push('Mobile');
    if (tags.length === 0) tags.push('General Engineering');

    // AI Inference simulation
    let inference = "Deep architectural flaw detected.";
    if (text.includes('performance') || text.includes('slow')) inference = "Scaling bottleneck affecting global user base.";
    if (text.includes('security') || text.includes('vulnerability')) inference = "Critical security exposure requiring immediate patch.";

    return {
        inference,
        logic_gap: "Existing community patches are insufficient for this scale.",
        difficulty: text.includes('critical') ? 'Extreme' : 'High',
        hiring_urgency: 'Critical',
        tags
    };
}

async function scrapeReddit() {
    console.log('🚀 Starting Reddit Scraper...');
    const opportunities = [];

    for (const sub of SUBREDDITS) {
        console.log(`📡 Scanning r/${sub}...`);
        try {
            const response = await fetch(`https://www.reddit.com/r/${sub}/new.json?limit=${POSTS_LIMIT}`);
            const data = await response.json();

            if (!data.data || !data.data.children) continue;

            for (const child of data.data.children) {
                const post = child.data;
                const analysis = analyzePost(post.title, post.selftext);
                if (analysis) {
                    opportunities.push({
                        type: 'scanned',
                        source: `Reddit - r/${sub}`,
                        channel: post.author,
                        title: post.title.substring(0, 250),
                        signal: (post.selftext || "").substring(0, 1000),
                        inference: analysis.inference,
                        logic_gap: analysis.logic_gap,
                        job_probability: 'High Visibility Bounty',
                        hiring_urgency: analysis.hiring_urgency,
                        tags: analysis.tags,
                        difficulty: analysis.difficulty,
                        source_url: `https://reddit.com${post.permalink}`
                    });
                }
            }
        } catch (err) {
            console.error(`❌ Reddit Error (${sub}):`, err.message);
        }
    }
    return opportunities;
}

// Simulated search-based discovery for other platforms
async function searchWebForProblems() {
    console.log('🔍 Searching Web (X, LinkedIn, App Stores)...');
    const searchOpportunities = [];
    
    // In a real implementation, this would use a Search API or Scraper Service
    // For this hackathon demo, we simulate the results from high-intent searches
    const mockSearchResults = [
        {
            source: 'X (Twitter)',
            title: 'Global Outage in FinTech App Sync',
            signal: 'Every user is seeing a 403 error during ledger sync. Team is silent.',
            url: 'https://x.com/status/123456789'
        },
        {
            source: 'App Store Reviews',
            title: 'Native Crash on iOS 18.2',
            signal: 'The latest update causes a crash at launch for all iPhone 15 users.',
            url: 'https://apps.apple.com/app/id12345/reviews'
        }
    ];

    for (const res of mockSearchResults) {
        const analysis = analyzePost(res.title, res.signal);
        if (analysis) {
            searchOpportunities.push({
                type: 'scanned',
                source: res.source,
                channel: 'Global Monitoring',
                title: res.title,
                signal: res.signal,
                inference: analysis.inference,
                logic_gap: analysis.logic_gap,
                job_probability: 'Immediate Crisis Need',
                hiring_urgency: analysis.hiring_urgency,
                tags: analysis.tags,
                difficulty: analysis.difficulty,
                source_url: res.url
            });
        }
    }
    return searchOpportunities;
}

async function run() {
    const redditOps = await scrapeReddit();
    const searchOps = await searchWebForProblems();
    const allOpportunities = [...redditOps, ...searchOps];

    if (allOpportunities.length === 0) {
        console.log('📉 No critical problems found.');
        process.exit(0);
    }

    console.log(`✅ Found ${allOpportunities.length} high-impact problems.`);

    for (const op of allOpportunities) {
        // Duplicate check: Check if URL already exists
        const { data: existing } = await supabase
            .from('opportunities')
            .select('id')
            .eq('source_url', op.source_url)
            .single();

        if (existing) {
            console.log(`⏭️ Skipping duplicate: ${op.source_url}`);
            continue;
        }

        const { error } = await supabase.from('opportunities').insert(op);
        if (error) {
            if (error.code === '23505') {
                console.log(`⏭️ Duplicate prevented by DB: ${op.source_url}`);
            } else {
                console.error('❌ Insert Error:', error.message);
            }
        } else {
            console.log(`🎉 New Problem Captured: ${op.title}`);
        }
    }

    console.log('🚀 Scan Complete.');
    process.exit(0);
}

run();
