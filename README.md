# 🚀 Hades (Competitive Programming API)

A comprehensive Next.js-based REST API service that aggregates data from multiple competitive programming platforms, providing unified access to problems, contests, user statistics, and more.

## 📋 Overview

Hades is a centralized API service that fetches and serves data from popular competitive programming platforms including LeetCode, Codeforces, and CodeChef. It provides developers with a single endpoint to access programming challenges, contest information, user profiles, and submission histories across multiple platforms.

## 📚 API Documentation

### Base URL

```
https://hades.strawhats.tech/api
```

### Response Format

All endpoints return a consistent JSON response format:

```json
{
  "status": 200,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

## 🎯 LeetCode API Endpoints

### Overview

Access the LeetCode API documentation:

```
GET /api/leetcode
```

| Endpoint                                 | Method | Description                     | Parameters                                                     |
| ---------------------------------------- | ------ | ------------------------------- | -------------------------------------------------------------- |
| `/api/leetcode/user/[username]`          | GET    | Fetch user profile data         | `username` (path)                                              |
| `/api/leetcode/problems`                 | GET    | Fetch all problems with filters | `difficulty`, `tags`, `category`, `frontendQuestionId`, `skip` |
| `/api/leetcode/problems/potd`            | GET    | Get Problem of the Day          | None                                                           |
| `/api/leetcode/user/[username]/calendar` | GET    | Get user submission calendar    | `username` (path)                                              |
| `/api/leetcode/contest/upcoming`         | GET    | Get upcoming contests           | None                                                           |

#### LeetCode Problems Filters

| Filter               | Type          | Description                             | Example                                |
| -------------------- | ------------- | --------------------------------------- | -------------------------------------- |
| `difficulty`         | String        | Filter by difficulty level              | `?difficulty=Easy`                     |
| `tags`               | String        | Filter by topic tags (multiple allowed) | `?tags=array&tags=dynamic-programming` |
| `category`           | String        | Filter by category slug                 | `?category=algorithms`                 |
| `frontendQuestionId` | String/Number | Search by question ID or title slug     | `?frontendQuestionId=two-sum`          |
| `skip`               | Number        | Skip questions for pagination           | `?skip=100`                            |

#### Example Usage

```bash
# Get user profile
curl https://hades.strawhats.tech/api/leetcode/user/john_doe

# Get easy array problems
curl https://hades.strawhats.tech/api/leetcode/problems?difficulty=Easy&tags=array

# Get problem of the day
curl https://hades.strawhats.tech/api/leetcode/problems/potd
```

## 🏆 Codeforces API Endpoints

### Overview

Access the Codeforces API documentation:

```
GET /api/codeforces
```

| Endpoint                                   | Method | Description                         | Parameters                          |
| ------------------------------------------ | ------ | ----------------------------------- | ----------------------------------- |
| `/api/codeforces/user/[username]`          | GET    | Fetch user profile data             | `username` (path)                   |
| `/api/codeforces/problems`                 | GET    | Fetch all problems from problemset  | None                                |
| `/api/codeforces/problems/[contestId]`     | GET    | Fetch specific problem from contest | `contestId` (path), `index` (query) |
| `/api/codeforces/contest`                  | GET    | Fetch all contests                  | None                                |
| `/api/codeforces/contest/upcoming`         | GET    | Fetch upcoming contests             | None                                |
| `/api/codeforces/user/[username]/calendar` | GET    | Get user submission history         | `username` (path)                   |

#### Codeforces Problem Filters

| Filter  | Type   | Description                                  | Example    |
| ------- | ------ | -------------------------------------------- | ---------- |
| `index` | String | Problem index within contest (A, B, C, etc.) | `?index=A` |

#### Example Usage

```bash
# Get user profile
curl https://hades.strawhats.tech/api/codeforces/user/tourist

# Get all problems
curl https://hades.strawhats.tech/api/codeforces/problems

