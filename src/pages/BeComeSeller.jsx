import React from "react";
import { FaStore, FaUsers, FaTruck, FaRupeeSign } from "react-icons/fa";

function BeComeSeller() {
  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-16 px-6 shadow-xl   rounded-b-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Become a Seller on <span className="text-red-500">ShopKart</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Join India’s fastest growing e-commerce platform. Sell your products
          to millions of customers across the country.
        </p>
        <button className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500">
          Start Selling
        </button>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Why Sell on ShopKart?
        </h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-gray-100 rounded-lg shadow hover:scale-105 transition">
            <FaUsers className="text-4xl mx-auto mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold mb-2">300M+ Customers</h3>
            <p>Reach millions of buyers all over India.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow hover:scale-105 transition">
            <FaStore className="text-4xl mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-2">Easy Setup</h3>
            <p>Create your seller account and start selling in minutes.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow hover:scale-105 transition">
            <FaTruck className="text-4xl mx-auto mb-4 text-yellow-500" />
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p>Integrated logistics ensure quick and safe delivery.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow hover:scale-105 transition">
            <FaRupeeSign className="text-4xl mx-auto mb-4 text-pink-500" />
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p>Timely payments directly to your bank account.</p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-6 bg-gray-100 rounded-lg">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-yellow-500">300M+</h3>
            <p className="text-lg">Customers</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-500">1M+</h3>
            <p className="text-lg">Sellers</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-pink-500">1000+</h3>
            <p className="text-lg">Cities Covered</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="text-xl font-semibold mb-2">
              How do I register as a seller?
            </h4>
            <p>
              Just click on "Start Selling", fill your details, and upload your
              product catalog. That’s it!
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="text-xl font-semibold mb-2">
              What documents are required?
            </h4>
            <p>
              GSTIN, Bank Account details, and a valid mobile number/email ID.
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="text-xl font-semibold mb-2">
              How much does it cost to sell?
            </h4>
            <p>
              Registration is free! You only pay a small commission per sale.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BeComeSeller;
