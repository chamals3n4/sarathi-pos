import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  CirclePercent,
  FilePlus,
  GalleryHorizontalEnd,
  Layers,
  LayoutDashboard,
  ListChecks,
  ReceiptText,
  Users,
} from "lucide-react";

export default function NavMenu() {
  return (
    <>
      <h1 className="text-4xl text-sarathi-text pt-20 pl-20 font-bold">
        Welcome Again
      </h1>
      <div className="flex flex-wrap justify-center gap-14 pt-[60px]">
        <Link to="/customers">
          <Button className="text-white text-2xl w-[150px] h-[150px] bg-choreo-blue rounded-[10px] ">
            <Users className="w-[60px] h-[60px] " />
          </Button>
          <h1 className="text-lg font-semibold pt-3 text-center">
            Manage Customers
          </h1>
        </Link>
        <Link to="/items">
          <Button className="text-white text-2xl w-[150px] h-[150px] bg-choreo-blue rounded-[10px]">
            <ListChecks className="w-[60px] h-[60px]" />
          </Button>
          <h1 className="text-lg font-semibold pt-3 text-center">
            Manage Items
          </h1>
        </Link>
        <Link to="/categories">
          <Button className="text-white text-2xl w-[150px] h-[150px] bg-choreo-blue rounded-[10px]">
            <Layers className="w-[60px] h-[60px]" />
          </Button>
          <h1 className="text-lg font-semibold pt-3 text-center">
            Manage Categories
          </h1>
        </Link>
        <Link to="/sales">
          <Button className="text-white text-2xl w-[150px] h-[150px] bg-choreo-blue rounded-[10px]">
            <CirclePercent className="w-[60px] h-[60px]" />
          </Button>
          <h1 className="text-lg font-semibold pt-3 text-center">Sales</h1>
        </Link>
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
              <GalleryHorizontalEnd className="w-[60px] h-[60px]" />
            </div>
          </Button>
          <h1 className="text-lg font-semibold pt-3 text-center">
            View All Invoice
          </h1>
        </Link>
      </div>
    </>
  );
}
