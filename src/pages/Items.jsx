import { useState, useEffect } from "react";
import supabase from "@/supabaseClient";
import { TableDemo } from "@/components/Table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import Items from "./Items";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import Spinner from "@/components/Spinner";
import NavMenuForRoutes from "@/components/NavMenuForRoutes";
import { ListChecks } from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuBar from "@/components/MenuBar";
import { ToastDescription } from "@radix-ui/react-toast";

export default function Customers() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQty, setItemQty] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [currentItem, setCurrentItem] = useState(null); // State to store the current item being edited

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*,categories(name)")
          .order("id", { ascending: true });
        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setItems(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

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

    fetchItems();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newItem = {
      name: itemName,
      price: parseFloat(itemPrice),
      qty: itemQty,
      category_id: selectedCategoryId,
    };

    try {
      const { data, error } = await supabase
        .from("items")
        .insert([newItem])
        .select();
      if (error) {
        console.log("Error inserting data", error.message);
        toast.error("Error Inserting Item");
      } else {
        console.log("Data inserted successfully", data);
        toast.success("Item Created Successfully");
      }
    } catch (error) {
      console.log("Error inserting data", error.message);
      toast.error("Error Inserting Item");
    }
    return navigate("/items");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedItem = {
      name: itemName,
      price: parseFloat(itemPrice),
      qty: itemQty,
      category_id: selectedCategoryId,
    };

    try {
      const { data, error } = await supabase
        .from("items")
        .update(updatedItem)
        .eq("id", currentItem.id)
        .select();
      if (error) {
        console.log("Error updating data", error.message);
        toast.error("Error Updating Item");
      } else {
        console.log("Data updated successfully", data);
        toast.success("Item Updated Successfully");
      }
    } catch (error) {
      console.log("Error updating data", error.message);
      toast.error("Error Updating Item");
    }
    return navigate("/items");
  };

  return (
    <>
      <ToastContainer />
      <div className="overflow-hidden bg-white py-24 pr-36 pl-36 mb-10 sm:py-16">
        <MenuBar />
        <div className="right-20 pb-6">
          <div className="pb-10 flex items-center space-x-4">
            <div className="text-white text-2xl w-[50px] h-[50px] bg-choreo-blue rounded-[10px] flex items-center justify-center">
              <ListChecks className="w-[25px] h-[25px]" />
            </div>
            <h1 className="text-3xl text-sarathi-text font-bold">
              Manage Items
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-choreo-blue">Add New Item</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input
                      id="price"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="qty" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="qty"
                      value={itemQty}
                      onChange={(e) => setItemQty(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <div className="col-span-3">
                      <select
                        id="category"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="col-span-12 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sarathi-text sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
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
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-lg font-medium">
                  ID
                </TableHead>
                <TableHead className="text-lg font-medium">Name</TableHead>
                <TableHead className="text-lg font-medium">Price</TableHead>
                <TableHead className="text-lg font-medium">Quantity</TableHead>
                <TableHead className="text-lg font-medium">
                  Item Category
                </TableHead>
                <TableHead className="text-lg font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-lg">{item.id}</TableCell>
                    <TableCell className="text-lg">{item.name}</TableCell>
                    <TableCell className="text-lg">{item.price}</TableCell>
                    <TableCell className="text-lg">{item.qty}</TableCell>
                    <TableCell className="text-lg">
                      {item.categories.name}
                    </TableCell>
                    <TableCell className="text-lg">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-update-green h-8"
                            onClick={() => {
                              setCurrentItem(item);
                              setItemName(item.name);
                              setItemPrice(item.price);
                              setItemQty(item.qty);
                              setSelectedCategoryId(item.category_id);
                            }}
                          >
                            Update Item
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Update the Item</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpdate}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  value={itemName}
                                  onChange={(e) => setItemName(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                  Price
                                </Label>
                                <Input
                                  id="price"
                                  value={itemPrice}
                                  onChange={(e) => setItemPrice(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="qty" className="text-right">
                                  Quantity
                                </Label>
                                <Input
                                  id="qty"
                                  value={itemQty}
                                  onChange={(e) => setItemQty(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="category"
                                  className="text-right"
                                >
                                  Category
                                </Label>
                                <div className="col-span-3">
                                  <select
                                    id="category"
                                    value={selectedCategoryId}
                                    onChange={(e) =>
                                      setSelectedCategoryId(e.target.value)
                                    }
                                    className="col-span-12 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sarathi-text sm:max-w-xs sm:text-sm sm:leading-6"
                                  >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                      <option
                                        key={category.id}
                                        value={category.id}
                                      >
                                        {category.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  type="submit"
                                  className="bg-update-green"
                                >
                                  Save Changes
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
                  <TableCell colSpan={5} className="text-center">
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
