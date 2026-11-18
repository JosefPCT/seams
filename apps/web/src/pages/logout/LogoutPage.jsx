import { useAuth } from "../../app/context/AuthContext"
import { useState } from "react";

export default function LogoutPage(){
    const { logout } = useAuth();

    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async(e) => {
      e.preventDefault();

      try {
        console.log("Logging out...");
        logout();
      } catch (error) {
        console.log("Logging out failed, something went wrong. Try again");
      } 
    }

  return (
    <button onClick={handleSubmit}>
        Logout
    </button>
  );
}