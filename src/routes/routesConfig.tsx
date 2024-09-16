import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Layout from "@/layout/layout";
import Dashboard from "@/pages/dashboard";
import Report from "@/pages/report";
import Login from "@/pages/login";
import { useIsAuthenticated } from "@/api/auth/authMutations";
import { useEffect } from "react";

const ProtectedRoutes: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.auth);

  const { mutate: checkAuth, data: authData, isLoading } = useIsAuthenticated();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="container after:!bg-primary before:!bg-primary">
        <div className="dot !bg-primary"></div>
      </div>
    );
  }

  const isAuthenticated = authData?.isAuthenticated ?? false;
  console.log(isAuthenticated)

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
