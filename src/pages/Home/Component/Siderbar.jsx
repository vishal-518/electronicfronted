import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Sidebar = () => {
  const [productapi, setProductapi] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://electronicbackend-vtjh.onrender.com/productapi")
      .then((res) => setProductapi(res.data.productdata))
      .catch((err) => console.error(err));
  }, []);

  const handleMouseEnter = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveIndex(null), 300);
  };

  const filterItem = (filteredProducts) => {
    navigate("/product", { state: filteredProducts });
  };

  const uniqueTypes = [...new Set(productapi.map((p) => p.product_type))];

  return (
    <div className="w-full bg-white shadow-md relative">
      {/* Swiper Main Categories */}
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{ 640: { slidesPerView: 4 }, 768: { slidesPerView: 5 }, 1024: { slidesPerView: 6 } }}
        className="px-4 py-3"
      >
        {uniqueTypes.map((type, index) => {
          const firstProduct = productapi.find(p => p.product_type === type);
          return (
            <SwiperSlide key={index}>
              <div
                className="relative cursor-pointer hover:text-pink-600 transition flex flex-col items-center gap-1"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={firstProduct?.product_img}
                  className="w-16 h-16 object-cover rounded-md shadow-sm"
                  alt={type}
                />
                <span className="text-sm font-semibold">{type}</span>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Dropdown */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-full bg-white shadow-lg w-full p-6 grid grid-cols-3 gap-6 z-50"
            onMouseEnter={() => timeoutRef.current && clearTimeout(timeoutRef.current)}
            onMouseLeave={handleMouseLeave}
          >
            {productapi
              .filter(p => p.product_type === uniqueTypes[activeIndex])
              .map((prod, i) => (
                <div key={i} className="p-2 rounded transition ">
                  <h3 className="font-semibold text-gray-800 mb-1">{prod.product_brand}</h3>
                  <p
                    className="text-sm text-gray-600 cursor-pointer hover:text-black"
                    onClick={() => filterItem(prod)}
                  >
                    {prod.product_name}
                  </p>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
