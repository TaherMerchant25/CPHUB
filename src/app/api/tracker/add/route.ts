import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { scrapeLeetCard } from '@/lib/leetcard-scraper';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Scrape initial data
    const data = await scrapeLeetCard(username);
    
    // Insert into database
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        username,
        total: data.total,
        easy: data.easy,
        medium: data.medium,
        hard: data.hard,
        questions: data.questions
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add user' },
      { status: 500 }
    );
  }
}
