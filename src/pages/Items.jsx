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

import Items from "./Items";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { PersonStanding } from "lucide-react";

export default function Customers() {
  const [items, setItems] = useState([]);

  const [categories, setCategories] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQty, setItemQty] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase.from("items").select("*");

        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setItems(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
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
      category_id: categoryId,
    };

    try {
      const { data, error } = await supabase
        .from("items")
        .insert([newItem])
        .select();
      if (error) {
        console.log("Error inserting data", error.message);
      } else {
        console.log("Data inserted successfully", data);
      }
    } catch (error) {
      console.log("Error inserting data", error.message);
    }
    return navigate("/items");
  };

  return (
    <>
      <div className="overflow-hidden bg-white py-24 pr-36 pl-36 mb-10 sm:py-16">
        <div className="right-20 pb-6">
          <div className="pb-10">
            <h1 className="text-2xl font-bold">Items Management</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Item</Button>
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
                    <Label htmlFor="qty" className="text-right">
                      Category
                    </Label>
                    <Switch />
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
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Item Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.category_id}</TableCell>
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
      </div>
    </>
  );
}
