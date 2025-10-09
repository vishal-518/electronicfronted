import React, { useEffect, useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import {  redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function CartPage() {
  const [cartdata, setCartData] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const subtotal = cartdata.reduce((acc, item) => acc + Number(item.product_price) * Number(item.quantity || 1), 0);
  const totalDelivery = cartdata.reduce((acc, item) => acc + Number(item.delivery?.deliveryCharge || 0), 0);
  const grandtotal = subtotal + totalDelivery;

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) return match[2];
    return null;
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const guestToken = getCookie("guestToken");

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const url = "https://electronicbackend-bzcr.onrender.com/cartapi";

      const res = await axios.get(url, {
        headers,
        withCredentials: true,
        params: token ? {} : { guestToken },
      });

      const cartWithQty = res.data.cartapidata.map((item) => ({
        ...item,
        quantity: item.quantity ? Number(item.quantity) : 1,
      }));

      setCartData(cartWithQty);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleRemoveItem = async (item) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post("https://electronicbackend-bzcr.onrender.com/removecart", item, { headers });
      toast.success("Item removed");
      setCartData((prev) => prev.filter((p) => p._id !== item._id));
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const updateQty = (id, type) => {
    setCartData((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const currentQty = Number(item.quantity || 1);
          return {
            ...item,
            quantity: type === "inc" ? currentQty + 1 : Math.max(currentQty - 1, 1),
          };
        }
        return item;
      })
    );
  };

  const proceedToCheckout = () => {
    if (!token) {
      navigate("/signup",{ state: { redirect:'/pay' } });
    } else {
      navigate("/pay", { state: { type: "cart", cartdata } });
    }
  };

  return (
    <div className="container mx-auto p-0 md:p-6">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-800">
        Shopping Cart ({cartdata.length})
      </h2>
      <Toaster position="top-right" reverseOrder={false} />

      {cartdata.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartdata.map((item) => (
              <div key={item._id} className="flex flex-col md:flex-row items-center justify-between rounded-lg p-4 shadow bg-white">
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={item.product_img}
                    alt={item.product_name}
                    className="w-24 h-24 cursor-pointer rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.product_titel}</h3>
                    <p className="text-gray-600">₹{item.product_price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="flex items-center rounded-lg">
                    <button onClick={() => updateQty(item._id, "dec")} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">-</button>
                    <span className="px-4">{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, "inc")} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">+</button>
                  </div>
                  <p className="font-semibold text-gray-800">₹{(item.product_price * item.quantity).toFixed(2)}</p>
                  <MdOutlineDelete onClick={() => handleRemoveItem(item)} className="text-2xl text-red-500 cursor-pointer hover:text-red-700" />
                </div>
              </div>
            ))}
          </div>

          {/* Right - Coupon + Total */}
          <div className="space-y-6">
            <div className="border p-2 md:p-6 rounded-lg shadow bg-white">
              <h3 className="text-2xl font-bold mb-6">Cart Total</h3>
              <div className="flex justify-between mb-3 text-gray-700"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between mb-3 text-gray-700"><span>Delivery:</span><span>₹{totalDelivery.toFixed(2)}</span></div>
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-xl mb-6 text-gray-800"><span>Grand Total:</span><span>₹{grandtotal.toFixed(2)}</span></div>
              <button onClick={proceedToCheckout} className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 font-semibold">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
