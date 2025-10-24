// Automated ranking update service
// This runs on Vercel cron jobs to update user rankings periodically

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { scrapeLeetCard } from '@/lib/leetcard-scraper';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron or authorized
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow manual trigger in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    console.log('[CRON] Starting automatic ranking update...');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;

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
        console.log(`[CRON] Updated ${user.username}: ${data.total} total`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        errors.push({
          username: user.username,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`[CRON] Failed to update ${user.username}:`, error);
      }
    }
    
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      updated: updatedCount,
      total: users?.length || 0,
      errors
    };
    
    console.log('[CRON] Update complete:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('[CRON] Fatal error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update rankings',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
