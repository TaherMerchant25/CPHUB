# Deployment Guide for CPHUB

## Prerequisites
1. GitHub account
2. Vercel account (sign up at vercel.com)
3. Supabase account (sign up at supabase.com)

## Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to the SQL Editor (in the left sidebar)
4. Run the following SQL script:

```sql
-- Create the users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    total INTEGER DEFAULT 0,
    easy INTEGER DEFAULT 0,
    medium INTEGER DEFAULT 0,
    hard INTEGER DEFAULT 0,
    questions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on username for faster lookups
CREATE INDEX idx_users_username ON users(username);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Enable all access for authenticated users" ON users
FOR ALL
USING (true)
WITH CHECK (true);
```

5. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy the **Project URL** (this is your `SUPABASE_URL`)
   - Copy the **anon/public key** (this is your `SUPABASE_KEY`)

## Step 2: Push Code to GitHub

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in

2. Click **"Add New Project"** or **"Import Project"**

3. Select **"Import Git Repository"**

4. Choose your GitHub repository

5. Configure the project:
   - Framework Preset: **Next.js** (should be auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

6. **Add Environment Variables** (CRITICAL):
   Click on "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `SUPABASE_URL` | Your Supabase project URL |
   | `SUPABASE_KEY` | Your Supabase anon key |

7. Click **"Deploy"**

8. Wait for the deployment to complete (usually 2-5 minutes)

9. Your site will be live at `https://your-project-name.vercel.app`

## Step 4: Test Your Deployment

1. Visit your deployed site
2. Navigate to `/ranking` and click "Import All Users"
3. Navigate to `/tracker` and add a test user
4. Test the `/dashboard` with a known username
5. Check that all API endpoints work

## Step 5: Custom Domain (Optional)

1. In Vercel, go to your project settings
2. Click on "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Review build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`

### API Routes Return Errors
- Verify Supabase credentials are correct
- Check that the database table exists
- Review Vercel function logs

### Slow Performance
- Consider enabling Vercel Edge Functions
- Check Supabase connection pooling settings
- Add caching where appropriate

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_KEY` | Your Supabase anon/public key | Yes |

## Post-Deployment

1. **Import Users**: Go to `/ranking` and click "Import All Users"
2. **Monitor Usage**: Check Vercel analytics and Supabase dashboard
3. **Enable Analytics**: Optional - enable Vercel Analytics in project settings
4. **Set up Monitoring**: Consider setting up error tracking (Sentry, etc.)

## Updating Your Deployment

When you push changes to your GitHub repository:
1. Vercel will automatically detect the changes
2. A new build will be triggered
3. The site will be updated automatically

To force a redeploy:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find your latest deployment
4. Click the three dots → "Redeploy"

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review the README.md for API documentation
4. Check browser console for client-side errors

---

Happy deploying! 🚀
