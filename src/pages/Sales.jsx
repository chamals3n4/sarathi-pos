import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Spinner from "@/components/Spinner";
import { TrendingUp } from "lucide-react";
import MenuBar from "@/components/MenuBar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Footer from "@/components/Footer";

export default function ViewAllInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    async function fetchaInvoices() {
      try {
        const { data, error } = await supabase
          .from("invoices")
          .select("*,customers(name)")
          .order("id", { ascending: true });
        if (error) {
          console.log("Error fetching data:", error.message);
        } else {
          setInvoices(data || []);
          calculateMonthlyRevenue(data || []);
        }
      } catch (error) {
        console.log("Error fetching data", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchaInvoices();
  }, []);

  function calculateMonthlyRevenue(invoices) {
    const revenueMap = {};

    invoices.forEach((invoice) => {
      const date = new Date(invoice.created_at);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!revenueMap[key]) {
        revenueMap[key] = 0;
      }
      revenueMap[key] += invoice.total_amount;
    });

    const revenueData = Object.keys(revenueMap).map((key) => ({
      month: key,
      revenue: revenueMap[key],
    }));

    setMonthlyRevenue(revenueData);
  }

  return (
    <>
      <MenuBar />
      <div className="overflow-hidden bg-white py-24 pr-36 pl-36 mb-10 sm:py-16">
        <div className="pb-10 flex items-center space-x-4">
          <div className="text-white text-2xl w-[50px] h-[50px] bg-choreo-blue rounded-[10px] flex items-center justify-center">
            <TrendingUp className="w-[25px] h-[25px]" />
          </div>
          <h1 className="text-3xl text-sarathi-text font-bold">
            Sales Management
          </h1>
        </div>
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <>
            <div className="overflow-x-auto mt-10">
              <ResponsiveContainer
                width={monthlyRevenue.length * 150}
                height={400}
              >
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-lg font-medium">Month</TableHead>
                  <TableHead className="text-lg font-medium">
                    Total Revenue
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyRevenue.length > 0 ? (
                  monthlyRevenue.map((entry) => (
                    <TableRow key={entry.month}>
                      <TableCell className="text-lg">{entry.month}</TableCell>
                      <TableCell className="text-lg">{entry.revenue}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No revenue data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table> */}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
