import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  CirclePercent,
  Layers,
  LayoutDashboard,
  ListChecks,
  ReceiptText,
  Users,
} from "lucide-react";

export default function NavMenu() {
  return (
    <div className="flex flex-wrap justify-center gap-10 pt-[150px]">
      <Link to="/customers">
        <Button className="text-white text-2xl w-[200px] h-[200px] rounded-[20px]">
          <Users className="w-[60px] h-[60px]" />
        </Button>
      </Link>
      <Link to="/items">
        <Button className="text-white text-2xl w-[200px] h-[200px] rounded-[20px]">
          <ListChecks className="w-[60px] h-[60px]" />
        </Button>
      </Link>
      <Link to="/categories">
        <Button className="text-white text-2xl w-[200px] h-[200px] rounded-[20px]">
          <Layers className="w-[60px] h-[60px]" />
        </Button>
      </Link>
      <Link to="/sales">
        <Button className="text-white text-2xl w-[200px] h-[200px] rounded-[20px]">
          <CirclePercent className="w-[60px] h-[60px]" />
        </Button>
      </Link>
      <Link to="/invoice">
        <Button className="text-white text-2xl w-[200px] h-[200px] rounded-[20px]">
          <div>
            <ReceiptText className="w-[60px] h-[60px]" />
          </div>
        </Button>
      </Link>
    </div>
  );
}
