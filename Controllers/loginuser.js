import pkg from "jsonwebtoken";
import {compare} from "bcrypt"
import User from "../Model/User.js"
const {sign} = pkg;

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body; 
            

        const Userdata = await User.findOne({email});
        if (Userdata != null){
            const passwordCompare = await compare(password, Userdata.password); 
            if (passwordCompare){
                const jwtToken = sign({userId: Userdata._id}, "SECRET_KEY")
                res.status(200);
                res.send({msg: "Login successful", token: jwtToken}) 
                
            }else{
                res.status(400); 
                res.send({msg: "Invalid password"});
            }
        }
        else{
            res.status(400); 
            res.send({msg: "User not found"});
        }
    }catch(error){
        if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
        res.status(400); 
        res.send({msg: "Error logging in user", error: error.message});
        
    }
}

export default loginUser;