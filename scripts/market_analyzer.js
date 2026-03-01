import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * In a real-world scenario, this function would hit APIs like:
 * - News APIs (NewsAPI, GNews)
 * - Job Aggregators (Adzuna, Jooble, SerpApi)
 * - LinkedIn / Indeed (via specialized scraping services or Puppeteer)
 * 
 * For this implementation, we are simulating the aggregation of that data
 * into the required JSON format based on prevailing market trends.
 */
async function analyzeMarketAndGenerateRoadmaps() {
    console.log("🔍 Starting Market Analysis...");

    // Simulated Data based on "Current Tech Trends"
    const trendingDomains = [
        {
            name: "Generative AI Engineering",
            description: "Building systems that generate text, images, and code using Foundation Models.",
            demand_score: 98,
            roadmaps: [
                {
                    company_name: "OpenAI / Anthropic (Tier 1 AI Labs)",
                    company_target: "MAANG / AI Labs",
                    market_context: "Extremely high demand for researchers and engineers who understand core model architectures, distributed training, and alignment.",
                    required_skills: ["PyTorch", "CUDA", "Transformers", "Distributed Systems", "Python"],
                    weekly_plan: [
                        { week: 1, focus: "Deep Learning Fundamentals & Linear Algebra", tasks: ["Implement Neural Net from scratch", "Study Attention Mechanism"] },
                        { week: 2, focus: "Transformer Architecture Deep Dive", tasks: ["Read 'Attention is All You Need'", "Implement GPT architecture in PyTorch"] },
                        { week: 3, focus: "Model Fine-Tuning & Evaluation", tasks: ["LoRA / PEFT techniques", "Deploy model on runpod/modal"] },
                        { week: 4, focus: "Distributed Systems & Inference", tasks: ["vLLM, TensorRT-LLM", "Optimize inference latency"] }
                    ]
                },
                {
                    company_name: "Enterprise Tech (Microsoft, Salesforce)",
                    company_target: "Enterprise",
                    market_context: "High demand for integrating LLMs into existing enterprise applications (RAG, Agents).",
                    required_skills: ["LangChain/LlamaIndex", "Vector Databases (Pinecone, Chroma)", "Next.js", "Python"],
                    weekly_plan: [
                        { week: 1, focus: "API Integrations & Prompt Engineering", tasks: ["Learn advanced prompting", "Integrate OpenAI API"] },
                        { week: 2, focus: "Retrieval-Augmented Generation (RAG)", tasks: ["Build a document QA system", "Understand vector embeddings"] },
                        { week: 3, focus: "Agentic Workflows", tasks: ["Build ReAct agents", "Use LangGraph/AutoGen"] },
                        { week: 4, focus: "Production Deployment", tasks: ["Evaluate RAG systems (Ragas)", "Deploy full-stack GenAI app"] }
                    ]
                }
            ]
        },
        {
            name: "Cloud-Native Infrastructure (Platform Engineering)",
            description: "Designing and managing scalable, resilient infrastructure using Kubernetes and Cloud providers.",
            demand_score: 92,
            roadmaps: [
                {
                    company_name: "FinTech (Stripe, Plaid)",
                    company_target: "FinTech",
                    market_context: "Critical need for reliability, security, and zero-downtime deployments.",
                    required_skills: ["Kubernetes", "Terraform", "Go", "AWS/GCP", "CI/CD (GitHub Actions)"],
                    weekly_plan: [
                        { week: 1, focus: "Containerization & Linux Internals", tasks: ["Master Docker", "Understand cgroups and namespaces"] },
                        { week: 2, focus: "Infrastructure as Code (IaC)", tasks: ["Learn Terraform", "Provision a secure VPC"] },
                        { week: 3, focus: "Kubernetes Orchestration", tasks: ["Deploy a highly available cluster", "Understand K8s networking/storage"] },
                        { week: 4, focus: "Observability & Security", tasks: ["Setup Prometheus/Grafana", "Implement RBAC & Network Policies"] }
                    ]
                }
            ]
        }
    ];

    for (const domain of trendingDomains) {
        console.log(`\n📊 Processing Domain: ${domain.name}`);

        // 1. Upsert Domain
        const { data: domainData, error: domainError } = await supabase.rpc('upsert_pathfinder_domain', {
            p_name: domain.name,
            p_description: domain.description,
            p_demand_score: domain.demand_score
        });

        if (domainError) {
            console.error(`❌ Error inserting domain ${domain.name}:`, domainError);
            continue;
        }

        const domainId = domainData;
        console.log(`✅ Upserted Domain ID: ${domainId}`);

        // 2. Upsert Roadmaps for Domain
        for (const roadmap of domain.roadmaps) {
            const { data: roadmapData, error: roadmapError } = await supabase.rpc('upsert_pathfinder_roadmap', {
                p_domain_id: domainId,
                p_company_name: roadmap.company_name,
                p_company_target: roadmap.company_target,
                p_weekly_plan: roadmap.weekly_plan,
                p_required_skills: roadmap.required_skills,
                p_market_context: roadmap.market_context
            });

            if (roadmapError) {
                console.error(`❌ Error inserting roadmap for ${roadmap.company_name}:`, roadmapError);
            } else {
                console.log(`   ✅ Upserted Roadmap for: ${roadmap.company_name}`);
            }
        }
    }

    console.log("\n✅ Market Analysis and Database Update Complete!");
}

analyzeMarketAndGenerateRoadmaps().catch(console.error);
