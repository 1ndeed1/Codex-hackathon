/**
 * Utility to generate pseudo-realistic data for a company to simulate 
 * AI-driven web scraping of job postings and market intelligence.
 */

// Helper to get a deterministic random based on a string seed
function seedRandom(seedStr) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
        hash |= 0;
    }
    return function () {
        let t = hash += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

const DOMAINS = {
    "frontend": {
        roles: ["Frontend Engineer", "UI/UX Developer", "Design Technologist"],
        skills: ["React", "Data Structures", "System Design", "TypeScript", "Performance Tuning"],
        tools: ["VS Code", "Vite", "Jest", "Webpack"],
        certs: ["Meta Front-End Developer", "Google UX Design", "AWS Certified Developer"],
        projects: ["Design System Migration", "Micro-frontend Architecture", "Web Vitals Optimization"],
        bets: ["WASM Integration", "AI-driven UI Generation", "Spatial Computing Interfaces"],
        phases: [
            {
                duration: "Months 1-3",
                focus: "Core CS Fundamentals & Data Structures",
                tasks: ["Master DOM manipulation & Event Loop", "Daily DSA practice (Arrays, Trees, Graphs, DP)", "Complex sorting and searching algorithms in JS"],
                resources: [{ type: "doc", title: "LeetCode 150 - Frontend", link: "https://leetcode.com" }],
                quiz: [
                    { type: 'mcq', q: "What is the time complexity of searching in a standard Binary Search Tree?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], ans: 1 },
                    { type: 'scenario', q: "SCENARIO: Write out the logic to traverse a deeply nested DOM tree to find an element with a specific data attribute without using querySelector, focusing on minimal memory overhead." }
                ]
            },
            {
                duration: "Months 4-6",
                focus: "Modern Framework Scale & Architecture",
                tasks: ["Understand Component Lifecycle & Hooks at scale", "State management with Context API / Redux", "Hydration and SSR vs SSG"],
                resources: [{ type: "youtube", title: "React Crash Course", link: "https://youtube.com" }],
                quiz: [
                    { type: 'mcq', q: "Which Hook would you use to measure a DOM element?", options: ["useEffect", "useRef", "useCallback", "useMemo"], ans: 1 },
                    { type: 'scenario', q: "SCENARIO: Your React application is experiencing severe re-rendering issues causing the UI to freeze when users type in a massive data table. Explain your exact step-by-step approach to diagnosing and fixing this performance bottleneck." }
                ]
            },
            {
                duration: "Months 7-9",
                focus: "Frontend System Design",
                tasks: ["Design scalable messaging/chat applications", "Implement micro-frontend architecture", "API request batching and optimistic UI"],
                resources: [{ type: "doc", title: "Frontend System Design Interview", link: "https://greatfrontend.com" }],
                quiz: [
                    { type: 'mcq', q: "What is hydration in modern frontend frameworks?", options: ["Attaching event listeners to static HTML", "Downloading CSS", "Server caching", "Minifying JavaScript"], ans: 0 },
                    { type: 'scenario', q: "SCENARIO: Design the frontend architecture for Netflix's video browsing catalog. Address image lazy loading, infinite scroll memory leaks, and keyboard navigation." }
                ]
            },
            {
                duration: "Months 10-12",
                focus: "Performance & Company Specific Optimizations",
                tasks: ["Optimize core web vitals (LCP, CLS, FID) for massive scale", "Advanced caching with Service Workers"],
                resources: [{ type: "youtube", title: "Web Performance at Scale", link: "https://youtube.com" }],
                quiz: [
                    { type: 'mcq', q: "Which Web Vital measures visual stability?", options: ["LCP", "FID", "CLS", "TTFB"], ans: 2 },
                    { type: 'scenario', q: "SCENARIO: The main thread is frequently blocked by a heavy data-processing task on the client. Explain how you would refactor the architecture to push this to Web Workers while keeping the UI fully reactive." }
                ]
            }
        ]
    },
    "backend": {
        roles: ["Backend Engineer", "Distributed Systems Engineer", "API Platform Engineer"],
        skills: ["Go", "Node.js", "Python", "Data Structures", "System Design", "PostgreSQL", "Kafka"],
        tools: ["Docker", "Kubernetes", "Postman", "Datadog", "Terraform"],
        certs: ["AWS Certified Solutions Architect", "CKAD", "MongoDB Developer"],
        projects: ["Event-Driven Architecture", "Database Sharding", "Internal Developer Platform"],
        bets: ["Serverless V2", "GraphQL Federation", "Rust for High Performance"],
        phases: [
            {
                duration: "Months 1-3",
                focus: "Core CS, Data Structures & Algorithms",
                tasks: ["Deep dive into chosen language specifics (Go/Python/Node)", "Daily Leetcode (Trees, Graphs, DP, Sliding Window)", "Master multi-threading and concurrency models"],
                resources: [{ type: "doc", title: "Language Official Specs & Leetcode", link: "#" }],
                quiz: [
                    { type: 'mcq', q: "Which data structure provides O(1) average time complexity for lookups?", options: ["Array", "Linked List", "Hash Table", "Binary Tree"], ans: 2 },
                    { type: 'scenario', q: "SCENARIO: Implement an intelligent cache eviction policy (like LRU or LFU) from scratch. Explain the exact data structures you would combine to achieve O(1) time complexity for both GET and PUT operations." }
                ]
            },
            {
                duration: "Months 4-6",
                focus: "Databases, Caching & OS Fundamentals",
                tasks: ["Master SQL joins, B-Tree indexing, and transaction isolation levels", "Implement Redis caching layer", "Study Operating Systems networking stack"],
                resources: [{ type: "youtube", title: "Database Internals", link: "https://youtube.com" }],
                quiz: [
                    { type: 'mcq', q: "What is an index in a database?", options: ["A data structure that improves the speed of data retrieval", "A security feature", "A backup protocol", "A type of table union"], ans: 0 },
                    { type: 'scenario', q: "SCENARIO: A critical transaction frequently deadlocks under high load. Detail how you would alter the isolation levels or use row-level locking patterns to prevent this while maintaining strict ACID guarantees." }
                ]
            },
            {
                duration: "Months 7-9",
                focus: "System Design & Distributed Systems",
                tasks: ["Handle rate limiting and load balancing", "Understand database sharding, replication, and consensus (Raft/Paxos)"],
                resources: [{ type: "git", title: "System Design Primer", link: "https://github.com/donnemartin/system-design-primer" }],
                quiz: [
                    { type: 'mcq', q: "In database sharding, what is a 'hot key' problem?", options: ["Too much encryption", "Uneven data distribution causing high load on one shard", "Missing primary keys", "Slow memory caching"], ans: 1 },
                    { type: 'scenario', q: "SCENARIO: You are designing a system for a company that receives 50,000 requests per second. The database is frequently locking up and the latency is spiking to 5 seconds. Walk through the architecture changes you would implement to ensure 99.9% uptime and <200ms latency." }
                ]
            },
            {
                duration: "Months 10-12",
                focus: "Company Specific Infrastructure & APIs",
                tasks: ["Design robust REST and gRPC API boundaries", "Deploy applications using Docker & Kubernetes", "Setup CI/CD pipelines"],
                resources: [{ type: "doc", title: "Kubernetes in Action", link: "#" }],
                quiz: [
                    { type: 'mcq', q: "What is the primary advantage of gRPC over REST?", options: ["Uses JSON", "Stateless", "Uses Protocol Buffers & HTTP/2", "Built exclusively by Google"], ans: 2 },
                    { type: 'scenario', q: "SCENARIO: Design the event schema and fail-over routing for a Kafka-based microservice architecture that processes millions of payment webhooks per hour. How do you guarantee exactly-once processing?" }
                ]
            }
        ]
    },
    "ai": {
        roles: ["AI/ML Engineer", "Machine Learning Researcher", "Applied Scientist"],
        skills: ["Algorithms", "System Design", "PyTorch", "Math", "Distributed Training"],
        tools: ["Jupyter", "HuggingFace", "Weights & Biases", "Triton Info Server"],
        certs: ["DeepLearning.AI", "AWS Machine Learning Specialty", "NVIDIA Deep Learning Institute"],
        projects: ["Custom Distributed Training Pipeline", "Multimodal Model Systems", "Optimization Research for Inference"],
        bets: ["Multimodal Models", "On-device AI inference", "Autonomous Software Agents"],
        phases: [
            {
                duration: "Months 1-4",
                focus: "Core Foundation (SWE basics & Math)",
                tasks: ["Master Python & NumPy", "Linear algebra and Probability basics", "DSA daily practice (Leetcode 150-200: Arrays, Trees, Graphs, DP)"],
                resources: [{ type: "youtube", title: "Essence of Linear Algebra - 3Blue1Brown", link: "https://youtube.com" }],
                quiz: [
                    { type: 'mcq', q: "What operation involves multiplying a matrix by a vector?", options: ["Dot product", "Cross product", "Scalar addition", "Tensor contraction"], ans: 0 },
                    { type: 'scenario', q: "SCENARIO: Write an optimized, memoized solution in Python for a dynamic programming problem (e.g. Word Break) evaluating O(N^2) time complexity. Ensure memory is strictly bounded." }
                ]
            },
            {
                duration: "Months 5-7",
                focus: "Machine Learning Foundations",
                tasks: ["Implement Regression, Classification, and Metrics from scratch", "Deep dive into Feature engineering & Bias-variance", "Master Scikit-learn & PyTorch raw fundamentals"],
                resources: [{ type: "doc", title: "Scikit-Learn Docs & Elements of Statistical Learning", link: "#" }],
                quiz: [
                    { type: 'mcq', q: "What is Overfitting?", options: ["Model predicting too slowly", "Model learning the training data too well, including noise", "Model failing to converge", "Low accuracy on training data"], ans: 1 },
                    { type: 'scenario', q: "SCENARIO: Your binary classification model shows 99% accuracy but precision is merely 10%. Diagnose the class imbalance and explain your exact re-sampling or cost-sensitive learning strategy." }
                ]
            },
            {
                duration: "Months 8-11",
                focus: "Deep Learning Architectures",
                tasks: ["Build CNNs, RNNs, and Attention Mechanisms", "Master Transformers and Transfer learning", "Fine-tuning loops and gradient clipping"],
                resources: [{ type: "youtube", title: "Andrej Karpathy - Neural Networks", link: "https://youtube.com" }],
                quiz: [
                    { type: 'mcq', q: "In Transformer architecture, what solves the sequence alignment problem?", options: ["RNNs", "CNNs", "Self-Attention", "Gradient Descent"], ans: 2 },
                    { type: 'scenario', q: "SCENARIO: You are experiencing vanishing gradients in a deep recurrent architecture. Explain how LSTMs solve this theoretically, and detail a modern Transformer alternative strategy." }
                ]
            },
            {
                duration: "Months 12-16",
                focus: "Advanced Systems + Production Projects",
                tasks: ["Design Distributed training systems (TPU/GPU clusters)", "Implement Multimodal models", "Build AI products with robust highly-scalable backends"],
                resources: [{ type: "git", title: "Distributed GPU Training Patterns", link: "#" }],
                quiz: [
                    { type: 'mcq', q: "What is Low-Rank Adaptation (LoRA) used for?", options: ["Speeding up internet search", "Parameter-efficient fine-tuning of LLMs", "Database compression", "UI rendering"], ans: 1 },
                    { type: 'scenario', q: "SCENARIO: You are building a Retrieval-Augmented Generation (RAG) system for a Tier-1 tech company serving millions. Design the architecture focusing on caching, embedding semantic-search latency, and factual grounding at scale." }
                ]
            }
        ]
    }
};

export function generateCompanyRoadmaps(companyName) {
    const r = seedRandom(companyName.toLowerCase());
    const companyKey = companyName.toLowerCase();

    // Determine 2-3 random tracks for this company
    const categories = Object.keys(DOMAINS);
    const numTracks = 2 + Math.floor(r() * 2); // 2 or 3

    // Shuffle categories
    for (let i = categories.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [categories[i], categories[j]] = [categories[j], categories[i]];
    }

    const roadmaps = [];

    for (let i = 0; i < numTracks; i++) {
        const catName = categories[i];
        const data = DOMAINS[catName];

        // Randomly pick a role from the category
        const role = data.roles[Math.floor(r() * data.roles.length)];

        // Pick a few random skills, tools, certs
        const getSubset = (arr, count) => arr.slice().sort(() => 0.5 - r()).slice(0, count);

        // Pseudo logic: if company name is short or weird, maybe it's not a great fit for AI
        const isNotFit = (r() > 0.85); // 15% chance a role is saturated or not recommended

        const marketSentiment = isNotFit ?
            `WARNING: Based on recent scraping of ${companyName}'s job boards, hiring for ${role} has frozen or is highly saturated. Internal transfers are preferred over external hires right now.` :
            `Strong hiring signal detected. ${companyName} has opened 14 new requisitions for ${role} in the last 30 days. High emphasis on ${data.skills[0]} and ${data.skills[1]}.`;

        roadmaps.push({
            id: `custom-${companyKey}-${catName}`,
            company_name: companyName,
            company_target: role,
            is_recommended: !isNotFit, // Special flag for the UI
            market_context: marketSentiment,
            recent_projects: getSubset(data.projects, 2),
            future_bets: getSubset(data.bets, 2),
            certifications: getSubset(data.certs, 2),
            tools_to_know: getSubset(data.tools, 3),
            required_skills: getSubset(data.skills, 4),
            internships: isNotFit ? [] : [
                { role: `${role} Intern`, link: "#", term: "Next Summer" },
                { role: `${data.skills[0]} Engineering Co-op`, link: "#", term: "Fall" }
            ],
            weekly_plan: data.phases.map((p, index) => ({
                phase: index + 1,
                duration: p.duration,
                focus: p.focus,
                tasks: p.tasks,
                resources: p.resources,
                quiz: p.quiz
            }))
        });
    }

    return roadmaps;
}
