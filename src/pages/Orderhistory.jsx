import axios from 'axios';
import React, { useEffect, useState } from 'react';
import jsPDF from "jspdf";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function Orderhistory() {
    const [orderdata, setOrderdata] = useState([]);
    const [returnModal, setReturnModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reason, setReason] = useState("");
    const [extraText, setExtraText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios
            .get('https://electronicbackend-euwf.onrender.com/orderapi', { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setOrderdata(res.data.ordata))
            .catch((err) => console.error(err));
    }, []);

    const statusSteps = ["Order Placed", "Packaging", "On The Road", "Delivered"];

    const taxbutton = (order) => {
        const doc = new jsPDF({ unit: "pt", format: "a4" });
        doc.setFontSize(20);
        doc.text("Tax Invoice", 220, 40);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 40, 100);
        doc.text("Billing & Shipping Address:", 40, 170);
        doc.text(`${order.fname} ${order.lname}, ${order.address}, ${order.city}, ${order.state} - ${order.pincode}`, 40, 190, { maxWidth: 500 });
        doc.text(`Phone: ${order.mobile}`, 40, 210);
        doc.setFontSize(14);
        doc.text("Products", 40, 250);

        let y = 280;
        doc.setFontSize(12);
        doc.text("Product", 40, y);
        doc.text("Qty", 300, y);
        doc.text("Price", 400, y);
        doc.text("Total", 500, y);
        y += 20;

        order.products.forEach((prod) => {
            doc.text(prod.product_name, 40, y, { maxWidth: 250 });
            doc.text(String(prod.quantity), 300, y);
            doc.text(`₹${prod.product_price}`, 400, y);
            doc.text(`₹${(prod.product_price * prod.quantity).toFixed(2)}`, 500, y);
            y += 20;
        });

        y += 20;
        doc.setFontSize(14);
        doc.text(`Total Amount: ₹${order.totalAmount}`, 400, y);
        y += 40;
        doc.setFontSize(10);
        doc.text("Thank you for shopping with us!", 220, y);
        doc.save(`invoice-${order._id}.pdf`);
    };

    const OrderCancel = (id) => {
        const token = localStorage.getItem('token');
        axios.post('https://electronicbackend-euwf.onrender.com/order-cencel', { id }, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                toast.success(res.data.msg);
                setTimeout(() => window.location.reload(), 1000);
            });
    };

    const submitReturn = async () => {
        if (!reason) {
            toast.error("Please select reason for return");
            return;
        }
        if (reason === "other" && !extraText.trim()) {
            toast.error("Please specify your reason");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await axios.put(
                `https://electronicbackend-euwf.onrender.com/return/${selectedOrder._id}`,
                reason === "other" ? { reason: "other", extraReason: extraText } : { reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data.msg);
            setOrderdata(prev => prev.map(o =>
                o._id === selectedOrder._id ? {
                    ...o,
                    return: {
                        status: "requested",
                        reason: reason === "other" ? extraText : reason,
                        updatedAt: new Date(),
                    }
                } : o
            ));

            setReason("");
            setExtraText("");
            setReturnModal(false);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Failed to request return");
        }
    };

    return (
        <div className="p-2 md:p-4 bg-gray-100 h-[600px] overflow-scroll">
            <Toaster position='top-right' reverseOrder={false} />
            <h2 className="text-lg md:text-xl font-bold mb-6 text-center">Order History</h2>

            {orderdata.length === 0 && <p className="text-center text-gray-300">No orders found.</p>}

            <div className="space-y-4">
                {orderdata.map((order) => {
                    const currentStepIndex = statusSteps.indexOf(order.tracking?.status || "Order Placed");
                    const isDelivered = order.tracking?.status === "Delivered";

                    // Return eligibility check
                    const canReturn = isDelivered && order.products.some((prod) => {
                        if (!prod.product_return || prod.product_return.toLowerCase() === "0") return false;

                        const deliveryDate = new Date(order.tracking?.updatedAt || order.createdAt);
                        const returnDays = parseInt(prod.product_return, 10);
                        if (isNaN(returnDays)) return false;

                        const returnExpiry = new Date(deliveryDate);
                        returnExpiry.setDate(deliveryDate.getDate() + returnDays);

                        return new Date() <= returnExpiry;
                    });

                    return (
                        <div key={order._id} className={`relative rounded-lg p-3 md:p-4 shadow ${isDelivered ? "bg-gray-200" : "bg-white"}`}>
                            {isDelivered && <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-center py-1 rounded-t-lg"> Delivery Successful</div>}

                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2 mt-6">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {order.products.length} Products · Placed on {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Return Days:{" "}
                                        <span className="font-semibold">
                                            {order.products.map((p) => p.product_return || "N/A").join(", ")}
                                        </span>
                                    </p>
                                </div>
                                <div className="font-bold text-gray-800 text-lg md:text-xl">
                                    ₹{order.totalAmount}
                                </div>
                            </div>

                            {/* Products */}
                            <div className="border-t border-b border-gray-200 py-2 mb-3 space-y-2">
                                {order.products.map(prod => (
                                    <div key={prod._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <img src={prod.product_img} alt={prod.product_name} className="h-12 w-12 object-contain rounded" />
                                            <div>
                                                <p className="text-sm text-gray-700">{prod.product_name}</p>
                                                <p className="text-xs text-gray-500">x {prod.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 font-semibold">
                                            ₹{(prod.product_price * prod.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Payment & Address */}
                            <div className="text-sm text-gray-600 mb-3 space-y-1">
                                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                {/* <p><strong>Payment Status:</strong> {order.paymentStatus}</p> */}
                                <p><strong>Shipping Address:</strong> {order.fname} {order.lname}, {order.address}, {order.town}, {order.city}, {order.state} - {order.pincode}, Phone: {order.mobile}</p>
                                <p><strong>Delivery Date:</strong> {new Date(new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 5)).toLocaleDateString()}</p>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative mb-6">
                                <div className="absolute top-3 left-0 right-0 h-1 bg-gray-300"></div>
                                <div className="absolute top-3 left-0 h-1 bg-green-600 transition-all duration-700 ease-in-out" style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}></div>
                                <div className="flex justify-between relative z-10">
                                    {statusSteps.map((step, idx) => (
                                        <div key={idx} className="flex-1 text-center">
                                            <div className={`w-6 h-6 mx-auto rounded-full border flex items-center justify-center transition duration-300 ${idx <= currentStepIndex ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-400"}`}>
                                                {idx + 1}
                                            </div>
                                            <p className="mt-1 text-[10px] sm:text-xs">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Activity */}
                            <div className="bg-gray-50 p-2 rounded text-gray-700 text-sm">
                                <p>Order placed successfully.</p>
                                <p className="text-blue-600"> Tracking Status: {order.tracking?.status} (Updated on{" "} {new Date(order.tracking?.updatedAt).toLocaleString()})</p>
                                {order.return?.status === "requested" && (<p className="text-orange-500"> Return Requested (Reason: {order.return?.reason})</p>)}
                                {order.return?.status === 'approved' && (<p className="text-green-600">Return Approved ✅</p>)}
                                {order.return?.status === "rejected" && (<p className="text-red-600">Return Rejected ❌</p>)}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Cancel */}
                                <button
                                    onClick={() => !isDelivered && OrderCancel(order._id)}
                                    disabled={isDelivered}
                                    className={`w-full sm:w-auto p-2 px-6 py-2 rounded mt-3 font-semibold ${isDelivered ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-200 text-black"}`}
                                >
                                    Order Cancel
                                </button>

                                {/* Return */}
                                {canReturn && (
                                    <button
                                        onClick={() => { setSelectedOrder(order); setReturnModal(true); }}
                                        className="w-full sm:w-auto p-2 px-6 py-2 rounded mt-3 font-semibold bg-gray-300 hover:bg-gray-200 text-black"
                                    >
                                        Return Order
                                    </button>
                                )}

                                {/* Download Invoice */}
                                <button
                                    onClick={() => taxbutton(order)}
                                    className="w-full sm:w-auto p-2 bg-gray-300 hover:bg-gray-200 font-semibold text-black px-6 py-2 rounded mt-3"
                                >
                                    Download Invoice
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Return Modal */}
            {returnModal && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-brightness-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-2xl">
                        <h3 className="text-lg font-semibold mb-4">Return Order</h3>
                        <select value={reason} onChange={e => setReason(e.target.value)} className="border p-2 rounded w-full mb-3">
                            <option value="">-- Select Reason for Return --</option>
                            <option value="defective">Product defective / damaged</option>
                            <option value="wrong">Wrong product delivered</option>
                            <option value="missing">Missing accessories / parts</option>
                            <option value="not_as_described">Product not as described</option>
                            <option value="used">Received used / open box item</option>
                            <option value="performance">Performance issue</option>
                            <option value="other">Other (please specify)</option>
                        </select>
                        {reason === "other" && <input type="text" value={extraText} onChange={e => setExtraText(e.target.value)} placeholder="Please specify your reason" className="border p-2 rounded w-full mb-3" />}
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setReturnModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                            <button onClick={submitReturn} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Submit Return</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orderhistory;
