/* scripts/source_factory.js */

const mockSignals = [
    {
        id: 'miner_1',
        type: 'inferred',
        source: 'Career Page',
        channel: 'GrowthTech Inc',
        title: "Scaling Engineering Team (Hiring 12 Devs)",
        signal: "We are expanding our core infrastructure team to handle 10x traffic growth. Hiring Senior Backend Engineers.",
        inference: "Heavy technical debt in core database partitioning and horizontal scaling. Massive opportunity for a 1-month optimization sprint.",
        tags: ['Database', 'Scaling', 'Inferred'],
        difficulty: 'Critical',
        estimated_price: "$15k - $25k",
        human_ingenuity_required: true,
        ai_gap: "Standard AI suggests simple load balancing. Real pain is in the legacy sharding logic 4.1."
    },
    {
        id: 'miner_2',
        type: 'inferred',
        source: 'Startup Blog',
        channel: 'StreamFlow.io',
        title: "Operational Frustrations: Support Overload",
        signal: "The team is spending 40% of their day answering manual data-sync tickets. We're hiring more support staff.",
        inference: "Inefficient data sync between CRM and Postgres. Opportunity to automate the bridge and save the company 3 salaries.",
        tags: ['Automation', 'Node.js', 'Inferred'],
        difficulty: 'Medium',
        estimated_price: "$8k - $12k",
        human_ingenuity_required: true,
        ai_gap: "Generic automation bots fail on the custom OAuth edge cases mentioned in their v2 docs."
    },
    {
        id: 'miner_3',
        type: 'inferred',
        source: 'GitHub Search',
        channel: 'facebook/react',
        title: "Help Wanted: Virtualization Edge Case #402",
        signal: "Issue #1293: Scroll jumping on dynamic height grid with 10k items. Community is stuck with hacks.",
        inference: "Custom spatial hashing requirement for the virtualization engine. High visibility logic fix.",
        tags: ['React', 'Low-Level', 'Inferred'],
        difficulty: 'High',
        estimated_price: "$5k Bounty",
        human_ingenuity_required: true,
        ai_gap: "AI suggests react-window which the issue explicitly states is non-viable for this geometry."
    },
    {
        id: 'user_1',
        type: 'verified',
        source: 'Direct Slip',
        channel: 'Local Exchange',
        title: "Memory leak in Node 20 worker threads",
        content: "Worker threads grow in heap size even after completion. Standard GC flags don't help.",
        tags: ['Node.js', 'DevOps'],
        difficulty: 'Critical',
        human_ingenuity_required: true,
        ai_gap: "Deep inter-op leak between C++ bindings and JS heap. Documentation is sparse."
    }
];

export const getDiscoveryFeed = () => {
    return mockSignals;
};
