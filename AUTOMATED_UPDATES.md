# Automated Ranking Updates

## Overview
The CPHUB system automatically updates LeetCode rankings every 6 hours using Vercel Cron Jobs.

## How It Works

### 1. Automated Updates (Production)
When deployed to Vercel, the system automatically:
- Runs every **6 hours** (at 00:00, 06:00, 12:00, 18:00 UTC)
- Fetches latest stats for all 43 users from LeetCode
- Updates the Supabase database
- Maintains question history (never deletes solved questions)

**Cron Schedule**: `0 */6 * * *`
- This means: At minute 0, every 6 hours

### 2. Manual Updates
You can also trigger updates manually:

#### Via Web UI:
- Go to `/ranking` page
- Click "Update All" button
- Wait 1-2 minutes for completion

#### Via API:
```bash
# Development
curl http://localhost:3000/api/tracker/update

# Production
curl https://your-app.vercel.app/api/tracker/update
```

#### Via Cron Endpoint (requires auth):
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-app.vercel.app/api/cron/update-rankings
```

### 3. Update Frequency Options

To change update frequency, edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/update-rankings",
      "schedule": "YOUR_SCHEDULE_HERE"
    }
  ]
}
```

**Common schedules:**
- Every 15 minutes: `*/15 * * * *`
- Every hour: `0 * * * *`
- Every 6 hours: `0 */6 * * *` (current)
- Every 12 hours: `0 */12 * * *`
- Daily at midnight: `0 0 * * *`
- Daily at 9 AM: `0 9 * * *`

⚠️ **Note**: More frequent updates consume more bandwidth and may hit rate limits.

## Deployment Setup

### Step 1: Deploy to Vercel
```bash
# Push to GitHub
git add .
git commit -m "Add automated ranking updates"
git push

# Deploy to Vercel (via dashboard or CLI)
vercel --prod
```

### Step 2: Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | `https://wdbxvhjibcmwgpggiwgw.supabase.co` |
| `SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `CRON_SECRET` | `cphub_cron_secret_2025` (or generate your own) |

### Step 3: Enable Cron Jobs
Vercel automatically detects `vercel.json` cron configuration.
No additional setup needed!

## Monitoring Updates

### Check Update Logs
1. Go to Vercel Dashboard
2. Navigate to your project
3. Click "Logs"
4. Filter by `/api/cron/update-rankings`

### View Update History
Each cron run returns:
```json
{
  "success": true,
  "timestamp": "2025-10-25T10:00:00.000Z",
  "updated": 43,
  "total": 43,
  "errors": []
}
```

### Monitor Database
- Go to Supabase Dashboard
- Table Editor → users
- Check `updated_at` column for last update time

## Rate Limiting
To avoid LeetCode rate limiting:
- 1 second delay between each user
- 43 users = ~45 seconds total per update
- Recommended: Max 1 update per 15 minutes

## Troubleshooting

### Cron not running?
1. Check Vercel logs for errors
2. Verify `vercel.json` syntax
3. Ensure environment variables are set
4. Check cron schedule format

### Some users failing?
- Users may have changed usernames
- LeetCode may be temporarily unavailable
- Rate limiting in effect
- Check error details in response

### Force immediate update?
Visit: `https://your-app.vercel.app/api/cron/update-rankings`
(Requires `Authorization: Bearer CRON_SECRET` header in production)

## Manual Override

If you need to update NOW without waiting for cron:

```bash
# Using the tracker API (recommended)
curl -X GET https://your-app.vercel.app/api/tracker/update

# Or trigger cron manually (requires secret)
curl -H "Authorization: Bearer cphub_cron_secret_2025" \
  https://your-app.vercel.app/api/cron/update-rankings
```

## Best Practices

1. **Don't over-update**: LeetCode may rate limit
2. **Monitor logs**: Check for consistent failures
3. **Backup data**: Export table periodically
4. **Test locally**: Use `/api/tracker/update` for testing
5. **Keep secrets safe**: Never commit `.env.local` to git

## Update Flow

```
┌─────────────┐
│ Vercel Cron │ (Every 6 hours)
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ /api/cron/update    │
│     -rankings       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ For each user:      │
│ 1. Scrape LeetCard  │
│ 2. Update Supabase  │
│ 3. Wait 1 second    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Rankings Updated!   │
│ Check /ranking page │
└─────────────────────┘
```

---

**Last Updated**: October 25, 2025
**Current Schedule**: Every 6 hours
**Total Users**: 43
