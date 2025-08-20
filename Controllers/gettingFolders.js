import Folder from "../Model/Folder.js"
import moment from "moment-timezone"

const gettingFoldersController = async (req, res) => {
        try{

            const {userId} = req; 
            console.log(userId)
            const folders = await  Folder.find({userId}); 
            const modifiedData = folders.map((each) => ({title: each.title, _id: title._id, createdAt: moment(each.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"), updatedAt: moment(each.updatedAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"), history: each.history}))
            res.status(200); 
            res.send(modifiedData);

        }catch(error){
            if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
            res.status(500); 
            res.send("Server side error")
        }
}

export default gettingFoldersController;