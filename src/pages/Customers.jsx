import { useState, useEffect } from "react";
import supabase from "@/supabaseClient";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import Spinner from "@/components/Spinner";

import { useNavigate } from "react-router-dom";
import { Layers } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MenuBar from "@/components/MenuBar";
import Footer from "@/components/Footer";

export default function Customers() {
  const [applicants, setApplicants] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const { data, error } = await supabase.from("customers").select("*");

        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setApplicants(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchApplicants();
  }, []);

  // Create new customer
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCustomer = {
      name: name,
      phone: phone,
      address: address,
    };

    try {
      const { data, error } = await supabase
        .from("customers")
        .insert([newCustomer])
        .select();
      if (error) {
        console.log("Error inserting data", error.message);
      } else {
        console.log("Data inserted successfully", data);
        toast.success("Customer created successfully!"); // Trigger toast notification
      }
    } catch (error) {
      console.log("Error inserting data", error.message);
    }
    return navigate("/customers");
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const updatedCustomer = {
      name: name,
      phone: phone,
      address: address,
    };
  
    try {
      const { data, error } = await supabase
        .from("customers")
        .update(updatedCustomer)
        .eq("id", currentCustomer.id)
        .select();
      if (error) {
        console.log("Error updating data", error.message);
        toast.error("Error Updating Customer");
      } else {
        console.log("Data updated successfully", data);
        toast.success("Customer Updated Successfully");
      }
    } catch (error) {
      console.log("Error updating data", error.message);
      toast.error("Error Updating Customer");
    }
    return navigate("/admin/customers");
  };


  return (
    <>
      <ToastContainer />
      <MenuBar />
      <div className="overflow-hidden bg-white py-24 pr-36 pl-36 mb-10 sm:py-16">
        <div className="right-20 pb-6">
          <div className="pb-10 flex items-center space-x-4">
            <div className="text-white text-2xl w-[50px] h-[50px] bg-choreo-blue rounded-[10px] flex items-center justify-center">
              <Layers className="w-[25px] h-[25px]" />
            </div>
            <h1 className="text-3xl text-sarathi-text font-bold">
              Customer Management
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-choreo-blue">Add New Customer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="col-span-3 focus:ring-sarathi-text"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button className="bg-sarath-orange" type="submit">
                      Save Changes
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg font-medium">Name</TableHead>
                <TableHead className="text-lg font-medium">Phone</TableHead>
                <TableHead className="text-lg font-medium">Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="text-lg">{applicant.name}</TableCell>
                    <TableCell className="text-lg">{applicant.phone}</TableCell>
                    <TableCell className="text-lg">
                      {applicant.address}
                    </TableCell>
                    <TableCell className="text-lg">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-update-green h-8"
                            onClick={() => {
                              setCurrentCustomer(applicant);
                              setName(applicant.name);
                              setPhone(applicant.phone);
                              setAddress(applicant.address);
                              console.log(applicant);
                            }}
                          >
                            Update Customer
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Update Customer</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpdate}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">
                                  Phone
                                </Label>
                                <Input
                                  id="phone"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">
                                  Address
                                </Label>
                                <Input
                                  id="address"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  type="submit"
                                  className="bg-update-green"
                                >
                                  Update Changes
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <Footer />
    </>
  );
}
