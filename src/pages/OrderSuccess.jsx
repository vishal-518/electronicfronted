import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="bg-green-100 rounded-full p-4 mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Your order has been successfully placed!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for shopping with us. A confirmation email has been sent to your registered email address.
        </p>

        <div className="w-full flex gap-4 justify-center">
          <Link to='/orderhistory'>
            <button className="w-full sm:w-auto border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded transition">
              See Order
            </button>
          </Link>
          <Link to='/'>
            <button className="w-full sm:w-auto border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded transition">
              Go to Home Page
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
