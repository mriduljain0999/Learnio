const jwt = require('jsonwebtoken');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const { adminModel, courseModel, contentModel } = require('../db');
const { adminAuth, JWT_ADMIN_SECRET } = require('../middleware/adminAuth');
const { Router } = require('express');
const adminRouter = Router();

adminRouter.post("/signup",async function(req,res){
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
    
        await adminModel.create({
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

adminRouter.post("/signin",async function(req,res){
    try{
        const { email, password } = req.body;
        const adminData = await adminModel.findOne({
            email
        })
        if(!adminData){
            res.send("Admin not found!");
            return;
        }

        const validatePassword = await bcrypt.compare(password,adminData.password)
        if(validatePassword){
            const token = jwt.sign({
                adminID: adminData._id
            },JWT_ADMIN_SECRET)
            res.send(token)
        }
        else{
            res.send("Incorrect credentials!")
        }
    }catch(e){
        res.status(500).send("Error signing in!")
    }
});

adminRouter.post("/course",adminAuth,async function(req,res){
    const reqBody = z.object({
        title:z.string().min(3),
        description:z.string().min(10),
        imageURL:z.string(),
        price:z.string().min(2)
    })

    const validateDataSuccess = reqBody.safeParse(req.body);
    if(!validateDataSuccess.success){
        res.send("Enter data in correct format!")
        return 
    }

    const adminID = req.adminID;
    const { title,description,price,imageURL } = req.body;
    const course = await courseModel.create({
        title,description,price,imageURL,creatorID:adminID
    })
    res.send(course._id)
});

adminRouter.put("/course",adminAuth,async function(req,res){
    const adminID = req.adminID;
    const { title,description,price,imageURL, courseID } = req.body;
    const course = await courseModel.updateOne({
        _id:courseID,
        creatorID:adminID
    },
    {
        title,description,price,imageURL   
    })
    res.json({
        msg:"Course updated successfully!",
        courseID:course._id
    })
});

adminRouter.delete("/course",adminAuth,async function(req,res){
    const adminID = req.adminID;
    const { courseID } = req.body;
    await courseModel.deleteOne({
        _id:courseID,
        creatorID:adminID
    })
    res.send("Course deleted Successfully!")
});

adminRouter.get("/course/bulk",adminAuth,async function(req,res){
    const adminID = req.adminID;
    const courses = await courseModel.find({
        creatorID:adminID
    })
    res.send(courses)
});

adminRouter.get("/course/all",async function(req,res){
    const courses = await courseModel.find({})
    res.send(courses)
});

adminRouter.post("/username",async function(req,res){
    const { adminID } = req.body;
    const admin = await adminModel.findOne({_id:adminID});
    const adminName = `${admin.firstName} ${admin.lastName}`
    res.send(adminName) 
})


adminRouter.post("/course/content",adminAuth,async function(req,res){
    
    const adminId = req.adminID;
    const { lectureTitle, lectureURL, courseID } = req.body;
    const content = await contentModel.create({
        lectureTitle,lectureURL,courseID,creatorID:adminId
    })
    res.json({
        contentID:content._id
    })
})

adminRouter.put("/course/content", adminAuth, async function(req, res) {
    try {
        const adminID = req.adminID;
        const { lectureTitle, lectureURL, contentID, courseID } = req.body;

        const response = await contentModel.updateOne(
            { _id: contentID, courseID, creatorID: adminID }, 
            { lectureTitle, lectureURL }
        );
        if (response.matchedCount === 0) {
            return res.status(403).send("Unauthorized update request!"); 
        }

        res.send("Content updated successfully!");
    } catch (e) {
        res.status(500).send("Error processing the update request!");
    }
});


adminRouter.delete("/course/content", adminAuth, async function(req, res) {
    try {
        const adminID = req.adminID;
        const { contentID, courseID } = req.body;

        const response = await contentModel.deleteOne({
            _id: contentID,
            courseID,
            creatorID: adminID
        });
        if (response.deletedCount === 0) {
            return res.status(403).send("Unauthorized delete request!");
        }

        res.send("Content deleted successfully!");
    } catch (e) {
        res.status(500).send("Error processing the delete request!");
    }
});

module.exports = {
    adminRouter
}