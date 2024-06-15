import { useState, useEffect } from "react";
import supabase from "@/supabaseClient";
import { TableDemo } from "@/components/Table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import { Layers } from "lucide-react";
import MenuBar from "@/components/MenuBar";
import { ToastDescription } from "@radix-ui/react-toast";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [categoryName, setCategoryName] = useState("");

  const [currentCategory, setCurrentCategory] = useState(null);
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
        toast.success("Category Created Successfully");
      }
    } catch (error) {
      console.log("Error inserting data", error.message);
    }
    navigate("/categories");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedCategory = {
      name: categoryName,
    };

    try {
      const { data, error } = await supabase
        .from("categories")
        .update(updatedCategory)
        .eq("id", currentCategory.id)
        .select();
      if (error) {
        console.log("Error updating data");
        toast.error("Error Updating Category");
      } else {
        console.log("Data updated successfully");
        toast.success("Category Updated Successfully");
      }
    } catch (error) {
      console.log("Error updating data");
      toast.error("Error Updating Category");
    }
    return navigate("/category");
  };

  return (
    <>
      <ToastContainer />
      <div className="overflow-hidden bg-white py-24 pr-36 pl-36 mb-10 sm:py-16">
        <MenuBar />
        <div className="right-20 pb-6">
          <div className="pb-10 flex items-center space-x-4">
            <div className="text-white text-2xl w-[50px] h-[50px] bg-sarath-orange rounded-[10px] flex items-center justify-center">
              <Layers className="w-[25px] h-[25px]" />
            </div>
            <h1 className="text-3xl text-sarathi-text font-bold">
              Manage Categories
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-sarath-orange">Add New Category</Button>
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
                    <TableCell className="text-lg">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-sarath-orange"
                            onClick={() => {
                              setCurrentCategory(category);
                              setCategoryName(category.name);
                            }}
                          >
                            Update Category
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Update Category</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpdate}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  value={categoryName}
                                  onChange={(e) =>
                                    setCategoryName(e.target.value)
                                  }
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
