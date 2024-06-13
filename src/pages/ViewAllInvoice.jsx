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
import Spinner from "@/components/Spinner";

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
  return (
    <>
      <div className="overflow-hidden bg-white py-24 pr-36 pl-36 mb-10 sm:py-16">
        <div className="pb-10">
          <h1 className="text-2xl font-bold">Manage All Invoices</h1>
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
                <TableHead className="text-lg font-medium">
                  Customer Name
                </TableHead>
                <TableHead className="text-lg font-medium">
                  Total Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="text-lg">{invoice.id}</TableCell>
                    <TableCell className="text-lg">
                      {invoice.customers.name}
                    </TableCell>
                    <TableCell className="text-lg">
                      {invoice.total_amount}
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
