const jwt = require('jsonwebtoken')
const JWT_USER_SECRET = "halleluiyauser"

function userAuth(req,res,next){
    try {
        const token = req.headers.token; 
        if (!token) {
            return res.status(401).send("Token not provided.");
        }

        const response = jwt.verify(token, JWT_USER_SECRET); 
        req.userID = response.userID; 
        next(); 
    } catch (err) {
        console.error("JWT Error:", err.message);
        res.status(403).send("Unauthorized Request"); 
    }
}

module.exports = {
    JWT_USER_SECRET,
    userAuth
}