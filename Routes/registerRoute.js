const express = require("express");  
const router = express.Router();  

const registerUser = require("../Controllers/registeruser.js");
console.log("Register user route loaded");
router.post("/", registerUser); 
module.exports = router;
