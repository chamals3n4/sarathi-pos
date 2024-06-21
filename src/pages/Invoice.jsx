import { useState, useEffect } from "react";
import supabase from "@/supabaseClient";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { Label } from "@radix-ui/react-label";
import { CirclePlus, FilePlus, Trash2 } from "lucide-react";
import MenuBar from "@/components/MenuBar";
import { Switch } from "@headlessui/react";
import { Select } from "@/components/ui/select";

export default function CreateInvoice() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [formItems, setFormItems] = useState([{ id: "", price: "", qty: "" }]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*,categories(name)")
          .order("id", { ascending: true });
        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setItems(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from("categories").select("*");
        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCustomers() {
      try {
        const { data, error } = await supabase.from("customers").select("*");
        if (error) {
          console.log("Error fetching data :", error.message);
        } else {
          setCustomers(data || []);
        }
      } catch (error) {
        console.log("Error fetching data:", error.message);
      }
    }

    fetchItems();
    fetchCategories();
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomerId) {
      alert("Please select a customer");
      return;
    }

    // Ensure all form items have valid ids
    for (const item of formItems) {
      if (
        !item.id ||
        !item.qty ||
        parseFloat(item.price) <= 0 ||
        parseInt(item.qty, 10) <= 0
      ) {
        alert("All items must be selected with valid price and quantity");
        return;
      }
    }

    const invoiceData = {
      customer_id: selectedCustomerId,
      total_amount: formItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * parseInt(item.qty, 10),
        0
      ),
    };

    try {
      // Insert into invoices table
      const { data: invoiceDataInserted, error: invoiceError } = await supabase
        .from("invoices")
        .insert([invoiceData])
        .select();

      if (invoiceError) {
        console.error("Error inserting invoice data", invoiceError.message);
        return;
      }

      const invoiceId = invoiceDataInserted[0].id;

      const invoiceItemsData = formItems.map((item) => ({
        invoice_id: invoiceId,
        item_id: item.id,
        quantity: item.qty,
        price: parseFloat(item.price),
      }));

      // Insert into invoice_items table
      const { data: invoiceItemsDataInserted, error: invoiceItemsError } =
        await supabase.from("invoice_items").insert(invoiceItemsData).select();

      if (invoiceItemsError) {
        console.error(
          "Error inserting invoice items data",
          invoiceItemsError.message
        );
        return;
      }

      // Update the item quantities in the items table
      for (const formItem of formItems) {
        const selectedItem = items.find(
          (item) => item.id === parseInt(formItem.id, 10)
        );
        if (selectedItem) {
          const newQty = selectedItem.qty - parseInt(formItem.qty, 10);
          if (newQty < 0) {
            alert(`Not enough quantity for item: ${selectedItem.name}`);
            return;
          }

          const { error: updateError } = await supabase
            .from("items")
            .update({ qty: newQty })
            .eq("id", selectedItem.id);

          if (updateError) {
            console.error("Error updating item quantity", updateError.message);
            return;
          }

          // Check if the item quantity has reached zero and display a toast error
          if (newQty === 0) {
            toast.error(`Item ${selectedItem.name} is now out of stock.`);
          }
        }
      }

      console.log(
        "Invoice and items inserted successfully",
        invoiceDataInserted,
        invoiceItemsDataInserted
      );

      toast.success("Invoice Created Successfully");

      setTimeout(() => {
        navigate(`/view-invoices/${invoiceId}`);
      }, 1000);
    } catch (error) {
      console.error("Error inserting data", error.message);
    }
  };

  const addFormItem = () => {
    setFormItems([...formItems, { id: "", price: "", qty: "" }]);
  };

  // const handleInputChange = (index, event) => {
  //   const values = [...formItems];
  //   const { name, value } = event.target;
  //   values[index][name] = value;

  //   // If the item ID is changed, update the price
  //   if (name === "id") {
  //     const selectedItem = items.find((item) => item.id === value);
  //     if (selectedItem) {
  //       values[index].price = selectedItem.price;
  //     }
  //   }

  //   setFormItems(values);
  // };

  const handleInputChange = (index, event) => {
    const values = [...formItems];
    const { name, value } = event.target;
    values[index][name] = value;

    // If the item ID is changed, update the price
    if (name === "id") {
      const selectedItem = items.find(
        (item) => item.id === parseInt(value, 10)
      );
      console.log("Selected item:", selectedItem); // Debugging log
      if (selectedItem) {
        values[index].price = selectedItem.price.toString();
        console.log("Updated price:", values[index].price); // Debugging log
      }
    }

    setFormItems(values);
  };

  const handleDeleteFormItem = (index) => {
    const values = [...formItems];
    values.splice(index, 1);
    setFormItems(values);
  };

  return (
    <>
      <ToastContainer />
      <div className="overflow-hidden bg-white py-24 pr-36 pl-36 mb-10 sm:py-16">
        <MenuBar />
        <div className="right-20 pb-6">
          <div className="pb-10 flex items-center space-x-4">
            <div className="text-white text-2xl w-[50px] h-[50px] bg-choreo-blue rounded-[10px] flex items-center justify-center">
              <FilePlus className="w-[25px] h-[25px]" />
            </div>
            <h1 className="text-3xl text-sarathi-text font-bold">
              Create Invoice
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-choreo-blue">Create New Invoice</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit}
                className="max-h-[70vh] overflow-auto"
              >
                <div className="grid grid-cols-12 gap-4 py-4 items-center">
                  <select
                    id="customer"
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="col-span-12 block w-full pl-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sarathi-text sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* {formItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 py-4 pl-1 items-center"
                  >
                    <select
                      id={`id-${index}`}
                      name="id"
                      value={item.id}
                      onChange={(e) => handleInputChange(index, e)}
                      className="col-span-3"
                    >
                      <option value="">Select Item</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <Input
                      id={`price-${index}`}
                      name="price"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleInputChange(index, e)}
                      className="col-span-3"
                      disabled
                    />

                    <Input
                      id={`qty-${index}`}
                      name="qty"
                      placeholder="Quantity"
                      value={item.qty}
                      onChange={(e) => handleInputChange(index, e)}
                      className="col-span-3"
                    />
                  </div>
                ))} */}

                {formItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 py-4 pl-1 items-center"
                  >
                    <select
                      id={`id-${index}`}
                      name="id"
                      value={item.id}
                      onChange={(e) => handleInputChange(index, e)}
                      className="col-span-3 pl-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sarathi-text sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="">Select Item</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    <div className="col-span-2">
                      <Label></Label>
                      <span>
                        {item.price
                          ? `Rs. ${parseFloat(item.price).toFixed(2)}` // Using "Rs." at the start
                          : // ? `${parseFloat(item.price).toFixed(2)} LKR` // Uncomment this line and comment the above line to use "LKR" at the end
                            "-"}
                      </span>
                    </div>
                    <Input
                      id={`qty-${index}`}
                      name="qty"
                      placeholder="Quantity"
                      value={item.qty}
                      onChange={(e) => handleInputChange(index, e)}
                      className="col-span-2"
                    />

                    <h1
                      onClick={() => handleDeleteFormItem(index)}
                      className="text-md flex gap-2 hover:cursor-pointer text-delete-red font-bold col-span-2"
                    >
                      <Trash2 />
                      Remove Item
                    </h1>
                  </div>
                ))}
                {/* <Button type="button" onClick={addFormItem}>
                  + Add Item
                </Button> */}
                <h1
                  onClick={addFormItem}
                  className="text-md flex gap-2 pl-1 hover:cursor-pointer text-choreo-blue font-bold col-span-2"
                >
                  <CirclePlus className="h-" />
                  Add Item
                </h1>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit">Finish and Generate Invoice</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
