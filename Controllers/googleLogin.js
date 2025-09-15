import dotenv from "dotenv"
dotenv.config()

import User from "../Model/User.js"
import jwtwebtoken from "jsonwebtoken"

import { google } from "googleapis";

console.log(process.env.GOOGLE_CLIENT_ID)


const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


// this is the route that will be called when user want to login like in frontend google login page will appear. it will not like fetch it will 
export const googleLoginController = async (req, res) => {
    try{
      const {token} = req.query
      
        // Step 1: Redirect user to Google consent page
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline", // 👈 very important for refresh_token
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    prompt: "consent", // 👈 force to always return refresh_token
    state: token
  });
  console.log(url)
  res.redirect(url);
    } catch(error){
        res.status(500).json({message: error.message})
    }
}



export const googleLoginCallbackController = async (req, res) => { 
    console.log(req.query)
    const {code, state} = req.query; 
   
     const payloads = jwtwebtoken.verify(state, "SECRET_KEY")

      if (!payloads){
           res.send("Invalid token")
      }
      const {userId} = payloads; 
      console.log(userId)

    try{
        // 1. Exchange code for tokens

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);  

         // 2. Get user info
        const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
        const { data } = await oauth2.userinfo.get();
        
        const isAlreadyExist = await User.findOne({"registerEmail.email": data.email})
        
        if (isAlreadyExist){  

            res.status(200).json({
        success: false,
        message: "This Gmail is already linked. Please login with another Gmail."
      })

        }else{
            const gettingData = await User.findByIdAndUpdate(userId, {$push: {registerEmail: {
                email:data.email,  
                googleId: data.id, 
                accessToken: tokens.access_token, 
                refreshToken: tokens.refresh_token, 
                tokenExpiry: tokens.expiry

            }}},    { upsert: true, new: true }  // if not found, create new; return updated one
            )  

            console.log(gettingData)
             

            res.status(200).json({message: "User logined Successfully"})
        }



    }catch(error){
        res.status(500).json({errorMsg: error.message})
    }

}