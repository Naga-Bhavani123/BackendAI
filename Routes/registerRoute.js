import express from "express";  
const router = express.Router();  

import registerUser from "../Controllers/registeruser.js";
console.log("Register user route loaded");
router.post("/", registerUser); 

export default router
