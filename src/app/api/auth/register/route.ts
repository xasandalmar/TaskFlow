import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email iyo password waa qasab' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Furaha sirta ah waa inuu ugu yaraan ka koobnaadaa 6 xaraf' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Supabase lama habayn. Fadlan ku dar NEXT_PUBLIC_SUPABASE_URL iyo NEXT_PUBLIC_SUPABASE_ANON_KEY faylkaaga .env.local',
        },
        { status: 503 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || email.split('@')[0],
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Diiwaangelintu si guul leh ayay u dhacday!',
        user: data.user,
        session: data.session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Khalad aan la filayn ayaa dhacay' },
      { status: 500 }
    );
  }
}
