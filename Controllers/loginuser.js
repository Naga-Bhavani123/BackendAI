const {sign} = require("jsonwebtoken"); 
const {compare} = require("bcrypt")
const User = require("../Model/User.js")


const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body; 
        const Userdata = await User.findOne({email});
        console.log(Userdata);
        if (Userdata != undefined){
            const passwordCompare = await compare(password, Userdata.password); 
            if (passwordCompare){
                const jwtToken = sign({email: Userdata.email}, "SECRET_KEY")
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
        res.status(400); 
        res.send({msg: "Error logging in user", error: error.message});
        
    }
}

module.exports = loginUser