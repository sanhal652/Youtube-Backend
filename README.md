# 📺 VideoTube Backend

A production-ready, feature-rich backend for a YouTube-like video sharing platform built with Node.js, Express, MongoDB, Redis, and Socket.IO.

---

## 🚀 Features

- **Authentication** — JWT-based access & refresh token system with secure HTTP-only cookies
- **Video Management** — Upload, update, delete, and fetch videos with Cloudinary integration
- **AI Categorization** -Automatically categorizes videos on upload using Google Gemini AI |
- **AI Summarization** -Generates concise video summaries on demand using Google Gemini AI |
- **Redis Caching** — Caching on videos, comments, tweets, channel stats, and feeds for fast response times
- **Real-time Notifications** — WebSocket-powered live notifications for likes, comments, and subscriptions using Socket.IO
- **Cache Invalidation** - Stale cache is automatically cleared on every mutation |
- **Unread Notification Count** — Redis hash-based unread notification tracking per user
- **Self-interaction Prevention** — Owners don't receive notifications for their own likes/subscriptions
- **Comments** — Paginated comments with user details
- **Tweets** — Twitter-like short posts with caching
- **Playlists** — Create, update, delete playlists and manage videos within them
- **Subscriptions** — Subscribe/unsubscribe to channels with real-time notifications
- **Likes** — Toggle likes on videos, tweets, and comments
- **Dashboard** — Channel stats (total views, likes, subscribers, videos) with Redis caching
- **Rate Limiting** — Login route protection against brute force attacks
- **Pagination** — Cursor-based pagination on videos and comments using `mongoose-aggregate-paginate-v2`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚙️ Node.js + Express | Server and REST API |
| 🍃MongoDB + Mongoose | Primary database |
| 🔴Redis | Caching and notification counters |
| 🔌Socket.IO | Real-time WebSocket notifications |
|  🤖 Google Gemini AI | Video categorization and summarization |
| ☁️Cloudinary | Video and image storage |
| 🔑JWT | Authentication |
| 📦Multer | File upload handling |
| 🛡️express-rate-limit | Rate limiting |
| 🔒bcrypt | Password hashing |

---

## 🤖 AI Features

### 🏷️ Auto Video Categorization
When a video is uploaded, Gemini AI automatically analyzes the title and description and assigns the most appropriate category:

> `Education` • `Entertainment` • `Technology` • `Lifestyle` • `Sports` • `Music` • `Travel` • `Food` • `Fashion` • `Gaming` • `Health and Fitness` • `Comedy` • `Science` • `Art and Culture` • `Business and Finance`

### 📝 Video Summarization *(On Demand)*
Generates a concise 2-3 sentence summary using a **3-layer fetching strategy** to minimize API costs:

```
Request comes in
      │
      ▼
 Redis Cache ──── Hit ──────────────────► Return cached summary
      │
    Miss
      │
      ▼
  MongoDB ──────── Has summary ─────────► Return & cache in Redis
      │
   No summary
      │
      ▼
 Gemini AI ──────► Generate summary ───► Save to MongoDB + Redis ──► Return
```

---

## 📁 Project Structure

```
src/
├── 📂 controllers/
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── tweet.controller.js
│   ├── playlist.controller.js
│   ├── subscription.controller.js
│   ├── dashboard.controller.js
│   └── notification.controller.js
├── 📂 db/
│   ├── index.js              # MongoDB connection
│   └── redis.js              # Redis connection
├── 📂 middlewares/
│   ├── auth.middleware.js
│   ├── multer.middleware.js
│   └── rateLimiter.middleware.js
├── 📂 models/
│   ├── user.model.js
│   ├── videos.model.js
│   ├── comments.model.js
│   ├── likes.model.js
│   ├── tweets.model.js
│   ├── playlist.model.js
│   └── subscription.model.js
├── routes/
│   ├── user.routes.js
│   ├── video.route.js
│   ├── comment.routes.js
│   ├── like.routes.js
│   ├── tweet.routes.js
│   ├── playlist.routes.js
│   ├── subscription.routes.js
│   ├── dashboard.routes.js
│   └── notification.routes.js
├── 📂 utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── cloudinary.js
    └── AiFunctions.js        # Gemini AI functions
├── app.js
├── socket.js
├── constants.js
└── index.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000

# 🍃 MongoDB
MONGODB_URI=your_mongodb_connection_string

# 🔑 JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# ☁️ Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# 🔴 Redis
REDIS_URL=redis://localhost:6379

# 🤖 Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🏃 Getting Started

### Prerequisites
- ✅ Node.js v18+
- ✅ MongoDB (local or Atlas)
- ✅ Redis (local or cloud)
- ✅ Cloudinary account
- ✅ Google Gemini API key — free at [aistudio.google.com](https://aistudio.google.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/sanhal652/Youtube-Backend.git
cd Youtube-Backend

# 📦 Install dependencies
npm install

# ⚙️ Configure environment variables
cp .env.sample .env

# ▶️ Start the development server
npm run dev
```

---

## 📡 API Endpoints

