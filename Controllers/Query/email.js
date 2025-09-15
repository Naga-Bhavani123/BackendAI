import dotenv from "dotenv"
dotenv.config()

import nodemailer from "nodemailer"
import { google } from "googleapis";


const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID, 
    process.env.GOOGLE_CLIENT_SECRET, 
    process.env.GOOGLE_REDIRECT_URI
)

//here redirect url is not needed because google google was not retruing to any callback API. Because access token will not sen din the url.

const getAccessToken = async (refreshToken) => {
  oAuth2Client.setCredentials({ refresh_token: refreshToken }); // seeting refresh token
  const accessToken = await oAuth2Client.getAccessToken(); // getting the access token
  
  return accessToken.token;
};

const sendingEmail = async (UserInfo, sendingData) => {
         
           try{
                         const {refreshToken} = UserInfo; 
               const { from, to, message } = sendingData;
              const token = await getAccessToken(refreshToken); 
              
              const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user: from,
                        clientId: process.env.GOOGLE_CLIENT_ID,
                        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                        refreshToken,
                        accessToken:token, // fresh access token
                    },
               });  // creating the transporter from which email we want to the email. THis enr=trie thing is from data through nodemailer

    const mailOptions = { from, to, text: message };  // creating an email oprtions

    const result = await transporter.sendMail(mailOptions); // transoprter will generate the sendMail method it will take to whom you wan to send the mail
    console.log("✅ Email sent:", result.messageId);
    return result;

           }catch(error){
            console.log(error)
           }
    
       
}

export default sendingEmail