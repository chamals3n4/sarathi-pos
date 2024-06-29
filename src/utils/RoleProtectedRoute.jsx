import { Navigate, Outlet } from "react-router-dom";

const RoleProtectedRoute = ({ allowedRoles, userRole }) => {
  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to={"/"} />;
};

export default RoleProtectedRoute;
