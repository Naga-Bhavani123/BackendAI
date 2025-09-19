import Folder from "../../Model/Folder.js"
import User from "../../Model/User.js"
import sendingEmail from "./email.js"

const responseRules = `You are a friendly assistant like ChatGPT.
Rules:
If it was email in the past conversation I am storing it as the string in my db but you should apply the rule's which are below and return the json don't return as string like this "From nagabhavani34@gmail.com to nagavishnudasyam@gmail.com with message hello world". 

Be a friendly assistant like ChatGPT.
Always answer clearly with a medium-length explanation and one short example.
If the user says “yes”, “continue”, or “tell me more”, extend the previous answer with more detail. Do not just reply with “Yes”.
In the first reply of a topic, always end with: “If you want, I will give more details.”
Use simple language; avoid technical terms unless the user asks.
Base responses on the past conversation history.

📧 Agent Action (Email Rules)

If the user explicitly asks to send an email, respond with only one valid JSON object (no extra text).
The JSON format must be exactly:
{"action":"send_email","to":"<email>","message":"<text>","from":"<email>, "subject": <subject>}
Do not return anything else when generating the email JSON.
If any field is missing, ask for the missing info in normal text (not JSON).
If recipient is missing → “What is the recipient’s email address?”
If sender is missing → “Wnd subject checkinghat email should I send it from?”
If message is missing → “What is the message you want to send?”
If subject is missing → “What is the Subject you want to send?”

Validation rule: "from" and "to" must not be the same.`

const GeminiApi = async (query, conversationHistory) => {
     const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${responseRules},
                previous conversation ${conversationHistory},
                Now user asks:${query}`}] }],
    }),
  }
);

return response;

}



const queryController = async (req, res) => {
    try{
        const {query} = req.body; 
        const {id} = req.params
        //getting previous history 
        const {userId} = req
        const previous = await Folder.findById(id); // geeting the previous history of the folder

        let conversationHistory = previous.history.map((his) => { 
          const regex = /From\s+(\S+)\s+to\s+(\S+)\s+with subject\s+(.+?)\s+and message\s+(.+)/i;   // I am storing every =thing as string in the history so When I gave to the gemini it was not returning the JSON object. So when it come's email I have used regex to make the previous data to the json object
          const match = his.response.match(regex);

          let req = his.request;
          let res = his.response


          if (match) {
            const result = JSON.stringify({
              from: match[1].trim(),
              to: match[2].trim(),
              message: match[4].trim(), 
              subject: match[3].trim()
            });

            res = result

          }

          // console.log(req); 
          // console.log(res)
          return `User: ${req}\nAssistant: ${res}`

    });  // making prevoius history as string too give the previous con for the gemini ai
        conversationHistory.join("\n")
        let Geminidata = await GeminiApi(query, conversationHistory) // getting response from then
        Geminidata = await Geminidata.json()

        let answer = Geminidata.candidates[0].content.parts[0].text; 
        var EmailOptions; // this was returnn by the gemini like from, to, message if all data ispresent
        
        try{ 
          // if returned is an object then we can do replace and parase else we can't then it will move to the catch block
          answer =   answer.replace(/```json|```/g, "").trim()
          answer = await JSON.parse(answer)

         }catch(error){
          answer = answer
        }
       
        if (typeof answer === "object"){ // if answer type is object it will move to this
        
          EmailOptions = answer  // because we are cnverting the answer to the string we are storing it the fromEmail to send it to the 
          answer = `From ${answer.from} to ${answer.to} with subject ${answer.subject} and message ${answer.message}`;  
        }

      // answer = await answer.json()
          // convert JSON string → object
          
        await Folder.findByIdAndUpdate(id, {$push: {history: {request: query, response: answer}}
        }); 

        // finding user is register or not if their was no access token the we will ask for login
        if (EmailOptions){
          const fromEmailToken = await User.findOne({_id: userId}, {registerEmail:{$elemMatch: {email: EmailOptions.from}}}) 
          if (!fromEmailToken){
            res.send({message:"User not login to google mail I don't permission to send the email."})

          }else{  
                //  console.log(fromEmailToken)
                // once user login we will get all the details of the user then we will be passing all the details to the sendingMail Component 
                // console.log(fromEmailToken.registerEmail[0])
                sendingEmail(fromEmailToken.registerEmail[0], EmailOptions)
  
          }
        }
     
         
//         if (answer.type === Object && answer.action == "send_email"){ // checking user google email id
//             const userData = await User.finstringdById(userId); 
//             if (userData.googleId != undefined){
                    
//                res.send({
//   "needConfirmation": true,
//   "existingEmail": userData.googleEmail,
//   "newEmailOption": true,
//   "emailAction": {"to": answer.to, "message": answer.message}
// })
                
//             }else{
               
//                res.send({
//           needGoogleLogin: true,
//           emailAction: answer
//        })

//             }
          
//         }

        
        res.send({answer})
    }catch(error){
        if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
        res.status(500); 
        res.send(error)
    }
}




export default queryController;