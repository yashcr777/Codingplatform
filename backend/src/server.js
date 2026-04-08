import express from 'express'
import {ENV} from './lib/env.js';
import {inngest,functions} from "./lib/inngest.js"
import path from "path"
import { connectDB } from './lib/db.js';
import cors from "cors";
import {serve} from "inngest/express"
import {clerkMiddleware} from '@clerk/express'
// import { protectRoute } from './middleware/protectRoute.js';
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js"
const app=express();

app.use(express.json());
// const CLIENT_URL = ENV.CLIENT_URL.replace(/\/$/, "");

app.use(cors({
  origin: "https://codingplatform-kappa.vercel.app",
  credentials: true
}));
app.use(clerkMiddleware());


const __dirname=path.resolve()
app.use("/api/inngest",serve({client:inngest,functions}))
app.use("/api/chat",chatRoutes)
app.use("/api/sessions",sessionRoutes)
app.get("/api/health",(req,res)=>{
    res.status(200).json({msg:"api is up and running"})
})
app.get("/",(req,res)=>{
    res.status(200).json({msg:"api is up and running"})
})
const startServer=async()=>{
    try{
        await connectDB();
        app.listen(ENV.PORT,()=>{
            console.log(`Server is running on port ${ENV.PORT}`)
        });
    } catch(error){
        console.log("Error starting server",error);
        process.exit(1);
    }
}

startServer();