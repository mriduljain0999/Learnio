const jwt = require('jsonwebtoken')
const JWT_ADMIN_SECRET = "halleluiyadmin"

function adminAuth(req,res,next){
    try {
        const token = req.headers.token; 
        if (!token) {
            return res.status(401).send("Token not provided.");
        }

        const response = jwt.verify(token, JWT_ADMIN_SECRET); 
        req.adminID = response.adminID; 
        next(); 
    } catch (err) {
        res.status(403).send("Unauthorized Request"); 
    }
}

module.exports = {
    JWT_ADMIN_SECRET,
    adminAuth
}