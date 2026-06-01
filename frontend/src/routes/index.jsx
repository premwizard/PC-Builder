import React from "react";
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
