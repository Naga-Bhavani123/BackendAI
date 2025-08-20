import express from "express"; 
import mongoDB from "mongodb"; 
import dotenv from "dotenv";
const app = express();
import mongoose from "mongoose";
//Routes
import registerUserRoute from "./Routes/registerRoute.js";
import loginUserRoute from "./Routes/loginRoute.js"
import folderRoute from "./Routes/folderRoute.js"



const port = process.env.Port || 5000; 
dotenv.config();
app.use(express.json());

app.listen(port, () => {

    console.log("Server is running on port 5000");
})



mongoose.connect(process.env.MONGO_URI).then((client) => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect to MongoDB", err)); 

app.use("/register", registerUserRoute) 
app.use("/login", loginUserRoute)
app.use("/folder", folderRoute);


export default app;