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
import Role from "../assets/images/role.png";

const ADMIN_PIN = "1899";
const EMPLOYEE_PIN = "0000";

export default function SelectRole() {
  const [adminPin, setAdminPin] = useState("");
  const [empPin, setEmpPin] = useState("");
  const navigate = useNavigate();

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminPin === ADMIN_PIN) {
      localStorage.setItem("role", "admin");
      navigate("/admin");
    } else {
      toast.error("Invalid PIN");
    }
  };

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    if (empPin === EMPLOYEE_PIN) {
      localStorage.setItem("role", "regular");
      navigate("/regular");
    } else {
      toast.error("Invalid PIN");
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="flex justify-center items-center pt-[50px] ">
        <div className="w-1/2 flex justify-center">
          <img src={Role} alt="Role" className="w-[550px] h-[550px]" />
        </div>
        <div className="w-1/2 flex flex-col items-center gap-[30px]">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white text-2xl w-[350px] h-[150px] bg-choreo-blue rounded-[10px]">
                Admin Dashboard
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center justify-center sm:max-w-[425px] h-[250px]">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">
                  Enter Pin Number
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdminSubmit} className="w-full">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Input
                      id="pin"
                      type="tel"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      className="col-span-2"
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-center w-full">
                  <Button
                    type="submit"
                    className="w-full bg-sarath-orange text-md"
                  >
                    Continue
                  </Button>
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
            <DialogContent className="flex flex-col items-center justify-center sm:max-w-[425px] h-[250px]">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">
                  Enter Pin Number
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEmployeeSubmit} className="w-full">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Input
                      id="pin"
                      type="tel"
                      value={empPin}
                      onChange={(e) => setEmpPin(e.target.value)}
                      className="col-span-2"
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-center w-full">
                  <Button
                    type="submit"
                    className="w-full bg-sarath-orange text-md"
                  >
                    Continue
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
