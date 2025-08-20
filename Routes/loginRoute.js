import express from "express"; 
const router = express.Router(); 
import loginUser from "../Controllers/loginuser.js"; 

router.post("/", loginUser); 

export default router;