import { useState, useEffect } from "react";
import supabase from "@/supabaseClient";
import { Input } from "@/components/ui/input";
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

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

export default function CreateNewInvoice() {
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);

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

    async function fetchCustomers() {
      try {
        const { data, error } = await supabase.from("customers").select("*");
        if (error) {
          console.log("Error fetching data :", error.message);
        } else {
          setCustomers(data || []);
        }
      } catch (error) {
        console.log("Error fetching data:", error.message);
      }
    }

    fetchItems();
    fetchCustomers();
  }, []);

  return (
    <>
      <div className="pt-20 pl-40">
        <Input
          type="text"
          className="w-[500px] my-3"
          placeholder="Start typing item name"
        />

        <div className="flex">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Akon</TableCell>
                  <TableCell>
                    <Input className="w-14 h-8 rounded-sm" />
                  </TableCell>
                  <TableCell>
                    <Input className="w-14 h-8 rounded-sm" />
                  </TableCell>
                  <TableCell>
                    <Input className="w-14 h-8 rounded-sm" />
                  </TableCell>
                  <TableCell>
                    <Input className="w-14 h-8 rounded-sm" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex-1">
            <Card className="w-[450px]">
              <CardHeader>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="email" placeholder="Search Customer" />
                  <Button className="bg-choreo-blue" type="submit">
                    New Customer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex">
                      <h1 className="flex-1">Sub Total</h1>
                      <h1 className="flex-1">1000 LKR</h1>
                    </div>
                    <div className="flex">
                      <h1 className="flex-1">Discount</h1>
                      <h1 className="flex-1">0 LKR</h1>
                    </div>
                    <Separator />
                    <div className="flex">
                      <h1 className="flex-1">Total</h1>
                      <h1 className="flex-1">1000 LKR</h1>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-choreo-blue">Finish & Create</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
