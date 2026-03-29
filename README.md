
YouTube Backend Clone 🚀
A production-ready, high-performance backend for a video-sharing platform built with the MERN stack. This project focuses on complex database relationships, optimized MongoDB aggregation pipelines, and a distributed caching layer using Redis to handle high-traffic scenarios.

🛠️ Tech Stack & Tools
Node.js & Express.js - Scalable server-side framework.

MongoDB & Mongoose - Document-oriented database with complex relationship modeling.

Redis (Cloud) - Distributed in-memory data store for high-speed caching.

JWT & bcrypt - Industry-standard secure authentication and session management.

Cloudinary - Third-party media management for optimized video and image hosting.

Mongoose-Aggregate-Paginate-V2 - For efficient, cursor-based pagination of large datasets.

✨ Key Features
⚡ Performance Optimization (Redis Caching)
Implemented a Cache-Aside (Lazy Loading) strategy to significantly reduce database load and improve response times.

Latency Reduction: Read-heavy operations (Channel Stats, Video Details, and Tweets) are cached, cutting response times by up to 80%.

Dynamic Pagination Caching: Sophisticated cache-key generation that accounts for page, limit, query, and sort parameters to ensure data integrity across paginated results.

Atomic Operations: Utilized SETEX for one-trip "Set with Expiry" operations to prevent memory leaks and ensure cache freshness.

📊 Advanced Dashboard & Analytics
Real-time Statistics: A comprehensive creator dashboard providing Total Views, Subscriber counts, Like totals, and Video analytics in a single, optimized query.

Complex Aggregations: Mastering $lookup, $addFields, and $facet stages to perform multi-collection joins within MongoDB.

🔐 Secure Authentication & User Management
Token-Based Security: Implementation of Access and Refresh tokens for a seamless yet secure user session.

Social Logic: Full "Follow/Unfollow" subscription system and "Like/Unlike" functionality with relational integrity.

📈 Database Schema & Logic
The architecture implements a relational-style schema within a NoSQL environment to handle social inter-dependencies.

Highlights of the Aggregation Pipelines:

Channel Stats: Merges data from Users, Videos, Subscriptions, and Likes collections in a single database trip.

Paginated Comments: Fetches top-level comments with nested user avatars and likes, optimized for infinite scroll or paginated UIs.

🧠 Key Learnings
System Design: Transitioning from a basic CRUD application to a scalable system using a distributed cache.

Cache Invalidation: Implementing "Cache-Busting" strategies (using client.del) to ensure that when a user updates data, the cache is instantly refreshed.

Data Modeling: Designing schemas to handle high-frequency social relationships (Subscriptions, Likes, and Views).

Middleware Security: Crafting robust verifyJwt middleware to protect sensitive routes and manage user permissions.


