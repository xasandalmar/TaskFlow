import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase configuration missing',
          user: null,
          profile: null,
        },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Awood ma lihid (Unauthorized)', user: null },
        { status: 401 }
      );
    }

    // Optionally fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      user,
      profile: profile || {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      },
    });
  } catch (error) {
    console.error('Auth ME API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Khalad aan la filayn ayaa dhacay' },
      { status: 500 }
    );
  }
}
