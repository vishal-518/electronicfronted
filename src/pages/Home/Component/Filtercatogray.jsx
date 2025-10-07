import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { BsHeart } from "react-icons/bs";
import { IoIosHeart } from "react-icons/io";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";
import { addToWishlist } from "../../../redux/wishlist/wishlistSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Filtercatogray() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    axios.get("https://electronicbackend-vtjh.onrender.com/productapi")
      .then((res) => {
        const data = res.data.productdata || res.data;
        setProducts(data);
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const [filters, setFilters] = useState({
    brand: [],
    type: [],
    warranty: [],
    rating: [],
    discount: []
  });

  const [wishlistClicked, setWishlistClicked] = useState({});
  const [search, setSearch] = useState("");

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const updated = { ...prev };
      if (!updated[filterType].includes(value)) {
        updated[filterType].push(value);
      } else {
        updated[filterType] = updated[filterType].filter(v => v !== value);
      }
      return updated;
    });
  };

  useEffect(() => {
    let filtered = allProducts;

    if (filters.brand.length > 0) {
      filtered = filtered.filter(p =>
        filters.brand.some(b => p.product_brand?.toLowerCase() === b.toLowerCase())
      );
    }
    if (filters.type.length > 0) {
      filtered = filtered.filter(p =>
        filters.type.some(t => p.product_type?.toLowerCase() === t.toLowerCase())
      );
    }
    if (filters.warranty.length > 0) {
      filtered = filtered.filter(p =>
        filters.warranty.some(w => p.product_warranty?.toLowerCase() === w.toLowerCase())
      );
    }
    if (filters.rating.length > 0) {
      filtered = filtered.filter(p =>
        filters.rating.some(r => (p.rating || 0) >= r)
      );
    }
    if (filters.discount.length > 0) {
      filtered = filtered.filter(p => {
        const discountValue = parseInt(p.product_discount) || 0;
        return filters.discount.some(d => {
          if (d === "10% or more") return discountValue >= 10;
          if (d === "20% or more") return discountValue >= 20;
          if (d === "30% or more") return discountValue >= 30;
          if (d === "50% or more") return discountValue >= 50;
          return false;
        });
      });
    }
    if (search) {
      filtered = filtered.filter(p =>
        p.product_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setProducts(filtered);
  }, [filters, search, allProducts]);

  const handleToggleWishlist = (product) => {
    setWishlistClicked(prev => ({ ...prev, [product._id]: !prev[product._id] }));
    dispatch(addToWishlist({
      id: product._id,
      name: product.product_name,
      price: product.product_price,
      img: product.product_img
    }));
  };

  const handleAddToCart = (product) => {
    let token = localStorage.getItem('token')
    const productWithDelivery = { ...product, delivery: product.delivery || 0 };
    axios
      .post("https://electronicbackend-vtjh.onrender.com/addtocart", productWithDelivery, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.status === 200) {
          toast.success(res.data.msg);
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.error(res.data.msg);
        }
      });
  };

  const goToDetail = (product) => {
    let token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login first");
      return;
    }
    axios.get(`https://electronicbackend-vtjh.onrender.com/product/${product._id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        navigate("/product", { state: { ...product, delivery: res.data.delivery } });
      });
  };

  const [openSections, setOpenSections] = useState({});
  const toggleSection = (name) => setOpenSections(prev => ({ ...prev, [name]: !prev[name] }));

  const Section = ({ name, children }) => (
    <div className="border-b border-gray-300 py-3">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection(name)}>
        <span className="font-medium text-gray-700">{name}</span>
        <span className={`transform transition-transform duration-300 ${openSections[name] ? "rotate-180" : "rotate-0"}`}>&#x2228;</span>
      </div>
      <div className={`transition-all duration-300 overflow-hidden ${openSections[name] ? "max-h-[9999px] mt-2" : "max-h-0"}`}>
        <div className="pl-3 space-y-2 text-sm text-gray-600">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-0 md:p-4">
      {/* Filters */}
      <Toaster position="top-right" reverseOrder={false} />
      <div className="md:w-88 h-full p-4 border border-gray-200 rounded-xl shadow-lg bg-white">
        <h2 className="text-xl font-semibold mb-2">Filters</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-200 rounded"
        />

        <Section name="Brand">
          {["vivo","Apple","Samsung","Dell","HP","Xiaomi"].map(b => (
            <label key={b} className="block">
              <input
                type="checkbox"
                checked={filters.brand.includes(b)}
                onChange={() => handleFilterChange("brand", b)}
              /> <span className="ps-2">{b}</span>
            </label>
          ))}
        </Section>

        <Section name="Type">
          {["mobile","laptop","air conditioner","mixer"].map(t => (
            <label key={t} className="block">
              <input
                type="checkbox"
                checked={filters.type.includes(t)}
                onChange={() => handleFilterChange("type", t)}
              /> <span className="ps-2">{t}</span>
            </label>
          ))}
        </Section>

        <Section name="Warranty">
          {["3months","6months","1year","2year","3year"].map(w => (
            <label key={w} className="block">
              <input
                type="checkbox"
                checked={filters.warranty.includes(w)}
                onChange={() => handleFilterChange("warranty", w)}
              /> <span className="ps-2">{w}</span>
            </label>
          ))}
        </Section>

        <Section name="Rating">
          {[4, 3, 2].map(r => (
            <label key={r} className="block">
              <input
                type="checkbox"
                checked={filters.rating.includes(r)}
                onChange={() => handleFilterChange("rating", r)}
              /> <span className="ps-2">{r}</span> ★ & above
            </label>
          ))}
        </Section>

        <Section name="Discount">
          {["10% or more", "20% or more", "30% or more", "50% or more"].map(d => (
            <label key={d} className="block">
              <input
                type="checkbox"
                checked={filters.discount.includes(d)}
                onChange={() => handleFilterChange("discount", d)}
              /> <span className="ps-2">{d}</span>
            </label>
          ))}
        </Section>
      </div>

      {/* Products */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:ml-4">
        {products.length > 0 ? products.map(prod => (
          <div key={prod._id} className="border border-gray-300 rounded-lg p-2 md:p-4 flex flex-col items-center relative group max-w-88 max-h-80">
            {prod.product_discount && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">{prod.product_discount}</span>}
            <button
              onClick={() => handleToggleWishlist(prod)}
              className="absolute top-2 right-3 text-gray-500 opacity-0 group-hover:opacity-100 transition"
            >
              {wishlistClicked[prod._id] ? <IoIosHeart className="text-red-400" size={20} /> : <BsHeart size={18} />}
            </button>
            <img
              src={prod.product_img}
              alt={prod.product_name}
              onClick={() => goToDetail(prod)}
              className="w-32 h-32 mt-4 rounded-sm transform transition duration-500 md:hover:scale-110 md:hover:-translate-y-0.5 cursor-pointer"
            />
            <h3 className="font-semibold mt-2 text-center">{prod.product_name}</h3>
            <div className="flex justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={16} className={i < (prod.rating || 0) ? "text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
            <p className="mt-1">
              <span className="font-bold text-red-500">${prod.product_price}</span>{" "}
              <span className="line-through text-gray-400">${prod.product_oldPrice}</span>
            </p>
            <button
              onClick={() => handleAddToCart(prod)}
              className="mt-3 w-full bg-black text-white text-sm py-2 rounded opacity-0 group-hover:opacity-100 cursor-pointer transition"
            >
              Add to Cart
            </button>
          </div>
        )) : (
          <p className="text-center text-gray-500 col-span-full">No products found</p>
        )}
      </div>
    </div>
  );
}

export default Filtercatogray;
