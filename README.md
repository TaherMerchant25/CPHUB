# 🚀 Hades - Competitive Programming API

<div align="center">

![Hades API](https://img.shields.io/badge/Hades-API-blue?style=for-the-badge&logo=api)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**A unified REST API for competitive programming platforms**

*Seamlessly access LeetCode, Codeforces, and CodeChef data through a single, powerful API*

[🌐 Live API](https://hades.mani.works/api) • [📖 Documentation](#-api-documentation) • [🚀 Quick Start](#-quick-start) • [💡 Examples](#-examples)

</div>

---

## 🎯 What is Hades?

Hades is a **comprehensive REST API service** that aggregates data from the most popular competitive programming platforms. Instead of integrating with multiple platform APIs separately, developers can use Hades as a **single source of truth** for:

- 👤 **User profiles and statistics**
- 🧩 **Programming problems and challenges**
- 🏆 **Contest information and schedules**
- 📊 **Submission histories and calendars**
- 🎪 **Problem of the day features**

### 🌟 Why Choose Hades?

✅ **Unified Interface** - One API for multiple platforms  
✅ **Consistent Format** - Standardized JSON responses  
✅ **Rate Limited** - Fair usage protection  
✅ **Real-time Data** - Fresh data from all platforms  
✅ **Developer Friendly** - Clear documentation and examples  

---

## 🚀 Quick Start

### Base URL
```
https://hades.mani.works/api
```

### Making Your First Request

```bash
# Get information about available endpoints
curl https://hades.mani.works/api/leetcode

# Fetch a user's LeetCode profile
curl https://hades.mani.works/api/leetcode/user/your-username

# Get today's problem of the day
curl https://hades.mani.works/api/leetcode/problems/potd
```

### Response Format

All endpoints return a consistent JSON structure:

```json
{
  "status": 200,
  "message": "Success message",
  "data": {
    // Your requested data here
  }
}
```

---

## 📚 API Documentation

## 🎯 LeetCode API

*Perfect for coding interview preparation and daily practice*

### 📋 Available Endpoints

| Endpoint | Description | Use Case |
|----------|-------------|----------|
| `GET /api/leetcode` | API documentation | Explore available routes |
| `GET /api/leetcode/user/[username]` | User profile data | Portfolio, statistics tracking |
| `GET /api/leetcode/problems` | Browse problems with filters | Problem discovery, practice planning |
| `GET /api/leetcode/problems/potd` | Problem of the Day | Daily challenges, consistency tracking |
| `GET /api/leetcode/user/[username]/calendar` | Submission calendar | Activity visualization |
| `GET /api/leetcode/contest/upcoming` | Upcoming contests | Contest preparation |

### 🔍 Problem Filtering Options

Create powerful queries to find exactly the problems you need:

```bash
# Find easy array problems
/api/leetcode/problems?difficulty=Easy&tags=array

# Get dynamic programming problems
/api/leetcode/problems?tags=dynamic-programming

# Search for specific problems
/api/leetcode/problems?frontendQuestionId=two-sum

# Paginate through results
/api/leetcode/problems?skip=100
```

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `difficulty` | String | Easy, Medium, Hard | `difficulty=Medium` |
| `tags` | String[] | Topic tags (multiple allowed) | `tags=array&tags=hash-table` |
| `category` | String | Problem category | `category=algorithms` |
| `frontendQuestionId` | String | Question ID or slug | `frontendQuestionId=reverse-integer` |
| `skip` | Number | Pagination offset | `skip=50` |

---

## 🏆 Codeforces API

*Access the world's most popular competitive programming platform*

### 📋 Available Endpoints

| Endpoint | Description | Use Case |
|----------|-------------|----------|
| `GET /api/codeforces` | API documentation | Explore available routes |
| `GET /api/codeforces/user/[username]` | User profile and ratings | Track competitive progress |
| `GET /api/codeforces/problems` | All problemset problems | Practice, problem solving |
| `GET /api/codeforces/problems/[contestId]` | Contest-specific problems | Contest analysis, upsolving |
| `GET /api/codeforces/contest` | All contests | Historical data, analysis |
| `GET /api/codeforces/contest/upcoming` | Upcoming contests | Contest planning |
| `GET /api/codeforces/user/[username]/calendar` | Submission history | Progress tracking |

### 🎯 Contest Problem Access

```bash
# Get problem A from contest 1851
/api/codeforces/problems/1851?index=A

# Get all problems from a contest
/api/codeforces/problems/1851
```

---

## 👨‍💻 CodeChef API

*India's largest competitive programming community*

### 📋 Available Endpoints

| Endpoint | Description | Status |
|----------|-------------|--------|
| `GET /api/codechef` | API documentation | ✅ Available |
| `GET /api/codechef/user/[username]` | User profile data | ✅ Available |
| `GET /api/codechef/problems` | Recent problems | ✅ Available |
| `GET /api/codechef/problems/potd` | Problem of the Day | ✅ Available |
| `GET /api/codechef/contest/upcoming` | Upcoming contests | ✅ Available |

### 🔧 Query Parameters

```bash
# Limit number of problems returned
/api/codechef/problems?limit=50
```

---

## 💡 Examples

### 🔥 Real-World Use Cases

#### 1. **Build a Personal Dashboard**

```javascript
// Fetch user stats from all platforms
const fetchUserStats = async (username) => {
  const [leetcode, codeforces, codechef] = await Promise.all([
    fetch(`https://hades.mani.works/api/leetcode/user/${username}`),
    fetch(`https://hades.mani.works/api/codeforces/user/${username}`),
    fetch(`https://hades.mani.works/api/codechef/user/${username}`)
  ]);
  
  return {
    leetcode: await leetcode.json(),
    codeforces: await codeforces.json(),
    codechef: await codechef.json()
  };
};
```

#### 2. **Create a Problem Recommender**

```javascript
// Get problems based on difficulty and topics
const getRecommendations = async (difficulty, topics) => {
  const problems = await fetch(
    `https://hades.mani.works/api/leetcode/problems?difficulty=${difficulty}&tags=${topics.join('&tags=')}`
  );
  return problems.json();
};

