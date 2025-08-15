const User = require("../Model/User.js")
const {hash} = require("bcrypt") 


const registerUser = async (req, res) => {
    try{
    const {lastName, firstName, email, password} = req.body; 
    const encryptedPast = await hash(password, 10); 
    const user = new User({firstName, lastName, email, password: encryptedPast}); 
    await user.save();
    res.status(201)
    res.send({msg: "User registered successfully"});
    
    }catch (error) {
        console.error("Error registering user:", error);        }
}

module.exports = registerUser;