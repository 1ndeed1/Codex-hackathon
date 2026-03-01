/* src/services/gapstart_service.js */
import { supabase } from './supabase';

/**
 * Requirement Analysis Engine (GapStart)
 * Analyzes an expressed need and expands it into hidden requirements across departments.
 */
export const analyzeRequirements = async (opportunity) => {
    const text = ((opportunity.title || "") + " " + (opportunity.signal || "")).toLowerCase();

    // Heuristic analysis based on industry and problem type
    let finance = "Standard billing integration.";
    let hr = "Basic role permissions.";
    let operations = "Order tracking and delivery logic.";
    let customer = "Feedback collection system.";
    let analytics = "Daily sales summary.";
    let automation = "Automated email notifications.";
    let efficiencyGain = 15;

    if (text.includes('restaurant') || text.includes('billing') || text.includes('food')) {
        finance = "Integrated payment gateway with automated supplier ledger management.";
        hr = "Staff attendance tracking, shifts scheduling, and payroll automation.";
        operations = "Inventory management (Real-time stock alerts), recipe costing, and wastage monitoring.";
        customer = "Loyalty program, online ordering integration, and AI-driven table reservations.";
        analytics = "Profit/Loss analytics, sales prediction based on historical data, and menu performance tracking.";
        automation = "Automated stock reordering and kitchen display system (KDS) integration.";
        efficiencyGain = 35;
    } else if (text.includes('clinic') || text.includes('doctor') || text.includes('hospital')) {
        finance = "Insurance claim processing, billing automation with ICD-10 codes.";
        hr = "Doctor roster management and nursing staff shift tracking.";
        operations = "Patient record management (EMR), pharmacy inventory, and lab test tracking.";
        customer = "Patient portal, automated appointment reminders, and telehealth integration.";
        analytics = "Patient recovery metrics, resource utilization analytics.";
        automation = "Automated appointment rescheduling and prescription refill alerts.";
        efficiencyGain = 40;
    } else if (text.includes('factory') || text.includes('manufacturing') || text.includes('inventory')) {
        finance = "Cost of Goods Sold (COGS) tracking, multi-currency accounting.";
        hr = "Safety compliance tracking and worker productivity metrics.";
        operations = "Production line monitoring, maintenance scheduling, and supply chain tracking.";
        customer = "B2B order portal and shipment tracking.";
        analytics = "OEE (Overall Equipment Effectiveness) reporting and wastage analytics.";
        automation = "IoT sensor data integration and automated production log generation.";
        efficiencyGain = 50;
    }

    const map = {
        opportunity_id: opportunity.id,
        finance,
        hr,
        operations,
        customer_handling: customer,
        analytics,
        automation_opps: automation,
        efficiency_gain: efficiencyGain,
        technical_solve: "Implement a distributed event-driven architecture using Node.js and Redis to handle peak load spikes.",
        architecture_plan: "1. Event Ingestion Layer\n2. Real-time Analysis Workers\n3. Consistent State Store (Supabase)\n4. Reactive Frontend (React + Signal)"
    };

    if (text.includes('i18n') || text.includes('translation')) {
        map.technical_solve = "AST-based extraction of hardcoded strings into a global i18n registry with automated CI checks.";
        map.architecture_plan = "1. Pre-commit hook for string detection\n2. Centralized Translation Management System (TMS) API\n3. Dynamic fetching for high-traffic routes";
    } else if (text.includes('promise') || text.includes('async') || text.includes('latency')) {
        map.technical_solve = "Implement a Parallel Execution Guard with partial rejection handling to prevent 'all-or-nothing' failures.";
        map.architecture_plan = "1. Promise.allSettled wrapper\n2. Priority-based retry queue\n3. Circuit breaker for failing downstream microservices";
    } else if (text.includes('vector') || text.includes('gif') || text.includes('conversion')) {
        map.technical_solve = "WASM-based image processing pipeline for client-side vectorization with zero server overhead.";
        map.architecture_plan = "1. Web Worker for heavy lifting\n2. Rust-based vectorization engine (via WASM)\n3. Canvas-based real-time preview";
    }

    // Store in RequirementMaps
    const { data, error } = await supabase.from('requirement_maps').insert(map).select().single();
    if (error) {
        console.error("GapStart Analysis Error:", error.message);
        // Fallback or return local data
    }
    return data || map;
};

/**
 * Gap Expansion Engine
 * Converts a detected gap into a buildable product idea.
 */
