import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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

    // Validate status if provided
    if (body.status && !['open', 'closed'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Prepare updates
    const updates: Record<string, any> = {};

    if ('status' in body) {
      updates.status = body.status;

      // Set resolved_at when closing
      if (body.status === 'closed') {
        updates.resolved_at = new Date().toISOString();
      }

      // Clear resolved_at when reopening
      if (body.status === 'open') {
        updates.resolved_at = null;
        updates.resolution_notes = null;
      }
    }

    if ('resolution_notes' in body) {
      updates.resolution_notes = body.resolution_notes;
    }

    // Update escalation
    const { data, error } = await supabase
      .from('escalations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update escalation' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Escalation not found' },
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

    // Fetch escalation with feedback
    const { data, error } = await supabase
      .from('escalations')
      .select('*, feedback(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch escalation' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Escalation not found' },
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
