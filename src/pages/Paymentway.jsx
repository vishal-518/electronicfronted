import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const Paymentway = () => {
  const location = useLocation();
  const { state } = location || {};
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [errors, setErrors] = useState({});
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    address: "",
    town: "",
    city: "",
    state: "",
    pincode: "",
    totalAmount:
      state?.type === "buy"
        ? state.data?.product_price * (state.data?.quantity || 1)
        : state?.type === "cart" && Array.isArray(state.cartdata)
        ? state.cartdata.reduce((a, b) => a + b.product_price * b.quantity, 0)
        : 0,
  });

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required("First name is required"),
    lname: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    address: Yup.string().required("Address is required"),
    town: Yup.string().required("Town is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) setFormData({ ...formData, [name]: digitsOnly });
    } else if (name === "pincode") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 6) {
        setFormData({ ...formData, [name]: digitsOnly });
        setPincode(digitsOnly);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const checkPincode = () => {
    if (pincode.length !== 6) {
      setIsPincodeValid(false);
      setPincodeMsg("Enter a valid 6-digit pincode");
      setPincodeStatus("error");
      return;
    }
    axios
      .post("https://electronicbackend-bzcr.onrender.com/check-pincode", { pincode })
      .then((res) => {
        if (res.data.status === 200) {
          setDeliveryInfo(res.data);
          setIsPincodeValid(true);
          setPincodeMsg(res.data.msg);
          setPincodeStatus("success");
        } else {
          setDeliveryInfo(null);
          setIsPincodeValid(false);
          setPincodeMsg(res.data.msg);
          setPincodeStatus("error");
        }
      })
      .catch(() => {
        setIsPincodeValid(false);
        setPincodeMsg("Error checking pincode");
        setPincodeStatus("error");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPincodeValid) {
      setPincodeMsg("Please enter a valid pincode before proceeding!");
      setPincodeStatus("error");
      return;
    }

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      const token = localStorage.getItem("token");

      // Determine products from state
      const productdata =
        state?.type === "buy" ? [state.data] : state?.type === "cart" ? state.cartdata : [];

      if (paymentMethod === "cash on delivery") {
        await axios.post(
          "https://electronicbackend-bzcr.onrender.com/order",
          { ...formData, products: productdata, totalAmount: formData.totalAmount, paymentMethod },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        navigate("/ordersuccess");
        return;
      }

      if (paymentMethod === "online") {
        if (!formData.totalAmount || formData.totalAmount <= 0) {
          setPincodeMsg("Invalid total amount for payment!");
          setPincodeStatus("error");
          return;
        }
        startOnlinePayment(token, productdata);
      }
    } catch (validationError) {
      const formattedErrors = {};
      validationError.inner?.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
      setErrors(formattedErrors);
    }
  };

  async function startOnlinePayment(token, productdata) {
    try {
      // Save order in DB first
      await axios.post(
        "https://electronicbackend-bzcr.onrender.com/order",
        {
          ...formData,
          products: productdata,
          totalAmount: formData.totalAmount,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Create Razorpay order
      const { data } = await axios.post(
        "https://electronicbackend-bzcr.onrender.com/create-order",
        { amount: formData.totalAmount, currency: "INR" },
        { headers: { "Content-Type": "application/json" } }
      );

      const options = {
        key: data.key_id,
        amount: data.order_amount,
        currency: data.currency,
        name: "Pixel Genix",
        order_id: data.order_id,
        description: "Payment via Razorpay",
        prefill: {
          name: `${formData.fname} ${formData.lname}`,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: { color: "#07a291db" },
        handler: async function (response) {
          try {
            const verifyRes = await axios.post("https://electronicbackend-bzcr.onrender.com/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) navigate("/ordersuccess");
            else {
              setPincodeMsg("Payment Verification Failed");
              setPincodeStatus("error");
            }
          } catch {
            setPincodeMsg("Error verifying payment");
            setPincodeStatus("error");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPincodeMsg("Error initiating payment");
      setPincodeStatus("error");
      console.error(err);
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-start justify-center gap-6 p-2">
      {/* Billing Form */}
      <div className="bg-white shadow-xl rounded-3xl p-6 w-full md:w-2/3">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Billing Details</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form fields (fname, lname, email, mobile, address, town, city, state, pincode) */}
          {["fname", "lname", "email", "mobile", "address", "town", "city", "state", "pincode"].map((field) => (
            <div key={field} className={field === "address" || field === "email" || field === "mobile" ? "md:col-span-2" : ""}>
              {field === "address" ? (
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder="Full Address"
                  className="border p-2 rounded w-full"
                />
              ) : (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="border p-2 rounded w-full"
                />
              )}
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}

          {/* Pincode button */}
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter Pincode"
                className="p-2 border-b w-full outline-none"
              />
              <button type="button" onClick={checkPincode} className="bg-red-500 text-white px-4 cursor-pointer">
                Search
              </button>
            </div>
            {pincodeMsg && <p className={`mt-1 text-sm ${pincodeStatus === "success" ? "text-green-600" : "text-red-600"}`}>{pincodeMsg}</p>}
          </div>

          {/* Payment Options */}
          <div className="md:col-span-2 mt-3">
            <h2 className="text-lg font-bold mb-3">Choose Payment Method</h2>
            {["online", "cash on delivery"].map((method) => (
              <label key={method} className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span>{method === "online" ? "Online Payment (UPI, Card, Netbanking)" : "Cash on Delivery"}</span>
              </label>
            ))}
          </div>

          {/* Submit */}
          <button type="submit" className="md:col-span-2 w-full mt-5 bg-red-500 text-white py-3 rounded-sm hover:bg-red-600 font-semibold transition">
            Proceed to Payment
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-2xl rounded-3xl p-6 w-full md:w-1/3 h-[560px] overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
        <div className="space-y-3">
          {state?.type === "buy" ? (
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center">
                <img src={state?.data?.product_img} className="w-14 h-14 shadow-2xl" alt="" />
                <p>{state?.data?.product_name} x {state?.data?.quantity}</p>
              </div>
              <p>₹{state?.data?.product_price * (state?.data?.quantity || 1)}</p>
            </div>
          ) : state?.type === "cart" ? (
            state.cartdata.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <img src={item.product_img} className="w-14 h-14 shadow-2xl" alt="" />
                  <p>{item.product_name} x {item.quantity}</p>
                </div>
                <p>₹{item.product_price * item.quantity}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No Items Found</p>
          )}
        </div>
        <div className="mt-4 font-bold text-lg">Total: ₹{formData.totalAmount}</div>
      </div>
    </div>
  );
};

export default Paymentway;
