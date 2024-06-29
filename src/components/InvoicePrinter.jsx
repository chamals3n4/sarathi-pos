// InvoicePrinter.js
import { Printer, Text, Line, Row, render } from "react-thermal-printer";

export async function generateInvoicePrintData(
  invoice,
  customer,
  invoiceItems
) {
  const receipt = (
    <Printer type="epson" width={42}>
      <Text size={{ width: 2, height: 2 }} align="center">
        Invoice #{invoice.id}
      </Text>
      <Line />
      <Text bold={true}>Customer Details:</Text>
      <Text>{customer.name}</Text>
      <Text>{customer.email}</Text>
      <Line />
      <Text bold={true}>Items:</Text>
      {invoiceItems.map((item) => (
        <Row
          key={item.id}
          left={`${item.items.name} x${item.quantity}`}
          right={`${item.price * item.quantity} LKR`}
        />
      ))}
      <Line />
      <Row left="Subtotal" right={`${invoice.subtotal} LKR`} />
      <Row
        left="Discount"
        right={`${invoice.subtotal - invoice.total_amount} LKR`}
      />
      <Row left="Total" right={`${invoice.total_amount} LKR`} />
      <Line />
      <Text align="center">Thank you for your business!</Text>
    </Printer>
  );

  try {
    const data = await render(receipt);
    return data;
  } catch (error) {
    console.error("Error rendering invoice:", error);
    throw error;
  }
}
