import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { FeedbackUpdate } from '@/lib/types/database.types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const updates: FeedbackUpdate = {};

    // Validate and prepare updates
    if ('tag' in body) {
      updates.tag = body.tag;
    }

    if ('pm_notes' in body) {
      if (body.pm_notes && body.pm_notes.length > 255) {
        return NextResponse.json(
          { error: 'PM notes must be 255 characters or less' },
          { status: 400 }
        );
      }
      updates.pm_notes = body.pm_notes;
    }

    if ('status' in body) {
      if (!['open', 'escalated', 'closed'].includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    // Update feedback
    const { data, error } = await supabase
      .from('feedback')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update feedback' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch feedback
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
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
