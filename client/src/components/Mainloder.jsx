import React from "react";
import "../LoadingScreen.css"; // Animation styles
import logo from "../assets/logo.png"
export default function LoadingScreen() {
    return (
        <div className="loading-wrapper">

            <div className="loading-content">
                <img
                    src={logo} // ✅ put your logo inside /public/assets/
                    alt="HackNexus Logo"
                    className="loading-logo"
                />
                <p className="text-[#00d084] text-4xl animate-pulse">Loding...</p>

                <div className="loadermain">
                </div>
            </div>
        </div>
    );
}
