import express from "express"
import upload from "../middlewares/upload.js"
import fs from 'fs'
import cloudinary from "../config/cloudinary.js"
import User from "../models/User.js"
import admin from "firebase-admin";
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));
import dotenv from "dotenv";
dotenv.config();
const userRoute = express.Router()
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_DOMAIN,
  })
});
userRoute.post("/savedata", upload.single('profilepic'), async (req, res) => {
  const { uid, name, bio, email, collagename, yearofs, allskills, allintarest, existingPhotoURL } = JSON.parse(req.body.userinfo)
  // console.log(name, email, collagename, yearofs,allskills,allintarest,existingPhotoURL)
  let imgurl = ""
  if (req.file) {
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_profiles", // Optional folder in Cloudinary
    });
    fs.unlinkSync(req.file.path);
    imgurl = cloudinaryResponse.secure_url;
  }
  const newuser = new User({
    uid: uid,
    fullname: name,
    bio: bio,
    email: email,
    imgUrl: existingPhotoURL || imgurl,
    collagename: collagename,
    study: yearofs,
    skill: allskills,
    intarest: allintarest,
  })
  await newuser.save();
  return res.status(200).json({ "message": "You register done", "status": true })
})

userRoute.get("/fecthuser", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token");
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("UID:", decoded.uid);
    // decoded.uid = firebase user unique ID
    // Now fetch user from DB:
    const user = await User.findOne({ uid: decoded.uid });
    if (user) {
      return res.status(200).json({ data: user, status: true });
    }
    return res.status(200).json({ status: false });
  } catch (err) {
    res.status(401).send("Invalid token");
  }
});
userRoute.put("/updatedata/:id", upload.single('profilepic'), async (req, res) => {
  try {

  const { bio, collagename, yearofs, allskills, allintarest } = JSON.parse(req.body.userinfo)
  console.log(req.params.id)
  let imgurl = ""
  if (req.file) {
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_profiles", // Optional folder in Cloudinary
    });
    fs.unlinkSync(req.file.path);
    imgurl = cloudinaryResponse.secure_url;
  }
  const finduser= await User.findById(req.params.id)
  console.log(finduser)
  const updateuserdata={}
  if(finduser.bio!=bio){
    updateuserdata.bio=bio;
  }
  if(finduser.collagename!=collagename){
    updateuserdata.collagename=collagename;
  }
  if(finduser.study!=yearofs){
    updateuserdata.study=yearofs;
  }
  if(allskills){
    updateuserdata.skill=allskills;
  }
  if(allintarest){
    updateuserdata.intarest=allintarest;
  }
  if(req.file){
    updateuserdata.imgUrl=imgurl;
  }
  const updatethedata= await User.findByIdAndUpdate(req.params.id,{$set:updateuserdata}, {new:true})
  return res.status(200).json({status:true})
      
  } catch (error) {
    console.log(error)
    return res.status(500).json({data:"Internal Server Error",status:false})
  }
})
export default userRoute;