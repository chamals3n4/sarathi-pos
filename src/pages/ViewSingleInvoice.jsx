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
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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

  const generatePDF = () => {
    const doc = new jsPDF({
      unit: "mm",
      format: [30, 297], // 30mm width, adjust height as needed
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 1; // 1mm margin on each side
    const contentWidth = pageWidth - 2 * margin;

    // Set font size
    doc.setFontSize(6);

    // Center-aligned text function
    const centerText = (text, y) => {
      const textWidth =
        (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const textOffset = (contentWidth - textWidth) / 2;
      doc.text(text, margin + textOffset, y);
    };

    centerText("Sarathi Book Shop", 3, 8);

    // Add invoice header
    // centerText(`Sarathi Book Shop`);
    centerText(`Invoice #${invoice.id}`, 3);
    centerText(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 6);

    // Add customer details
    if (customer) {
      centerText(`${customer.name}`, 9);
    }

    // Add items table
    doc.autoTable({
      startY: 12,
      head: [["Item", "Qty", "Total"]],
      body: invoiceItems.map((item) => [
        item.items.name,
        item.quantity,
        calculateItemTotal(item).toFixed(2),
      ]),
      styles: { fontSize: 5, cellPadding: 0.5, halign: "left" },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 5, halign: "center" },
        2: { cellWidth: 8, halign: "right" },
      },
      margin: { left: margin, right: margin },
    });

    // Add totals
    let finalY = doc.lastAutoTable.finalY + 1;
    doc.setFontSize(5);
    doc.text(`Subtotal: ${invoice.subtotal.toFixed(2)} LKR`, margin, finalY);
    doc.text(
      `Discount: ${(invoice.subtotal - invoice.total_amount).toFixed(2)} LKR`,
      margin,
      finalY + 2
    );
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text(
      `Total: ${invoice.total_amount.toFixed(2)} LKR`,
      margin,
      finalY + 4
    );

    // Save the PDF
    doc.save(`invoice_${invoice.id}.pdf`);
  };

  if (loading) return <Spinner loading={loading} />;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <>
      <MenuBar />

      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Invoice #{invoice.id}</h1>
          <Button onClick={generatePDF}>Print Invoice</Button>
        </div>

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
