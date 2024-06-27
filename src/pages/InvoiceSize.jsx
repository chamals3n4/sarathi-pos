import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoiceSize() {
  const printInvoice = () => {
    const invoiceDiv = document.getElementById("invoiceDiv");
    html2canvas(invoiceDiv).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, (canvas.height * 80) / canvas.width],
      });
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        80,
        (canvas.height * 80) / canvas.width
      );
      pdf.save("invoice.pdf");
    });
  };

  return (
    <>
      <div
        className="bg-white p-4 rounded-md shadow-md w-[80mm]"
        id="invoiceDiv"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Sarathi Book Shop</h2>
            <p className="text-sm text-muted-foreground">Invoice #SRT-001</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Cash</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm">June 26, 2024</p>
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-muted">
              <th className="text-left text-sm font-medium pb-2">
                Description
              </th>
              <th className="text-right text-sm font-medium pb-2">Qty</th>
              <th className="text-right text-sm font-medium pb-2">
                Unit Price
              </th>
              <th className="text-right text-sm font-medium pb-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-muted">
              <td className="text-sm py-2">Product A</td>
              <td className="text-right text-sm py-2">2</td>
              <td className="text-right text-sm py-2">$10.00</td>
              <td className="text-right text-sm py-2">$20.00</td>
            </tr>
            <tr className="border-b border-muted">
              <td className="text-sm py-2">Product A</td>
              <td className="text-right text-sm py-2">1</td>
              <td className="text-right text-sm py-2">$50.00</td>
              <td className="text-right text-sm py-2">$50.00</td>
            </tr>
            <tr className="border-b border-muted">
              <td className="text-sm py-2">Product A</td>
              <td className="text-right text-sm py-2">1</td>
              <td className="text-right text-sm py-2">$50.00</td>
              <td className="text-right text-sm py-2">$50.00</td>
            </tr>
            <tr className="border-b border-muted">
              <td className="text-sm py-2">Product A</td>
              <td className="text-right text-sm py-2">1</td>
              <td className="text-right text-sm py-2">$50.00</td>
              <td className="text-right text-sm py-2">$50.00</td>
            </tr>
            <tr className="border-b border-muted">
              <td className="text-sm py-2">Product A</td>
              <td className="text-right text-sm py-2">1</td>
              <td className="text-right text-sm py-2">$50.00</td>
              <td className="text-right text-sm py-2">$50.00</td>
            </tr>
            <tr className="border-b border-muted">
              <td className="text-sm py-2">Product A</td>
              <td className="text-right text-sm py-2">1</td>
              <td className="text-right text-sm py-2">$50.00</td>
              <td className="text-right text-sm py-2">$50.00</td>
            </tr>
            <tr className="border-b border-muted">
              <td className="text-sm py-2">Product A</td>
              <td className="text-right text-sm py-2">1</td>
              <td className="text-right text-sm py-2">$50.00</td>
              <td className="text-right text-sm py-2">$50.00</td>
            </tr>
            <tr className="border-b border-muted">
              <td className="text-sm py-2">Product A</td>
              <td className="text-right text-sm py-2">1</td>
              <td className="text-right text-sm py-2">$50.00</td>
              <td className="text-right text-sm py-2">$50.00</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 text-right">
          <p className="text-sm font-medium">Total: $70.00</p>
        </div>
      </div>
      <button
        onClick={printInvoice}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Download Invoice
      </button>
    </>
  );
}
