
# YouTube Backend Clone 🚀

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

A production-ready, high-performance backend for a video-sharing platform built with the **MERN stack**. This project implements a distributed caching layer using **Redis** to handle high-traffic scenarios and complex MongoDB aggregations.

---

## 🛠️ Tech Stack & Tools

* **Node.js & Express.js** - Scalable server-side framework.
* **MongoDB & Mongoose** - Data modeling with complex relationships.
* **Redis (Cloud)** - Distributed in-memory data store for caching.
* **JWT & bcrypt** - Secure authentication & session management.
* **Cloudinary** - Optimized media management for Video/Images.

---

## ✨ Key Features

### ⚡ Performance Optimization (Redis Caching)
Implemented a **Cache-Aside (Lazy Loading)** strategy to reduce database load.
* **80% Latency Reduction:** Critical routes (Stats, Video Details, Tweets) are cached for near-instant retrieval.
* **Dynamic Pagination Caching:** Cache-keys dynamically account for `page`, `limit`, and `query` parameters.
* **Atomic Operations:** Utilized `SETEX` for clean, expiring cache management.

### 📊 Advanced Analytics
* **Real-time Dashboard:** Merges data from `Users`, `Videos`, and `Likes` using high-performance MongoDB pipelines.
* **Custom Pagination:** Efficient, cursor-based pagination for comments and video feeds.

---

## 📈 System Architecture & Logic

The project uses a relational-style architecture in a NoSQL environment. 

> **Cache Logic:** When a request hits the server, we check Redis first (**Cache Hit**). If data is missing (**Cache Miss**), we fetch from MongoDB, populate Redis, and return the response.

---

## 🧠 Key Learnings

* **Distributed Caching:** Mastering Redis Cloud integration for scalability.
* **Cache Invalidation:** Using "Cache-Busting" strategies (`client.del`) to maintain data freshness.
* **Data Sovereignty:** Understanding the flow of information between local servers and cloud databases.

---