import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CirclePercent,
  FilePlus,
  GalleryHorizontalEnd,
  Layers,
  LayoutDashboard,
  ListChecks,
  ReceiptText,
  ShieldEllipsis,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

export default function SelectRole() {
  return (
    <>
      <div className="flex flex-wrap justify-center gap-[100px] pt-[60px]">
        <Link to="/admin">
          <Button className="text-white text-2xl w-[350px] h-[150px] bg-delete-red rounded-[10px] ">
            <ShieldEllipsis className="w-[60px] h-[60px] " />
          </Button>
          <h1 className="text-xl font-semibold pt-3 text-center">
            Admin Dashboard
          </h1>
        </Link>
        <Link to="/regular">
          <Button className="text-white text-2xl w-[350px] h-[150px] bg-update-green rounded-[10px]">
            <UserCheck className="w-[60px] h-[60px]" />
          </Button>
          <h1 className="text-xl font-semibold pt-3 text-center">
            Regular Dashboard
          </h1>
        </Link>
      </div>
    </>
  );
}
