import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Authentication/AuthProvider/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const { user } = useContext(AuthContext); // Access user from context
  const [profileData, setProfileData] = useState(null); // To store profile data
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [imagePreview, setImagePreview] = useState(profileData?.image || null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    image: "",
  });

  useEffect(() => {
    if (user?.email) {
      // Fetch data from the API
      fetch(`https://excel-server-site.vercel.app/signup`)
        .then((response) => response.json())
        .then((data) => {
          // Filter the user profile data based on email
          const userProfile = data.find((item) => item.email === user.email);
          
          if (userProfile) {
            setProfileData(userProfile); // If the email matches, update the state with the profile data
          } else {
            console.error("No profile found for this email");
          }
        })
        .catch((error) => console.error("Error fetching profile data:", error));
    }
  }, [user?.email]);

  // Open modal for editing the profile
  const openModal = () => {
    if (profileData) {
      setEditedProfile({
        fullName: profileData.fullName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        image: profileData.image,
      });
      setIsModalOpen(true); // Open the modal
    }
  };

  // Close the modal
  const closeModal = () => setIsModalOpen(false);

  // Handle input field changes for editing profile
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    // Handle image file change
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          setErrors({ ...errors, image: "File size exceeds 2MB" });
          setImagePreview(null);
        } else if (!file.type.startsWith("image/")) {
          setErrors({ ...errors, image: "Only image files are allowed" });
          setImagePreview(null);
        } else {
          setErrors({ ...errors, image: "" });
          setImagePreview(URL.createObjectURL(file));
          setEditedProfile({ ...editedProfile, image: file });
        }
      }
    };


  const validateForm = (data) => {
    const errors = {};
    if (!data.fullName) errors.fullName = "Full Name is required";
    if (!data.phoneNumber) errors.phoneNumber = "Phone Number is required";
    return errors;
  };

    const saveChanges = async (e) => {
      e.preventDefault();
  
      const validationErrors = validateForm(editedProfile);
      setErrors(validationErrors);
  
      if (Object.keys(validationErrors).length === 0) {
        try {
          setLoading(true);
  
          let imageUrl = editedProfile.image;
          if (editedProfile.image instanceof File) {
            const formData = new FormData();
            formData.append('image', editedProfile.image);
            const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_APIKEY}`, formData);
            imageUrl = data.data.display_url;
          }
  
          const updatedData = { ...editedProfile, image: imageUrl };
  
          await fetch(`https://excel-server-site.vercel.app/profile/${profileData._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message === "Profile updated successfully") {
                setProfileData(updatedData);
                toast.success("Profile updated successfully!");
                closeModal();
              } else {
                toast.error("Failed to update profile");
              }
            })
            .catch((error) => {
              toast.error(error.message || "Error saving changes");
            })
            .finally(() => setLoading(false));
        } catch (error) {
          toast.error(error.message || "An unexpected error occurred");
          setLoading(false);
        }
      }
    };
  

  // // Save the edited profile data (PUT request to update profile)
  // const saveChanges = () => {
  //   if (profileData?._id) {
  //     fetch(`https://excel-server-site.vercel.app/profile/${profileData._id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(editedProfile), // Send the updated profile data
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.message === "Profile updated successfully") {
  //           setProfileData(editedProfile); // Update the local state with the new data
  //           closeModal(); // Close the modal
  //         } else {
  //           console.error("Failed to update profile");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error saving changes:", error);
  //       });
  //   }
  // };

  // Show a loading message until profileData is fetched
  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:flex sm:space-x-6 my-10 dark:bg-gray-50 dark:text-gray-800 rounded-lg shadow-md">
      {/* Profile Image Section */}
      <div className="flex-shrink-0 max-h-48 w-32 sm:w-40 sm:h-40 mb-6 sm:mb-0">
        <img
          src={profileData.image || "https://source.unsplash.com/100x100/?portrait?1"}
          alt="Profile"
          className="object-cover object-center w-full h-full rounded-lg shadow-lg dark:bg-gray-500"
        />
      </div>

      {/* Profile Information Section */}
      <div className="flex flex-col justify-between space-y-4 w-full">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-900">
            {profileData.fullName || "Leroy Jenkins"}
          </h2>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-500">
            {profileData?.role || "user"}
          </span>
        </div>

        <div className="space-y-2">
          {/* Email */}
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 text-gray-500">
              <path
                fill="currentColor"
                d="M274.6,25.623a32.006,32.006,0,0,0-37.2,0L16,183.766V496H496V183.766ZM464,402.693,339.97,322.96,464,226.492ZM256,51.662,454.429,193.4,311.434,304.615,256,268.979l-55.434,35.636L57.571,193.4ZM48,226.492,172.03,322.96,48,402.693ZM464,464H48V440.735L256,307.021,464,440.735Z"
              ></path>
            </svg>
            <span>{profileData.email || "leroy.jenkins@company.com"}</span>
          </div>

          {/* Phone Number */}
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 text-gray-500">
              <path
                fill="currentColor"
                d="M449.366,89.648l-.685-.428L362.088,46.559,268.625,171.176l43,57.337a88.529,88.529,0,0,1-83.115,83.114l-57.336-43L46.558,362.088l42.306,85.869.356.725.429.684a25.085,25.085,0,0,0,21.393,11.857h22.344A327.836,327.836,0,0,0,461.222,133.386V111.041A25.084,25.084,0,0,0,449.366,89.648Zm-20.144,43.738c0,163.125-132.712,295.837-295.836,295.837h-18.08L87,371.76l84.18-63.135,46.867,35.149h5.333a120.535,120.535,0,0,0,120.4-120.4v-5.333l-35.149-46.866L371.759,87l57.463,28.311Z"
              ></path>
            </svg>
            <span>{profileData.phoneNumber || "+25 381 77 983"}</span>
          </div>
        </div>

        {/* Edit Icon */}
        <button
          onClick={openModal}
          className="text-blue-500 hover:text-blue-700 flex items-center space-x-1 mt-4"
        >
         <FaEdit />
          <span>Edit</span>
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full sm:w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={editedProfile.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg focus:outline-none"
              />
              <input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:outline-none"
                disabled
              />
              <input
                type="tel"
                name="phoneNumber"
                value={editedProfile.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg focus:outline-none"
              />
               {/* Image Upload */}
               <div>
                <label>Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.image && <span>{errors.image}</span>}
                {imagePreview && (
                  <div>
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
