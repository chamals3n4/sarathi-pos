import React from "react";
import { Link } from "react-router-dom";

export default function MenuBar() {
  return (
    <>
      <header className="flex flex-col items-center justify-between max-w-full md:max-w-6xl px-2 md:px-6 py-0.5 mx-auto md:flex-row">
        <Link to="/" className="text-indigo-900 z-10 active">
          {/* <img
            src="https://www.svgrepo.com/show/489282/brand.svg"
            className="w-24 py-8 md:py-0 g-image"
          /> */}
        </Link>
        <nav className="z-10">
          <ul className="flex flex-row items-center px-6 py-3 mb-12 text-indigo-100 bg-sarathi-text rounded-lg">
            <li className="font-bold pr-8">
              <Link to="/">Home Page</Link>
            </li>
            <li className="font-bold pr-8">
              <Link to="/customers">Customers</Link>
            </li>
            <li className="font-bold pr-8">
              <Link to="/items">Items</Link>
            </li>
            <li className="font-bold pr-8">
              <Link to="/categories">Categories</Link>
            </li>
            <li className="font-bold pr-8">
              <Link to="/invoice" className="ml-2">
                Create Invoice
              </Link>
            </li>
            <li className="font-bold pr-8">
              <Link to="/view-invoices" className="ml-2">
                View All Invoices
              </Link>
            </li>
            <li className="font-bold pr-8">
              <Link to="/sales" className="ml-2">
                Sales
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
