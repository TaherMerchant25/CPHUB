import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { scrapeLeetCard } from '@/lib/leetcard-scraper';

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    let updatedCount = 0;
    const errors: Array<{ username: string; error: string }> = [];
    
    for (const user of users || []) {
      try {
        const data = await scrapeLeetCard(user.username);
        
        // Merge questions (keep existing + add new)
        const existingQuestions = new Set(user.questions || []);
        const newQuestions = new Set(data.questions);
        const allQuestions = Array.from(new Set([...existingQuestions, ...newQuestions]));
        
        // Update database
        await supabase
          .from('users')
          .update({
            total: data.total,
            easy: data.easy,
            medium: data.medium,
            hard: data.hard,
            questions: allQuestions
          })
          .eq('id', user.id);
        
        updatedCount++;
      } catch (error) {
        errors.push({
          username: user.username,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      updated: updatedCount,
      total: users?.length || 0,
      errors
    });
  } catch (error) {
    console.error('Error updating users:', error);
    return NextResponse.json(
      { error: 'Failed to update users' },
      { status: 500 }
    );
  }
}
