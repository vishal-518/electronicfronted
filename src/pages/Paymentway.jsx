import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const Paymentway = () => {
  const location = useLocation();
  const [productdata] = useState(location.state || []);
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [errors, setErrors] = useState({});
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState("");
  const navigate = useNavigate();
  console.log(productdata)
 

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
    totalAmount: productdata.reduce((a, b) => a + b.product_price * b.quantity, 0) + (productdata[0].delivery?.deliveryCharge || 0),
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
      if (digitsOnly.length <= 10) {
        setFormData({ ...formData, [name]: digitsOnly });
      }
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
    axios.post("http://localhost:5000/check-pincode", { pincode }).then((res) => {
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

    if (paymentMethod === "cash on delivery") {
      await axios.post("http://localhost:5000/order",
        { ...formData, products: productdata, totalAmount: formData.totalAmount, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/ordersuccess");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await startOnlinePayment(pos.coords.latitude, pos.coords.longitude, token);
      },
      async (err) => {
        console.log("Geo error", err);
        await startOnlinePayment(null, null, token);
      }
    );

  } catch (validationError) {
    const formattedErrors = {};
    validationError.inner?.forEach((err) => {
      formattedErrors[err.path] = err.message;
    });
    setErrors(formattedErrors);
  }
};

async function startOnlinePayment(latitude, longitude, token) {
  const orderRes = await axios.post("http://localhost:5000/order",
    {
      ...formData,
      products: productdata,
      totalAmount: formData.totalAmount,
      paymentMethod,
      latitude,
      longitude
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const { data } = await axios.post(
    "http://localhost:5000/create-order",
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
        const verifyRes = await axios.post(
          "http://localhost:5000/verify-payment",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }
        );

        if (verifyRes.data.success) {
          navigate("/ordersuccess");
        } else {
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
}



  return (
    <div className="flex flex-col md:flex-row items-start justify-center gap-6 p-2">
      {/* Billing Form */}
      <div className="bg-white shadow-xl rounded-3xl p-6 w-full md:w-2/3">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Billing Details</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* First Name */}
          <div>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="First Name"
              className="border p-2 rounded w-full"
            />
            {errors.fname && (
              <p className="text-red-500 text-sm">{errors.fname}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-2 rounded w-full"
            />
            {errors.lname && (
              <p className="text-red-500 text-sm">{errors.lname}</p>
            )}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="border p-2 rounded w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Mobile */}
          <div className="md:col-span-2">
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="border p-2 rounded w-full"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile}</p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full Address"
              className="border p-2 rounded w-full"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          {/* Town */}
          <div>
            <input
              type="text"
              name="town"
              value={formData.town}
              onChange={handleChange}
              placeholder="Town / Village"
              className="border p-2 rounded w-full"
            />
            {errors.town && (
              <p className="text-red-500 text-sm">{errors.town}</p>
            )}
          </div>

          {/* City */}
          <div>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="border p-2 rounded w-full"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="border p-2 rounded w-full"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state}</p>
            )}
          </div>

          {/* Pincode */}
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
              <button
                type="button"
                onClick={checkPincode}
                className="bg-red-500 text-white px-4 cursor-pointer "
              >
                Search
              </button>
            </div>
            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode}</p>
            )}
            {pincodeMsg && (
              <p
                className={`mt-1 text-sm ${pincodeStatus === "success"
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {pincodeMsg}
              </p>
            )}
          </div>

          {/* Payment Options */}
          <div className="md:col-span-2 mt-3">
            <h2 className="text-lg font-bold mb-3">Choose Payment Method</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <span>Online Payment (UPI, Card, Netbanking)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="radio"
                name="payment"
                value="cash on delivery"
                checked={paymentMethod === "cash on delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <span>Cash on Delivery</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="md:col-span-2 w-full mt-5 bg-red-500 text-white py-3 rounded-sm hover:bg-red-600 font-semibold transition"
          >
            Proceed to Payment
          </button>
        </form>
      </div>

      {/* Product Summary */}
      <div className="bg-white shadow-2xl rounded-3xl p-6 w-full md:w-1/3 h-[560px] overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
        <div className="space-y-3">
          {productdata.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="flex items-center">
                <img src={item.product_img} className="w-14 h-14 shadow-2xl" alt="" />
                <p>{item.product_name} x {item.quantity}</p>
              </div>
              <p>₹{item.product_price * item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 font-bold text-lg">
          Total: ₹{formData.totalAmount}
        </div>
      </div>
    </div>
  );
};

export default Paymentway;
