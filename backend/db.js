const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
    firstName: String,
    lastName: String,
    email: {type:String , unique:true},
    password: String,
    purchasedCourses: [{
        type: ObjectId,    
        ref: 'courses'  
    }]
})

const Admin = new Schema({
    firstName: String,
    lastName: String,
    email: {type:String , unique:true},
    password: String,
})

const Content = new Schema({
    lectureTitle: String,
    lectureURL: String,
    courseID: ObjectId,
    creatorID:ObjectId
})

const Course = new Schema({
    title: String,
    description: String,
    price: String,
    imageURL: String,
    creatorID: ObjectId,
})

const userModel = mongoose.model("users",User);
const courseModel = mongoose.model("courses",Course)
const adminModel = mongoose.model("admins",Admin);
const contentModel = mongoose.model("contents",Content);

module.exports = {
    userModel,
    courseModel,
    adminModel,
    contentModel
}