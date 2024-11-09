const jwt = require('jsonwebtoken');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const { userModel, courseModel } = require('../db');
const { userAuth , JWT_USER_SECRET } = require('../middleware/userAuth');
const { Router } = require('express');
const userRouter = Router();

userRouter.post("/signup",async function(req,res){
    try{
        const reqBody = z.object({
            firstName:z.string().min(2),
            lastName:z.string().min(2),
            email:z.string().email({message:"Invalid email address"}),
            password:z.string().regex(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                { message: "Password must contain at least one uppercase letter, one number, special character, and be at least 8 characters long" })
        })
    
        const validateDataSuccess = reqBody.safeParse(req.body);
        if(!validateDataSuccess.success){
            let msg = "";
            for(i=0;i<validateDataSuccess.error.issues.length;i++){
                msg += validateDataSuccess.error.issues[i].message;
                if(i != validateDataSuccess.error.issues.length-1) msg += " and ";
            }
            res.send(msg);
            return;
        }
    
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
    
        await userModel.create({
            firstName,
            lastName,
            email,
            password:hashedPassword
        })
        res.send("Signed up successfully!");
    }catch(e){
        res.status(500).send("Error while signing up!")
    }
});

userRouter.post("/signin",async function(req,res){
    try{
        const { email, password } = req.body;
        const userData = await userModel.findOne({
            email
        })
        if(!userData){
            res.send("User not found!");
            return;
        }
        const validatePassword = await bcrypt.compare(password,userData.password)
        if(validatePassword){
            const token = jwt.sign({
                userID: userData._id
            },JWT_USER_SECRET)
            res.send(token)
        }
        else{
            res.send("Incorrect credentials!")
        }
    }catch(e){
        res.status(500).send("Error signing in!")
    }
});

userRouter.get("/purchases",userAuth,async function(req,res){
    const userID = req.userID
    const user = await userModel.findOne({
        _id:userID
    })
    const courses = await courseModel.find({
        _id: { $in: user.purchasedCourses }
    })
    res.json(courses)
});

module.exports = {
    userRouter
}