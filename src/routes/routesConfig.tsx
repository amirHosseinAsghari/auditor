import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Layout from "@/layout/layout";
import Dashboard from "@/pages/dashboard";
import Report from "@/pages/report";
import Login from "@/pages/login";

const ProtectedRoutes: React.FC = () => {
  const token = localStorage.getItem("token");
  const { role } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = true;
  // TODO remember token !== null
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />

      {isAuthenticated ? (
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="report/new"
            element={
              role === "author" ? <Report mode="new" /> : <Navigate to="/" />
            }
          />
          <Route path="report/edit/:id" element={<Report mode="edit" />} />
          <Route path="report/:id" element={<Report mode="view" />} />
        </Route>
      ) : (
        <Route path="/*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

export default ProtectedRoutes;
