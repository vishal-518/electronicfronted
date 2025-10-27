import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";
import { addToWishlist } from "../../../redux/wishlist/wishlistSlice";
import { BsHeart } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


export default function FlashSalesPage() {
    const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 23, minutes: 19, seconds: 56 });
    const [productapi, setProductApi] = useState([]);
    const dispatch = useDispatch();
    const [wishlistClicked, setWishlistClicked] = useState({});
    const navigate = useNavigate();

    const token = localStorage.getItem("token");


    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) return { ...prev, seconds: seconds - 1 };
                if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
                if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
                if (days > 0) return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);




    useEffect(() => {
        axios.get("https://electronicbackend-bzcr.onrender.com/productapi", { withCredentials: true })
            .then((res) => setProductApi(res.data.productdata))
            .catch((err) => console.error(err));
    }, []);





    const handleAddToCart = (product) => {
        const token = localStorage.getItem('token');

        // axios.get(`https://electronicbackend-bzcr.onrender.com/product/${product._id}`, { headers: { Authorization: token ? `Bearer ${token}` : "" } })
        //     .then((res) => {
        //         const productWithDelivery = { ...product, delivery: res.data.delivery };


        //     });
        axios.post(
            "https://electronicbackend-bzcr.onrender.com/addtocart",
            product,
            {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
                withCredentials: true,
            }
        ).then((res) => {
            if (res.data.status === 200) {
                toast.success(res.data.msg);
                setTimeout(() => window.location.reload(), 1500);
            } else {
                toast.error(res.data.msg);
            }
        })
            .catch((err) => {
                toast.error("Add to cart failed");
                console.error(err);
            });


       

    };


    const handleToggleWishlist = (product) => {
        setWishlistClicked((prev) => ({ ...prev, [product.id]: !prev[product.id] }));
        dispatch(
            addToWishlist({
                id: product.id,
                name: product.product_name,
                price: product.price,
                img: product.product_img,
            })
        );
    };


    const datial = (product) => {
        console.log(product)
        navigate("/product", { state: product });

        // let token = localStorage.getItem('token');
        // axios.get(`https://electronicbackend-bzcr.onrender.com/product/${product._id}`)
        //     .then((res) => {
        //         navigate("/product", { state: product });
        //     });
    };

    return (
        <section className="container mx-auto px-1 md:py-6 my-10">
            <Toaster position="top-right" reverseOrder={false} />
            {/* Heading + Countdown */}
            <div className="flex items-center justify-between mb-6 p-3 shadow-md rounded-sm">
                <div>
                    <p className="text-red-500 font-semibold">Today's</p>
                    <h2 className="text-xl md:text-2xl font-bold">Flash Sales</h2>
                </div>
                <div className="flex gap-1 md:gap-4 font-mono ">
                    <div>{String(timeLeft.days).padStart(2, "0")} <span className="text-sm">Days</span></div> :
                    <div>{String(timeLeft.hours).padStart(2, "0")} <span className="text-sm">Hours</span></div> :
                    <div>{String(timeLeft.minutes).padStart(2, "0")} <span className="text-sm">Minutes</span></div> :
                    <div>{String(timeLeft.seconds).padStart(2, "0")} <span className="text-sm">Seconds</span></div>
                </div>
            </div>

            {/* Swiper Slider */}
            <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{ 320: { slidesPerView: 1 }, 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
                loop={productapi.length > 4}
            >
                {productapi.map((product) => (
                    <SwiperSlide key={product._id}>
                        <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center relative group">
                            {product.discount && (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                    {product.product_discount}
                                </span>
                            )}
                            <button
                                onClick={() => handleToggleWishlist(product)}
                                className="absolute top-2 right-2 text-gray-500 opacity-0 group-hover:opacity-100 transition"
                            >
                                {wishlistClicked[product.id] ? <IoIosHeart className="text-red-400" size={20} /> : <BsHeart size={18} />}
                            </button>
                            <img
                                src={product.product_img}
                                alt={product.product_name}
                                onClick={() => datial(product)}
                                className="w-32 h-32  mt-4 rounded-sm transform transition duration-500 hover:scale-110 hover:-translate-y-0.5 cursor-pointer"
                            />
                            <h3 className="font-semibold mt-2 text-center">{product.product_name}</h3>
                            <div className="flex justify-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} size={14} className={i < product.rating ? "text-yellow-400" : "text-gray-300"} />
                                ))}
                            </div>
                            <p className="mt-1">
                                ${product.price}{" "}
                                <span className="line-through text-gray-500">${product.oldPrice}</span>
                            </p>
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="mt-3 w-full bg-black text-white text-sm py-2 rounded opacity-0 group-hover:opacity-100 cursor-pointer transition"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
