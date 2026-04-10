import { Server } from "socket.io"
import { app } from "./app.js"

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    })
    const userSocketMap = {}; // To store the mapping of userId to socket.id
    app.set("io", io)  //to make io available in the routes
    app.set("userSocketMap", userSocketMap);

    
    // Socket.io connection handling
    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);

        socket.on("setup", (userId) => {
            userSocketMap[userId] = socket.id; // Store the mapping of userId to socket.id
            socket.userId = userId; // Attach userId to the socket object for easy access later
            console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        })
        socket.on("joinVideo", (videoId) => {
            socket.join(videoId);
            console.log(`User ${socket.userId} joined room: ${videoId}`);
        });

        socket.on("disconnect", () => {
            if (socket.userId) {
                delete userSocketMap[socket.userId]; // Remove the mapping when the user disconnects
                console.log(`User ${socket.userId} is disconnected`);
            }

        }); 
    });
    return { io, userSocketMap }


}


