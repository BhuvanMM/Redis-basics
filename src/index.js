import express from 'express'
import Redis from 'ioredis'
import mongoose from 'mongoose'

const app = express();
app.use(express.json())

const redis = new Redis('redis://localhost:6379')
const BANNER_KEY = "app:banner"

app.post("/banner", async(req,res)=>{
    await redis.set(BANNER_KEY,req.body.message || "Welcome to SCP")
    res.json({success:true})
})

app.get("/banner", async(req,res)=>{
    const message = await redis.get(BANNER_KEY)
    res.json({message: message})
})

app.delete("/banner", async(req,res)=>{
    await redis.del(BANNER_KEY)
    res.json({success:true})
})

app.get("/banner/exists", async(req,res)=>{
    const exists = await redis.exists(BANNER_KEY)
    res.json({exists: exists})
})

// health monitoring 
app.get("/redis-health", async(req,res)=>{
    const reply = await redis.ping()
    res.json({redis:reply})
})

app.get("/mongo-health", async(req,res)=>{
    const url = 'mongodb://localhost:27017'
    if(mongoose.connection.readyState == 0){
        await mongoose.connect(url)
    }
    res.json({mongo:"connected"})
})

// server listening and serve
app.listen(3000, () => {
    console.log("server running on port : 3000")
})