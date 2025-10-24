import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, total, easy, medium, hard')
      .order('total', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
