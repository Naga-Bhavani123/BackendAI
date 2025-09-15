import mongoose  from 'mongoose'; 

const EachFromEmail = new mongoose.Schema({
    email:  {
        type: String, 
        required: true,
        unique: true, 
        match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only Gmail addresses are allowed"]

    }, 
     googleId: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiry: Date
}, { _id: false }
)

const Schema = new mongoose.Schema({
    name: {
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
    },

    registerEmail: [EachFromEmail]

})

const User = mongoose.model("User", Schema); 
export default User;