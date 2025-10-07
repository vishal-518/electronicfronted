import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";
import { addToWishlist } from "../../../redux/wishlist/wishlistSlice";
import { BsHeart, BsEye } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaStar } from "react-icons/fa";
import "swiper/css";
import { IoIosHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaDiagramNext } from "react-icons/fa6";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const BestSellingProducts = () => {
    const dispatch = useDispatch();
    const [wishlistClicked, setWishlistClicked] = useState({});
    let swiperRef = useRef(null)

    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("https://electronicbackend-euwf.onrender.com/productapi")
            .then((res) => {
                const data = res.data.productdata || res.data;
                setProducts(data);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleAddToCart = (product) => {
        let token = localStorage.getItem('token')
        const productWithDelivery = { ...product, delivery: product.delivery || 0 };
        axios
            .post("https://electronicbackend-euwf.onrender.com/addtocart", productWithDelivery, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                if (res.data.status === 200) {
                    toast.success(res.data.msg);
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    toast.error(res.data.msg);
                }
            });
    };

    const handleToggleWishlist = (product) => {
        setWishlistClicked((prev) => ({
            ...prev,
            [product.id]: !prev[product.id],
        }));

        dispatch(
            addToWishlist({
                id: product.id,
                name: product.title,
                price: product.price,
                img: product.img,
            })
        );
    };
    let navigate = useNavigate()
    let datial = (product) => {
        // let token = localStorage.getItem('token');
        // if (!token) {
        //     toast.error("Please login first");
        //     return;
        // }
        axios.get(`https://electronicbackend-euwf.onrender.com/product/${product._id}`)
            .then((res) => {
                navigate("/product", { state:product });
            });
    }

    return (
        <section className="container mx-auto px-1 md:px-6 my-12">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="flex items-center justify-between mb-6 p-3 shadow-md rounded-sm">
                <div>
                    <p className="text-red-500 font-semibold">This Month</p>
                    <h2 className="text-xl md:text-2xl font-bold">Best Selling Products</h2>
                </div>
                <div className="flex justify-center gap-2 md:gap-4 mt-6">
                    <button
                        className="bg-gray-100 px-2 py-2 rounded-full hover:bg-gray-200 transition"
                        onClick={() => swiperRef.current?.slidePrev()}
                    >
                        <GrFormPreviousLink className="text-2xl" />
                    </button>
                    <button
                        className="bg-gray-100 px-2 py-2 rounded-full hover:bg-gray-200 transition"
                        onClick={() => swiperRef.current?.slideNext()}
                    >
                        <GrFormNextLink className="text-2xl" />
                    </button>
                </div>
            </div>

            <Swiper
                spaceBetween={20}
                autoplay={{ pauseOnMouseEnter: true, disableOnInteraction: false }}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                }}
                onSwiper={(swiper) => (swiperRef.current = swiper)}

                className="pb-6"
            >
                {products.map((product, index) => (
                    <SwiperSlide key={index}>
                        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-300  hover:shadow-lg transition relative group">
                            <button
                                onClick={() => handleToggleWishlist(product)}
                                className="absolute top-2 right-3 text-gray-500 opacity-0 group-hover:opacity-100 transition"
                            >
                                {wishlistClicked[product.id] ? <IoIosHeart className="text-red-400" size={20} /> : <BsHeart size={18} />}
                            </button>
                            <img
                                src={product.product_img}
                                alt={product.product_name}
                                onClick={() => { datial(product) }}
                                className="h-32 w-32 mx-auto object-contain rounded-sm transform transition duration-500 hover:scale-110 hover:-translate-y-0.5 cursor-pointer"
                            />
                            <h3 className="mt-4 text-sm font-medium text-center">
                                {product.product_name}
                            </h3>
                            <div className="flex items-center justify-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        size={14}
                                        className={
                                            i < product.rating
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">
                                    ({product.reviews})
                                </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className="text-red-500 font-bold ">
                                    ${product.product_price}
                                </span>
                                <span className="line-through text-gray-400 text-sm">
                                    ${product.product_oldPrice}
                                </span>
                            </div>
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="mt-3 w-full bg-black text-white text-sm py-2 rounded opacity-0 group-hover:opacity-100 cursor-pointer transition"
                            >
                                Add To Cart
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default BestSellingProducts;
