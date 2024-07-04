import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function MenuBar({ simple = false }) {
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (simple) {
      navigate("/");
    } else {
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/regular");
      }
    }
  };

  const TimeAndDate = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    const formatDateTime = (date) => {
      return date.toLocaleString("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
    };

    return (
      <span className="text-lg font-semibold text-white">
        {formatDateTime(currentDateTime)}
      </span>
    );
  };

  return (
    <header className="bg-choreo-blue text-primary-foreground shadow">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl font-semibold">Sarathi Book Shop</span>
        </div>
        {!simple && (
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
              View All Invoices
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
        )}
        <div className="flex items-center">
          <TimeAndDate />
        </div>
      </div>
    </header>
  );
}
