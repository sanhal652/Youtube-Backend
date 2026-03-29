# YouTube Backend Clone 🚀

A production-ready backend for a video-sharing platform built with the **MERN stack**, focusing on complex database relationships, high-performance aggregation pipelines, and secure authentication.

## 🛠️ Tech Stack & Tools
- **Node.js & Express.js** - Server-side framework
- **MongoDB & Mongoose** - Database and Object Modeling
- **JWT &bcrypt** - Secure Authentication
- **Cloudinary** - Media management (Video & Images)
- **Aggregation Pipelines** - High-performance data processing for analytics

## ✨ Key Features
- **Advanced Dashboard:** Real-time channel statistics (Total Views, Subscribers, Likes, and Video counts) using optimized MongoDB aggregations.
- **Video Management:** Secure upload, toggle publish status, and filtered retrieval.
- **Subscription System:** Seamless "Follow/Unfollow" logic with subscriber lists.
- **Authentication:** Industry-standard JWT implementation with Access and Refresh tokens.

## 📈 Database Schema & Logic
This project implements a complex relational-style architecture within MongoDB. 


### Highlights of the Aggregation Pipelines:
- **Channel Stats:** Merges data from `Users`, `Videos`, `Subscriptions`, and `Likes` collections in a single query to provide a comprehensive creator dashboard.
- **Performance:** Optimized query patterns to reduce database load and improve response times.

- ## 🧠 Key Learnings
- **Data Modeling:** Designing schemas to handle complex social relationships (Subscriptions, Likes).
- **Advanced Aggregation:** Mastering the `$lookup`, `$addFields`, and `$group` stages to perform complex calculations in a single database trip.
- **Middleware Security:** Implementing `verifyJwt` to protect sensitive routes and manage user sessions.


