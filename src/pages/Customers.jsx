import { useState, useEffect } from "react";
import supabase from "@/supabaseClient";
import { TableDemo } from "@/components/Table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Switch from "@/components/Swith";
import Spinner from "@/components/Spinner";

import Items from "./Items";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { PersonStanding } from "lucide-react";

export default function Customers() {
  const [applicants, setApplicants] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);

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
      }
    } catch (error) {
      console.log("Error inserting data", error.message);
    }
    return navigate("/customers");
  };

  return (
    <>
      <div className="overflow-hidden bg-white py-24 pr-36 pl-36 mb-10 sm:py-16">
        <div className="right-20 pb-6">
          <div className="pb-10">
            <h1 className="text-2xl font-bold">Customer Management</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Customer</Button>
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
                  {/* <Button type="submit">Save changes</Button> */}

                  <DialogClose asChild>
                    <Button type="submit">Save Changes</Button>
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
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-lg font-medium">
                  ID
                </TableHead>
                <TableHead className="text-lg font-medium">Name</TableHead>
                <TableHead className="text-lg font-medium">Phone</TableHead>
                <TableHead className="text-lg font-medium">Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="text-lg">{applicant.id}</TableCell>
                    <TableCell className="text-lg">{applicant.name}</TableCell>
                    <TableCell className="text-lg">{applicant.phone}</TableCell>
                    <TableCell className="text-lg">
                      {applicant.address}
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
    </>
  );
}
