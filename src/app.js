import express from 'express'
import cors from 'cors'
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extends: true, limit: "16kb"}))
app.use(express.static("public"))

import healthcheckRouter from './routes/healthcheck.routes.js'
import tweetRoute from './routes/tweet.route.js'

app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRoute)

export {app}