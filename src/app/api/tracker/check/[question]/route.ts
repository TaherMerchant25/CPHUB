import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ question: string }> }
) {
  try {
    const { question: questionParam } = await params;
    const question = decodeURIComponent(questionParam);
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, questions');
    
    if (error) {
      throw error;
    }
    
    const results = (users || []).map(user => ({
      username: user.username,
      has_solved: (user.questions || []).includes(question)
    }));
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error checking question:', error);
    return NextResponse.json(
      { error: 'Failed to check question' },
      { status: 500 }
    );
  }
}
