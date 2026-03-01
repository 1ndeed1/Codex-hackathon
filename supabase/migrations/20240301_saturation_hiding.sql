-- Add saturation hiding columns to opportunities table
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS solver_count INTEGER DEFAULT 0;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS max_solvers INTEGER DEFAULT 10;

-- Optional: Index for performance on the filter
CREATE INDEX IF NOT EXISTS idx_opportunities_solver_count ON opportunities(solver_count);
