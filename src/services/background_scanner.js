/* src/services/background_scanner.js */
import { supabase } from './supabase';

const SAMPLE_PULSE_SIGNALS = [
    {
        title: "Scaling React Context for Real-time Dashboards",
        signal: "Reddit users in r/reactjs are reporting massive re-render issues when scaling Context for real-time crypto signals. Multiple developers seeking a standardized 'Slice' pattern for Context.",
        source: "Reddit",
        channel: "r/reactjs",
        source_url: "https://reddit.com/r/reactjs/scaling-context",
        tags: ["React", "Performance", "State Management"]
    },
    {
        title: "LinkedIn: The Rise of 'Ghost' Microservices in Enterprise",
        signal: "Enterprise architects on LinkedIn are discussing the cost of unmanaged, abandoned microservices. 40% of infra budget wasted on services no one owns.",
        source: "LinkedIn",
        channel: "Tech Architecture Group",
        source_url: "https://linkedin.com/posts/enterprise-ghost-services",
        tags: ["Cloud", "DevOps", "Governance"]
    },
    {
        title: "StackOverflow: Memory Leaks in Node.js 20 Streams",
        signal: "Spike in questions regarding memory accumulation when using high-concurrency streams in Node.js 20. Users identifying a pattern of unclosed pipeline handles.",
        source: "StackOverflow",
        channel: "node.js tag",
        source_url: "https://stackoverflow.com/questions/node-streams-leak",
        tags: ["Node.js", "Memory", "Backend"]
    }
];

const SAMPLE_SERVICE_GAPS = [
    {
        title: "MNC Logistics: Real-time Multi-carrier Reconciliation",
        signal: "Large shipping firms (FedEx, DHL partners) lack a unified reconciliation engine for multi-leg international shipments involving local couriers.",
        source: "MNC-Internal Service Gap",
        channel: "Logistics Industry Report",
        source_url: "https://industry-insights.com/logistics-gaps",
        tags: ["Logistics", "Fintech", "B2B"]
    },
    {
        title: "Healthcare: Automated Patient Consent Lifecycles",
        signal: "Top-tier hospitals still manage digital consent manually via PDF. No automated 'Smart Consent' protocol that updates based on procedure changes.",
        source: "Healthcare Ops Review",
        channel: "Digital Health Summit",
        source_url: "https://health-tech.com/consent-gaps",
        tags: ["Healthcare", "Compliance", "LegalTech"]
    }
];

const SAMPLE_CODING_GAPS = [
    {
        title: "GitHub Optimization: Redis Cache Strategy for Next.js",
        signal: "Analysis of 500+ public Next.js repositories shows redundant database calls that could be optimized with a 'Stale-While-Revalidate' Redis layer.",
        source: "GitHub Public Scan",
        channel: "Repo Optimizer AI",
        source_url: "https://github.com/analysis/nextjs-cache-gap",
        tags: ["Next.js", "Redis", "Performance"]
    },
    {
        title: "Efficient Server Usage: Python Worker Threading",
        signal: "Widespread usage of inefficient polling in Python background workers. Could be replaced with event-driven Signal handlers to reduce CPU usage by 30%.",
        source: "GitHub Public Scan",
        channel: "Python Efficiency Guard",
        source_url: "https://github.com/analysis/python-worker-efficiency",
        tags: ["Python", "Concurrency", "Optimization"]
    }
];

export const startBackgroundScanner = () => {
    console.log("🚀 GapStart 24/7 Background Scanner Initialized...");

    // Simulate finding a new gap every 45 seconds
    const interval = setInterval(async () => {
        const categories = [
            { type: 'pulse', pool: SAMPLE_PULSE_SIGNALS },
            { type: 'service', pool: SAMPLE_SERVICE_GAPS },
            { type: 'coding', pool: SAMPLE_CODING_GAPS }
        ];

        const category = categories[Math.floor(Math.random() * categories.length)];
        const item = category.pool[Math.floor(Math.random() * category.pool.length)];

        console.log(`🔍 Scanner found relevant ${category.type} item: ${item.title}`);

        // Deduplication Check: Don't add if title exists
        const { data: existing } = await supabase
            .from('opportunities')
            .select('id')
            .eq('title', item.title)
            .limit(1);

        if (existing && existing.length > 0) {
            console.log(`⏭️ Skipping duplicate found: ${item.title}`);
            return;
        }

        const { error } = await supabase.from('opportunities').insert([{
            type: category.type,
            source: item.source,
            channel: item.channel,
            title: item.title,
            signal: item.signal,
            source_url: item.source_url,
            tags: item.tags,
            inference: "Automatically detected via GapStart 24/7 Monitoring Layer.",
            hiring_urgency: "High",
            job_probability: "85%"
        }]);

        if (error) {
            console.error("Scanner Insert Error:", error.message);
        }
    }, 45000);

    return () => clearInterval(interval);
};

export const getPlatformIcon = (source) => {
    if (source.includes('Reddit')) return 'fab fa-reddit';
    if (source.includes('LinkedIn')) return 'fab fa-linkedin';
    if (source.includes('StackOverflow')) return 'fab fa-stack-overflow';
    if (source.includes('GitHub')) return 'fab fa-github';
    return 'fas fa-globe';
};
