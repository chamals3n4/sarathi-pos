/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TXJelOHbsOu
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Link } from "react-router-dom";

export default function MenuBar() {
  return (
    <header className="bg-choreo-blue text-primary-foreground shadow">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" prefetch={false}>
          <span className="text-2xl font-semibold">Sarathi Book Shop</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/invoice"
            className="rounded-md px-3 py-2 text-lg font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            prefetch={true}
          >
            Create Invoice
          </Link>
          <Link
            to="/view-invoices"
            className="rounded-md px-3 py-2 text-lg font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            prefetch={false}
          >
            View All Invoice
          </Link>
          <Link
            to="/items"
            className="rounded-md px-3 py-2 text-lg font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            prefetch={false}
          >
            Items
          </Link>
          <Link
            to="/categories"
            className="rounded-md px-3 py-2 text-lg font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            prefetch={false}
          >
            Categories
          </Link>
          <Link
            to="/customers"
            className="rounded-md px-3 py-2 text-lg font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            prefetch={false}
          >
            Customers
          </Link>
          <Link
            to="/sales"
            className="rounded-md px-3 py-2 text-lg font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            prefetch={false}
          >
            Sales
          </Link>
        </nav>
      </div>
    </header>
  );
}

function ReceiptIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  );
}

// 711010108693
