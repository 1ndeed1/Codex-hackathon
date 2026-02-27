/* src/services/discovery_service.js */

export const OPPORTUNITY_TYPES = {
    MINED: 'mined',
    DIRECT: 'direct'
};

const mockOpportunities = [
    {
        id: 'opp_1',
        type: OPPORTUNITY_TYPES.MINED,
        source: 'Career Page',
        channel: 'GrowthTech Inc',
        title: "Database Scaling Technical Debt",
        signal: "Hiring 5 Senior Backend Engineers for core infrastructure scaling.",
        inference: "The organization is hitting a sharding bottleneck. Predictive analysis suggests a high-priority role opening in 4-6 weeks.",
        logicGap: "Standard sharding hooks in their stack (Postgres/Citrus) are failing on their unique time-series geometry.",
        jobProbability: '95%',
        hiringUrgency: 'Critical',
        tags: ['Database', 'Scaling', 'Postgres'],
        difficulty: 'Critical'
    },
    {
        id: 'opp_2',
        type: OPPORTUNITY_TYPES.MINED,
        source: 'Startup Blog',
        channel: 'AutomationFlow',
        title: "Support Operations Automation",
        signal: "Spent 40% of Q4 on manual data migrations for enterprise clients.",
        inference: "Ongoing manual toil is delaying client onboarding. Likely to open a Lead Automation role to resolve technical bottleneck.",
        logicGap: "Generic ETL tools don't handle the multi-tenant encryption requirements mentioned in their security whitepaper.",
        jobProbability: '72%',
        hiringUrgency: 'Medium',
        tags: ['Node.js', 'ETL', 'Automation'],
        difficulty: 'Medium'
    },
    {
        id: 'opp_3',
        type: OPPORTUNITY_TYPES.DIRECT,
        source: 'Direct Slip',
        channel: 'Community Host',
        title: "Memory leak in custom Node.js buffers",
        content: "Community verified technical pain. Direct signal from lead architect indicates immediate need for logic audit.",
        logicGap: "AI keeps suggesting standard heap profiling, but this is a low-level inter-op leak with C++ bindings.",
        jobProbability: 'Immediate Need',
        hiringUrgency: 'Extreme',
        tags: ['Low-Level', 'Node.js', 'C++'],
        difficulty: 'High'
    }
];

export const fetchOpportunities = () => {
    return mockOpportunities;
};
