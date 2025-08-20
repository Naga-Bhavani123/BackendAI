import Folder from "../Model/Folder.js"

const gettingEachFolderController = async (req, res) => {
    try{
        const {userId} = req.userId; 
        const id = req.params; 
        const folder = await Folder.findById(id); 
        const each = folder
        res.status(200); 
        res.send({title: each.title, _id: title._id, createdAt: moment(each.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"), updatedAt: moment(each.updatedAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"), history: each.history});

    }catch(error) {
        if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
        res.status(500)
        res.send("Sever side error")
    }
}

export default gettingEachFolderController;