export const expandGap = (gap) => {
    const text = ((gap.title || "") + " " + (gap.signal || "")).toLowerCase();

    let mvpFeatures = ["User Authentication", "Dashboard", "Basic CRUD"];
    let advancedFeatures = ["AI Predictions", "Global Scaling", "Third-party Integrations"];
    let rootCause = "Manual processes and fragmented data silos.";
    let productType = "SaaS Tool";
    let startupScore = 70;
    let freelanceScore = 85;

    if (text.includes('billing') || text.includes('restaurant')) {
        mvpFeatures = ["Digital Menu", "POS System", "Staff Management"];
        advancedFeatures = ["Inventory AI Prediction", "Loyalty CRM", "Multi-branch Consolidation"];
        rootCause = "Lack of real-time insights into stock and staff performance.";
        productType = "ERP / POS Hybrid";
        startupScore = 85;
        freelanceScore = 95;
    }

    return {
        ...gap,
        root_cause: rootCause,
        product_type: productType,
        mvp_features: mvpFeatures,
        advanced_features: advancedFeatures,
        startup_score: startupScore,
        freelance_score: freelanceScore,
        difficulty: 'Medium-High'
    };
};

/**
 * B2B Service Gap Discovery
 * Identifies missing services between industries that create job opportunities.
 */
export const discoverB2BGaps = () => {
    return [
        {
            id: 'b2b-1',
            type: 'B2B Service Gap',
            industry_a: 'Retail',
            industry_b: 'Logistics',
            missing_service: 'Hyper-local Micro-fulfillment',
            description: 'Major retail chains in urban sectors lack automated micro-fulfillment partners for sub-30 minute delivery.',
            opportunity: 'High - Massive demand for independent fulfillment protocols.',
            job_roles: ['Logistics Architect', 'Node.js Developer', 'GIS Specialist']
        },
        {
            id: 'b2b-2',
            type: 'B2B Service Gap',
            industry_a: 'Healthcare',
            industry_b: 'Fintech',
            missing_service: 'Real-time Insurance Liquidity',
            description: 'Clinics face 45-day delays in insurance payouts. Missing a protocol for instant liquidation of verified claims.',
            opportunity: 'Critical - Reduces clinic operational debt by 60%.',
            job_roles: ['Fintech Engineer', 'Smart Contract Dev', 'Compliance Officer']
        },
        {
            id: 'b2b-3',
            type: 'B2B Service Gap',
            industry_a: 'Manufacturing',
            industry_b: 'Energy',
            missing_service: 'Grid-aware Production Scheduling',
            description: 'Heavy manufacturing plants do not have automated sync with regional energy grid pricing to shift heavy loads.',
            opportunity: 'Industrial - Saves average plant $4k/day in energy costs.',
            job_roles: ['IoT Integration Lead', 'Data Scientist', 'Industrial Automation Eng']
        }
    ];
};

/**
 * Industry Gap Monitor
 * Simulates a continuous scanner that detects new gaps.
 */
export const monitorIndustryGaps = async (userId) => {
    const freshGaps = [
        {
            source: 'GitHub Trending',
            industry: 'Backend Engineering',
            inefficiency: 'Microservices failing to handle silent timeouts during heavy load, causing cascaded system downtime.',
            status: 'approved',
            job_roles: ['Site Reliability Engineer', 'Backend Dev', 'Infra Architect']
        },
        {
            source: 'Stack Overflow Pulse',
            industry: 'Frontend Engineering',
            inefficiency: 'Memory leaks in SPA applications due to unmanaged global state subscriptions over long sessions.',
            status: 'approved',
            job_roles: ['Frontend Architect', 'Performance Specialist']
        }
    ];

    // Insert into DB
    const results = [];
    for (const gap of freshGaps) {
        const { data, error } = await supabase.from('external_gaps').insert([{ ...gap, submitter_id: userId }]).select();
        if (!error) results.push(data[0]);
    }
    return results;
};
/**
 * Solution Analysis Engine
 * Evaluates technical strength and provides scoring/feedback.
 */
export const analyzeSolution = (solution) => {
    const text = (solution.explanation || "" + solution.logic || "").toLowerCase();
    const hasArchitecture = !!solution.architecture_plan;
    const hasCode = !!solution.code;
    const hasFile = !!solution.file_url;

    let score = 60; // Base score
    let feedback = "Valid technical approach detected.";

    if (hasArchitecture) score += 15;
    if (hasCode) score += 10;
    if (hasFile) score += 5;

    if (text.includes('complexity') || text.includes('latency') || text.includes('scalable')) {
        score += 10;
        feedback = "Strong technical reasoning with focus on system performance. Excellent baseline logic.";
    }

    if (score > 90) {
        feedback = "Exceptional architecture and documentation. Remarkable clarity in the proposed optimization.";
    } else if (score < 70) {
        feedback = "Good baseline, but could benefit from more detailed architecture diagrams or specific edge-case handling.";
    }

    return {
        score: Math.min(score, 100),
        review_feedback: feedback
    };
};
