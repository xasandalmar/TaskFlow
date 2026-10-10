import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function POST() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Ka bixitaan guul leh (demo mode)',
      });
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Si guul leh ayaad uga baxday nidaamka',
    });
  } catch (error) {
    console.error('Logout API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Khalad aan la filayn ayaa dhacay' },
      { status: 500 }
    );
  }
}
