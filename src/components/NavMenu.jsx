import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Users,
  ListChecks,
  Layers,
  TrendingUp,
  FilePlus,
  ListOrdered,
} from "lucide-react";

export default function NavMenu() {
  const userRole = localStorage.getItem("role");

  return (
    <>
      <h1 className="text-4xl text-sarathi-text pt-20 pl-20 font-bold">
        Welcome Again
      </h1>
      <div className="flex flex-wrap justify-center gap-14 pt-[60px]">
        <>
          <Link to="/invoice">
            <Button className="text-white text-2xl w-[150px] h-[150px] bg-choreo-blue rounded-[10px]">
              <div>
                <FilePlus className="w-[60px] h-[60px]" />
              </div>
            </Button>
            <h1 className="text-lg font-semibold pt-3 text-center">
              Create Invoice
            </h1>
          </Link>
          <Link to="/view-invoices">
            <Button className="text-white text-2xl w-[150px] h-[150px] bg-choreo-blue rounded-[10px]">
              <div>
                <ListOrdered className="w-[60px] h-[60px]" />
              </div>
            </Button>
            <h1 className="text-lg font-semibold pt-3 text-center">
              View All Invoices
            </h1>
          </Link>
          {userRole === "admin" && (
            <>
              <Link to="/admin/items">
                <Button className="text-white text-2xl w-[150px] h-[150px] bg-choreo-blue rounded-[10px]">
                  <ListChecks className="w-[60px] h-[60px]" />
                </Button>
                <h1 className="text-lg font-semibold pt-3 text-center">
                  Manage Items
                </h1>
              </Link>
              <Link to="/admin/categories">
                <Button className="text-white text-2xl w-[150px] h-[150px] bg-choreo-blue rounded-[10px]">
                  <Layers className="w-[60px] h-[60px]" />
                </Button>
                <h1 className="text-lg font-semibold pt-3 text-center">
                  Manage Categories
                </h1>
              </Link>
              <Link to="/admin/customers">
                <Button className="text-white text-2xl w-[150px] h-[150px] bg-choreo-blue rounded-[10px] ">
                  <Users className="w-[60px] h-[60px] " />
                </Button>
                <h1 className="text-lg font-semibold pt-3 text-center">
                  Manage Customers
                </h1>
              </Link>
              <Link to="/admin/sales">
                <Button className="text-white text-2xl w-[150px] h-[150px] bg-choreo-blue rounded-[10px]">
                  <TrendingUp className="w-[60px] h-[60px]" />
                </Button>
                <h1 className="text-lg font-semibold pt-3 text-center">
                  Sales
                </h1>
              </Link>
            </>
          )}
        </>
      </div>
    </>
  );
}
