import supabase from "@/supabaseClient";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";

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
import NavMenuForRoutes from "@/components/NavMenuForRoutes";
import MenuBar from "@/components/MenuBar";
import { Button } from "@/components/ui/button";

export default function InvoicePDF() {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const [invoiceResponse, itemsResponse] = await Promise.all([
          supabase
            .from("invoices")
            .select("*, customers(name,phone,address)")
            .eq("id", id)
            .single(),
          supabase
            .from("invoice_items")
            .select("*,items(name)")
            .eq("invoice_id", id),
        ]);

        if (invoiceResponse.error) {
          console.log("Error fetching invoice:", invoiceResponse.error.message);
        } else if (itemsResponse.error) {
          console.log(
            "Error fetching invoice items:",
            itemsResponse.error.message
          );
        } else {
          setInvoice({
            ...invoiceResponse.data,
            items: itemsResponse.data,
          });
        }
      } catch (error) {
        console.log("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Spinner />;
  }

  if (!invoice || !invoice.customers) {
    return (
      <div className="pt-16 pr-24 pl-24 pb-24">
        <p>No invoice data available</p>
      </div>
    );
  }

  return (
    <>
      <div className="no-print">
        <MenuBar />
      </div>

      <div className="pt-16 pr-24 pl-24 pb-24">
        <style>
          {`
          @media print {
            body {
              width: 80mm;
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
            #invoice-content {
              width: 80mm;
              font-size: 12px;
            }
            h2 {
              font-size: 16px;
            }
            .text-lg {
              font-size: 12px;
            }
            .text-sm {
              font-size: 10px;
            }
            .pb-10 {
              padding-bottom: 5mm;
            }
            .pl-4 {
              padding-left: 2mm;
            }
          }
        `}
        </style>

        <div id="invoice-content">
          <div className="mx-auto max-w-2xl pb-10 pl-4 lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sarathi Book Shop
            </h2>
            <p className="mt-5 text-base leading-6 text-gray-600">
              Customer Name: {invoice.customers.name} <br className="mb-0.5" />
              Phone Number: {invoice.customers.phone} <br className="mb-0.5" />
              Address: {invoice.customers.address}
            </p>
          </div>
          <Table>
            <TableCaption className="text-sm">
              Thank You, Come Again
            </TableCaption>
            <TableCaption>Contact us - 0717110160</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg font-medium">Item Name</TableHead>
                <TableHead className="text-lg font-medium">Qty</TableHead>
                <TableHead className="text-lg font-medium">Rate</TableHead>
                <TableHead className="text-lg font-medium">Discount</TableHead>
                <TableHead className="text-lg font-medium">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-lg">{item.items.name}</TableCell>
                    <TableCell className="text-lg">{item.quantity}</TableCell>
                    <TableCell className="text-lg">{item.price}</TableCell>
                    <TableCell className="text-lg">
                      {item.quantity * item.price}
                    </TableCell>
                    <TableCell className="text-lg">
                      {invoice.discount_amount}
                    </TableCell>
                    <TableCell className="text-lg">
                      {invoice.total_amount}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No items available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-lg font-bold">
                  {invoice.items
                    ? invoice.items.reduce(
                        (sum, item) => sum + item.quantity * item.price,
                        0
                      )
                    : 0}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="flex justify-end mt-5 no-print">
          <Button onClick={handlePrint}>Print as PDF</Button>
        </div>
      </div>
    </>
  );
}
