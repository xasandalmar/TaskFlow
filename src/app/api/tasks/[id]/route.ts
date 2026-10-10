import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { TaskStatus, TaskPriority } from '@/types';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase lama habayn' },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Awood ma lihid' },
        { status: 401 }
      );
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !task) {
      return NextResponse.json(
        { success: false, error: 'Hawsha lama helin' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Task GET by ID API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Khalad aan la filayn ayaa dhacay' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase lama habayn' },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Awood ma lihid' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, status, priority, due_date } = body;

    const updates: Record<string, unknown> = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json(
          { success: false, error: 'Cinwaanka hawshu ma noqon karo faaruq' },
          { status: 400 }
        );
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (status !== undefined) {
      const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Xaaladda hawsha (status) sax ma aha' },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    if (priority !== undefined) {
      const validPriorities: TaskPriority[] = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          { success: false, error: 'Mudnaanta (priority) sax ma aha' },
          { status: 400 }
        );
      }
      updates.priority = priority;
    }

    if (due_date !== undefined) {
      updates.due_date = due_date;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Wax xog ah oo la cusboonaysiinayo lama helin' },
        { status: 400 }
      );
    }

    const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !updatedTask) {
      console.error('Error updating task:', error);
      return NextResponse.json(
        { success: false, error: error?.message || 'Hawsha lama helin' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Hawsha si guul leh ayaa loo cusboonaysiiyay!',
      data: updatedTask,
    });
  } catch (error) {
    console.error('Task PUT API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Khalad aan la filayn ayaa dhacay' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase lama habayn' },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Awood ma lihid' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting task:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Hawsha si guul leh ayaa loo tirtiray!',
    });
  } catch (error) {
    console.error('Task DELETE API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Khalad aan la filayn ayaa dhacay' },
      { status: 500 }
    );
  }
}
