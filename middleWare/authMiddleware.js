import jwt from "jsonwebtoken"; 

const authMiddleware = async (req, res, next) => {
    try{
        
        const jwtToken = req.headers.authorization.split(" ")[1];

        const data = jwt.verify(jwtToken, "SECRET_KEY")
     
        req.userId = data.userId; 

         next();

    }catch(error){
        if (error.name === "TokenExpiredError") {
      return res.status(401).send("Token expired, please log in again");
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }

        res.status(500); 
        res.send("server side error")
    }
}


export default authMiddleware;