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
  const [formItems, setFormItems] = useState([
    {
      id: "",
      price: "",
      qty: "",
      itemSearchTerm: "",
      itemFocusedIndex: -1,
      isItemDropdownOpen: false,
    },
  ]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const dropdownRef = useRef(null);

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
    setFormItems([
      ...formItems,
      {
        id: "",
        price: "",
        qty: "",
        itemSearchTerm: "",
        itemFocusedIndex: -1,
        isItemDropdownOpen: false,
      },
    ]);
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

  const handleItemSearchChange = (index, e) => {
    const values = [...formItems];
    values[index].itemSearchTerm = e.target.value;
    values[index].itemFocusedIndex = -1;
    values[index].isItemDropdownOpen = true;
    setFormItems(values);
  };

  const handleItemSelect = (index, itemId, itemName) => {
    const values = [...formItems];
    values[index].id = itemId;
    const selectedItem = items.find((item) => item.id === itemId);
    if (selectedItem) {
      values[index].price = selectedItem.price.toString();
    }
    values[index].itemSearchTerm = itemName;
    values[index].itemFocusedIndex = -1;
    values[index].isItemDropdownOpen = false;
    setFormItems(values);
  };

  const handleItemKeyDown = (index, e) => {
    const values = [...formItems];
    if (!values[index].isItemDropdownOpen) {
      values[index].isItemDropdownOpen = true;
      setFormItems(values);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      values[index].itemFocusedIndex = Math.min(
        values[index].itemFocusedIndex + 1,
        filteredItems.length - 1
      );
      setFormItems(values);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      values[index].itemFocusedIndex = Math.max(
        values[index].itemFocusedIndex - 1,
        0
      );
      setFormItems(values);
    } else if (e.key === "Enter" && values[index].itemFocusedIndex >= 0) {
      e.preventDefault();
      const selectedItem = filteredItems[values[index].itemFocusedIndex];
      handleItemSelect(index, selectedItem.id, selectedItem.name);
    } else if (e.key === "Escape") {
      values[index].isItemDropdownOpen = false;
      setFormItems(values);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredItems = (searchTerm) =>
    items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((customer) => customer.id === customerId);
    return customer ? customer.name : "Unknown";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MenuBar />
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold mb-6">Create Invoice</h1>
        <div className="pl-20 pr-20">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Label
                htmlFor="customerSearch"
                className="block text-sm font-medium text-gray-700"
              >
                Search Customer
              </Label>
              <Input
                id="customerSearch"
                type="text"
                placeholder="Search Customer"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
              {isDropdownOpen && (
                <ul
                  ref={dropdownRef}
                  className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-auto shadow-lg"
                >
                  {filteredCustomers.map((customer, index) => (
                    <li
                      key={customer.id}
                      className={`px-4 py-2 cursor-pointer ${
                        index === focusedIndex ? "bg-gray-200" : ""
                      }`}
                      onMouseDown={() =>
                        handleCustomerSelect(customer.id, customer.name)
                      }
                    >
                      {customer.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {formItems.map((formItem, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:space-x-4 mb-4"
              >
                <div className="mb-4 sm:mb-0 flex-1 relative">
                  <Label
                    htmlFor={`itemSearch-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Item
                  </Label>
                  <Input
                    id={`itemSearch-${index}`}
                    type="text"
                    name="itemSearchTerm"
                    placeholder="Search Item"
                    value={formItem.itemSearchTerm}
                    onChange={(e) => handleItemSearchChange(index, e)}
                    onKeyDown={(e) => handleItemKeyDown(index, e)}
                    autoComplete="off"
                  />
                  {formItem.isItemDropdownOpen && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-auto shadow-lg">
                      {filteredItems(formItem.itemSearchTerm).map((item, i) => (
                        <li
                          key={item.id}
                          className={`px-4 py-2 cursor-pointer ${
                            i === formItem.itemFocusedIndex ? "bg-gray-200" : ""
                          }`}
                          onMouseDown={() =>
                            handleItemSelect(index, item.id, item.name)
                          }
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor={`price-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </Label>
                  <Input
                    id={`price-${index}`}
                    type="text"
                    name="price"
                    value={formItem.price}
                    onChange={(e) => handleInputChange(index, e)}
                    readOnly
                  />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor={`qty-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity
                  </Label>
                  <Input
                    id={`qty-${index}`}
                    type="text"
                    name="qty"
                    value={formItem.qty}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    className="sm:ml-2 mt-2 sm:mt-0"
                    onClick={() => handleDeleteFormItem(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
            <div className="mb-6">
              <Button type="button" variant="secondary" onClick={addFormItem}>
                <CirclePlus size={16} className="mr-2" />
                Add Item
              </Button>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                <FilePlus size={16} className="mr-2" />
                Create Invoice
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