### Auth & Users — `/api/v1/user`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Register a new user | ❌ |
| POST | `/login` | Login user (rate limited) | ❌ |
| POST | `/logout` | Logout user | ✅ |
| POST | `/refresh-token` | Refresh access token | ❌ |
| POST | `/change-password` | Change current password | ✅ |
| GET | `/current-user` | Get logged in user | ✅ |
| PATCH | `/update-account` | Update name and email | ✅ |
| PATCH | `/update-avatar` | Update avatar image | ✅ |
| PATCH | `/update-cover-image` | Update cover image | ✅ |
| GET | `/channel/:username` | Get channel profile | ✅ |
| GET | `/watch-history` | Get watch history | ✅ |

### Videos — `/api/v1/video`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/` | Get all videos (paginated, filterable) | ❌ |
| POST | `/upload` | Upload a new video | ✅ |
| GET | `/:videoId` | Get video by ID (with caching) | ❌ |
| PATCH | `/:videoId` | Update video details | ✅ |
| DELETE | `/:videoId` | Delete video | ✅ |
| PATCH | `/toggle/:videoId` | Toggle publish status | ✅ |
|  GET  | `/summary/:videoId` | Get AI-generated summary | ✅ |

### Comments — `/api/v1/comment`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/:videoId` | Get paginated comments (with caching) | ❌ |
| POST | `/:videoId` | Add a comment | ✅ |
| PATCH | `/c/:commentId` | Update comment | ✅ |
| DELETE | `/c/:commentId` | Delete comment | ✅ |

### Likes — `/api/v1/likes`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/toggle/v/:videoId` | Toggle like on video | ✅ |
| POST | `/toggle/t/:tweetId` | Toggle like on tweet | ✅ |
| POST | `/toggle/c/:commentId` | Toggle like on comment | ✅ |
| GET | `/videos` | Get all liked videos | ✅ |

### Tweets — `/api/v1/tweet`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/` | Create a tweet | ✅ |
| GET | `/user/:userId` | Get user tweets (with caching) | ❌ |
| PATCH | `/:tweetId` | Update tweet | ✅ |
| DELETE | `/:tweetId` | Delete tweet | ✅ |

### Playlists — `/api/v1/playlist`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/` | Create a playlist | ✅ |
| GET | `/:playlistId` | Get playlist by ID | ❌ |
| PATCH | `/:playlistId` | Update playlist | ✅ |
| DELETE | `/:playlistId` | Delete playlist | ✅ |
| PATCH | `/add/:videoId/:playlistId` | Add video to playlist | ✅ |
| PATCH | `/remove/:videoId/:playlistId` | Remove video from playlist | ✅ |
| GET | `/user/:userId` | Get all user playlists | ❌ |

### Subscriptions — `/api/v1/subscription`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/c/:channelId` | Toggle subscribe/unsubscribe | ✅ |
| GET | `/c/:channelId` | Get channel subscribers | ❌ |
| GET | `/u/:userId` | Get subscribed channels | ✅ |

### 📊Dashboard — `/api/v1/dashboard`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/stats/:channelId` | Get channel stats (with caching) | ✅ |
| GET | `/videos/:channelId` | Get all channel videos | ✅ |

### 🔕Notifications — `/api/v1/notifications`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/clear` | Clear unread notification count | ✅ |

---

## 🔌 WebSocket Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `setup` | `userId` | Register user's socket connection |
| `joinVideo` | `videoId` | Join a video room for live updates |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `notification` | `{ message, from, unreadCount, videoId? }` | Real-time notification for likes/subscriptions |

---

## 🧠 Redis Caching Strategy

| Cache Key | TTL | Description |
|---|---|---|
| `video:{videoId}` | 1000s | Single video data |
| `all_videos:{page}:{limit}:{...}` | 2000s | Paginated video feed |
| `video_comments:{videoId}:{page}:{limit}` | 1000s | Paginated comments |
| `user_tweets:{userId}` | 1800s | User tweet list |
| `channel_stats:{channelId}` | 3600s | Channel dashboard stats |
| `notification:unread` | Persistent hash | Per-user unread notification counts |

---

### 🔄 Cache Invalidation Rules

| 🎯 Action | 🗑️ Cache Cleared |
|---|---|
| Video uploaded | `all_videos:*` |
| Video updated | `video:{id}` + `all_videos:*` |
| Video deleted | `video:{id}` + `video_summary:{id}` + `all_videos:*` |
| Comment mutation | `video_comments:{videoId}:*` |
| Tweet mutation | `user_tweets:{userId}` |
| Publish toggled | `video:{id}` + `all_videos:*` |

## 🔒 Security

- Passwords hashed with **bcrypt**
- JWT tokens stored in **HTTP-only cookies** (not accessible via JavaScript)
- Login route protected with **rate limiting** (10 requests per 15 minutes)
- Owner-only access enforced on all update/delete operations
- Self-notification prevention on likes and subscriptions

---

## 👨‍💻 Author

Built by [Sangita Halder]
(https://github.com/sanhal652)
