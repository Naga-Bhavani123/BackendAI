const express = require("express"); 
const mongoDB = require("mongodb"); 
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");
//Routes
const registerUserRoute = require("./Routes/registerRoute.js");
const loginUserRoute = require("./Routes/loginRoute.js")

const port = process.env.Port || 5000; 
dotenv.config();
app.use(express.json());

app.listen(port, () => {
    console.log("Server is running on port 5000");
})

mongoose.connect(process.env.MONGO_URI).then((client) => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect to MongoDB", err)); 
console.log(registerUserRoute)

app.use("/register", registerUserRoute) 
app.use("/login", loginUserRoute)


module.exports = app;