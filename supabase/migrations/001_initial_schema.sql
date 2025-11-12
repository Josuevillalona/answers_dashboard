-- O'Reilly Answers QA Dashboard - Initial Schema
-- Creates feedback and escalations tables with indexes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE feedback_status AS ENUM ('open', 'escalated', 'closed');
CREATE TYPE feedback_tag AS ENUM (
  'hallucination',
  'outdated_content',
  'wrong_context',
  'poor_ux',
  'source_misinterpretation',
  'correct_answer'
);
CREATE TYPE escalation_team AS ENUM ('engineering', 'editorial');
CREATE TYPE escalation_priority AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE escalation_status AS ENUM ('open', 'closed');

-- Create feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query TEXT NOT NULL,
  answer TEXT NOT NULL,
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating BOOLEAN NOT NULL, -- true = thumbs up, false = thumbs down
  user_comment TEXT,
  status feedback_status NOT NULL DEFAULT 'open',
  tag feedback_tag,
  pm_notes TEXT CHECK (length(pm_notes) <= 255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create escalations table
CREATE TABLE escalations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  team escalation_team NOT NULL,
  priority escalation_priority NOT NULL,
  summary TEXT NOT NULL CHECK (length(summary) <= 100),
  details TEXT CHECK (length(details) <= 500),
  suggested_action TEXT CHECK (length(suggested_action) <= 200),
  status escalation_status NOT NULL DEFAULT 'open',
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX idx_feedback_tag ON feedback(tag) WHERE tag IS NOT NULL;

CREATE INDEX idx_escalations_feedback_id ON escalations(feedback_id);
CREATE INDEX idx_escalations_team ON escalations(team);
CREATE INDEX idx_escalations_priority ON escalations(priority);
CREATE INDEX idx_escalations_status ON escalations(status);
CREATE INDEX idx_escalations_created_at ON escalations(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE feedback IS 'User feedback submissions for AI-generated answers';
COMMENT ON TABLE escalations IS 'Issues escalated to Engineering or Editorial teams';

COMMENT ON COLUMN feedback.sources IS 'Array of cited sources in JSONB format';
COMMENT ON COLUMN feedback.rating IS 'true = thumbs up, false = thumbs down';
COMMENT ON COLUMN feedback.pm_notes IS 'Internal notes added by Product Managers (max 255 chars)';

COMMENT ON COLUMN escalations.summary IS 'Brief issue summary (max 100 chars)';
COMMENT ON COLUMN escalations.details IS 'Detailed description (max 500 chars)';
COMMENT ON COLUMN escalations.suggested_action IS 'Recommended action to resolve (max 200 chars)';
