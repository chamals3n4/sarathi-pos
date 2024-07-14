import { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Spinner from "@/components/Spinner";
import { ListOrdered, Plus } from "lucide-react";
import MenuBar from "@/components/MenuBar";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function ViewAllInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceNumbers, setInvoiceNumbers] = useState([""]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

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

  const handleRowClick = (invoiceId) => {
    // Ensure we always navigate to the correct path
    const basePath = "/view-invoices/";
    const newPath = `${basePath}${invoiceId}`;

    // Check if we're already on a view-invoices path
    if (location.pathname.startsWith(basePath)) {
      // If so, replace the current route
      navigate(newPath, { replace: true });
    } else {
      // If not, push a new route
      navigate(newPath);
    }
  };

  const addInvoiceNumber = () => {
    setInvoiceNumbers([...invoiceNumbers, ""]);
  };

  const handleInvoiceNumberChange = (index, value) => {
    const newInvoiceNumbers = [...invoiceNumbers];
    newInvoiceNumbers[index] = value;
    setInvoiceNumbers(newInvoiceNumbers);
  };

  const printPDF = (invoicesToPrint) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 110], // Initial format, will be adjusted later
    });

    doc.setFont("Arial");

    let y = 5; // Initial Y position
    doc.setFontSize(12);
    doc.text("Sarathi Book Shop", 40, y, null, null, "center");
    y += 5;
    doc.setFontSize(10);
    doc.text("Near School,Wellawa.", 40, y, null, null, "center");
    y += 4;
    doc.text("Tel: 037 223 5377", 40, y, null, null, "center");
    y += 6;
    doc.setFontSize(8);

    // Get the current date and time
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD format
    const time = now.toTimeString().split(" ")[0]; // HH:MM:SS format

    doc.text(`Date: ${date}`, 5, y);
    y += 4;
    doc.text(`Time: ${time}`, 5, y);
    y += 6;

    doc.autoTable({
      startY: y,
      head: [["Invoice Number", "Total Amount"]],
      body: invoicesToPrint.map((invoice) => [
        invoice.id,
        `${invoice.total_amount} LKR`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: 0,
        fontSize: 6,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fontSize: 7,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      styles: {
        cellPadding: 0.5,
        minCellHeight: 4,
        halign: "center",
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      margin: { left: 5, right: 5 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 35 },
      },
    });

    y = doc.lastAutoTable.finalY + 5;

    // Calculate the total of all invoice totals
    const totalAmount = invoicesToPrint.reduce(
      (sum, invoice) => sum + invoice.total_amount,
      0
    );

    // Add the total amount after the table
    doc.setFontSize(8);
    doc.setFont("Arial", "bold");
    doc.text(`Total Amount: ${totalAmount.toFixed(2)} LKR`, 5, y);

    y += 6;

    doc.setFontSize(9);
    doc.setFont("Arial", "normal");
    doc.text("THANK YOU COME AGAIN !!!", 40, y, null, null, "center");

    // Calculate the final height dynamically
    const finalHeight = y + 5;

    // Update the document format with the new height
    const pages = doc.internal.pages;
    pages.splice(0, 1, {
      id: pages.id,
      width: pages.width,
      height: finalHeight,
    });

    doc.output("dataurlnewwindow");
  };

  const handleSaveInvoices = () => {
    const selected = invoices.filter((invoice) =>
      invoiceNumbers.includes(invoice.id.toString())
    );
    setSelectedInvoices(selected);
    printPDF(selected);
    setIsDialogOpen(false); // Close the dialog after saving and printing
  };

  return (
    <>
      <MenuBar />
      <div className="overflow-hidden bg-white py-24 pr-36 pl-36 mb-10 sm:py-16">
        <div className="pb-10 flex items-center space-x-4">
          <div className="text-white text-2xl w-[50px] h-[50px] bg-choreo-blue rounded-[10px] flex items-center justify-center">
            <ListOrdered className="w-[25px] h-[25px]" />
          </div>
          <h1 className="text-3xl text-sarathi-text font-bold">
            View All Invoices
          </h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">Select Invoices to Print</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter Invoice Numbers</DialogTitle>
              </DialogHeader>
              {invoiceNumbers.map((number, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={number}
                    onChange={(e) =>
                      handleInvoiceNumberChange(index, e.target.value)
                    }
                    placeholder="Invoice number"
                  />
                  {index === invoiceNumbers.length - 1 && (
                    <Button onClick={addInvoiceNumber} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button onClick={handleSaveInvoices}>Save</Button>
            </DialogContent>
          </Dialog>
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
                <TableHead className="text-lg font-medium">Sub Total</TableHead>
                <TableHead className="text-lg font-medium">Discount</TableHead>
                <TableHead className="text-lg font-medium">
                  Total Amount
                </TableHead>
                <TableHead className="text-lg font-medium">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    onClick={() => handleRowClick(invoice.id)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell className="text-lg">
                      {invoice.customers.name}
                    </TableCell>
                    <TableCell className="text-lg">
                      {invoice.subtotal}
                    </TableCell>
                    <TableCell className="text-lg">
                      {invoice.discount_amount}
                    </TableCell>
                    <TableCell className="text-lg">
                      {invoice.total_amount}
                    </TableCell>
                    <TableCell className="text-lg">
                      {formatDate(invoice.created_at)}
                    </TableCell>
                    <TableCell className="text-lg">
                      <Button className="bg-print-green h-8 hover:bg-print-green rounded-sm">
                        Print Invoice
                      </Button>
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
      <Footer />
    </>
  );
}
