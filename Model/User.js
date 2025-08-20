import mongoose  from 'mongoose'; 

const Schema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true
    }, 
    lastName:{
        type: String, 
        required: true
    }, 
    email: {
        type: String, 
        required: true,
        unique: true, 
        match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only Gmail addresses are allowed"]

    }, 
    password: {
        type: String, 
        required: true
    }   
})

const User = mongoose.model("User", Schema); 
export default User;