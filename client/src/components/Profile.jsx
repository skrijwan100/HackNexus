import React, { useState } from "react";

const Profile = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#00D084] font-[Orbitron] flex justify-center py-12 px-6">
      <div className="w-full max-w-3xl bg-[#0d0d0d] border border-[#00D084]/40 rounded-2xl shadow-[0_0_25px_#00D08440] p-8">
        
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Account Settings
        </h1>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-8">
          <label htmlFor="profile-upload" className="cursor-pointer">
            <img
              src={image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="User"
              className="w-28 h-28 rounded-full border-2 border-[#00D084] object-cover shadow-[0_0_18px_#00D08480] hover:shadow-[0_0_25px_#00ffc480] transition-all duration-300"
            />
          </label>
          <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <p className="text-xs text-gray-400 mt-2">Tap to change profile photo</p>
        </div>

        {/* Form Section */}
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-gray-400 text-sm">Full Name</label>
              <input
                type="text"
                placeholder="Sk Rijwan"
                className="w-full bg-transparent border border-[#00D084] text-[#00D084] rounded-md px-3 py-2 outline-none focus:shadow-[0_0_8px_#00D084] transition-all"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-400 text-sm">Email</label>
              <input
                type="email"
                placeholder="rascalboy329@gmail.com"
                className="w-full bg-transparent border border-[#00D084] text-[#00D084] rounded-md px-3 py-2 outline-none focus:shadow-[0_0_8px_#00D084]"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-gray-400 text-sm">College / Organization</label>
              <input
                type="text"
                placeholder="Brainware University"
                className="w-full bg-transparent border border-[#00D084] text-[#00D084] rounded-md px-3 py-2 outline-none focus:shadow-[0_0_8px_#00D084]"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-400 text-sm">Skills</label>
              <input
                type="text"
                placeholder="React, Node, Flask..."
                className="w-full bg-transparent border border-[#00D084] text-[#00D084] rounded-md px-3 py-2 outline-none focus:shadow-[0_0_8px_#00D084]"
              />
            </div>
          </div>

          {/* Password Change */}

          {/* Save Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              className="bg-[#00D084] text-black px-8 py-2 rounded-md font-semibold hover:shadow-[0_0_18px_#00D084] transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
