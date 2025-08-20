import express from "express"
const router = express.Router(); 
import authMiddleware from "../middleWare/authMiddleware.js"
import creatingFolderController from "../Controllers/creatingFolder.js"
import gettingFoldersController from "../Controllers/gettingFolders.js" 

import deletingFoldersController from "../Controllers/deletingFolders.js" 
import queryController from "../Controllers/query.js"; 
import gettingEachFolderController from "../Controllers/gettingEachFolder.js"
import deletingEachFolderController from "../Controllers/deletingEachFolder.js"

router.post("/",authMiddleware,  creatingFolderController); 
router.get("/",authMiddleware,  gettingFoldersController); 
router.delete("/",authMiddleware, deletingFoldersController); 
router.post("/:id/query",authMiddleware, queryController);  
router.get("/:id", authMiddleware, gettingEachFolderController); 
router.delete("/:id", authMiddleware, deletingEachFolderController)

export default router