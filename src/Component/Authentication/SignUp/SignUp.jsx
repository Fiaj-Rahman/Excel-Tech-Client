import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for error messages
import axios from "axios";

const SignUp = () => {
  const { signUpUser, setUser } = useContext(AuthContext);
  const navigate = useNavigate(); // For redirect after successful signup

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    nationality: "",
    image: "",
    password: "",
    confirmPassword: "",
    general: "",  // General error for form-wide issues
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for the form submission

  // Basic form validation function
  const validateForm = (formData) => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation (allowing both 10 or 11 digits)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number (10 or 11 digits)";
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|;:'",.<>?/~`]).{6,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters long, include at least one letter, one number, and one special character";
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Check for other fields
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.nationality) newErrors.nationality = "Nationality is required";

    // Image validation
    if (!formData.image) {
      newErrors.image = "Profile image is required";
    } else if (formData.image && !formData.image.type.startsWith("image/")) {
      newErrors.image = "File must be an image";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Manually extract form values from e.target
    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const phoneNumber = e.target.phoneNumber.value;
    const nationality = e.target.nationality.value;
    const image = e.target.image.files[0];  // For file input, use `files[0]`
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const role = "user";

    const formData = {
      fullName,
      email,
      phoneNumber,
      nationality,
      role,
      image,  // Store the image file here
      password,
      confirmPassword,
    };

    // Validate form before submission
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    // If there are no errors, proceed with signup
    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);  // Start loading state
        setErrors({ ...errors, general: "" }); // Reset general errors before submission

        // Upload image to ImgBB
        const imageformData = new FormData();
        imageformData.append('image', image);
        const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_APIKEY}`, imageformData);
        const imageUrl = data.data.display_url;

        // Create the user data object with the image URL
        const userData = {
          fullName,
          email,
          phoneNumber,
          nationality,
          role,
          image: imageUrl,  // Use the image URL from ImgBB
          password,
          confirmPassword,
        };

        // Send data to backend to create a new user
        const response = await axios.post('https://excel-server-site.vercel.app/signup', userData);

        if (response.data.success) {
          // Proceed with signup using the signUpUser function
          const result = await signUpUser(email, password);

          // Once signUp is successful, set the user context
          setUser(result.user);  // Assuming result contains the user object

          setLoading(false);  // Stop loading state
          toast.success("Signup successful!");  // Show success message
          navigate("/login");  // Redirect to homepage/dashboard (or any other page)
        }

        // Reset form after successful signup
        e.target.reset();
        setImagePreview(null);  // Clear image preview
        setLoading(false);  // Stop loading state
      } catch (error) {
        setLoading(false);  // Stop loading state
        setErrors({ ...errors, general: error.message });  // Set general error message if any
        toast.error(error.message);  // Show error message in toast
      }
    }
  };

  // Handle file input for image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit to 2MB
        setErrors({ ...errors, image: "File size exceeds 2MB" });
        setImagePreview(null);  // Clear preview on error
      } else if (!file.type.startsWith("image/")) { // Check if it's an image file
        setErrors({ ...errors, image: "Only image files are allowed" });
        setImagePreview(null);  // Clear preview on error
      } else {
        setErrors({ ...errors, image: "" });  // Clear error if valid image
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900">
      <div className="w-full max-w-md p-8 my-10 rounded-lg shadow-lg bg-gray-100 text-gray-800">
        <h2 className="mb-4 text-3xl font-semibold text-center text-gray-800">Create Your Account</h2>

        {/* Display General Error */}
        {errors.general && (
          // <div className="mb-4 text-red-400 text-center">{errors.general}</div>
          <div className="mb-4 text-red-400 text-center"><span>A verification email has been sent to your email address. Please verify your email and log in.</span></div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm text-gray-800">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              className={`w-full px-4 py-2 border rounded-md ${errors.fullName ? "border-red-400" : "border-gray-700"} bg-gray-100 text-gray-800 focus:border-violet-400 focus:outline-none`}
            />
            {errors.fullName && <span className="text-xs text-red-400">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-gray-800">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="leroy@jenkins.com"
              className={`w-full px-4 py-2 border rounded-md ${errors.email ? "border-red-400" : "border-gray-700"} bg-gray-100 text-gray-800 focus:border-violet-400 focus:outline-none`}
            />
            {errors.email && <span className="text-xs text-red-400">{errors.email}</span>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="block text-sm text-gray-800">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Your phone number"
              className={`w-full px-4 py-2 border rounded-md ${errors.phoneNumber ? "border-red-400" : "border-gray-700"} bg-gray-100 text-gray-800 focus:border-violet-400 focus:outline-none`}
            />
            {errors.phoneNumber && <span className="text-xs text-red-400">{errors.phoneNumber}</span>}
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <label htmlFor="nationality" className="block text-sm text-gray-800">Nationality</label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              placeholder="Your nationality"
              className={`w-full px-4 py-2 border rounded-md ${errors.nationality ? "border-red-400" : "border-gray-700"} bg-gray-100 text-gray-800 focus:border-violet-400 focus:outline-none`}
            />
            {errors.nationality && <span className="text-xs text-red-400">{errors.nationality}</span>}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm text-gray-800">Profile Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full px-4 py-2 border rounded-md ${errors.image ? "border-red-400" : "border-gray-700"} bg-gray-100 text-gray-800 focus:border-violet-400 focus:outline-none`}
            />
            {errors.image && <span className="text-xs text-red-400">{errors.image}</span>}
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
              </div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-gray-800">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              className={`w-full px-4 py-2 border rounded-md ${errors.password ? "border-red-400" : "border-gray-700"} bg-gray-100 text-gray-800 focus:border-violet-400 focus:outline-none`}
            />
            {errors.password && <span className="text-xs text-red-400">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm text-gray-800">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="********"
              className={`w-full px-4 py-2 border rounded-md ${errors.confirmPassword ? "border-red-400" : "border-gray-700"} bg-gray-100 text-gray-800 focus:border-violet-400 focus:outline-none`}
            />
            {errors.confirmPassword && <span className="text-xs text-red-400">{errors.confirmPassword}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-8 py-3 font-semibold rounded-md bg-blue-900 text-gray-100 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          {/* Login Link */}
          <p className="text-xs text-center sm:px-6 text-gray-400">
            If you have an account, <Link className="underline text-indigo-600" to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
