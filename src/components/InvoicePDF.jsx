import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
});

const calculateItemTotal = (price, quantity, discountType, discountAmount) => {
  const discount =
    discountType === "value"
      ? Math.min(discountAmount, price * quantity)
      : price * quantity * (discountAmount / 100);
  return price * quantity - discount;
};

const InvoicePDF = () => {
  const invoice = {
    id: 1,
    created_at: "2024-06-29T12:34:56Z",
    subtotal: 1000,
    total_amount: 950,
  };

  const customer = {
    name: "John Doe",
  };

  const invoiceItems = [
    {
      id: 1,
      items: { name: "Atlas Chooty T" },
      price: 25,
      quantity: 2,
      discount_type: "percentage",
      discount_amount: 0,
    },
    {
      id: 2,
      items: { name: "Notebook" },
      price: 50,
      quantity: 1,
      discount_type: "value",
      discount_amount: 5,
    },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Wimalasiri Shoe Shop</Text>
          <Text>No: 245, IDH Road, Kotikawatta</Text>
        </View>
        <View style={styles.section}>
          <Text>Invoice #: {invoice.id}</Text>
          <Text>Date: {new Date(invoice.created_at).toLocaleDateString()}</Text>
          <Text>User: ADMIN</Text>
          <Text>Customer: {customer.name}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bold}>Description</Text>
          {invoiceItems.map((item) => (
            <View style={styles.row} key={item.id}>
              <Text>{item.items.name}</Text>
              <Text>
                {item.price} x {item.quantity}
              </Text>
              <Text>
                {calculateItemTotal(
                  item.price,
                  item.quantity,
                  item.discount_type,
                  item.discount_amount
                )}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Sub Total</Text>
            <Text>{invoice.subtotal} LKR</Text>
          </View>
          <View style={styles.row}>
            <Text>Invoice Discount</Text>
            <Text>{invoice.subtotal - invoice.total_amount} LKR</Text>
          </View>
          <View style={styles.row}>
            <Text>Total</Text>
            <Text>{invoice.total_amount} LKR</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
