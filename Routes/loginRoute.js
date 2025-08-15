const express = require("express"); 
const router = express.Router(); 
const loginUser =   require("../Controllers/loginuser.js"); 

router.post("/", loginUser); 

module.exports = router; 