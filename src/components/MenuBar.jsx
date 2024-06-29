import React from "react";
import { Link } from "react-router-dom";

export default function MenuBar() {
  const userRole = localStorage.getItem("role");

  return (
    <header className="bg-choreo-blue text-primary-foreground shadow">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" prefetch={false}>
          <span className="text-2xl font-semibold">Sarathi Book Shop</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/invoice"
            className="rounded-md px-3 py-2 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            prefetch={true}
          >
            Create Invoice
          </Link>
          <Link
            to="/view-invoices"
            className="rounded-md px-3 py-2 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            prefetch={false}
          >
            View All Invoice
          </Link>
          {userRole === "admin" && (
            <>
              <Link
                to="/admin/items"
                className="rounded-md px-3 py-2 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                prefetch={false}
              >
                Items
              </Link>
              <Link
                to="/admin/categories"
                className="rounded-md px-3 py-2 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                prefetch={false}
              >
                Categories
              </Link>
              <Link
                to="/admin/customers"
                className="rounded-md px-3 py-2 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                prefetch={false}
              >
                Customers
              </Link>
              <Link
                to="/admin/sales"
                className="rounded-md px-3 py-2 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                prefetch={false}
              >
                Sales
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