# Get specific problem from contest
curl https://hades.strawhats.tech/api/codeforces/problems/1851?index=A

# Get upcoming contests
curl https://hades.strawhats.tech/api/codeforces/contest/upcoming
```

## 👨‍💻 CodeChef API Endpoints

### Overview

Access the CodeChef API documentation:

```
GET /api/codechef
```

| Endpoint                         | Method | Description                        | Parameters        |
| -------------------------------- | ------ | ---------------------------------- | ----------------- |
| `/api/codechef/user/[username]`  | GET    | Fetch user profile data            | `username` (path) |
| `/api/codechef/problems`         | GET    | Fetch recent problems with filters | `limit`           |
| `/api/codechef/problems/potd`    | GET    | Get Problem of the Day             | None              |
| `/api/codechef/contest/upcoming` | GET    | Get upcoming and running contests  | None              |

#### CodeChef Problems Filters

| Filter  | Type   | Description                                         | Example     |
| ------- | ------ | --------------------------------------------------- | ----------- |
| `limit` | Number | Number of problems to fetch (default: 20, max: 100) | `?limit=50` |

#### Example Usage

```bash
# Get user profile
curl https://hades.strawhats.tech/api/codechef/user/gennady.korotkevich

# Get recent problems (default 20)
curl https://hades.strawhats.tech/api/codechef/problems

# Get 50 recent problems
curl https://hades.strawhats.tech/api/codechef/problems?limit=50

# Get problem of the day
curl https://hades.strawhats.tech/api/codechef/problems/potd

# Get upcoming contests
curl https://hades.strawhats.tech/api/codechef/contest/upcoming
```

## 📊 Response Examples

### User Profile Response

```json
{
  "status": 200,
  "message": "User data fetched successfully",
  "data": {
    "username": "john_doe",
    "rating": 1543,
    "rank": "Expert",
    "submissions": 245,
    "problems_solved": 180
    // Platform-specific additional data
  }
}
```

### Problems Response

```json
{
  "status": 200,
  "message": "Problems fetched successfully",
  "data": {
    "problems": [
      {
        "id": "1",
        "title": "Two Sum",
        "difficulty": "Easy",
        "tags": ["array", "hash-table"],
        "acceptance_rate": "49.5%"
      }
      // More problems...
    ],
    "total": 2500
  }
}
```

### Contest Response

```json
{
  "status": 200,
  "message": "Contests fetched successfully",
  "data": [
    {
      "id": 1851,
      "name": "Codeforces Round #885",
      "start_time": "2024-07-13T14:35:00Z",
      "duration": 7200,
      "phase": "BEFORE"
    }
    // More contests...
  ]
}
```

### CodeChef User Profile Response

```json
{
  "status": 200,
  "message": "User data fetched successfully",
  "data": {
    "username": "gennady.korotkevich",
    "country": "Belarus",
    "problemSolved": "150",
    "rating": {
      "currentRatingNumber": "2500",
      "ratingStar": "7★",
      "highestRating": "2700",
      "globalRank": "1",
      "countryRank": "1"
    },
    "contests": [
      {
        "name": "Long Challenge",
        "problems": ["PROBLEM1", "PROBLEM2", "PROBLEM3"]
      }
      // More contest data...
    ]
  }
}
```

### CodeChef Problems Response

```json
{
  "status": 200,
  "message": "Problems fetched successfully",
  "data": [
    {
      "id": "PROB001",
      "code": "HELLO",
      "name": "Life, the Universe, and Everything",
      "difficulty": "Simple",
      "totalSubmissions": "50000",
      "successfulSubmissions": "35000",
      "contestCode": "PRACTICE"
    }
    // More problems...
  ]
}
```

## 🔒 Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Rate Limit**: 10 requests per minute per IP

Made with 💻 by [Mani](https://github.com/YadlaMani) and [Ananya](https://github.com/Ananya54321)
