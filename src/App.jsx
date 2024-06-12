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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<NavMenu />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/items" element={<Items />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/invoice" element={<Invoice />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
