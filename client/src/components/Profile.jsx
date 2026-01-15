import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Fixed import source
import axios from "axios";
import { Camera, Save, Loader2 } from "lucide-react"; // Using Icons for better UI

// Contexts
import { useAuth } from "../context/AuthContext";
import { useloding as useLoading } from "../context/LodingContext"; // Fixed typo alias

// Components & Utils
import LoadingScreen from "./Mainloder";
import { handleSuccess, handleError } from "./ErrorMessage";

// --- Constants ---
const SKILLS_LIST = [
  "React", "NextJs", "Node", "Python", "C++", "Java", "UI/UX", 
  "Blockchain", "AI/ML", "Flutter", "CyberSecurity", "FullStack", "DSA"
];

const INTERESTS_LIST = ["Hackathon", "Seminar", "Workshop", "Leetcode"];

// --- Reusable Sub-components ---

const TagSelector = ({ title, options, selected, onToggle }) => (
  <div className="mb-4">
    <label className="block mb-2 text-gray-400 text-sm font-medium">{title}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((item) => {
        const isSelected = selected.includes(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 
              ${isSelected 
                ? "bg-[#00D084] text-black border-[#00D084] shadow-[0_0_10px_#00D08460]" 
                : "bg-transparent text-gray-300 border-gray-600 hover:border-[#00D084]"
              }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  </div>
);

const InputField = ({ label, name, value, onChange, readOnly = false, type = "text", required = false }) => (
  <div className="flex flex-col">
    <label className="block mb-1 text-gray-400 text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full bg-[#0d0d0d] border border-[#00D084]/50 text-[#00D084] rounded-md px-4 py-2.5 outline-none transition-all duration-300
        ${readOnly ? "opacity-70 cursor-not-allowed" : "focus:border-[#00D084] focus:shadow-[0_0_8px_#00D08440]"}
      `}
    />
  </div>
);

// --- Main Component ---

const Profile = ({ userdata }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, setLoading } = useLoading();

  // Local State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    collegeName: userdata?.collagename || "",
    yearOfStudy: userdata?.study || "",
    bio: userdata?.bio || "",
    skills: userdata?.skill || [],
    interests: userdata?.intarest || [], // Fixed typo 'intarest' to 'interests' for internal logic, mapped back later
  });

  // Handle Text Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  // Handle Image Upload with Validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit
        return handleError("File size should be less than 5MB");
      }
      setPreviewImage(URL.createObjectURL(file));
      setSelectedFile(file);
      setHasChanges(true);
    }
  };

  // Handle Toggle for Arrays (Skills/Interests)
  const handleToggle = useCallback((listType, item) => {
    setFormData((prev) => {
      const currentList = prev[listType];
      const newList = currentList.includes(item)
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];
      
      return { ...prev, [listType]: newList };
    });
    setHasChanges(true);
  }, []);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setIsSubmitting(true);
    const apiFormData = new FormData();

    if (selectedFile) {
      apiFormData.append("profilepic", selectedFile);
    }

    // Prepare JSON payload (Mapping back to backend expected keys)
    const userUpdateInfo = {
      bio: formData.bio,
      collagename: formData.collegeName,
      yearofs: formData.yearOfStudy,
      allskills: formData.skills,
      allintarest: formData.interests,
    };

    apiFormData.append("userinfo", JSON.stringify(userUpdateInfo));

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/updatedata/${userdata._id}`,
        apiFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.status) {
        handleSuccess("Profile updated successfully!");
        setHasChanges(false);
        // Optional: Refresh global user data here if context supports it
      } else {
        handleError(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      handleError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Global Loading Check
  if (!loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#00D084] flex justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-3xl bg-[#0d0d0d] border border-[#00D084]/30 rounded-2xl shadow-[0_0_20px_rgba(0,208,132,0.15)] p-6 md:p-10 animate-fade-in-up">
        
        <h1 className="text-3xl font-bold mb-8 text-center text-white tracking-wide">
          Account Settings
        </h1>

        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-8 group">
          <div className="relative">
            <img
              src={previewImage || userdata?.imgUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-2 border-[#00D084] object-cover shadow-[0_0_15px_#00D08460] group-hover:shadow-[0_0_25px_#00D08480] transition-all duration-300"
            />
            <label 
              htmlFor="profile-upload" 
              className="absolute bottom-0 right-0 bg-[#00D084] text-black p-2 rounded-full cursor-pointer hover:bg-white transition-colors shadow-lg"
            >
              <Camera size={18} />
            </label>
          </div>
          <input 
            id="profile-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageChange} 
          />
          <p className="text-xs text-gray-500 mt-3">Recommended: Square JPG/PNG, Max 5MB</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <InputField label="Full Name" name="fullname" value={userdata.fullname} readOnly />
            <InputField label="Email Address" name="email" value={userdata.email} readOnly />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <InputField 
              label="College / Organization" 
              name="collegeName" 
              value={formData.collegeName} 
              onChange={handleInputChange} 
            />
            <InputField 
              label="Year of Study" 
              name="yearOfStudy" 
              value={formData.yearOfStudy} 
              onChange={handleInputChange} 
            />
          </div>

          <div className="flex flex-col">
            <label className="block mb-1 text-gray-400 text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full bg-[#0d0d0d] border border-[#00D084]/50 text-[#00D084] rounded-md px-4 py-2 outline-none focus:border-[#00D084] focus:shadow-[0_0_8px_#00D08440] resize-none transition-all"
              placeholder="Tell us about yourself..."
            />
          </div>

          <TagSelector 
            title="Skills" 
            options={SKILLS_LIST} 
            selected={formData.skills} 
            onToggle={(item) => handleToggle("skills", item)} 
          />

          <TagSelector 
            title="Interests" 
            options={INTERESTS_LIST} 
            selected={formData.interests} 
            onToggle={(item) => handleToggle("interests", item)} 
          />

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={!hasChanges || isSubmitting}
              className={`
                flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold transition-all duration-300
                ${hasChanges && !isSubmitting
                  ? "bg-[#00D084] text-black hover:bg-[#00b074] hover:shadow-[0_0_20px_#00D08460] cursor-pointer" 
                  : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"}
              `}
            >
              {isSubmitting ? (
                <> <Loader2 className="animate-spin" size={20} /> Saving... </>
              ) : (
                <> <Save size={20} /> Save Changes </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;