import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { TaskStatus, TaskPriority } from '@/types';

export async function GET(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Supabase lama habayn. Fadlan geli NEXT_PUBLIC_SUPABASE_URL iyo NEXT_PUBLIC_SUPABASE_ANON_KEY faylka .env.local',
        },
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
        { success: false, error: 'Awood ma lihid (Fadlan soo gal nidaamka)' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as TaskStatus | null;
    const priority = searchParams.get('priority') as TaskPriority | null;
    const search = searchParams.get('search');

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);

    if (status && status !== ('all' as unknown)) {
      query = query.eq('status', status);
    }

    if (priority && priority !== ('all' as unknown)) {
      query = query.eq('priority', priority);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data: tasks, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tasks || [],
    });
  } catch (error) {
    console.error('Tasks GET API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Khalad aan la filayn ayaa dhacay' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Supabase lama habayn. Fadlan geli NEXT_PUBLIC_SUPABASE_URL iyo NEXT_PUBLIC_SUPABASE_ANON_KEY faylka .env.local',
        },
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
        { success: false, error: 'Awood ma lihid (Fadlan soo gal nidaamka)' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, status, priority, due_date } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Cinwaanka hawshu (Title) waa qasab' },
        { status: 400 }
      );
    }

    const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'completed'];
    const validPriorities: TaskPriority[] = ['low', 'medium', 'high'];

    const taskStatus = validStatuses.includes(status) ? status : 'todo';
    const taskPriority = validPriorities.includes(priority) ? priority : 'medium';

    const { data: newTask, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description?.trim() || '',
        status: taskStatus,
        priority: taskPriority,
        due_date: due_date || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Hawsha si guul leh ayaa loo abuuray!',
        data: newTask,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Tasks POST API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Khalad aan la filayn ayaa dhacay' },
      { status: 500 }
    );
  }
}
