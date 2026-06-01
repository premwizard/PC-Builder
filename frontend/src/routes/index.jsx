import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Builder from "../pages/Builder";
import ComponentLibrary from "../pages/ComponentLibrary";
import Community from "../pages/Community";
import BuildDetails from "../pages/BuildDetails";
import Compare from "../pages/Compare";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Pcs from "../pages/Pcs";
import Laptops from "../pages/Laptops";

// Lazy-loaded new feature pages (code-split for performance)
const FpsEstimator = lazy(() => import("../pages/FpsEstimator"));
const Recommend    = lazy(() => import("../pages/Recommend"));
const AdminPanel   = lazy(() => import("../pages/AdminPanel"));

const LazyPage = ({ Component }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#050816" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full animate-spin"
          style={{ border: "2px solid rgba(124,58,237,0.2)", borderTop: "2px solid #7C3AED" }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#475569" }}>Loading...</span>
      </div>
    </div>
  }>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "pcs",
        element: <Pcs />,
      },
      {
        path: "laptops",
        element: <Laptops />,
      },
      {
        path: "builder",
        element: <Builder />,
      },
      {
        path: "components",
        element: <ComponentLibrary />,
      },
      {
        path: "community",
        element: <Community />,
      },
      {
        path: "build/:id",
        element: <BuildDetails />,
      },
      {
        path: "compare",
        element: <Compare />,
      },
      { path: "fps",          element: <LazyPage Component={FpsEstimator} /> },
      { path: "recommend",    element: <LazyPage Component={Recommend} /> },
      { path: "admin",        element: <LazyPage Component={AdminPanel} /> },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
      {
        path: "profile",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Profile />,
          },
        ],
      },
      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "auth/register",
        element: <Register />,
      },
    ],
  },
]);
