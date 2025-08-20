import mongoose from "mongoose" 
// console.log(mongoose.Schema.Types)

const eachHistorySchema = new mongoose.Schema({
    request: {type:String, required: true}, response: {type: String, required: true }
}, {timestamps:true})

const folderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, 
    title: {type: String, required: true},
    history: [eachHistorySchema]
}, {timestamps: true})


const Model = mongoose.model("Folder", folderSchema) 
export default Model;