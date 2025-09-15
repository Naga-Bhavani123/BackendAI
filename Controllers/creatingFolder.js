import Folder from "../Model/Folder.js"

const creatingFolderController = async (req, res) => {

    try{
        const {userId} = req
        

        const {title} = req.body; 
        const folderIntence = await  new Folder({userId, title}); 
        const newFolderId = await folderIntence.save(); 
        const idNeedToPass = newFolderId._id; 
        res.status(200); 
        res.send({folderId: idNeedToPass});
    }catch(error){
        if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
        res.status(500); 
        res.send("Sever side error")
    }


}

export default creatingFolderController;
