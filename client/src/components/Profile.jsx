import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useloding } from "../context/LodingContext";
import LoadingScreen from "./Mainloder";
import { handleSuccess,handleError } from "./ErrorMessage";
import axios from "axios";
const Profile = ({ userdata }) => {
  const [image, setImage] = useState(null);
  const [newdata, setnewdata] = useState({ collagename: userdata.collagename, yearofstudy: userdata.study, bio: userdata.bio })
  const [loder,setloder]=useState(false)
  const skillsList = [
    "React", "NextJs", "Node", "Python", "C++", "Java", "UI/UX", "Blockchain", "AI/ML", "Flutter", "CyberSecurity", "FullStack", "DSA"
  ];
  const intarestlist = ["Hackathon", "Seminar", "Workshop", "Leetcode"]
  const [selectedSkills, setSelectedSkills] = useState([ ...(userdata.skill || [])]);
  const [selectedintarest, setSelectedintarest] = useState([ ...(userdata.intarest || [])])
  const [update, setupdate] = useState(false)
  const { user } = useAuth();
  const { loading, setLoading } = useloding()
  const naviget = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)
  // useEffect(() => {
  //   const chakelog = async () => {
  //     const token = await user.getIdToken();
  //     console.log("ID Token:", token);
  //     if (!token) {
  //       naviget("/")

  //     }
  //   }
  //   chakelog();

  // }, [])
  const onchange = (e) => {
    setnewdata({ ...newdata, [e.target.name]: e.target.value })
    if (userdata.bio != newdata.bio || userdata.collagename != newdata.collagename || userdata.study != newdata.yearofstudy
    ) {
      setupdate(true)
    }
  }
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setupdate(true)
    }
    setSelectedFile(e.target.files[0])
  };
  const toggleSkill = (skill) => {
    setupdate(true)
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  }
  const toggleintarest = (skill) => {
       setupdate(true)
    if (selectedintarest.includes(skill)) {
      setSelectedintarest(selectedintarest.filter((s) => s !== skill));
    } else {
      setSelectedintarest([...selectedintarest, skill]);
    }
  }

  const handleupdatedata = async (e) => {
    e.preventDefault()
    setloder(true)
    const formData = new FormData();
    if (selectedFile) {
      formData.append("profilepic", selectedFile);
    }
    const userupdateinfo = ({
      bio: newdata.bio,
      collagename: newdata.collagename,
      yearofs: newdata.yearofstudy,
      allskills: selectedSkills,
      allintarest: selectedintarest

    })
    formData.append("userinfo", JSON.stringify(userupdateinfo));
    try {
      const responce = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/updatedata/${userdata._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      // console.log(responce)
    setloder(false)

    if(responce.data.status){
      setupdate(false)
      return handleSuccess("Your update is save.")
    }

    } catch (error) {
      console.log(error)  
      setloder(false)

    }
  }
  return (

    <div className="min-h-screen bg-black text-[#00D084] font-[] flex justify-center py-12 px-6">
      {!loading ? <>
        <div className="text-6xl text-white"> <LoadingScreen /></div>

      </> : <div className="w-full max-w-3xl bg-[#0d0d0d] border border-[#00D084]/40 rounded-2xl shadow-[0_0_25px_#00D08440] p-8">

        {/* Header */}
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Account Settings
        </h1>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-8">
          <label htmlFor="profile-upload" className="cursor-pointer">
            <img
              src={image ? image : userdata.imgUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="User"
              className="w-28 h-28 rounded-full border-2 border-[#00D084] object-cover shadow-[0_0_18px_#00D08480] hover:shadow-[0_0_25px_#00ffc480] transition-all duration-300"
            />
          </label>
          <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <p className="text-xs text-gray-400 mt-2">Tap to change profile photo</p>
        </div>

        {/* Form Section */}
        <form className="space-y-6" onSubmit={handleupdatedata}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-gray-400 text-sm">Full Name</label>
              <input

                type="text"
                value={userdata.fullname}
                className="w-full bg-transparent border border-[#00D084] text-[#00D084] rounded-md px-3 py-2 outline-none focus:shadow-[0_0_8px_#00D084] transition-all"
                readOnly
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-400 text-sm">Email</label>
              <input
                type="email"
                value={userdata.email}
                className="w-full bg-transparent border border-[#00D084] text-[#00D084] rounded-md px-3 py-2 outline-none focus:shadow-[0_0_8px_#00D084]"
                readOnly
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-gray-400 text-sm">College / Organization</label>
              <input
                name="collagename"
                type="text"
                value={newdata.collagename}
                onChange={onchange}
                className="w-full bg-transparent border border-[#00D084] text-[#00D084] rounded-md px-3 py-2 outline-none focus:shadow-[0_0_8px_#00D084]"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-400 text-sm">Year of study</label>
              <input
                name="yearofstudy"
                type="text"
                value={newdata.yearofstudy}
                onChange={onchange}
                className="w-full p-2 bg-transparent border border-[#00D084] text-[#00D084] rounded-md px-3 py-2 outline-none focus:shadow-[0_0_8px_#00D084]"
              />
            </div>
          </div>
          <label className="block mb-1 text-gray-400 text-sm">Your Bio</label>
          <textarea
            className="py-3 px-4 block w-full resize-none textareastyle focus:shadow-[0_0_8px_#00D084]"
            style={{ border: "1px solid #00d084", marginBottom: "10px" }}
            rows={3}
            name="bio"
            value={newdata.bio}
            onChange={onchange}
            placeholder="Tell about your self" required

          />
          <label className="block mb-1 text-gray-400 text-sm">Your Skills</label>
          <div className="skills-container">

            {skillsList.map((skill) => (
              <span
                key={skill}
                className={`${selectedSkills.includes(skill) ? "skill-tag selected" : "skill-tag"} ${selectedSkills.includes(skill) ? "skill-tag selected" : "skill-tag"}`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </span>
            ))}
          </div>
          <label className="block mb-2.5 text-gray-400 text-sm">Your Intarest</label>
          <div className="skills-container">
            {intarestlist.map((skill) => (
              <span
                key={skill}
                className={`${selectedintarest.includes(skill) ? "skill-tag selected" : "skill-tag"} ${selectedintarest.includes(skill) ? "skill-tag selected" : "skill-tag"}`}
                onClick={() => toggleintarest(skill)}
              >
                {skill}
              </span>
            ))}
          </div>
          {/* Save Button */}
          <div className="text-center pt-6">
            {update ? <button
              type="submit"
              className="bg-[#00D084] text-black px-8 py-2 rounded-md font-semibold hover:shadow-[0_0_18px_#00D084] transition-all"
            >
              {loder ? <div className="loder"></div> : 'Save Changes'}
              
            </button> : ""}
          </div>
        </form>
      </div>}
    </div>
  );
};

export default Profile;
