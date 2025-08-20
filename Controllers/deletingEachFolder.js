import Folder from "../Model/Folder.js" 

const deletingEachFolderController = async (req, res) => {
    try{

        const {id} = req.params; 
        const deleted = findByIdAndDelete(id); 
        res.status(200); res.send("Folder Deleted")

    }catch(error){
        if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
         res.status(500)
            res.send("Server side error")
    }
}

export default deletingEachFolderController;