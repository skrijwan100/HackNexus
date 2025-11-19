import React, { useEffect, useState } from "react";
import axios from "axios"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router";
const skillsList = [
    "React", "NextJs", "Node", "Python", "C++", "Java", "UI/UX", "Blockchain", "AI/ML", "Flutter", "CyberSecurity", "FullStack", "DSA"
];
const intarestlist = ["Hackathon", "Seminar", "Workshop", "Leetcode"]

const Signup = ({ userdata }) => {
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedintarest, setSelectedintarest] = useState([]);
    const [image, setImage] = useState(null);
    const [formdata, setformdata] = useState({ collagename: "", yearofs: "", bio: "" })
    const [selectedFile, setSelectedFile] = useState(null)
    const [loder, setloder] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        console.log(userdata)
    }, [])
    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter((s) => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    }
    const toggleintarest = (skill) => {
        if (selectedintarest.includes(skill)) {
            setSelectedintarest(selectedintarest.filter((s) => s !== skill));
        } else {
            setSelectedintarest([...selectedintarest, skill]);
        }
    }
    const onchange = (e) => {
        setformdata({ ...formdata, [e.target.name]: e.target.value })
    }
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
        setSelectedFile(e.target.files[0]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setloder(true)
        const formData = new FormData();
        console.log(selectedFile)
        if (selectedFile) {
            formData.append("profilepic", selectedFile);
        }

        const userinfo = ({
            uid: userdata.uid,
            name: userdata.displayName,
            bio:formdata.bio,
            email: userdata.email,
            collagename: formdata.collagename,
            yearofs: formdata.yearofs,
            allskills: selectedSkills,
            allintarest: selectedintarest,
            existingPhotoURL: !image ? userdata.photoURL : null
        })
        formData.append("userinfo", JSON.stringify(userinfo));
        try {
            const responce = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/savedata`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log(responce)
            if (responce.status) {
                navigate("/")
                return setloder(false)
            }
        } catch (error) {
            console.log(error)
            return setloder(false)
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-box" onSubmit={handleSubmit}>
                <div className="flex items-center justify-center"><div className="nav-logo"><img src={logo} alt="" className="h-[140px]" /></div></div>
                {/* <h2>HackNexus</h2> */}
                <p className="subtitle">Create your account</p>
                <div className="img-upload-box">
                    <label htmlFor="profile-upload">
                        <img
                            src={image || userdata.photoURL}
                            alt="profile"
                            className="preview-img"
                        />
                    </label>
                    <input id="profile-upload" type="file" name="profilepic" accept="image/*" onChange={handleImageUpload} />
                    <p className="upload-text">Tap to upload profile picture</p>
                </div>
                <input name="usernam" value={userdata.displayName} type="text" placeholder="Full Name" required readOnly />
                <input name="useremail" value={userdata.email} type="email" placeholder="Email Address" required readOnly />
                <textarea
                    className="py-3 px-4 block w-full resize-none textareastyle"
                    style={{border:"1px solid #00d084"}}
                    rows={3}
                    name="bio"
                    value={formdata.bio}
                    onChange={onchange}
                    placeholder="Tell about your self" required
                     
                />
                <input value={formdata.collagename} onChange={onchange} name="collagename" type="text" placeholder="College/ Organization" required />
                <input value={formdata.yearofs} onChange={onchange} name="yearofs" type="text" placeholder="Year of study" required />
                <label className="section-title">Select Your Skills:</label>
                <div className="skills-container">
                    {skillsList.map((skill) => (
                        <span
                            key={skill}
                            className={selectedSkills.includes(skill) ? "skill-tag selected" : "skill-tag"}
                            onClick={() => toggleSkill(skill)}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
                <label className="section-title">Your Intarest:</label>
                <div className="skills-container">
                    {intarestlist.map((skill) => (
                        <span
                            key={skill}
                            className={selectedintarest.includes(skill) ? "skill-tag selected" : "skill-tag"}
                            onClick={() => toggleintarest(skill)}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
                <button type="submit">{loder ? <div className="loder"></div> : 'Save Account'}</button>
            </form>
        </div>
    );
};

export default Signup;
