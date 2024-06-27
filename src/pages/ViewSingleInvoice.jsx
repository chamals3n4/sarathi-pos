import React, { useState, useEffect } from "react";
import supabase from "@/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/Spinner";
import { useParams } from "react-router-dom";
import MenuBar from "@/components/MenuBar";

export default function ViewSingleInvoice() {
  const [invoice, setInvoice] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function fetchInvoiceData() {
      try {
        const [invoiceResponse, itemsResponse] = await Promise.all([
          supabase.from("invoices").select("*").eq("id", id).single(),
          supabase
            .from("invoice_items")
            .select("*, items(*)")
            .eq("invoice_id", id),
        ]);

        if (invoiceResponse.error) throw invoiceResponse.error;
        if (itemsResponse.error) throw itemsResponse.error;

        setInvoice(invoiceResponse.data);
        setInvoiceItems(itemsResponse.data);

        // Fetch customer data
        if (invoiceResponse.data.customer_id) {
          const { data: customerData, error: customerError } = await supabase
            .from("customers")
            .select("*")
            .eq("id", invoiceResponse.data.customer_id)
            .single();

          if (customerError) throw customerError;
          setCustomer(customerData);
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoiceData();
  }, [id]);

  const calculateItemDiscount = (item) => {
    if (item.discount_type === "value") {
      return Math.min(item.discount_amount, item.price * item.quantity);
    } else {
      return item.price * item.quantity * (item.discount_amount / 100);
    }
  };

  const calculateItemTotal = (item) => {
    return item.price * item.quantity - calculateItemDiscount(item);
  };

  if (loading) return <Spinner loading={loading} />;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <>
      <MenuBar />

      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Invoice #{invoice.id}</h1>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Customer Details</h2>
          </CardHeader>
          <CardContent>
            {customer && (
              <>
                <p>
                  <strong>Name:</strong> {customer.name}
                </p>
                <p>
                  <strong>Email:</strong> {customer.email}
                </p>
                {/* Add more customer details as needed */}
              </>
            )}
          </CardContent>
        </Card>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Discount Type</TableHead>
              <TableHead>Discount Amount</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.items.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.discount_type}</TableCell>
                <TableCell>{item.discount_amount}</TableCell>
                <TableCell>{calculateItemTotal(item)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Card className="mt-6 w-[350px] ml-auto">
          <CardContent className="pt-6">
            <div className="grid w-full items-center gap-4">
              <div className="flex">
                <h1 className="flex-1">Sub Total</h1>
                <h1 className="flex-1">{invoice.subtotal} LKR</h1>
              </div>
              <Separator />
              <div className="flex">
                <h1 className="flex-1">Invoice Discount</h1>
                <h1 className="flex-1">
                  {invoice.subtotal - invoice.total_amount} LKR
                </h1>
              </div>
              <Separator />
              <div className="flex">
                <h1 className="flex-1">Total</h1>
                <h1 className="flex-1">{invoice.total_amount} LKR</h1>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
