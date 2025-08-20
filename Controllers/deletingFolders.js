import Folder from "../Model/Folder.js"

const deleteFoldersController = async (req, res) => {
    try{
        console.log(req)
        const {userId} = req; 
        const deleted = await Folder.deleteMany({userId}); 
        res.status(200); 
        res.send("Folders Deleted")
    }catch (error){
        
    // fallback (real server error)
    return res.status(500).send("Server error");
 
    }
}


export default deleteFoldersController;