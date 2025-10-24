import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { scrapeLeetCard } from '@/lib/leetcard-scraper';

export async function POST(request: Request) {
  try {
    const { usernames } = await request.json();
    
    if (!Array.isArray(usernames) || usernames.length === 0) {
      return NextResponse.json(
        { error: 'Usernames array is required' },
        { status: 400 }
      );
    }
    
    const results = {
      added: 0,
      updated: 0,
      failed: [] as Array<{ username: string; error: string }>,
    };
    
    for (const username of usernames) {
      try {
        // Check if user exists
        const { data: existing } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single();
        
        // Scrape data
        const data = await scrapeLeetCard(username);
        
        if (existing) {
          // Update existing user
          const existingQuestions = new Set(existing.questions || []);
          const newQuestions = new Set(data.questions);
          const allQuestions = Array.from(new Set([...existingQuestions, ...newQuestions]));
          
          await supabase
            .from('users')
            .update({
              total: data.total,
              easy: data.easy,
              medium: data.medium,
              hard: data.hard,
              questions: allQuestions
            })
            .eq('id', existing.id);
          
          results.updated++;
        } else {
          // Insert new user
          await supabase
            .from('users')
            .insert({
              username,
              total: data.total,
              easy: data.easy,
              medium: data.medium,
              hard: data.hard,
              questions: data.questions
            });
          
          results.added++;
        }
      } catch (error) {
        results.failed.push({
          username,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in bulk import:', error);
    return NextResponse.json(
      { error: 'Failed to import users' },
      { status: 500 }
    );
  }
}
