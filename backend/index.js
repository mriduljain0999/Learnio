//build signup & signin with google etc(passport) and also otp verification - frontend

// kirat web3 saas vid to upload img without url in admin course creation code - frontend

//check whether payment is done or not (razorpay) - forntend

//try to learn cookie and session based authentication ✅
// -> firstly we need to create a "uuid" and store it as sessionID
// -> next we need to map this sessionID to user (setUser and getUser) 
// -> and when we signin we need to pass this id to cookie (cookie parser)
// -> and then it will attach each time a request goes and we can confirm user by getUser
// -> one problem is that whenever server dies we need to login again 

// try if more complexity could be added to database - ✅

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const { userRouter } = require('./route/user')
const { adminRouter } = require('./route/admin')
const { courseRouter } = require('./route/course')
const { userModel, courseModel, adminModel, purchaseModel } = require('./db')
// require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors(
    {
        origin: ["https://deploy-mern-frontend.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));

app.get("/",(req,res) => {
    res.json("Hello")
})

app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/course",courseRouter);

async function main(){
    await mongoose.connect("mongodb+srv://mriduljain012:ahnw9kt8H5@cluster0.th8on.mongodb.net/100xCoursify");
    const PORT = 3000;
    app.listen(PORT);
    console.log("listening on port " + PORT)
}
main();
