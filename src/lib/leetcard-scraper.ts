import * as cheerio from 'cheerio';

export interface LeetCardData {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  questions: string[];
}

export async function scrapeLeetCard(username: string): Promise<LeetCardData> {
  const url = `https://leetcard.jacoblin.cool/${username}?ext=activity`;
  
  try {
    const response = await fetch(url, { 
      next: { revalidate: 0 },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch LeetCard: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract counts
    const totalText = $('#total-solved-text').text().trim();
    const easyText = $('#easy-solved-count').text().trim();
    const mediumText = $('#medium-solved-count').text().trim();
    const hardText = $('#hard-solved-count').text().trim();
    
    const total = parseInt(totalText) || 0;
    const easy = parseInt(easyText.split(' /')[0]) || 0;
    const medium = parseInt(mediumText.split(' /')[0]) || 0;
    const hard = parseInt(hardText.split(' /')[0]) || 0;
    
    // Extract recent questions
    const questions: string[] = [];
    for (let i = 0; i < 5; i++) {
      const qid = `ext-activity-item-${i}`;
      const elem = $(`a#${qid}`);
      
      if (elem.length) {
        const texts = elem.find('text').toArray().map(el => $(el).text().trim());
        
        // Check if it's an AC (Accepted) submission
        if (texts[1] === 'AC' && texts[3]) {
          questions.push(texts[3]);
        }
      }
    }
    
    return { total, easy, medium, hard, questions };
  } catch (error) {
    throw new Error(`Failed to scrape LeetCard for ${username}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
