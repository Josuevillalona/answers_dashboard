// TypeScript types matching Supabase database schema

export type FeedbackStatus = 'open' | 'escalated' | 'closed';
export type FeedbackTag =
  | 'hallucination'
  | 'outdated_content'
  | 'wrong_context'
  | 'poor_ux'
  | 'source_misinterpretation'
  | 'correct_answer';

export type EscalationTeam = 'engineering' | 'editorial';
export type EscalationPriority = 'critical' | 'high' | 'medium' | 'low';
export type EscalationStatus = 'open' | 'closed';

export interface Source {
  title: string;
  url: string;
  type?: string;
}

export interface Feedback {
  id: string;
  query: string;
  answer: string;
  sources: Source[];
  rating: boolean; // true = thumbs up, false = thumbs down
  user_comment: string | null;
  status: FeedbackStatus;
  tag: FeedbackTag | null;
  pm_notes: string | null;
  created_at: string;
}

export interface Escalation {
  id: string;
  feedback_id: string;
  team: EscalationTeam;
  priority: EscalationPriority;
  summary: string;
  details: string | null;
  suggested_action: string | null;
  status: EscalationStatus;
  resolution_notes: string | null;
  created_at: string;
  resolved_at: string | null;
}

// Database insert types (fields that are optional or have defaults)
export type FeedbackInsert = Omit<Feedback, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type EscalationInsert = Omit<Escalation, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

// Database update types (all fields optional except id)
export type FeedbackUpdate = Partial<Omit<Feedback, 'id' | 'created_at'>>;
export type EscalationUpdate = Partial<Omit<Escalation, 'id' | 'created_at' | 'feedback_id'>>;

// Join type for escalations with feedback context
export interface EscalationWithFeedback extends Escalation {
  feedback: Feedback;
}
