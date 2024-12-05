import React, { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // If the user is authenticated, return the children (protected content)
  if (user) {
    return children;
  }

  // If not authenticated, redirect to the login page and pass the current location to the login page
  return <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