// Usage
const recommendations = await getRecommendations('Medium', ['dynamic-programming', 'graph']);
```

#### 3. **Contest Notification System**

```javascript
// Get all upcoming contests
const getUpcomingContests = async () => {
  const [leetcode, codeforces, codechef] = await Promise.all([
    fetch('https://hades.mani.works/api/leetcode/contest/upcoming'),
    fetch('https://hades.mani.works/api/codeforces/contest/upcoming'),
    fetch('https://hades.mani.works/api/codechef/contest/upcoming')
  ]);
  
  return {
    leetcode: await leetcode.json(),
    codeforces: await codeforces.json(),
    codechef: await codechef.json()
  };
};
```

#### 4. **Daily Problem Challenge Bot**

```javascript
// Get problem of the day from different platforms
const getDailyProblems = async () => {
  const [leetcodePOTD, codechefPOTD] = await Promise.all([
    fetch('https://hades.mani.works/api/leetcode/problems/potd'),
    fetch('https://hades.mani.works/api/codechef/problems/potd')
  ]);
  
  return {
    leetcode: await leetcodePOTD.json(),
    codechef: await codechefPOTD.json()
  };
};
```

### 🌐 Frontend Integration Examples

#### React Hook

```jsx
import { useState, useEffect } from 'react';

const useUserProfile = (platform, username) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://hades.mani.works/api/${platform}/user/${username}`);
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [platform, username]);

  return { profile, loading, error };
};

// Usage in component
const UserProfile = ({ username }) => {
  const { profile, loading, error } = useUserProfile('leetcode', username);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render profile data */}</div>;
};
```

#### Python Integration

```python
import requests
import asyncio
import aiohttp

class HadesAPI:
    BASE_URL = "https://hades.mani.works/api"
    
    def __init__(self):
        self.session = requests.Session()
    
    def get_user_profile(self, platform, username):
        """Get user profile from specified platform"""
        response = self.session.get(f"{self.BASE_URL}/{platform}/user/{username}")
        return response.json()
    
    def get_problems(self, platform, **filters):
        """Get problems with optional filters"""
        params = "&".join([f"{k}={v}" for k, v in filters.items()])
        url = f"{self.BASE_URL}/{platform}/problems"
        if params:
            url += f"?{params}"
        return self.session.get(url).json()
    
    async def get_all_user_data(self, username):
        """Async method to fetch user data from all platforms"""
        async with aiohttp.ClientSession() as session:
            tasks = [
                self._fetch_user_data(session, 'leetcode', username),
                self._fetch_user_data(session, 'codeforces', username),
                self._fetch_user_data(session, 'codechef', username)
            ]
            return await asyncio.gather(*tasks)
    
    async def _fetch_user_data(self, session, platform, username):
        url = f"{self.BASE_URL}/{platform}/user/{username}"
        async with session.get(url) as response:
            return await response.json()

