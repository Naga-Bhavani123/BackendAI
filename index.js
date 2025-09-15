import express from "express"; 
import dotenv from "dotenv";
dotenv.config();
const app = express();
import mongoose from "mongoose";
//Routes

import folderRoute from "./Routes/folderRoute.js"
import authUserRoute from "./Routes/authRoute.js"



const port = process.env.Port || 5000; 

app.use(express.json());

app.listen(port, () => {

    console.log("Server is running on port 5000");
})



mongoose.connect(process.env.MONGO_URI).then((client) => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect to MongoDB", err)); 

app.use("/auth", authUserRoute) 

app.use("/folder", folderRoute);


export default app;