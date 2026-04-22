📺 VideoTube Backend
A production-ready, feature-rich backend for a YouTube-like video sharing platform built with Node.js, Express, MongoDB, Redis, Socket.IO, and Google Gemini AI.

🚀 Features

Authentication — JWT-based access & refresh token system with secure HTTP-only cookies
Video Management — Upload, update, delete, and fetch videos with Cloudinary integration
AI Video Categorization — Automatically categorizes videos on upload using Google Gemini AI
AI Video Summarization — Generates concise video summaries on demand using Google Gemini AI
Redis Caching — Caching on videos, comments, tweets, channel stats, and feeds for fast response times
Cache Invalidation — Stale cache is automatically cleared on every create, update, and delete operation
Real-time Notifications — WebSocket-powered live notifications for likes, comments, and subscriptions using Socket.IO
Unread Notification Count — Redis hash-based unread notification tracking per user
Self-interaction Prevention — Owners don't receive notifications for their own likes/subscriptions
Comments — Paginated comments with user details
Tweets — Twitter-like short posts with caching
Playlists — Create, update, delete playlists and manage videos within them
Subscriptions — Subscribe/unsubscribe to channels with real-time notifications
Likes — Toggle likes on videos, tweets, and comments
Dashboard — Channel stats (total views, likes, subscribers, videos) with Redis caching
Rate Limiting — Login route protection against brute force attacks
Pagination — Cursor-based pagination on videos and comments using mongoose-aggregate-paginate-v2


🛠️ Tech Stack
TechnologyPurposeNode.js + ExpressServer and REST APIMongoDB + MongoosePrimary databaseRedisCaching and notification countersSocket.IOReal-time WebSocket notificationsGoogle Gemini AIVideo categorization and summarizationCloudinaryVideo and image storageJWTAuthenticationMulterFile upload handlingexpress-rate-limitRate limitingbcryptPassword hashing

🤖 AI Features
Auto Video Categorization
When a video is uploaded, Gemini AI automatically analyzes the title and description and assigns one of the following categories:
Education Entertainment Technology Lifestyle Sports Music Travel Food Fashion Gaming Health and Fitness Comedy Science Art and Culture Business and Finance
Video Summarization (On Demand)
Generates a concise 2-3 sentence summary of any video using a three-layer fetching strategy:

Check Redis cache first
Check MongoDB if already generated before
Call Gemini AI only if not found in either

This ensures the AI is called only once per video, saving API costs.

📁 Project Structure
src/
├── controllers/
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── tweet.controller.js
│   ├── playlist.controller.js
│   ├── subscription.controller.js
│   ├── dashboard.controller.js
│   └── notification.controller.js
├── db/
│   ├── index.js           # MongoDB connection
│   └── redis.js           # Redis connection
├── middlewares/
│   ├── auth.middleware.js
│   ├── multer.middleware.js
│   └── rateLimiter.middleware.js
├── models/
│   ├── user.model.js
│   ├── videos.model.js
│   ├── comments.model.js
│   ├── likes.model.js
│   ├── tweets.model.js
│   ├── playlist.model.js
│   ├── subscription.model.js
│   └── category.model.js
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
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── cloudinary.js
│   └── AiFunctions.js
├── app.js
├── socket.js
├── constants.js
└── index.js

⚙️ Environment Variables
Create a .env file in the root directory with the following:
envPORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

REDIS_URL=redis://localhost:6379

GEMINI_API_KEY=your_gemini_api_key

🏃 Getting Started
Prerequisites

Node.js v18+
MongoDB (local or Atlas)
Redis (local or cloud)
Cloudinary account
Google Gemini API key (free at aistudio.google.com)

Installation
bash# Clone the repository
git clone https://github.com/sanhal652/Youtube-Backend.git
cd Youtube-Backend

# Install dependencies
npm install

# Create and configure .env file
cp .env.sample .env

# Start the development server
npm run dev

