import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800 font-sans text-center p-4">
      <div>
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="text-lg mb-4">We encountered an error while loading the page.</p>
        <p className="text-md text-gray-600">Please try again later or go back to the <Link className="text-blue-800 font-bold" to={'/'}>homepage</Link>.</p>
      </div>
    </div>
  );
};

export default ErrorPage;
