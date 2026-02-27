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

const SUBREDDITS = ['reactjs', 'FlutterDev', 'webdev'];
const POSTS_LIMIT = 20;

/**
 * Super naive heuristic "Analysis" engine.
 * In production, you would run the `selftext` through an LLM (like Gemini or OpenAI)
 * to perfectly extract the logicGap, inference, and calculate difficulty.
 */
function analyzePost(title, selftext) {
    const text = (title + " " + selftext).toLowerCase();

    // Check if it's a complaint/bug report
    if (!text.includes('bug') && !text.includes('error') && !text.includes('help') && !text.includes('issue') && !text.includes('crash')) {
        return null; // Ignore normal posts, only look for problems
    }

    // Determine Tags
    const tags = [];
    if (text.includes('react')) tags.push('React');
    if (text.includes('flutter')) tags.push('Flutter');
    if (text.includes('node')) tags.push('Node.js');
    if (text.includes('database') || text.includes('sql')) tags.push('Database');
    if (text.includes('ui') || text.includes('css')) tags.push('Frontend');
    if (tags.length === 0) tags.push('General Engineering');

    // Simulate AI inference
    let inference = "Deep analysis indicates a high priority technical wall.";
    if (text.includes('performance') || text.includes('slow')) inference = "The project is hitting severe performance bottlenecks likely related to unoptimized rendering or queries.";
    if (text.includes('memory') || text.includes('leak')) inference = "Massive opportunity to fix memory management issues deeply embedded in their logic.";

    let difficulty = "Medium";
    let hiringUrgency = "Medium";
    if (text.includes('production') || text.includes('urgent') || text.includes('crash')) {
        difficulty = "High";
        hiringUrgency = "Critical";
    }

    return {
        inference,
        logic_gap: "The standard community solutions are failing due to highly custom architectural constraints mentioned in the post.",
        difficulty,
        hiring_urgency: hiringUrgency,
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

            if (!data.data || !data.data.children) {
                console.warn(`⚠️ Failed to parse data from r/${sub}`);
                continue;
            }

            for (const child of data.data.children) {
                const post = child.data;
                // Only self posts (text), ignore link posts/images
                if (!post.is_self || !post.selftext) continue;

                const analysis = analyzePost(post.title, post.selftext);
                if (analysis) {
                    opportunities.push({
                        type: 'scanned',
                        source: `Reddit - r/${sub}`,
                        channel: post.author,
                        title: post.title.substring(0, 250), // Postgres limit protection
                        signal: post.selftext.substring(0, 1000) + '...', // Don't store massive posts raw
                        inference: analysis.inference,
                        logic_gap: analysis.logic_gap,
                        job_probability: 'Community Bounty / Portfolio',
                        hiring_urgency: analysis.hiring_urgency,
                        tags: analysis.tags,
                        difficulty: analysis.difficulty,
                        source_url: `https://reddit.com${post.permalink}`
                    });
                }
            }
        } catch (err) {
            console.error(`❌ Error scraping r/${sub}:`, err.message);
        }
    }

    return opportunities;
}

async function run() {
    const opportunities = await scrapeReddit();

    if (opportunities.length === 0) {
        console.log('📉 No actionable problems found in this scan.');
        process.exit(0);
    }

    console.log(`✅ Scraped and analyzed ${opportunities.length} potential opportunities.`);
    console.log('💾 Inserting into Supabase...');

    const { data, error } = await supabase
        .from('opportunities')
        .insert(opportunities)
        .select();

    if (error) {
        console.error('❌ Supabase Insert Error:', error);
    } else {
        console.log(`🎉 Successfully inserted ${data.length} new records into the database!`);
    }

    process.exit(0);
}

run();
