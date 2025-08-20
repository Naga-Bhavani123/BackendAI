import User from "../Model/User.js"
import {hash} from "bcrypt"


const registerUser = async (req, res) => {
    try{
    const {lastName, firstName, email, password} = req.body; 
    const encryptedPast = await hash(password, 10); 
    const user = new User({firstName, lastName, email, password: encryptedPast}); 
    await user.save();
    res.status(201)
    res.send({msg: "User registered successfully"});
    
    }catch (error) {
         if (error.code === 11000) {
      // duplicate key error
      return res.status(400).json({ message: "Email already exists" });
    }

    // validation errors (like missing fields)
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
        console.error("Error registering user:", error);        }
}

export default registerUser;