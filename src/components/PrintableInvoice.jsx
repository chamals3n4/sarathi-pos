export default function PrintableInvoice({ invoice, customer, invoiceItems }) {
  return (
    <div className="printable-invoice">
      <h2>Invoice #{invoice.id}</h2>
      <p>Customer: {customer.name}</p>
      <p>Email: {customer.email}</p>

      {invoiceItems.map((item) => (
        <div key={item.id}>
          <p>
            {item.items.name} x {item.quantity}
          </p>
          <p>Price: {item.price} LKR</p>
        </div>
      ))}

      <p>Subtotal: {invoice.subtotal} LKR</p>
      <p>Discount: {invoice.subtotal - invoice.total_amount} LKR</p>
      <p>Total: {invoice.total_amount} LKR</p>
    </div>
  );
}
