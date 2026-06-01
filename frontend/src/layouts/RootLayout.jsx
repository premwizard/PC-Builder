import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ToastContainer from "../components/ToastContainer";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen text-white" style={{ background: "#050816" }}>
      {/* Global noise grain texture */}
      <div className="noise-overlay" aria-hidden />
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
