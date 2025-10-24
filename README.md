# CPHUB - Competitive Programming Hub

A comprehensive competitive programming statistics and tracking platform that provides:
- **API Access**: Unified APIs for LeetCode, Codeforces, and CodeChef
- **User Dashboard**: View detailed statistics from multiple platforms
- **LeetCode Tracker**: Track and compare LeetCode progress across users
- **Rankings**: Leaderboard of tracked users

## 🚀 Features

### 1. Multi-Platform API
Access user data from:
- LeetCode (user stats, contests, problems, calendar)
- Codeforces (user info, contests, problems)
- CodeChef (user profile, contests, problems)

### 2. Dashboard
Search and view comprehensive statistics for any user across all platforms.

### 3. LeetCode Tracker
- Add multiple users to track
- Monitor problem-solving progress
- Check who solved specific problems
- Update all users' stats with one click

### 4. Rankings
- Leaderboard sorted by total problems solved
- Visual difficulty breakdown (Easy/Medium/Hard)
- Bulk import functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: TailwindCSS with Neobrutalism design
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Web Scraping**: Cheerio
- **UI Components**: Radix UI

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd CompetitiveProgrammingDashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
```

4. Set up Supabase Database:
Run this SQL in your Supabase SQL editor:

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

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment to Vercel

1. Push your code to GitHub

2. Import your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. Configure environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add `SUPABASE_URL` and `SUPABASE_KEY`

4. Deploy!

## 📚 API Endpoints

### LeetCode
- `/api/leetcode` - API documentation
- `/api/leetcode/user/[username]` - User stats
- `/api/leetcode/user/[username]/calendar` - Submission calendar
- `/api/leetcode/user/[username]/recent-ac` - Recent accepted submissions
- `/api/leetcode/contest/upcoming` - Upcoming contests
- `/api/leetcode/problems` - All problems
- `/api/leetcode/problems/potd` - Problem of the day

### Codeforces
- `/api/codeforces` - API documentation
- `/api/codeforces/user/[username]` - User info
- `/api/codeforces/user/[username]/calendar` - Contest calendar
- `/api/codeforces/contest` - Recent contests
- `/api/codeforces/contest/upcoming` - Upcoming contests
- `/api/codeforces/problems` - Problem list
- `/api/codeforces/problems/[contestId]` - Problems by contest

### CodeChef
- `/api/codechef` - API documentation
- `/api/codechef/user/[username]` - User profile
- `/api/codechef/contest/upcoming` - Upcoming contests
- `/api/codechef/problems` - Problem list

### Tracker
- `/api/tracker/users` - Get all tracked users
- `/api/tracker/add` - Add a user (POST)
- `/api/tracker/update` - Update all users
- `/api/tracker/check/[question]` - Check who solved a question
- `/api/tracker/users/[username]` - Get/Delete specific user
- `/api/tracker/bulk-import` - Import multiple users (POST)

## 🎨 Pages

- `/` - Home page with API explorer
- `/dashboard` - Multi-platform user statistics
- `/tracker` - LeetCode progress tracker
- `/ranking` - User leaderboard

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ for competitive programmers
