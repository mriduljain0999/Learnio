const { userAuth } = require('../middleware/userAuth')
const { userModel, courseModel } = require('../db')
const { Router } = require('express');
const courseRouter = Router();

courseRouter.post("/purchase",userAuth,async function(req,res){
    const userID = req.userID;
    const courseID = req.body.courseID

    //check whether payment is done or not 
    const purchases = await userModel.updateOne({_id:userID},{
        $addToSet: { purchasedCourses: courseID }
    });
    res.json("Purchase complete!")
});

courseRouter.get("/preview",async function(req,res){
    const courses = await courseModel.find({})
    res.send(courses)
}); 

module.exports = {
    courseRouter
}