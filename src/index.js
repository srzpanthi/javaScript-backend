import dotenv from "dotenv"
import connectDB from "./db/index.js";


dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Currently running on port ${PORT}`);
        
    })



})
.catch((err)=>{
    console.log("mongoDB connection error", err)
})
