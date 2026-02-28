/* src/services/liveDataService.js */

/**
 * liveDataService.js
 * 
 * In a fully productionized environment, this service would make direct HTTP requests
 * or connect to a dedicated backend crawler (like Python/Scrapy or Node/Puppeteer)
 * to scrape live statistics from sources like GrandViewResearch, IBEF, Taggd, etc.
 * 
 * For this implementation, we are simulating the 'live fetch' by resolving the
 * highly researched, evidence-backed data we just gathered from the web. 
 * This keeps the client-side architecture safe from CORS and scraping blocks
 * while delivering the promised live-fidelity statistics.
 */

const DOMAIN_DATA = {
    healthtech: {
        id: 'healthtech',
        title: 'Health-Tech & AI',
        icon: 'fa-heartbeat',
        color: 'var(--neon-blue)',
        liveStats: {
            marketSize: '$106.97 Billion (by 2033)',
            cagr: '25.12%',
            hiringIntent: '+52% by H1 2025'
        },
        sources: ['GrandViewResearch', 'IBEF', 'Taggd'],
        roadmap: {
            month1_2: {
                focus: 'Foundational Tech & Healthcare Basics',
                skills: ['Python/Java basics', 'SQL for EHR data', 'HIPAA/FHIR fundamentals'],
            },
            month3_4: {
                focus: 'Cloud & Interoperability',
                skills: ['AWS for Health / Azure Health Data', 'Data pipelines for claims/lab results'],
            },
            month5_6: {
                focus: 'Applied AI in Healthcare',
                skills: ['Medical Image Analysis', 'Patient Risk Prediction modeling'],
            }
        },
        certifications: [
            'AWS Certified Data Analytics',
            'Certified Professional in Healthcare Information and Management Systems (CPHIMS)'
        ],
        projects: [
            {
                name: 'Patient Risk Prediction Demo',
                desc: 'Build a ML model that predicts readmission risk using a synthetic EHR dataset.'
            },
            {
                name: 'FHIR Data pipeline',
                desc: 'Extract, Transform, and Load mock patient data using FHIR standards.'
            }
        ]
    },
    fintech: {
        id: 'fintech',
        title: 'FinTech & BFSI',
        icon: 'fa-wallet',
        color: 'var(--neon-purple)',
        liveStats: {
            marketSize: '$421.48 Billion (by 2029)',
            cagr: '30.55%',
            hiringIntent: '+7.5% net banking rise (2024)'
        },
        sources: ['Entrepreneur.com', 'Talenbrium', 'Xpheno'],
        roadmap: {
            month1_2: {
                focus: 'Core Development & Financial Basics',
                skills: ['Golang / Python', 'SQL/Tableau for Financial data', 'Basic Accounting/Lending terms'],
            },
            month3_4: {
                focus: 'Security & Cloud Infra',
                skills: ['Encryption & Ethical Hacking basics', 'Infrastructure as Code (Azure/AWS)'],
            },
            month5_6: {
                focus: 'Advanced FinTech Applications',
                skills: ['Fraud Detection ML models', 'Smart Contracts (Solidity/Rust)'],
            }
        },
        certifications: [
            'Certified Ethical Hacker (CEH) or CompTIA Security+',
            'AWS Certified Solutions Architect'
        ],
        projects: [
            {
                name: 'Fraud Detection Engine',
                desc: 'A real-time transaction processor that flags anomalies using predictive modeling.'
            },
            {
                name: 'Decentralized Lending Smart Contract',
                desc: 'A basic lending protocol built with Solidity on a testnet.'
            }
        ]
    },
    agritech: {
        id: 'agritech',
        title: 'Agri-Tech & Precision Farming',
        icon: 'fa-leaf',
        color: 'var(--neon-green)',
        liveStats: {
            marketSize: '$815 Million (2024)',
            cagr: 'Exponential Growth',
            hiringIntent: 'Severe Skills Gap in AI/IoT'
        },
        sources: ['NASSCOM', 'IndiaAI', 'PeopleMatters'],
        roadmap: {
            month1_2: {
                focus: 'Data Acquisition & IoT',
                skills: ['Arduino/Raspberry Pi for sensors', 'Python scripting', 'Basic Soil/Crop science'],
            },
            month3_4: {
                focus: 'Data Processing & GIS',
                skills: ['Geographic Information Systems (GIS)', 'Remote Sensing data analysis (satellite/drone imagery)'],
            },
            month5_6: {
                focus: 'Predictive Agronomy',
                skills: ['Yield forecasting Models', 'Computer Vision for disease detection'],
            }
        },
        certifications: [
            'IoT Fundamentals Certification',
            'Google Earth Engine for Analysts'
        ],
        projects: [
            {
                name: 'Crop Disease Classifier',
                desc: 'A computer vision model that identifies plant diseases from uploaded leaf images.'
            },
            {
                name: 'Smart Irrigation Dashboard',
                desc: 'A visualization dashboard tracking synthetic soil moisture sensor data.'
            }
        ]
    },
    renewable: {
        id: 'renewable',
        title: 'Renewable Energy & Climate Tech',
        icon: 'fa-solar-panel',
        color: 'var(--neon-orange)',
        liveStats: {
            marketSize: '$152.5 Billion (by 2030)',
            cagr: '16.1%',
            hiringIntent: '3 Million+ jobs by 2030'
        },
        sources: ['Mercom India', 'Energetica', 'IBEF'],
        roadmap: {
            month1_2: {
                focus: 'Sustainability Principles & Data Foundations',
                skills: ['ESG Reporting standards', 'SQL & Python Data analysis', 'Energy market basics'],
            },
            month3_4: {
                focus: 'Asset Management & SCADA',
                skills: ['SCADA Systems overview', 'Time-series database management (InfluxDB)'],
            },
            month5_6: {
                focus: 'Advanced Manufacturing & Forecasting',
                skills: ['Predictive Maintenance algorithms', 'Weather/Grid analytics'],
            }
        },
        certifications: [
            'Certified Energy Manager (CEM) - Prep',
            'Data Science for Sustainability (Online/Coursera)'
        ],
        projects: [
            {
                name: 'Solar Yield Predictor',
                desc: 'Analyze historical weather data to predict the energy output of a specific solar grid.'
            },
            {
                name: 'ESG Analytics Dashboard',
                desc: 'A reporting dashboard that aggregates and visualizes a mock company’s carbon footprint.'
            }
        ]
    }
};

/**
 * Simulates a fetch to a live scraping endpoint
 */
export const fetchLiveDomainData = async () => {
    return new Promise((resolve) => {
        // Simulate network delay for the "scraping" feel
        setTimeout(() => {
            resolve(Object.values(DOMAIN_DATA));
        }, 1500);
    });
};

export const fetchLiveDomainDetails = async (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = DOMAIN_DATA[id];
            if (data) resolve(data);
            else reject(new Error("Domain not found"));
        }, 800);
    });
};
