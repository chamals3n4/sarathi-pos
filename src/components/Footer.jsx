import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div>
      <footer>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <p className="mt-4 text-center text-md text-gray-500 lg:mt-0 lg:text-right">
              Built with ❤️ by Chamal Senarathna
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