# Usage
api = HadesAPI()
profile = api.get_user_profile('leetcode', 'john_doe')
problems = api.get_problems('leetcode', difficulty='Easy', tags='array')
```

---

## 📊 Response Examples

### 👤 User Profile Response

```json
{
  "status": 200,
  "message": "User data fetched successfully",
  "data": {
    "username": "john_doe",
    "realName": "John Doe",
    "ranking": 125432,
    "rating": 1543,
    "maxRating": 1687,
    "globalRanking": 98234,
    "problemsSolved": 245,
    "totalSubmissions": 567,
    "acceptanceRate": "43.2%",
    "contestsParticipated": 15,
    "badges": ["50 Days Badge", "Annual Badge"],
    "streak": {
      "current": 7,
      "max": 23
    }
  }
}
```

### 🧩 Problems Response

```json
{
  "status": 200,
  "message": "Problems fetched successfully",
  "data": {
    "problems": [
      {
        "questionId": "1",
        "title": "Two Sum",
        "titleSlug": "two-sum",
        "difficulty": "Easy",
        "acceptanceRate": "49.5%",
        "tags": ["Array", "Hash Table"],
        "isPaidOnly": false,
        "hasSolution": true,
        "hasVideoSolution": false,
        "similarQuestions": ["15", "18"],
        "companyTags": ["Amazon", "Google", "Microsoft"]
      }
    ],
    "total": 2847,
    "hasMore": true
  }
}
```

### 🏆 Contest Response

```json
{
  "status": 200,
  "message": "Contests fetched successfully",
  "data": [
    {
      "id": 1851,
      "name": "Codeforces Round #885 (Div. 2)",
      "type": "CF",
      "phase": "BEFORE",
      "frozen": false,
      "durationSeconds": 7200,
      "startTimeSeconds": 1721745300,
      "relativeTimeSeconds": -86400,
      "startTime": "2024-07-23T14:35:00Z",
      "description": "Educational round for Division 2 participants"
    }
  ]
}
```

---

## ⚡ Performance & Limits

### 🔒 Rate Limiting

To ensure fair usage and optimal performance:

- **Rate Limit**: 10 requests per minute per IP address
- **Burst Limit**: Up to 20 requests in the first 10 seconds
- **Headers**: Rate limit info included in response headers

```bash
# Rate limit headers in response
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1721745360
```

### 💡 Best Practices

1. **Cache responses** when possible to reduce API calls
2. **Implement exponential backoff** for failed requests
3. **Use batch endpoints** when fetching multiple data points
4. **Monitor rate limits** and adjust request frequency accordingly

---

## 🛠️ Integration Guide

### Error Handling

```javascript
const handleApiRequest = async (url) => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait before making more requests.');
      }
      if (response.status === 404) {
        throw new Error('Resource not found. Please check the username or endpoint.');
      }
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 200) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data.data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};
```

### TypeScript Definitions

```typescript
// API Response Types
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface UserProfile {
  username: string;
  realName?: string;
  ranking: number;
  rating: number;
  maxRating: number;
  problemsSolved: number;
  totalSubmissions: number;
  acceptanceRate: string;
  contestsParticipated: number;
  badges: string[];
  streak: {
    current: number;
    max: number;
  };
}

interface Problem {
  questionId: string;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptanceRate: string;
  tags: string[];
  isPaidOnly: boolean;
  hasSolution: boolean;
  hasVideoSolution: boolean;
}

interface Contest {
  id: number;
  name: string;
  type: string;
  phase: string;
  durationSeconds: number;
  startTimeSeconds: number;
  startTime: string;
}
```

---

## 🔧 Self-Hosting

Want to run your own instance? Here's how:

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/YadlaMani/hades.git
cd hades

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

### Environment Variables

```env
# Rate limiting (optional)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Optional: API keys for platforms (if required)
LEETCODE_API_KEY=your_leetcode_key
CODEFORCES_API_KEY=your_codeforces_key
```

---

## 🤝 Contributing

We love contributions! Here's how you can help:

### 🐛 Found a Bug?

1. Check existing issues
2. Create a detailed bug report
3. Include reproduction steps

### 💡 Have a Feature Idea?

1. Open a feature request
2. Describe the use case
3. Discuss implementation

### 🔧 Want to Code?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

---

## 📞 Support & Community

- 🐛 **Issues**: [GitHub Issues](https://github.com/YadlaMani/hades/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/YadlaMani/hades/discussions)
- 📧 **Email**: support@hades.mani.works

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

<div align="center">

**Built with ❤️ by**

[![Mani](https://img.shields.io/badge/🧑‍💻-Mani-blue?style=for-the-badge)](https://github.com/YadlaMani)
[![Ananya](https://img.shields.io/badge/👩‍💻-Ananya-pink?style=for-the-badge)](https://github.com/Ananya54321)

*Making competitive programming data accessible to everyone*

</div>

---

<div align="center">

### 🌟 Star us on GitHub if you find this useful!

[![GitHub stars](https://img.shields.io/github/stars/YadlaMani/hades?style=social)](https://github.com/YadlaMani/hades/stargazers)

</div>
