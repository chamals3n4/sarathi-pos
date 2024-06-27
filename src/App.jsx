import React from "react";
import { Button } from "./components/ui/button";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import Categories from "./pages/Categories";
import Sales from "./pages/Sales";
import Invoice from "./pages/Invoice";
import NotFoundPage from "./pages/NotFoundPage";
import NavMenu from "./components/NavMenu";
import ViewAllInvoice from "./pages/ViewAllInvoice";
import SingleGeneratedInvoice from "./pages/SingleGeneratedInvoice";
import LoginReg from "./pages/LoginReg";
import AuthComponent from "./components/AuthComponent";
import ProtectedRoute from "./utils/ProtectedRoute";
import SelectRole from "./pages/SelectRole";
import AsgardeoAuth from "./components/AsgardeoAuth";
import CreateInvoice from "./pages/Invoice";
import CreateNewInvoice from "./pages/CreateInvoice";
import InvoiceSize from "./pages/InvoiceSize";
import ViewSingleInvoice from "./pages/ViewSingleInvoice";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<SelectRole />} />
            <Route path="/admin" element={<NavMenu />} />
            <Route path="/regular" element={<NavMenu />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/items" element={<Items />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/chamalsena" element={<Invoice />} />
            <Route path="/invoice" element={<CreateNewInvoice />} />
            <Route path="/view-invoices" element={<ViewAllInvoice />} />
            <Route path="/invoice-size" element={<InvoiceSize />} />
            {/* <Route
              path="/view-invoices/:id"
              element={<SingleGeneratedInvoice />}
            /> */}
            <Route path="/view-invoices/:id" element={<ViewSingleInvoice />} />
          </Route>
          <Route path="/login" element={<AuthComponent />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
