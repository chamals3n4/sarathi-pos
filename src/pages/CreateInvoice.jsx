import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

import { Trash2, UserRound } from "lucide-react";

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
    setSelectedItems([...selectedItems, { ...item, qty: 1 }]);
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

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );
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
      total_amount: calculateTotal(),
    };

    try {
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
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItemsData);

      if (itemsError) throw itemsError;

      toast.success("Invoice created successfully");

      // Reset form
      setSelectedCustomerId(null);
      setSearchTerm("");
      setSelectedItems([]);

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

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <ToastContainer />
      <div className="pt-20 pl-40">
        <div className="flex items-center space-x-5">
          <Input
            type="text"
            className="w-[450px] my-3"
            placeholder="Start typing item name"
            value={itemSearchTerm}
            onChange={handleItemSearchChange}
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
        <div className="flex mt-5">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price} LKR</TableCell>
                    <TableCell>
                      <Input
                        className="w-14 h-8 rounded-sm"
                        value={item.qty}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>{item.price * item.qty} LKR</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => removeItem(item.id)}
                        variant="destructive"
                        className="h-8.5"
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex-1">
            <Card className="w-[450px]">
              <CardHeader>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Button
                    className="bg-pos-grey hover:bg-pos-grey hover:cursor-auto"
                    type="button"
                  >
                    <UserRound />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Search Customer"
                    value={searchTerm}
                    onChange={handleCustomerSearchChange}
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
                    <h1 className="flex-1">Sub Total</h1>
                    <h1 className="flex-1">{calculateTotal()} LKR</h1>
                  </div>
                  <Separator />
                  <div className="flex">
                    <h1 className="flex-1">Total</h1>
                    <h1 className="flex-1">{calculateTotal()} LKR</h1>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-choreo-blue" onClick={handleSubmit}>
                  Finish & Create
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
