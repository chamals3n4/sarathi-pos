import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function NavMenu() {
  return (
    <div className="flex flex-wrap justify-center gap-10 pt-[150px]">
      <Link to="/customers">
        <Button className="text-white text-2xl w-[200px] h-[200px] rounded-[20px]">
          Customers
        </Button>
      </Link>
      <Link to="/items">
        <Button className="text-white text-2xl w-[200px] h-[200px] rounded-[20px]">
          Items
        </Button>
      </Link>
      <Link to="/categories">
        <Button className="text-white text-2xl w-[200px] h-[200px] rounded-[20px]">
          Categories
        </Button>
      </Link>
      <Link to="/sales">
        <Button className="text-white text-2xl w-[200px] h-[200px] rounded-[20px]">
          Sales
        </Button>
      </Link>
      <Link to="/invoice">
        <Button className="text-white text-2xl w-[200px] h-[200px] rounded-[20px]">
          Invoice
        </Button>
      </Link>
    </div>
  );
}
