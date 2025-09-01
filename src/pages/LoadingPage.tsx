import React from "react";
import logo from "../assets/storysphere_logo.png"; // adjust path if needed

const LoadingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Logo with concentric spinners */}
      <div className="relative">
        {/* Logo */}
        <img
          src={logo}
          alt="Site Logo"
          className="w-32 h-32 object-contain relative z-10"
        />

        {/* Outer Spinner (Clockwise) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-52 h-52 border-8 border-transparent border-t-blue-500 animate-spin-fast rounded-full"></div>
        </div>

        {/* Inner Spinner (Counterclockwise) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-44 h-44 border-8 border-transparent border-b-pink-600 rounded-full animate-spin-reverse"></div>
        </div>
      </div>

      {/* Loading Text */}
      <p className="mt-8 text-xl font-semibold tracking-wide animate-pulse bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
        Loading...
      </p>
    </div>
  );
};

export default LoadingPage;
