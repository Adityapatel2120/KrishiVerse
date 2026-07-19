import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return null;

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;