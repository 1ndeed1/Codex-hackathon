-- 1. Create table for tracking dynamically discovered high-demand domains
CREATE TABLE IF NOT EXISTS public.pathfinder_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    demand_score INTEGER DEFAULT 0, -- Score based on market signals 
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pathfinder_domains ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated and anon users
CREATE POLICY "Allow public read access to pathfinder_domains" 
    ON public.pathfinder_domains FOR SELECT 
    USING (true);

-- Allow insert/update/delete only via service role (scripts)
-- Service roles bypass RLS by default, but we can be explicit if needed.


-- 2. Create table for the company-specific roadmaps linked to domains
CREATE TABLE IF NOT EXISTS public.pathfinder_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id UUID REFERENCES public.pathfinder_domains(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    company_target TEXT, -- E.g. "Startup", "MAANG", "Mid-Level Tech"
    weekly_plan JSONB NOT NULL, -- The weekly schedule structure
    required_skills JSONB, -- Array or object of required tech/certs
    market_context TEXT, -- Explanation based on current hiring analysis
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pathfinder_roadmaps ENABLE ROW LEVEL SECURITY;

-- Allow read access to all 
CREATE POLICY "Allow public read access to pathfinder_roadmaps" 
    ON public.pathfinder_roadmaps FOR SELECT 
    USING (true);


-- 3. Upsert Function for Domains (Used by the Scanner)
CREATE OR REPLACE FUNCTION upsert_pathfinder_domain(
    p_name TEXT,
    p_description TEXT,
    p_demand_score INTEGER
) RETURNS UUID AS $$
DECLARE
    v_domain_id UUID;
BEGIN
    INSERT INTO public.pathfinder_domains (name, description, demand_score, last_verified_at, is_active)
    VALUES (p_name, p_description, p_demand_score, NOW(), TRUE)
    ON CONFLICT (name) DO UPDATE SET
        description = EXCLUDED.description,
        demand_score = EXCLUDED.demand_score,
        last_verified_at = NOW(),
        is_active = TRUE,
        updated_at = NOW()
    RETURNING id INTO v_domain_id;
    
    RETURN v_domain_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Upsert Function for Roadmaps
CREATE OR REPLACE FUNCTION upsert_pathfinder_roadmap(
    p_domain_id UUID,
    p_company_name TEXT,
    p_company_target TEXT,
    p_weekly_plan JSONB,
    p_required_skills JSONB,
    p_market_context TEXT
) RETURNS UUID AS $$
DECLARE
    v_roadmap_id UUID;
BEGIN
    -- Check if roadmap already exists for domain and company
    SELECT id INTO v_roadmap_id 
    FROM public.pathfinder_roadmaps
    WHERE domain_id = p_domain_id AND company_name = p_company_name;

    IF v_roadmap_id IS NOT NULL THEN
        -- Update existing roadmap
        UPDATE public.pathfinder_roadmaps SET
            company_target = p_company_target,
            weekly_plan = p_weekly_plan,
            required_skills = p_required_skills,
            market_context = p_market_context,
            last_updated_at = NOW()
        WHERE id = v_roadmap_id;
    ELSE
        -- Insert new roadmap
        INSERT INTO public.pathfinder_roadmaps (domain_id, company_name, company_target, weekly_plan, required_skills, market_context)
        VALUES (p_domain_id, p_company_name, p_company_target, p_weekly_plan, p_required_skills, p_market_context)
        RETURNING id INTO v_roadmap_id;
    END IF;

    RETURN v_roadmap_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
