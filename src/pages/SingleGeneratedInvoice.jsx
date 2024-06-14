import supabase from "@/supabaseClient";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";
import NotFoundPage from "./NotFoundPage";
import InvoicePDF from "./InvoicePDF";

export default function SingleGeneratedInvoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const { data, error } = await supabase
          .from("invoices")
          .select("*, customers(name)")
          .eq("id", id)
          .single();

        if (error) {
          console.log("Error fetching data:", error.message);
        } else {
          setInvoice(data);
        }
      } catch (error) {
        console.log("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [id]);

  return (
    <>
      {loading ? (
        <Spinner loading={loading} />
      ) : invoice ? (
        <>
          <InvoicePDF />
        </>
      ) : (
        <NotFoundPage isInvoicePage={true} />
      )}
    </>
  );
}
