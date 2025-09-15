import express from "express"; 
const router = express.Router(); 

//Controllers
import registerUser from "../Controllers/registeruser.js";
import loginUser from "../Controllers/loginuser.js"; 
import {googleLoginController, googleLoginCallbackController} from "../Controllers/googleLogin.js"
import authMiddleware  from "../middleWare/authMiddleware.js";
// import googleLogin from "../Controllers/googleLogin.js"


router.post('/register', registerUser)
router.post("/login", loginUser); 
router.get("/google",googleLoginController); 
router.get("/google/callback", googleLoginCallbackController);

// router.post("/google-login", googleLogin)

export default router;