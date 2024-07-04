import { useState, useEffect, useRef } from "react";
import supabase from "@/supabaseClient";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast, ToastContainer } from "react-toastify";
import { Label } from "@radix-ui/react-label";
import Spinner from "@/components/Spinner";

import { useNavigate } from "react-router-dom";
import { Trash2, User, UserRound, X } from "lucide-react";
import MenuBar from "@/components/MenuBar";
import Footer from "@/components/Footer";

export default function CreateNewInvoice() {
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [itemFocusedIndex, setItemFocusedIndex] = useState(-1);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const [invoiceDiscountType, setInvoiceDiscountType] = useState("value");
  const [invoiceDiscountAmount, setInvoiceDiscountAmount] = useState(0);

  const customerInputRef = useRef(null);
  const itemInputRef = useRef(null);
  const qtyInputRef = useRef(null);

  const [activeSection, setActiveSection] = useState("customer");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [itemsResponse, customersResponse] = await Promise.all([
          supabase
            .from("items")
            .select("*,categories(name)")
            .order("id", { ascending: true }),
          supabase.from("customers").select("*"),
        ]);

        if (itemsResponse.error) throw itemsResponse.error;
        if (customersResponse.error) throw customersResponse.error;

        setItems(itemsResponse.data || []);
        setCustomers(customersResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleCustomerSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setFocusedIndex(-1);
    setIsCustomerDropdownOpen(true);
  };

  const handleItemSearchChange = (e) => {
    setItemSearchTerm(e.target.value);
    setItemFocusedIndex(-1);
    setIsItemDropdownOpen(true);
  };

  const handleCustomerSelect = (customerId, customerName) => {
    setSelectedCustomerId(customerId);
    setSearchTerm(customerName);
    setIsCustomerDropdownOpen(false);
  };

  const handleItemSelect = (item) => {
    setSelectedItems([
      ...selectedItems,
      {
        ...item,
        qty: 1,
        discountType: "value",
        discountAmount: 0,
      },
    ]);
    setItemSearchTerm("");
    setIsItemDropdownOpen(false);
  };

  const handleQuantityChange = (id, newQty) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === id ? { ...item, qty: parseInt(newQty) || 0 } : item
      )
    );
  };

  const handleItemDiscountTypeChange = (id, newType) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === id ? { ...item, discountType: newType } : item
      )
    );
  };

  const handleItemDiscountAmountChange = (id, newAmount) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === id
          ? { ...item, discountAmount: parseFloat(newAmount) || 0 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const calculateItemDiscount = (item) => {
    if (item.discountType === "value") {
      return Math.min(item.discountAmount, item.price * item.qty);
    } else {
      return item.price * item.qty * (item.discountAmount / 100);
    }
  };

  const calculateSubtotal = () => {
    return selectedItems.reduce(
      (total, item) =>
        total + item.price * item.qty - calculateItemDiscount(item),
      0
    );
  };

  const calculateInvoiceDiscount = () => {
    const subtotal = calculateSubtotal();
    if (invoiceDiscountType === "value") {
      return Math.min(invoiceDiscountAmount, subtotal);
    } else {
      return subtotal * (invoiceDiscountAmount / 100);
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateInvoiceDiscount();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      toast.error("Please select a customer");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const invoiceData = {
      customer_id: selectedCustomerId,
      subtotal: calculateSubtotal(),
      total_amount: calculateTotal(),
      discount_type: invoiceDiscountType,
      discount_amount: invoiceDiscountAmount,
    };

    try {
      // Check and update item quantities before creating the invoice
      for (const selectedItem of selectedItems) {
        const { data: currentItemData, error: fetchError } = await supabase
          .from("items")
          .select("qty")
          .eq("id", selectedItem.id)
          .single();

        if (fetchError) throw fetchError;

        const newQty = currentItemData.qty - selectedItem.qty;
        if (newQty < 0) {
          toast.error(`Not enough quantity for item: ${selectedItem.name}`);
          return;
        }
      }

      const { data, error } = await supabase
        .from("invoices")
        .insert([invoiceData])
        .select();

      if (error) throw error;

      const invoiceId = data[0].id;

      const invoiceItemsData = selectedItems.map((item) => ({
        invoice_id: invoiceId,
        item_id: item.id,
        quantity: item.qty,
        price: item.price,
        discount_type: item.discountType,
        discount_amount: item.discountAmount,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItemsData);

      if (itemsError) throw itemsError;

      // Update item quantities
      for (const item of selectedItems) {
        const { data: currentItemData, error: fetchError } = await supabase
          .from("items")
          .select("qty")
          .eq("id", item.id)
          .single();

        if (fetchError) throw fetchError;

        const newQty = currentItemData.qty - item.qty;
        if (newQty < 0) {
          toast.error(`Not enough quantity for item: ${item.name}`);
          return;
        }

        const { error: updateError } = await supabase
          .from("items")
          .update({ qty: newQty })
          .eq("id", item.id);

        if (updateError) throw updateError;

        if (newQty === 0) {
          toast.error(`Item ${item.name} is now out of stock.`);
        }
      }

      toast.success("Invoice created successfully");

      // Reset form
      setSelectedCustomerId(null);
      setSearchTerm("");
      setSelectedItems([]);
      setInvoiceDiscountType("value");
      setInvoiceDiscountAmount(0);

      setTimeout(() => {
        navigate(`/view-invoices/${invoiceId}`);
      }, 1000);
    } catch (error) {
      console.error("Error creating invoice:", error.message);
      toast.error("Error creating invoice");
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase())
  );

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  const handleGlobalKeyDown = (e) => {
    if (e.key === "c" || e.key === "C") {
      e.preventDefault();
      setActiveSection("customer");
      customerInputRef.current?.focus();
    } else if (e.key === "i" || e.key === "I") {
      e.preventDefault();
      setActiveSection("item");
      itemInputRef.current?.focus();
    } else if (e.key === "q" || e.key === "Q") {
      e.preventDefault();
      setActiveSection("qty");
      qtyInputRef.current?.focus();
    }
  };

  const handleKeyDown = (e, type, itemId) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const increment = e.key === "ArrowDown" ? 1 : -1;

      if (type === "qty") {
        setSelectedItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? { ...item, qty: Math.max(1, item.qty + increment) }
              : item
          )
        );
      } else {
        const list = type === "customer" ? filteredCustomers : filteredItems;
        const setIndex =
          type === "customer" ? setFocusedIndex : setItemFocusedIndex;
        const currentIndex =
          type === "customer" ? focusedIndex : itemFocusedIndex;

        setIndex((prevIndex) => {
          const newIndex = (prevIndex + increment + list.length) % list.length;
          return newIndex;
        });

        if (type === "customer") {
          setIsCustomerDropdownOpen(true);
        } else {
          setIsItemDropdownOpen(true);
        }
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (type === "customer" && focusedIndex !== -1) {
        const selectedCustomer = filteredCustomers[focusedIndex];
        handleCustomerSelect(selectedCustomer.id, selectedCustomer.name);
      } else if (type === "item" && itemFocusedIndex !== -1) {
        handleItemSelect(filteredItems[itemFocusedIndex]);
      } else if (type === "qty") {
        const nextInput = document.querySelector(`#discount-type-${itemId}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else if (e.key === "Escape") {
      if (type === "customer") setIsCustomerDropdownOpen(false);
      else setIsItemDropdownOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedCustomerId(null);
    setSearchTerm("");
    setSelectedItems([]);
    setInvoiceDiscountType("value");
    setInvoiceDiscountAmount(0);
    setItemSearchTerm("");
    setFocusedIndex(-1);
    setItemFocusedIndex(-1);
    setIsCustomerDropdownOpen(false);
    setIsItemDropdownOpen(false);
  };

  return (
    <>
      <ToastContainer />
      <MenuBar />
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div className="pt-8 pl-[60px]">
          <div className="flex items-center space-x-5">
            <Input
              ref={itemInputRef}
              type="text"
              className="w-[450px] my-3"
              placeholder="Start typing item name (Press 'I' to focus)"
              value={itemSearchTerm}
              onChange={handleItemSearchChange}
              onKeyDown={(e) => handleKeyDown(e, "item")}
            />
          </div>
          {isItemDropdownOpen && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-[400px] mt-1 max-h-60 overflow-auto shadow-lg">
              {filteredItems.map((item, index) => (
                <li
                  key={item.id}
                  className={`px-4 py-2 cursor-pointer ${
                    index === itemFocusedIndex ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleItemSelect(item)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
          <div className="flex  mt-5">
            <div className="flex-1	 ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Discount Type</TableHead>
                    <TableHead>Discount Amount</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="w-[200px]">{item.name}</TableCell>
                      <TableCell className="w-[100px] font-bold">
                        {item.price}
                      </TableCell>
                      <TableCell className="w-14 h-8 rounded-sm">
                        <Input
                          ref={qtyInputRef}
                          className="w-14 h-8 rounded-sm"
                          value={item.qty}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, "qty")}
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={item.discountType}
                          onChange={(e) =>
                            handleItemDiscountTypeChange(
                              item.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="value">Value</option>
                          <option value="percentage">Percentage</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <Input
                          className="w-14 h-8 rounded-sm"
                          value={item.discountAmount}
                          onChange={(e) =>
                            handleItemDiscountAmountChange(
                              item.id,
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="w-[100px] font-bold">
                        {item.price * item.qty - calculateItemDiscount(item)}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="destructive"
                          className="h-8"
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex-none pr-8">
              <Card className="-mt-8 w-[350px]">
                <CardHeader>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Button
                      className="bg-choreo-blue hover:bg-choreo-blue hover:cursor-auto"
                      type="button"
                    >
                      <User />
                    </Button>

                    <Input
                      ref={customerInputRef}
                      type="text"
                      placeholder="Search Customer (Press 'C' to focus)"
                      value={searchTerm}
                      onChange={handleCustomerSearchChange}
                      onKeyDown={(e) => handleKeyDown(e, "customer")}
                    />
                  </div>
                  {isCustomerDropdownOpen && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-[calc(100%-5.5rem)] mt-1 max-h-60 overflow-auto shadow-lg">
                      {filteredCustomers.map((customer, index) => (
                        <li
                          key={customer.id}
                          className={`px-4 py-2 cursor-pointer ${
                            index === focusedIndex ? "bg-gray-200" : ""
                          }`}
                          onClick={() =>
                            handleCustomerSelect(customer.id, customer.name)
                          }
                        >
                          {customer.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex">
                      <h1 className="flex-1 font-semibold">Sub Total</h1>
                      <h1 className="flex-1 font-semibold">
                        {calculateSubtotal()} LKR
                      </h1>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-2 font-semibold">
                      <Label>Invoice Discount Type</Label>
                      <div className="flex gap-4">
                        <Label className="flex items-center gap-2">
                          <Input
                            type="radio"
                            name="invoiceDiscountType"
                            value="value"
                            checked={invoiceDiscountType === "value"}
                            onChange={(e) =>
                              setInvoiceDiscountType(e.target.value)
                            }
                          />
                          Value
                        </Label>
                        <Label className="flex items-center gap-2">
                          <Input
                            type="radio"
                            name="invoiceDiscountType"
                            value="percentage"
                            checked={invoiceDiscountType === "percentage"}
                            onChange={(e) =>
                              setInvoiceDiscountType(e.target.value)
                            }
                          />
                          Percentage
                        </Label>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 font-semibold">
                      <Label>Invoice Discount Amount</Label>
                      <Input
                        type="number"
                        value={invoiceDiscountAmount}
                        onChange={(e) =>
                          setInvoiceDiscountAmount(
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder={
                          invoiceDiscountType === "value"
                            ? "Enter amount"
                            : "Enter percentage"
                        }
                      />
                    </div>
                    <div className="flex">
                      <h1 className="flex-1 font-semibold">Invoice Discount</h1>
                      <h1 className="flex-1 font-semibold">
                        {calculateInvoiceDiscount()} LKR
                      </h1>
                    </div>
                    <Separator />
                    <div className="flex">
                      <h1 className="flex-1 font-semibold">Total</h1>
                      <h1 className="flex-1 font-semibold">
                        {calculateTotal()} LKR
                      </h1>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline font-semibold"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-choreo-blue font-semibold"
                    onClick={handleSubmit}
                  >
                    Finish & Create
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
