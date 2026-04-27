import { createClient } from "redis";

const client = createClient({
    url: process.env.REDIS_URL
})

client.on('error', (err) => console.error('Redis Client Error', err));
const connectRedis = async () => {
    try {
        await client.connect()
        console.log('Connected to Redis successfully!');
    } catch (error) {
        console.error("Redis connection Error", error);
        process.exit(1);
    }
}

export   { connectRedis, client }

