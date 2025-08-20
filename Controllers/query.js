import Folder from "../Model/Folder.js"
import moment from "moment-timezone";


const GeminiApi = async (query, conversationHistory) => {
     const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `You are an assistant like ChatGPT. 
- Always answer the user question detaily with medium explaination, with short examples. 
- If the user says "yes", that means they want you to continue the last answer with more details, not just say "yes".
- At the end of your first response always add: "If you want, I will give more details."
- Continue the explanation naturally if the user keeps saying "yes".
- Base your answers on the past conversation.
-You are an assistant agent.
If user asks about sending an email, output a JSON object like:
{
  "action": "send_email",
  "to": "<email>",
  "message": "<text>"
}  
If any of the bove feilds are missing ask them to give
Otherwise, just give normal text answer. 
-Don't use technical tearms for the normal conversation like json and etc
-Assistant should not be display
 
Conversation history: ${conversationHistory}
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

        const previous = await Folder.findById(id); 

        const conversationHistory = previous.history.map((his) => `User: ${his.request}\nAssistant: ${his.response}`).join("\n");  // making prevoius history as string too give the previous con for the gemini ai
         
        let Geminidata = await GeminiApi(query, conversationHistory) // getting response from then 
                console.log(Geminidata)

        Geminidata = await Geminidata.json()
        const answer = Geminidata.candidates[0].content.parts[0].text; 
        console.log(answer)

        await Folder.findByIdAndUpdate(id, {$push: {history: {request: query, response: answer}}
        }); 
        let  resdata = await Folder.findById(id);
      
        // console.log(resdata)

        
        const modifiedData = resdata.history.map((his) => {
            const obj =  {request: his.request, response: his.response, createdAt: moment(his.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")}
            return obj
        })

        
        res.send(modifiedData)
    }catch(error){
        if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
        res.status(500); 
        res.send(error)
    }
}




export default queryController;