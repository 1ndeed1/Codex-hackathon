-- Update solutions table for Ingenuity Certification & AI Analysis
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS abstract TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS explanation TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS architecture_plan TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS review_feedback TEXT;

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_solutions_user_score ON solutions(user_id, score);
