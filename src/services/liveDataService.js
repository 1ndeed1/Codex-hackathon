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
 */

const DOMAIN_DATA = {
    // --- BLOOMING TRACK ---
    healthtech: {
        id: 'healthtech',
        track: 'blooming',
        title: 'Digital Healthcare & Health-Tech',
        icon: 'fa-heartbeat',
        color: 'var(--neon-blue)',
        gapAnalysis: "Hospitals and health systems are adopting tech fast, but lack people who understand both data/AI and healthcare workflows. Data is under-used and automation is weak.",
        hybridRoles: ['Health-data Analyst', 'Product Specialist (Health-tech)', 'Operations Analytics'],
        liveStats: {
            marketSize: '$106.97 Billion (by 2033)',
            cagr: '25.12%',
            hiringIntent: '+52% by H1 2025'
        },
        sources: [
            { name: 'Express Healthcare 2026 Trends', url: 'https://www.expresshealthcare.in/news/indian-healthcare-in-2026-the-top-5-trends-shaping-the-future/452123/' },
            { name: 'Staffing Industry Analysts', url: 'https://www.staffingindustry.com/news/global-daily-news/healthcare-sector-expected-to-drive-job-creation-across-india-in-2026' },
            { name: 'PIB: AI in Healthcare', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2227410' }
        ],
        roadmap: {
            month1_2: {
                focus: 'Healthcare Analytics Foundations',
                skills: ['Python/SQL for EHR', 'HIPAA/FHIR fundamentals', 'Digital Health basics'],
            },
            month3_4: {
                focus: 'Cloud & Interoperability',
                skills: ['AWS Health / Azure Health Data', 'Data pipelines for claims'],
            },
            month5_6: {
                focus: 'Applied AI Diagnostics',
                skills: ['Medical Image Analysis', 'Patient Risk Prediction'],
            }
        },
        certifications: ['AWS Certified Data Analytics', 'CPHIMS'],
        projects: [
            { name: 'Patient Risk Prediction Demo', desc: 'Build a ML model that predicts readmission risk using synthetic EHR data.' },
            { name: 'FHIR Data pipeline', desc: 'Extract, Transform, and Load mock patient data using FHIR standards.' }
        ]
    },
    agritech: {
        id: 'agritech',
        track: 'blooming',
        title: 'Agri-Tech & Precision Farming',
        icon: 'fa-leaf',
        color: 'var(--neon-green)',
        gapAnalysis: "Severe Skills Gap in AI/IoT for rural reality. Mandi data and soil sensors are under-utilized for decision support.",
        hybridRoles: ['Agri-data Analyst', 'Field-Ops Product Manager', 'Supply Chain Optimizer'],
        liveStats: {
            marketSize: '$815 Million (2024)',
            cagr: '13.1% CAGR projection',
            hiringIntent: 'Severe Skills Gap in AI/IoT'
        },
        sources: [
            { name: 'Farmonaut: Agri-Job Trends', url: 'https://farmonaut.com/asia/agri-biotech-jobs-agri-jobs-in-india-top-10-trends' },
            { name: 'Naukri Agri-Tech Insights', url: 'https://www.naukri.com/agri-tech-jobs-in-india' }
        ],
        roadmap: {
            month1_2: {
                focus: 'IoT & Remote Sensing',
                skills: ['Arduino/RPi sensors', 'GIS basics', 'Soil/Crop science fundamentals'],
            },
            month3_4: {
                focus: 'Geospatial Analytics',
                skills: ['NDVI data analysis', 'Satellite imagery processing with Python'],
            },
            month5_6: {
                focus: 'Predictive Agronomy',
                skills: ['Yield forecasting Models', 'Mandi Price Trend Prediction'],
            }
        },
        certifications: ['IoT Fundamentals', 'Google Earth Engine for Analysts'],
        projects: [
            { name: 'Crop Disease Classifier', desc: 'A computer vision model that identifies plant diseases from uploaded leaf images.' },
            { name: 'Smart Irrigation Dashboard', desc: 'A visualization dashboard tracking synthetic soil moisture sensor data.' }
        ]
    },
    manufacturing: {
        id: 'manufacturing',
        track: 'blooming',
        title: 'Industry 4.0 / Smart Factories',
        icon: 'fa-industry',
        color: 'var(--neon-orange)',
        gapAnalysis: "Factories have automation hardware but very poor data usage (OEE, downtime analytics). They need people who bridge shop floors and cloud tools.",
        hybridRoles: ['Factory Data Analyst', 'IIoT Engineer', 'Digital Transformation Manager'],
        liveStats: {
            marketSize: '$241 Billion (by 2028)',
            cagr: '15.5%',
            hiringIntent: 'High for manufacturing digitization'
        },
        sources: [
            { name: 'Taggd Manufacturing Trends 2026', url: 'https://taggd.in/blogs/manufacturing-hiring-trends/' }
        ],
        roadmap: {
            month1_2: {
                focus: 'Industrial Protocols',
                skills: ['MQTT/Kafka basics', 'SCADA overview', 'Python for Time-series'],
            },
            month3_4: {
                focus: 'Factory Analytics',
                skills: ['OEE calculation dashboards', 'Predictive Maintenance logs'],
            },
            month5_6: {
                focus: 'Smart Supply Chain',
                skills: ['Inventory Optimization Models', 'Route Planning Algorithms'],
            }
        },
        certifications: ['Six Sigma Green Belt', 'AWS Certified Machine Learning'],
        projects: [
            { name: 'Downtime Predictor', desc: 'Use synthetic machine vibration data to predict mechanical failure.' },
            { name: 'OEE Dashboard', desc: 'Real-time monitoring platform for factory line efficiency.' }
        ]
    },
    climatetech: {
        id: 'climatetech',
        track: 'blooming',
        title: 'Renewable Energy & Climate-Tech',
        icon: 'fa-solar-panel',
        color: 'var(--neon-blue)',
        gapAnalysis: "Data-rich but insight-poor. Need people who can map weather generation to grid generation and handle predictive maintenance for massive solar/wind parks.",
        hybridRoles: ['Solar/Wind Forecasting Scientist', 'Energy Analytics Engineer', 'Sustainability Product Manager'],
        liveStats: {
            marketSize: '$152.5 Billion (by 2030)',
            cagr: '16.1%',
            hiringIntent: '3 Million+ jobs by 2030'
        },
        sources: [
            { name: 'CXOToday: Renewable Jobs', url: 'https://cxotoday.com/media-coverage/renewable-energy-emerging-as-indias-next-big-jobs-engine/' },
            { name: 'Mercom India: Solar Jobs', url: 'https://mercomindia.com/renewable-energy-jobs-hit-record-but-growth-slows-amid-automation' },
            { name: 'IBEF: Renewable Boom', url: 'https://www.ibef.org/research/case-study/india-s-renewable-energy-boom-the-power-of-solar-and-beyond' }
        ],
        roadmap: {
            month1_2: {
                focus: 'Sustainability Principles',
                skills: ['ESG Reporting standards', 'SQL/Python Data analysis', 'Energy market basics'],
            },
            month3_4: {
                focus: 'Grid & Asset Mgmt',
                skills: ['SCADA Systems', 'Time-series database (InfluxDB)'],
            },
            month5_6: {
                focus: 'Generation Forecasting',
                skills: ['Weather/Grid analytics', 'PV Output Prediction'],
            }
        },
        certifications: ['Certified Energy Manager (CEM)', 'Data Science for Sustainability'],
        projects: [
            { name: 'Solar Yield Predictor', desc: 'Analyze historical weather data to predict the energy output of a solar grid.' },
            { name: 'ESG Analytics Dashboard', desc: 'Aggregates and visualizes a mock company’s carbon footprint.' }
        ]
    },
    edtech: {
        id: 'edtech',
        track: 'blooming',
        title: 'EdTech & Skill-Tech',
        icon: 'fa-graduation-cap',
        color: 'var(--neon-purple)',
        gapAnalysis: "Growth is shifting to corporate learning and skills. Shortage of people who can use data to personalize learning and build interactive experiences.",
        hybridRoles: ['Learning Analytics Engineer', 'EdTech Product Associate', 'Platform Integration Engineer'],
        liveStats: {
            marketSize: '$33 Billion (by 2026)',
            cagr: '25%',
            hiringIntent: 'High for skills platform developers'
        },
        sources: [
            { name: 'Taggd EdTech Trends 2026', url: 'https://taggd.in/blogs/edtech-hiring-trends/' },
            { name: 'IBEF EdTech Surge', url: 'https://www.ibef.org/blogs/india-s-edtech-surge-opportunities-in-online-education-and-training' },
            { name: 'LinkedIn: EdTech Market', url: 'https://www.linkedin.com/posts/ashish-anand284_edtech-aiineducation-digitallearning-activity-7412702387213332480-q-GR' }
        ],
        roadmap: {
            month1_2: {
                focus: 'Educational Data Foundations',
                skills: ['Learning engagement tracking', 'SQL/Python Basics', 'LMS Standards (SCORM/LTI)'],
            },
            month3_4: {
                focus: 'Personalized Learning',
                skills: ['Adaptive test algorithms', 'User experience for students'],
            },
            month5_6: {
                focus: 'Platform Scale',
                skills: ['Content delivery pipelines', 'Video streaming optimization'],
            }
        },
        certifications: ['Google Data Analytics', 'Coursera Instructional Design'],
        projects: [
            { name: 'Adaptive Quiz App', desc: 'A quiz app that adjusts difficulty based on student performance.' },
            { name: 'Engagement Dashboard', desc: 'Visualize student drop-off points in a mock course.' }
        ]
    },
    fintech: {
        id: 'fintech',
        track: 'blooming',
        title: 'FinTech & Digital Banking',
        icon: 'fa-piggy-bank',
        color: 'var(--neon-green)',
        gapAnalysis: "Massive AI impact in fraud detection and personalized lending. Banks need 'Bridge Engineers' who understand both legacy core banking and modern AI/Cloud stacks.",
        hybridRoles: ['FinTech Data Analyst', 'Lending Algorithm Engineer', 'Digital Banking Product Manager'],
        liveStats: {
            marketSize: '$150 Billion (by 2025)',
            cagr: '31%',
            hiringIntent: 'High for BFSI Digitization'
        },
        sources: [
            { name: 'Bennett: AI in FinTech', url: 'https://www.bennett.edu.in/media-center/blog/role-of-ai-in-the-exponential-growth-of-the-fintech-industry-in-india/' },
            { name: 'BillCut: FinTech Trends 2026', url: 'https://www.billcut.com/blogs/indias-fintech-hiring-trends-for-2026/' },
            { name: 'Taggd BFSI Trends 2026', url: 'https://taggd.in/blogs/bfsi-hiring-trends/' }
        ],
        roadmap: {
            month1_2: {
                focus: 'Financial Data Security',
                skills: ['PCI-DSS Basics', 'SQL for Transaction Audit', 'API Security'],
            },
            month3_4: {
                focus: 'ML for Fraud',
                skills: ['Anomaly Detection', 'Risk Scoring Models', 'Python/Scikit-Learn'],
            },
            month5_6: {
                focus: 'Cloud Core Banking',
                skills: ['Microservices for Finance', 'Event-driven Architecture (Kafka)'],
            }
        },
        certifications: ['Certified Financial Crime Specialist', 'AWS Certified Security'],
        projects: [
            { name: 'Transaction Anomaly Detector', desc: 'Identify suspicious credit card patterns using synthetic log data.' },
            { name: 'UPI Data Dashboard', desc: 'Analyze and visualize mock real-time payment volumes.' }
        ]
    },
    ecommerce: {
        id: 'ecommerce',
        track: 'blooming',
        title: 'E-commerce & Supply Chain',
        icon: 'fa-shopping-cart',
        color: 'var(--neon-orange)',
        gapAnalysis: "Rapid growth in quick-commerce requires specialized analytics for last-mile delivery and inventory prediction. Efficiency is the new product.",
        hybridRoles: ['Supply Chain Analyst', 'Conversion Optimization Engineer', 'Logistics Product Lead'],
        liveStats: {
            marketSize: '$188 Billion (by 2025)',
            cagr: '12.4% (2026 Forecast)',
            hiringIntent: '+40% for logistics tech'
        },
        sources: [
            { name: 'GlobalData: E-commerce 2026', url: 'https://www.globaldata.com/media/banking/indias-e-commerce-market-to-register-12-4-growth-in-2026-forecasts-globaldata/' },
            { name: 'IBEF: E-commerce Industry', url: 'https://www.ibef.org/industry/ecommerce' }
        ],
        roadmap: {
            month1_2: {
                focus: 'E-commerce Operations',
                skills: ['Warehouse MGMT APIs', 'SQL for Inventory', 'Analytics (GA4/Mixpanel)'],
            },
            month3_4: {
                focus: 'Personalization Engines',
                skills: ['Recommender Systems', 'User Path Tracking', 'A/B Testing Frameworks'],
            },
            month5_6: {
                focus: 'Logistics Optimization',
                skills: ['Route Planning Algorithms', 'Delivery ETA ML Models'],
            }
        },
        certifications: ['Google Project Management', 'Digital Marketing & Analytics'],
        projects: [
            { name: 'Inventory Demand Predictor', desc: 'Predict stock-outs based on seasonal mock sales data.' },
            { name: 'Last-Mile Route Optimizer', desc: 'Minimize travel distance for a fleet using Google Maps API mocks.' }
        ]
    },
    smartcity: {
        id: 'smartcity',
        track: 'blooming',
        title: 'Smart Cities & Gov-Tech',
        icon: 'fa-city',
        color: 'var(--neon-blue)',
        gapAnalysis: "Government digitizing infrastructure. Need for engineers who can handle urban-scale IoT, traffic data, and public safety tech.",
        hybridRoles: ['Urban Data Scientist', 'IoT Infrastructure Lead', 'Public Health Tech Manager'],
        liveStats: {
            marketSize: '$100 Billion+ Investment',
            cagr: '18.5%',
            hiringIntent: 'Rising for smart infra projects'
        },
        sources: [
            { name: 'LinkedIn Smart City Jobs', url: 'https://in.linkedin.com/jobs/smart-city-jobs' }
        ],
        roadmap: {
            month1_2: {
                focus: 'Civic IoT Foundations',
                skills: ['MQTT/IoT Sensors', 'Network Topology', 'Python/GIS'],
            },
            month3_4: {
                focus: 'Urban Analytics',
                skills: ['Traffic Flow Modeling', 'Water/Power Grid Monitoring'],
            },
            month5_6: {
                focus: 'Civic Security & Cloud',
                skills: ['Video Analytics AI', 'Sovereign Cloud Architectures'],
            }
        },
        certifications: ['Certified Smart City Associate', 'Azure IoT Developer'],
        projects: [
            { name: 'Traffic Pattern Analyzer', desc: 'Visualize urban congestion using open street map data.' },
            { name: 'Water Sensor Network', desc: 'Dashboard for monitoring mock urban water pressure and leakages.' }
        ]
    },

    // --- CLASSIC TRACK ---
    softwareengineer: {
        id: 'softwareengineer',
        track: 'classic',
        title: 'Full-Stack Software Engineer',
        icon: 'fa-code',
        color: 'var(--neon-purple)',
        gapAnalysis: "High volume of standard applications. The market requires deep full-stack proficiency with modern frameworks and cloud deployment.",
        hybridRoles: ['Full-stack Developer', 'Backend Engineer', 'Frontend Specialist'],
        liveStats: {
            marketSize: '$600 Billion',
            cagr: '8.5%',
            hiringIntent: '+73% for freshers in early 2026'
        },
        sources: [
            { name: 'Wheebox: India Skills Report 2026', url: 'https://wheebox.com/assets/pdf/ISR_Report_2026.pdf' },
            { name: 'TOI: Fresher Hiring 2026', url: 'https://timesofindia.indiatimes.com/education/careers/news/fresher-hiring-rises-to-73-in-early-2026-but-the-rules-of-entry-have-changed/articleshow/128504926.cms' }
        ],
        roadmap: {
            month1_2: {
                focus: 'Frontend Mastery',
                skills: ['React/Next.js', 'Advanced CSS/Tailwind', 'State Management'],
            },
            month3_4: {
                focus: 'Backend & Databases',
                skills: ['Node.js/Express', 'PostgreSQL/Prisma', 'Auth/Security (JWT)'],
            },
            month5_6: {
                focus: 'Cloud & Architecture',
                skills: ['Docker/K8s', 'AWS/Firebase Deployment', 'System Design Basics'],
            }
        },
        certifications: ['AWS Certified Developer', 'Meta Front-End Developer'],
        projects: [
            { name: 'Personal SaaS Product', desc: 'Build a full-stack application with auth, payments, and database.' },
            { name: 'Component Library', desc: 'Create a reusable, documented UI library.' }
        ]
    },
    devops: {
        id: 'devops',
        track: 'classic',
        title: 'DevOps & SRE',
        icon: 'fa-infinity',
        color: 'var(--neon-blue)',
        gapAnalysis: "Critical shortage of engineers who can automate the entire SDLC and manage high-availability cloud infrastructure.",
        hybridRoles: ['SRE', 'Cloud Architect', 'Platform Engineer'],
        liveStats: {
            marketSize: '$20 Billion (by 2026)',
            cagr: '24.7%',
            hiringIntent: 'High across enterprise'
        },
        sources: [
            { name: 'DORA Metrics', url: 'https://cloud.google.com/devops' },
            { name: 'TOI: Job Market 2026', url: 'https://timesofindia.indiatimes.com/business/india-business/indias-job-market-in-2026-where-hiring-will-grow-and-which-skills-will-matter-most-explained/articleshow/126056684.cms' }
        ],
        roadmap: {
            month1_2: {
                focus: 'Linux & Scripting',
                skills: ['Bash/Python', 'Network Fundamentals', 'Git/GitHub Actions'],
            },
            month3_4: {
                focus: 'Containerization & IaC',
                skills: ['Docker/Kubernetes', 'Terraform/Ansible'],
            },
            month5_6: {
                focus: 'Cloud Platforms',
                skills: ['AWS/GCP Architecture', 'Monitoring (Prometheus/Grafana)'],
            }
        },
        certifications: ['CKA/CKAD (Kubernetes)', 'AWS Certified DevOps Engineer'],
        projects: [
            { name: 'Auto-Scaling Cluster', desc: 'Deploy a multi-node Kubernetes cluster with auto-scaling.' },
            { name: 'GitOps Pipeline', desc: 'Implement automated deployments using ArgoCD or Flux.' }
        ]
    },
    ds: {
        id: 'ds',
        track: 'classic',
        title: 'Data Scientist / AI Engineer',
        icon: 'fa-brain',
        color: 'var(--neon-green)',
        gapAnalysis: "Massive requirement for LLM orchestration and fine-tuning. Need for engineers who can move beyond basic models to production AI.",
        hybridRoles: ['ML Engineer', 'Data Scientist', 'AI Researcher'],
        liveStats: {
            marketSize: '$450 Billion (by 2030)',
            cagr: '38.1%',
            hiringIntent: 'Extreme for AI-proficient engineers'
        },
        sources: [
            { name: 'PIB: AI Productivity & Jobs', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2226912' },
            { name: 'State of AI Report', url: 'https://stateof.ai' }
        ],
        roadmap: {
            month1_2: {
                focus: 'Math & Python for DS',
                skills: ['Linear Algebra/Calculus', 'Pandas/NumPy', 'Scikit-Learn'],
            },
            month3_4: {
                focus: 'Deep Learning & NLP',
                skills: ['PyTorch/TensorFlow', 'LLM Basics', 'Vector Databases'],
            },
            month5_6: {
                focus: 'AI in Production',
                skills: ['MLOps fundamentals', 'LangChain/LlamaIndex', 'Fine-tuning models'],
            }
        },
        certifications: ['TensorFlow Developer Certificate', 'AWS Certified Machine Learning'],
        projects: [
            { name: 'Custom LLM Chatbot', desc: 'Build a RAG-based chatbot using your own data.' },
            { name: 'Fraud Detection Model', desc: 'Implement a production-ready anomaly detection system.' }
        ]
    }
};

/**
 * Simulates a fetch to a live scraping endpoint
 */
export const fetchLiveDomainData = async (track = 'all') => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const all = Object.values(DOMAIN_DATA);
            if (track === 'all') resolve(all);
            else resolve(all.filter(d => d.track === track));
        }, 1200);
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
