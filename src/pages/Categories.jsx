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

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [categoryName, setCategoryName] = useState("");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from("categories").select("*");

        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCategory = {
      name: categoryName,
    };

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([newCategory])
        .select();
      if (error) {
        console.log("Error inserting data", error.message);
      } else {
        console.log("Data inserted successfully", data);
      }
    } catch (error) {
      console.log("Error inserting data", error.message);
    }
    return navigate("/categories");
  };

  return (
    <>
      <div className="overflow-hidden bg-white py-24 pr-36 pl-36 mb-10 sm:py-16">
        <div className="right-20 pb-6">
          <div className="pb-10">
            <h1 className="text-2xl font-bold">Category Management</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
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
                <TableHead className="w-[200px] text-lg">ID</TableHead>
                <TableHead className="text-lg">Category Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="text-lg">{category.id}</TableCell>
                    <TableCell className="text-lg">{category.name}</TableCell>
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
