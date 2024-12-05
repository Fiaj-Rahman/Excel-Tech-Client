import React, { createContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.confiq"; // Ensure path is correct
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create Context for authentication
export const AuthContext = createContext(null);

// Translate Firebase error codes to user-friendly messages
const translateError = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    default:
      return 'Something went wrong. Please try again later.';
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // New state to handle errors
  const googleProvider = new GoogleAuthProvider();
  // const navigate = useNavigate(); // Used for navigation after signup

  // Sign Up User function
  const signUpUser = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser); // Send verification email
      await signOut(auth); // Sign out the user to encourage email verification

      alert('Please verify your email by checking the inbox for a verification link.');

      // Navigate to login page after successful signup
      // navigate('/login');

      setError(null); // Clear error on successful signup
    } catch (error) {
      setError(translateError(error.code)); // Set error message if signup fails
    }
  };

  // Login User function
  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        alert('Your email is verified.');
      } else {
        alert('Please verify your email. Check your inbox.');
        await signOut(auth);
        await sendEmailVerification(auth.currentUser);
        
      }

      setError(null); // Clear error on successful login
    } catch (error) {
      setError(translateError(error.code)); // Set error message if login fails
    }
  };

//  // Google Login function
// const googleLogin = async () => {
//   try {
//     const userCredential = await signInWithPopup(auth, googleProvider);
//     const user = userCredential.user;
//     return user;  // Make sure to return the user data from the Google login
//   } catch (error) {
//     setError(translateError(error.code)); // Handle error
//     throw error; // Throw error to handle it properly in the component
//   }
// };


  // Log Out function
 // Log Out function
const logOut = async () => {
  try {

    // Sign out from Firebase
    await signOut(auth);
      // Send GET request to the backend server to clear session cookies
      await axios.get('https://excel-server-site.vercel.app/logout', { withCredentials: true });
    // Clear any error on successful logout
    setError(null);
  } catch (error) {
    // Handle Firebase error and set error message
    if (error.code) {
      setError(translateError(error.code)); // Firebase-specific error
    } else {
      setError('An error occurred during logout. Please try again.'); // Generic error message
    }
  }
};


  // Password Reset function
  const resetPass = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return 'Password reset email sent successfully.'; // Success message
    } catch (error) {
      return translateError(error.code); // Translate and return error message
    }
  };


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      // if (currentUser) {
      //   saveUser(currentUser);
      // }
    });

    return () => unsubscribe();
  }, []);
  


  // Context value to share with children components
  const authInfo = {
    signUpUser,
    loginUser,
    user,
    setUser,
    logOut,
    error, // Share the error state with children components
    resetPass,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
