import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/Spinner";
import { GalleryHorizontalEnd } from "lucide-react";
import MenuBar from "@/components/MenuBar";
import Switch from "@/components/Swith";

export default function ViewAllInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchaInvoices() {
      try {
        const { data, error } = await supabase
          .from("invoices")
          .select("*,customers(name)")
          .order("id", { ascending: true });
        if (error) {
          console.log("Error fetching data:", error.message);
        } else {
          setInvoices(data || []);
        }
      } catch (error) {
        console.log("Error fetching data", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchaInvoices();
  }, []);

  function formatDate(dateString) {
    return dateString.split("T")[0];
  }

  return (
    <>
      <div className="overflow-hidden bg-white py-24 pr-36 pl-36 mb-10 sm:py-16">
        <MenuBar />
        <div className="pb-10 flex items-center space-x-4">
          <div className="text-white text-2xl w-[50px] h-[50px] bg-choreo-blue rounded-[10px] flex items-center justify-center">
            <GalleryHorizontalEnd className="w-[25px] h-[25px]" />
          </div>
          <h1 className="text-3xl text-sarathi-text font-bold">
            View All Invoices
          </h1>
        </div>
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg font-medium">
                  Customer Name
                </TableHead>
                <TableHead className="text-lg font-medium">
                  Total Amount
                </TableHead>
                <TableHead className="text-lg font-medium">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="text-lg">
                      {invoice.customers.name}
                    </TableCell>
                    <TableCell className="text-lg">
                      {invoice.total_amount}
                    </TableCell>
                    <TableCell className="text-lg">
                      {formatDate(invoice.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No invoices found
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
