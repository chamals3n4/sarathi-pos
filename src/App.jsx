import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import Categories from "./pages/Categories";
import Sales from "./pages/Sales";
import Invoice from "./pages/Invoice";
import NotFoundPage from "./pages/NotFoundPage";
import NavMenu from "./components/NavMenu";
import ViewAllInvoice from "./pages/ViewAllInvoice";
import AuthComponent from "./components/AuthComponent";
import ProtectedRoute from "./utils/ProtectedRoute";
import SelectRole from "./pages/SelectRole";
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
            <Route path="/view-invoices/:id" element={<ViewSingleInvoice />} />
          </Route>
          <Route path="/login" element={<AuthComponent />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
