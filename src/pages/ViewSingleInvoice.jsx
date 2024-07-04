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
import Footer from "@/components/Footer";

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 110], // Initial format, will be adjusted later
    });

    doc.setFont("Arial");

    let y = 5; // Reduced initial Y position
    doc.setFontSize(12);
    doc.text("Sarathi Book Shop", 40, y, null, null, "center");
    y += 5; // Reduced spacing
    doc.setFontSize(10);
    doc.text("Near School,Wellawa.", 40, y, null, null, "center");
    y += 4; // Reduced spacing
    doc.text("Tel: 037 223 5377", 40, y, null, null, "center");
    y += 6; // Reduced spacing
    doc.setFontSize(8); // Reduced font size for details

    // Get the current date and time
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD format
    const time = now.toTimeString().split(" ")[0]; // HH:MM:SS format

    doc.text(`Invoice No: ${invoice.id}`, 5, y);
    y += 4;
    doc.text(`Date: ${date}`, 5, y);
    y += 4;
    doc.text(`Time: ${time}`, 5, y);
    y += 4;
    // doc.text(`User: ADMIN`, 5, y);
    // y += 4;
    doc.text(`Customer: CASH CUSTOMER`, 5, y);
    y += 6; // Reduced spacing before table

    const tableData = invoiceItems.map((item) => [
      item.quantity,
      // item.items.name,
      item.items.name.length > 10
        ? item.items.name.substring(0, 15)
        : item.items.name,
      item.price,
      item.discount_type === "value"
        ? item.discount_amount
        : `${item.discount_amount}%`,
      calculateItemTotal(item),
    ]);

    doc.autoTable({
      startY: y,
      head: [["QTY", "DESC", "RATE", "DISC", "AMOUNT"]],
      body: tableData,
      theme: "plain",
      headStyles: { fillColor: [255, 255, 255], textColor: 0, fontSize: 6 },
      bodyStyles: { fontSize: 7 },
      styles: { cellPadding: 0.5, minCellHeight: 4, halign: "center" },
      margin: { left: 5, right: 5 }, // Center the table
      columnStyles: {
        0: { cellWidth: 7 }, // Quantity
        1: { cellWidth: 30 }, // Description
        2: { cellWidth: 10 }, // Rate
        3: { cellWidth: 7 }, // Discount
        4: { cellWidth: 13 }, // Amount
      },
    });

    y = doc.lastAutoTable.finalY + 5; // Reduced spacing after table
    doc.setFontSize(8); // Keep smaller font size for summary
    const summaryTexts = [
      `SUB TOTAL: ${invoice.subtotal} LKR`,
      `DISCOUNT: ${invoice.subtotal - invoice.total_amount} LKR`,
      `NET TOTAL: ${invoice.total_amount} LKR`,
    ];

    summaryTexts.forEach((text) => {
      doc.text(text, 5, y);
      y += 3.5; // Reduced line spacing
    });

    y += 3; // Small space before final text
    doc.setFontSize(9);
    doc.text("THANK YOU COME AGAIN !!!", 40, y, null, null, "center");

    // Calculate the final height dynamically
    const finalHeight = y + 5; // Minimal bottom padding

    // Update the document format with the new height
    const pages = doc.internal.pages;
    pages.splice(0, 1, {
      id: pages.id,
      width: pages.width,
      height: finalHeight,
    });

    // doc.save("invoice.pdf");
    doc.output("dataurlnewwindow");
  };

  if (loading) return <Spinner loading={loading} />;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <>
      <MenuBar />

      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Invoice No.{invoice.id}</h1>
          <Button
            className="bg-print-green hover:bg-print-green"
            onClick={handleDownloadPDF}
          >
            Download Invoice
          </Button>
        </div>

        <Card className="mb-6 bg-invoice-green">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Sub Total : {invoice.subtotal}
            </h2>
            <h2 className="text-xl font-semibold">
              Invoice Discount : {invoice.subtotal - invoice.total_amount} LKR
            </h2>
            <h2 className="text-xl font-semibold">
              Total : {invoice.total_amount} LKR
            </h2>
          </CardHeader>
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
                <TableCell className="font-semibold">
                  {item.items.name}
                </TableCell>
                <TableCell className="font-semibold">{item.price}</TableCell>
                <TableCell className="font-semibold">{item.quantity}</TableCell>
                <TableCell className="font-semibold">
                  {item.discount_type}
                </TableCell>
                <TableCell className="font-semibold">
                  {item.discount_amount}
                </TableCell>
                <TableCell className="font-semibold">
                  {calculateItemTotal(item)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
