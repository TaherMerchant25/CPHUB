# Quick Setup Guide - Import Users to Supabase

## Step 1: Create the Database Table

1. Go to your Supabase dashboard:
   **https://wdbxvhjibcmwgpggiwgw.supabase.co**

2. Click on **"SQL Editor"** in the left sidebar

3. Click **"New query"**

4. Copy and paste the entire contents of `scripts/setup-database.sql`

5. Click **"Run"** or press `Ctrl+Enter`

6. You should see "Table created successfully!" message

## Step 2: Import All 43 Users

Once the table is created, run:

```bash
npm run import-users
```

This will:
- Scrape LeetCode stats for all 43 users from `1.txt`
- Store their data in Supabase
- Show progress for each user
- Take approximately 1-2 minutes (1 second delay between users to avoid rate limiting)

## Step 3: Verify Import

After import completes, you can:

1. **Check in Supabase**:
   - Go to "Table Editor" → "users"
   - You should see all 43 users

2. **Check in your app**:
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3000/ranking
   - You should see the leaderboard with all users!

## Troubleshooting

### If import fails:
- Check that you ran the SQL script first
- Verify your Supabase credentials in `.env.local`
- Check your internet connection (script needs to fetch from LeetCode)

### If some users fail:
- The script will continue with other users
- Failed users will be listed at the end
- You can re-run the script - it will update existing users

## Alternative: Manual SQL Insert

If you prefer, you can also insert users manually via SQL:

```sql
INSERT INTO users (username, total, easy, medium, hard, questions)
VALUES 
  ('rIwtJjkvXG', 438, 218, 208, 12, '{}'),
  ('Shyyshawarma', 390, 127, 233, 30, '{}')
  -- ... etc
ON CONFLICT (username) DO UPDATE SET
  total = EXCLUDED.total,
  easy = EXCLUDED.easy,
  medium = EXCLUDED.medium,
  hard = EXCLUDED.hard;
```

## What Happens During Import

For each user, the script:
1. Fetches live data from LeetCode via LeetCard
2. Extracts: total solved, easy/medium/hard counts, recent AC problems
3. Stores in Supabase database
4. If user exists, updates their stats
5. If user is new, creates new record

## Expected Output

```
=================================
Starting bulk import of LeetCode users
Total users to import: 43
=================================

[1/43] Processing rIwtJjkvXG...
✓ rIwtJjkvXG: Total=438, Easy=218, Medium=208, Hard=12
✓ Added rIwtJjkvXG

[2/43] Processing Shyyshawarma...
✓ Shyyshawarma: Total=390, Easy=127, Medium=233, Hard=30
✓ Added Shyyshawarma

...

=================================
Import Complete!
=================================
✓ Added: 43
✓ Updated: 0
✗ Failed: 0
=================================
```

---

**Ready to go!** 🚀
