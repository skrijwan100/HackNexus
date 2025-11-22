import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        require: true,
        unique: true
    },
    fullname: {
        type: String,
        require: true
    },
    bio:{
        type:String,
        require:true
    },
    email: {
        type: String,
        require: true,
    },
    imgUrl: {
        type: String,
        require: true,
    },
    collagename: {
        type: String,
        require: true,
    },
    study: {
        type: String,
        require: true,
    },
    skill: {
        type: Array,
        require: true,
    },
    intarest:{
        type:Array,
        require:true
    }
},{ timestamps: true })
const User = mongoose.model("User", userSchema);
export default User;