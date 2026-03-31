
import dotenv from "dotenv"   //we have done in this way to maintain consistency
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { connectRedis } from "./db/redis.js";

dotenv.config({
    path: './.env'
})


connectDB()
    .then(()=>
    {
        return connectRedis()
    })
    .then(()=>{
        console.log("Connected to both MongoDB and Redis successfully!");
    })
    .then((res) => {
        app.on("error", (error) => {                //to check after database is connected before server starts, mainly to check the server
            console.log("Error in connecting to the database");
            throw error;
        })
        server.listen(process.env.PORT || 8000, () => {
            console.log(`App listening on port: ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("Mongo Db connection failed", error);
    })

    

