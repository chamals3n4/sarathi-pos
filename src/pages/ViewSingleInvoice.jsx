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

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 110], // Initial format, will be adjusted later
    });
    let y = 5; // Reduced initial Y position
    doc.setFontSize(12);
    doc.text("Sarathi Book Shop", 40, y, null, null, "center");
    y += 5; // Reduced spacing
    doc.setFontSize(10);
    doc.text("Near School,Wellawa.", 40, y, null, null, "center");
    y += 4; // Reduced spacing
    doc.text("Tel: 037-2235377", 40, y, null, null, "center");
    y += 6; // Reduced spacing
    doc.setFontSize(8); // Reduced font size for details
    doc.text(`Invoice No: 000001`, 5, y);
    y += 4;
    doc.text(`Date: 2024-02-23`, 5, y);
    y += 4;
    doc.text(`Time: 22:53:57 PM`, 5, y);
    y += 4;
    // doc.text(`User: ADMIN`, 5, y);
    // y += 4;
    doc.text(`Customer: CASH CUSTOMER`, 5, y);
    y += 6; // Reduced spacing before table

    doc.autoTable({
      startY: y,
      head: [["QTY", "DESC", "RATE", "DISC", "AMOUNT"]],
      body: [["5", "Atlas Chooty T", "25", "10", "115", "200.00"]],
      theme: "grid",
      headStyles: { fillColor: [255, 255, 255], textColor: 0, fontSize: 6 },
      bodyStyles: { fontSize: 6 },
      styles: { cellPadding: 0.5, minCellHeight: 4, halign: "center" },
      margin: { left: 10, right: 10 }, // Center the table
      columnStyles: {
        0: { cellWidth: 7 }, // Description
        2: { cellWidth: 7 }, // Quantity
        3: { cellWidth: 10 }, // Rate
        4: { cellWidth: 7 }, // Discount
        5: { cellWidth: 13 }, // Amount
      },
    });

    y = doc.lastAutoTable.finalY + 5; // Reduced spacing after table
    doc.setFontSize(8); // Keep smaller font size for summary
    const summaryTexts = [
      "SUB TOTAL: 200.00",
      "DISCOUNT: 0.00",
      "NET TOTAL: 200.00",
      "PAID AMOUNT: 200.00",
      "BALANCE: 0.00",
      "DUE AMOUNT: 0.00",
      "Total Discount: 0.00",
      "No of Items: 1",
      "No of Pcs: 2.00",
    ];

    summaryTexts.forEach((text) => {
      doc.text(text, 5, y);
      y += 3.5; // Reduced line spacing
    });

    y += 3; // Small space before final text
    doc.setFontSize(9);
    doc.text("THANK YOU COME AGAIN!!!", 40, y, null, null, "center");

    // Calculate the final height dynamically
    const finalHeight = y + 5; // Minimal bottom padding

    // Update the document format with the new height
    const pages = doc.internal.pages;
    pages[1].splice(0, 1, {
      id: pages[1][0].id,
      width: pages[1][0].width,
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
          <h1 className="text-2xl font-bold">Invoice #{invoice.id}</h1>
          <Button onClick={handleDownloadPDF}>Download Invoice</Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Customer Name : {customer.name}
            </h2>
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
