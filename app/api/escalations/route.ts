import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { EscalationInsert } from '@/lib/types/database.types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.feedback_id) {
      return NextResponse.json(
        { error: 'feedback_id is required' },
        { status: 400 }
      );
    }

    if (!body.team || !['engineering', 'editorial'].includes(body.team)) {
      return NextResponse.json(
        { error: 'Valid team is required (engineering or editorial)' },
        { status: 400 }
      );
    }

    if (!body.priority || !['critical', 'high', 'medium', 'low'].includes(body.priority)) {
      return NextResponse.json(
        { error: 'Valid priority is required (critical, high, medium, or low)' },
        { status: 400 }
      );
    }

    if (!body.summary || body.summary.trim().length === 0) {
      return NextResponse.json(
        { error: 'Summary is required' },
        { status: 400 }
      );
    }

    if (body.summary.length > 100) {
      return NextResponse.json(
        { error: 'Summary must be 100 characters or less' },
        { status: 400 }
      );
    }

    if (body.details && body.details.length > 500) {
      return NextResponse.json(
        { error: 'Details must be 500 characters or less' },
        { status: 400 }
      );
    }

    if (body.suggested_action && body.suggested_action.length > 200) {
      return NextResponse.json(
        { error: 'Suggested action must be 200 characters or less' },
        { status: 400 }
      );
    }

    // Check if feedback exists
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('id, status')
      .eq('id', body.feedback_id)
      .single();

    if (feedbackError || !feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Prepare escalation data
    const escalationData: EscalationInsert = {
      feedback_id: body.feedback_id,
      team: body.team,
      priority: body.priority,
      summary: body.summary.trim(),
      details: body.details?.trim() || null,
      suggested_action: body.suggested_action?.trim() || null,
      status: 'open',
      resolution_notes: null,
      resolved_at: null,
    };

    // Create escalation
    const { data: escalation, error: escalationError } = await supabase
      .from('escalations')
      .insert(escalationData)
      .select()
      .single();

    if (escalationError) {
      console.error('Database error:', escalationError);
      return NextResponse.json(
        { error: 'Failed to create escalation' },
        { status: 500 }
      );
    }

    // Update feedback status to 'escalated'
    const { error: updateError } = await supabase
      .from('feedback')
      .update({ status: 'escalated' })
      .eq('id', body.feedback_id);

    if (updateError) {
      console.error('Failed to update feedback status:', updateError);
      // Don't fail the request, escalation was created successfully
    }

    return NextResponse.json(escalation, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const team = searchParams.get('team');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');

    // Build query
    let query = supabase
      .from('escalations')
      .select('*, feedback(*)')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    // Apply filters
    if (team && ['engineering', 'editorial'].includes(team)) {
      query = query.eq('team', team);
    }

    if (priority && ['critical', 'high', 'medium', 'low'].includes(priority)) {
      query = query.eq('priority', priority);
    }

    if (status && ['open', 'closed'].includes(status)) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch escalations' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
