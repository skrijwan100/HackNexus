import express from "express"
import cors from "cors"
import 'dotenv/config'
import { connectDB } from "./db.js"
import userRoute from "./routes/auth.js"
const app = express()

app.use(express.json())
app.use(cors())
connectDB()
app.use("/api/v1/auth",userRoute)
app.listen(process.env.PORT,()=>{
   console.log(`Server Started   on http://localhost:${process.env.PORT}`)
})