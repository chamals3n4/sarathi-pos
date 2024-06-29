import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";

const ADMIN_PIN = "1899";
const EMPLOYEE_PIN = "0000";

export default function SelectRole() {
  const [adminPin, setAdminPin] = useState("");
  const [empPin, setEmpPin] = useState("");
  const navigate = useNavigate();

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminPin === ADMIN_PIN) {
      navigate("/admin");
    } else {
      toast.error("Invalid PIN");
    }
  };

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    if (empPin === EMPLOYEE_PIN) {
      navigate("/regular");
    } else {
      toast.error("Invalid PIN");
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="flex flex-wrap justify-center gap-[100px] pt-[150px]">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-white text-2xl w-[350px] h-[150px] bg-choreo-blue rounded-[10px]">
              Admin Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Pin Number</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdminSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="pin"
                    type="tel"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-white text-2xl w-[350px] h-[150px] bg-choreo-blue rounded-[10px]">
              Regular Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter Pin Number</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEmployeeSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="pin"
                    type="tel"
                    value={empPin}
                    onChange={(e) => setEmpPin(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
