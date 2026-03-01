-- Update projects table for GitHub integration
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_link TEXT;

-- Create project_access_requests table
CREATE TABLE IF NOT EXISTS project_access_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, requester_id)
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_project_access_requests_project_id ON project_access_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_project_access_requests_requester_id ON project_access_requests(requester_id);
