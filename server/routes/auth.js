import express from "express"
import upload from "../middlewares/upload.js"
import fs from 'fs'
import cloudinary from "../config/cloudinary.js"
import User from "../models/User.js"
import admin from "firebase-admin";
const userRoute= express.Router()
admin.initializeApp();
userRoute.post("/savedata",upload.single('profilepic'),async(req,res)=>{
    const {uid, name, email, collagename, yearofs,allskills,allintarest,existingPhotoURL } = JSON.parse(req.body.userinfo)
    // console.log(name, email, collagename, yearofs,allskills,allintarest,existingPhotoURL)
    let imgurl=""
    if(req.file){
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: "user_profiles", // Optional folder in Cloudinary
        });
        fs.unlinkSync(req.file.path);
        imgurl = cloudinaryResponse.secure_url;
    }
    const newuser= new User({
        uid:uid,
        fullname:name,
        email:email,
        imgUrl:existingPhotoURL||imgurl,
        collagename:collagename,
        study:yearofs,
        skill:allskills,
        intarest:allintarest,
    })
    await newuser.save();
    return res.status(200).json({ "message": "You register done", "status": true })
})



userRoute.get("/fecthuser", async (req, res) => {
  const uid = req.headers.uid
//   if (!token) return res.status(401).send("No token");

  try {
    // const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: uid });
    return res.status(200).json({message:user,status:true});
  } catch (err) {
    return res.status(200).json({"message":"User is new"})
  }
});
export default userRoute;