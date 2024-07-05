import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import Categories from "./pages/Categories";
import Sales from "./pages/Sales";
// import Invoice from "./pages/Invoice";
import NotFoundPage from "./pages/NotFoundPage";
import NavMenu from "./components/NavMenu";
import ViewAllInvoice from "./pages/ViewAllInvoice";
import AuthComponent from "./components/AuthComponent";
import ProtectedRoute from "./utils/ProtectedRoute";
import SelectRole from "./pages/SelectRole";
import CreateNewInvoice from "./pages/CreateInvoice";
import ViewSingleInvoice from "./pages/ViewSingleInvoice";

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("role") === "admin";
  return isAdmin ? children : <Navigate to={"/regular"} />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<SelectRole />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <NavMenu />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <AdminRoute>
                <Customers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/items"
            element={
              <AdminRoute>
                <Items />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <Categories />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <AdminRoute>
                <Sales />
              </AdminRoute>
            }
          />

          {/* Regular user routes */}
          <Route path="/regular" element={<NavMenu />} />
          <Route path="/invoice" element={<CreateNewInvoice />} />
          <Route path="/view-invoices" element={<ViewAllInvoice />} />
          <Route path="/view-invoices/:id" element={<ViewSingleInvoice />} />
        </Route>

        <Route path="/login" element={<AuthComponent />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
