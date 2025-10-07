import React, { useEffect, useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function CartPage() {
  const [cartdata, setCartData] = useState([]);
  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [buydata] = useState(location.state || []);

  const subtotal = cartdata.reduce((acc, item) => acc + Number(item.product_price) * Number(item.quantity || 1), 0);

  const totalDelivery = cartdata.reduce((acc, item) => acc + Number(item.delivery?.deliveryCharge || 0), 0);

  const grandtotal = subtotal + totalDelivery;

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://electronicbackend-vtjh.onrender.com/cartapi", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const cartWithQty = res.data.cartapidata.map((item) => ({
          ...item,
          quantity: item.quantity ? Number(item.quantity) : 1,
        }));
        setCartData(cartWithQty);
      });
  }, []);

  const handleApplyCoupon = () => {
    alert("Coupon applied: " + coupon);
    setCoupon("");
  };

  const handleRemoveItem = (item) => {
    const token = localStorage.getItem("token");
    axios
      .post("https://electronicbackend-vtjh.onrender.com/removecart", item, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success(res.data.msg);
        setCartData((prev) => prev.filter((p) => p._id !== item._id));
      })
      .catch(() => toast.error("Failed to remove item"));
  };

  const updateQty = (id, type) => {
    setCartData((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const currentQty = Number(item.quantity || 1);
          return {
            ...item,
            quantity:
              type === "inc" ? currentQty + 1 : Math.max(currentQty - 1, 1),
          };
        } else return item;
      })
    );
  };

  const proceedToCheckout = (grandtotal) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signup");
    } else {
      navigate("/pay", { state: cartdata });
    }
  };

  const BiDetail = (item) => {
    navigate("/product", { state: item });
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
              <div
                key={item._id}
                className="flex flex-col md:flex-row items-center justify-between rounded-lg p-4 shadow bg-white"
              >
                {/* Product Image */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    onClick={() => BiDetail(item)}
                    src={item.product_img}
                    alt={item.product_name}
                    className="w-24 h-24 cursor-pointer rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.product_titel}
                    </h3>
                    <p className="text-gray-600">₹{item.product_price}</p>
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="flex items-center rounded-lg">
                    <button
                      onClick={() => updateQty(item._id, "dec")}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item._id, "inc")}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ₹{(item.product_price * item.quantity).toFixed(2)}
                  </p>
                
                  <MdOutlineDelete
                    onClick={() => handleRemoveItem(item)}
                    className="text-2xl text-red-500 cursor-pointer hover:text-red-700"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right - Coupon + Total */}
          <div className="space-y-6">
            <div className="border p-1 md:p-6 rounded-lg shadow bg-white">
              <h3 className="text-sm md:text-xl font-bold mb-4">Apply Coupon</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon Code"
                  className="flex-1 border rounded md:px-4 md:py-2 placeholder:ps-2 focus:ring-2 focus:ring-red-400 outline-none"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-red-500 text-white px-2 text-sm md:text-xl md:px-5 md:py-2 rounded hover:bg-red-600"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="border p-2 md:p-6 rounded-lg shadow bg-white">
              <h3 className="text-2xl font-bold mb-6">Cart Total</h3>
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Delivery:</span>
                <span className="font-medium">
                  ₹{totalDelivery.toFixed(2)}
                </span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-xl mb-6 text-gray-800">
                <span>Grand Total:</span>
                <span>₹{grandtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={()=>proceedToCheckout(grandtotal)}
                className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
