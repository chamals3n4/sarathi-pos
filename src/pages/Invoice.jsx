import { useState, useEffect, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Label } from "@radix-ui/react-label";
import { CirclePlus, FilePlus, Flame, Trash2 } from "lucide-react";
import MenuBar from "@/components/MenuBar";

export default function CreateInvoice() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [formItems, setFormItems] = useState([{ id: "", price: "", qty: "" }]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [itemFocusedIndex, setItemFocusedIndex] = useState(-1);
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const itemDropdownRef = useRef(null);

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

      const { data: invoiceItemsDataInserted, error: invoiceItemsError } =
        await supabase.from("invoice_items").insert(invoiceItemsData).select();

      if (invoiceItemsError) {
        console.error(
          "Error inserting invoice items data",
          invoiceItemsError.message
        );
        return;
      }

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

          if (newQty === 0) {
            toast.error(`Item ${selectedItem.name} is now out of stock.`);
          }
        }
      }

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

  const handleInputChange = (index, event) => {
    const values = [...formItems];
    const { name, value } = event.target;
    values[index][name] = value;

    if (name === "id") {
      const selectedItem = items.find(
        (item) => item.id === parseInt(value, 10)
      );
      if (selectedItem) {
        values[index].price = selectedItem.price.toString();
      }
    }

    setFormItems(values);
  };

  const handleDeleteFormItem = (index) => {
    const values = [...formItems];
    values.splice(index, 1);
    setFormItems(values);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setFocusedIndex(-1);
    setIsDropdownOpen(true);
  };

  const handleCustomerSelect = (customerId, customerName) => {
    setSelectedCustomerId(customerId);
    setSearchTerm(customerName);
    setFocusedIndex(-1);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev < filteredCustomers.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const selectedCustomer = filteredCustomers[focusedIndex];
      handleCustomerSelect(selectedCustomer.id, selectedCustomer.name);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const handleItemSearchChange = (e) => {
    setItemSearchTerm(e.target.value);
    setItemFocusedIndex(-1);
    setIsItemDropdownOpen(true);
  };

  const handleItemSelect = (index, itemId, itemName) => {
    const values = [...formItems];
    values[index].id = itemId;
    const selectedItem = items.find((item) => item.id === itemId);
    if (selectedItem) {
      values[index].price = selectedItem.price.toString();
    }
    setFormItems(values);
    setItemSearchTerm(itemName);
    setItemFocusedIndex(-1);
    setIsItemDropdownOpen(false);
  };

  const handleItemKeyDown = (e) => {
    if (!isItemDropdownOpen) {
      setIsItemDropdownOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setItemFocusedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setItemFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && itemFocusedIndex >= 0) {
      e.preventDefault();
      const selectedItem = filteredItems[itemFocusedIndex];
      handleItemSelect(index, selectedItem.id, selectedItem.name);
    } else if (e.key === "Escape") {
      setIsItemDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (itemDropdownRef.current) {
      const focusedElement = itemDropdownRef.current.children[itemFocusedIndex];
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [itemFocusedIndex]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        itemDropdownRef.current &&
        !itemDropdownRef.current.contains(event.target)
      ) {
        setIsItemDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (dropdownRef.current) {
      const focusedElement = dropdownRef.current.children[focusedIndex];
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase())
  );

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
                  <div className="relative col-span-12">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Search Customer"
                      className="block w-[300px] pl-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sarathi-text sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                    {isDropdownOpen && searchTerm && (
                      <ul
                        ref={dropdownRef}
                        className="absolute z-10 mt-1 w-[300px] bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                      >
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map((customer, index) => (
                            <li
                              key={customer.id}
                              onClick={() =>
                                handleCustomerSelect(customer.id, customer.name)
                              }
                              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                                index === focusedIndex
                                  ? "bg-gray-200"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {customer.name}
                            </li>
                          ))
                        ) : (
                          <li className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-700">
                            No results found
                          </li>
                        )}
                      </ul>
                    )}
                    <input
                      type="hidden"
                      id="customer"
                      value={selectedCustomerId || ""}
                      onChange={() => {}}
                    />
                  </div>
                </div>
                {formItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 py-4 pl-1 items-center"
                  >
                    {/* <select
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
                    </select> */}

                    <div className="relative col-span-3">
                      <input
                        type="text"
                        value={itemSearchTerm}
                        onChange={handleItemSearchChange}
                        onKeyDown={handleItemKeyDown}
                        onFocus={() => setIsItemDropdownOpen(true)}
                        placeholder="Search Item"
                        className="block w-full pl-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sarathi-text sm:max-w-xs sm:text-sm sm:leading-6"
                      />
                      {isItemDropdownOpen && itemSearchTerm && (
                        <ul
                          ref={itemDropdownRef}
                          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        >
                          {filteredItems.length > 0 ? (
                            filteredItems.map((item, idx) => (
                              <li
                                key={item.id}
                                onClick={() =>
                                  handleItemSelect(index, item.id, item.name)
                                }
                                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                                  idx === itemFocusedIndex
                                    ? "bg-gray-200"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                {item.name}
                              </li>
                            ))
                          ) : (
                            <li className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-700">
                              No results found
                            </li>
                          )}
                        </ul>
                      )}
                    </div>

                    <div className="col-span-2">
                      <Label></Label>
                      <span>
                        {item.price
                          ? `Rs. ${parseFloat(item.price).toFixed(2)}`
                          : "-"}
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
                <h1
                  onClick={addFormItem}
                  className="text-md flex gap-2 pl-1 hover:cursor-pointer text-choreo-blue font-bold col-span-2"
                >
                  <CirclePlus />
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