📡 API Endpoints
Auth & Users — /api/v1/user
MethodEndpointDescriptionAuth RequiredPOST/registerRegister a new user❌POST/loginLogin user (rate limited)❌POST/logoutLogout user✅POST/refresh-tokenRefresh access token❌POST/change-passwordChange current password✅GET/current-userGet logged in user✅PATCH/update-accountUpdate name and email✅PATCH/update-avatarUpdate avatar image✅PATCH/update-cover-imageUpdate cover image✅GET/channel/:usernameGet channel profile✅GET/watch-historyGet watch history✅
Videos — /api/v1/video
MethodEndpointDescriptionAuth RequiredGET/Get all videos (paginated, filterable)❌POST/uploadUpload video (auto-categorized by AI)✅GET/:videoIdGet video by ID (with caching)❌PATCH/:videoIdUpdate video details✅DELETE/:videoIdDelete video✅PATCH/toggle/:videoIdToggle publish status✅GET/summary/:videoIdGet AI-generated video summary❌
Comments — /api/v1/comment
MethodEndpointDescriptionAuth RequiredGET/:videoIdGet paginated comments (with caching)❌POST/:videoIdAdd a comment✅PATCH/c/:commentIdUpdate comment✅DELETE/c/:commentIdDelete comment✅
Likes — /api/v1/likes
MethodEndpointDescriptionAuth RequiredPOST/toggle/v/:videoIdToggle like on video✅POST/toggle/t/:tweetIdToggle like on tweet✅POST/toggle/c/:commentIdToggle like on comment✅GET/videosGet all liked videos✅
Tweets — /api/v1/tweet
MethodEndpointDescriptionAuth RequiredPOST/Create a tweet✅GET/user/:userIdGet user tweets (with caching)❌PATCH/:tweetIdUpdate tweet✅DELETE/:tweetIdDelete tweet✅
Playlists — /api/v1/playlist
MethodEndpointDescriptionAuth RequiredPOST/Create a playlist✅GET/:playlistIdGet playlist by ID❌PATCH/:playlistIdUpdate playlist✅DELETE/:playlistIdDelete playlist✅PATCH/add/:videoId/:playlistIdAdd video to playlist✅PATCH/remove/:videoId/:playlistIdRemove video from playlist✅GET/user/:userIdGet all user playlists❌
Subscriptions — /api/v1/subscription
MethodEndpointDescriptionAuth RequiredPOST/c/:channelIdToggle subscribe/unsubscribe✅GET/c/:channelIdGet channel subscribers❌GET/u/:userIdGet subscribed channels✅
Dashboard — /api/v1/dashboard
MethodEndpointDescriptionAuth RequiredGET/stats/:channelIdGet channel stats (with caching)✅GET/videos/:channelIdGet all channel videos✅
Notifications — /api/v1/notifications
MethodEndpointDescriptionAuth RequiredPOST/clearClear unread notification count✅

🔌 WebSocket Events
Client → Server
EventPayloadDescriptionsetupuserIdRegister user's socket connectionjoinVideovideoIdJoin a video room for live updates
Server → Client
EventPayloadDescriptionnotification{ message, from, unreadCount, videoId? }Real-time notification for likes/subscriptions

🧠 Redis Caching Strategy
Cache KeyTTLDescriptionvideo:{videoId}1000sSingle video dataall_videos:{page}:{limit}:{...}2000sPaginated video feedvideo_comments:{videoId}:{page}:{limit}1000sPaginated commentsuser_tweets:{userId}1800sUser tweet listchannel_stats:{channelId}3600sChannel dashboard statsvideo_summary:{videoId}2000sAI generated video summarynotification:unreadPersistent hashPer-user unread notification counts
Cache Invalidation
Cache is automatically cleared when data changes:

Video uploaded → clears all_videos:*
Video updated → clears video:{videoId} and all_videos:*
Video deleted → clears video:{videoId}, video_summary:{videoId} and all_videos:*
Comment added/updated/deleted → clears video_comments:{videoId}:*
Tweet added/updated/deleted → clears user_tweets:{userId}
Publish status toggled → clears video:{videoId} and all_videos:*


🔒 Security

Passwords hashed with bcrypt
JWT tokens stored in HTTP-only cookies (not accessible via JavaScript)
Login route protected with rate limiting (10 requests per 15 minutes)
Owner-only access enforced on all update/delete operations
Self-notification prevention on likes and subscriptions


👨‍💻 Author
Built by Sangita Halder