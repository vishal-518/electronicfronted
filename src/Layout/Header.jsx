import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiShoppingCart, CiHeart } from "react-icons/ci";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineAccountCircle, MdOutlineNotificationsNone, MdOutlineLogout } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import { RiCoupon3Line } from "react-icons/ri";
import { TbGiftCard, TbCoinRupee } from "react-icons/tb";
import { FaStar } from "react-icons/fa6";
import { BiSolidShoppingBags } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartdata, setCartData] = useState([]);
  const [profile, setProfile] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("https://electronicbackend-bzcr.onrender.com/cartapi", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCartData(res.data.cartapidata))
      .catch(() => toast.error("Failed to fetch cart data"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("https://electronicbackend-bzcr.onrender.com/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProfile(res.data.userprofile))
      .catch(() => toast.error("Failed to fetch profile"));
  }, []);


  useEffect(() => {
    axios
      .get("https://electronicbackend-bzcr.onrender.com/productapi",{   withCredentials: true})
      .then((res) => setProducts(res.data.productdata || res.data))
      .catch(() => toast.error("Failed to fetch products"));
  }, []);


  const wishlistQty = useSelector((state) => state.wishlist.totalQty || 0);

  const filteredProducts = products.filter((item) => {
    const combined = `${item.product_brand || ""} ${item.product_name || ""} ${item.product_titel || ""} ${item.product_type || ""}`.toLowerCase();
    return combined.includes(searchTerm.toLowerCase());
  });

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      await axios.post(
        "https://electronicbackend-bzcr.onrender.com/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      setTimeout(() => {
        navigate("/signup");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  // Toggle quantity, profile dropdown etc handled in CartPage

  return (
    <header className="bg-white text-black shadow-md sticky top-0 z-50">
      <Toaster position="top-right" />
      <div className="container mx-auto flex justify-between items-center p-4">

        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link to="/" className="text-red-900">My Logo</Link>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-medium">
          <Link to="/" className="hover:text-gray-600">Home</Link>
          <Link to="/contact" className="hover:text-gray-600">Contact</Link>
          <Link to="/seller" className="hover:text-gray-600">Become a Seller</Link>
        </nav>

        {/* Right Side: Search + Icons */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {/* Search Bar */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-black text-black"
            />
            <FaSearch className="absolute right-2 top-2 text-gray-600" />

            {/* Search Results Dropdown */}
            {searchTerm && (
              <div className="absolute top-10 left-0 w-full bg-white shadow-md rounded-md max-h-60 overflow-y-auto z-50">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => (
                    <Link
                      key={item._id}
                      to={`/product/${item._id}`}
                      className="block px-3 py-2 hover:bg-gray-100"
                      onClick={() => setSearchTerm("")}
                    >
                      <div>{item.product_brand}</div>
                      <div>{item.product_type}</div>
                      <div>{item.product_name}</div>
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-2 text-gray-500">No products found</p>
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="relative">
            <Link to="/wishlist">
              <CiHeart className="cursor-pointer" size={22} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {wishlistQty}
            </span>
          </div>

          {/* Cart */}
          <div className="relative">
            <Link to="/cart">
              <CiShoppingCart className="cursor-pointer" size={22} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {cartdata.length}
            </span>
          </div>

          {/* Profile */}
          {profile?.name ? (
            <div
              className="relative flex flex-col items-center justify-center cursor-pointer"
              onMouseEnter={() => setActiveIndex(true)}
              onMouseLeave={() => setActiveIndex(false)}
            >
              <div className="flex flex-col items-center">
                <MdOutlineAccountCircle className="text-gray-800 hover:text-gray-700 transition-colors" size={28} />
                <span className="mt-1 text-sm font-medium text-black">{profile.name}</span>
              </div>

              {activeIndex && (
                <div className="absolute top-12 right-0 w-64 bg-white rounded-md shadow-md z-50 border border-gray-200">
                  <Link onClick={()=>setActiveIndex(false)} to="/editprofile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <MdOutlineAccountCircle className="text-blue-600" size={20} />
                    <span>My Profile</span>
                  </Link>
                  <Link onClick={()=>setActiveIndex(false)} to="/supercoin" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <TbCoinRupee className="text-blue-600" size={20} />
                    <span>SuperCoin Zone</span>
                  </Link>
                  <Link onClick={()=>setActiveIndex(false)} to="/pluszone" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <FaStar className="text-blue-600" size={18} />
                    <span>Flipkart Plus Zone</span>
                  </Link>
                  <Link onClick={()=>setActiveIndex(false)} to="/orderhistory" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <BiSolidShoppingBags className="text-blue-600" size={20} />
                    <span>Orders</span>
                  </Link>
                  <Link onClick={()=>setActiveIndex(false)} to="/wishlist" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <CiHeart className="text-blue-600" size={20} />
                    <span>Wishlist</span>
                  </Link>
                  <Link onClick={()=>setActiveIndex(false)} to="/coupons" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <RiCoupon3Line className="text-blue-600" size={20} />
                    <span>Coupons</span>
                  </Link>
                  <Link onClick={()=>setActiveIndex(false)} to="/giftcards" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <TbGiftCard className="text-blue-600" size={20} />
                    <span>Gift Cards</span>
                  </Link>
                  <Link onClick={()=>setActiveIndex(false)} to="/notifications" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100">
                    <MdOutlineNotificationsNone className="text-blue-600" size={20} />
                    <span>Notifications</span>
                  </Link>
                  <button onClick={logout}  className="flex items-center cursor-pointer gap-3 px-4 py-2 hover:bg-gray-100 w-full text-left">
                    <MdOutlineLogout className="text-blue-600" size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signup">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="flex gap-3 md:hidden">
          <div className="relative">
            <Link to="/wishlist">
              <CiHeart className="cursor-pointer" size={26} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {wishlistQty}
            </span>
          </div>
          <div className="relative">
            <Link to="/cart">
              <CiShoppingCart className="cursor-pointer" size={26} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {cartdata.length}
            </span>
          </div>
          <button className="text-xl text-black" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
     <AnimatePresence>
  {menuOpen && (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg z-50 p-6 space-y-6"
    >
      <Link to="/" className="block text-lg font-medium text-black hover:text-gray-600" onClick={() => setMenuOpen(false)}>Home</Link>
      <Link to="/about" className="block text-lg font-medium text-black hover:text-gray-600" onClick={() => setMenuOpen(false)}>About</Link>
      <Link to="/contact" className="block text-lg font-medium text-black hover:text-gray-600" onClick={() => setMenuOpen(false)}>Contact</Link>

      {/* Conditional Rendering for Login/Profile */}
      {!profile?.name ? (
        <Link to="/signup" className="block text-lg font-medium text-black hover:text-gray-600" onClick={() => setMenuOpen(false)}>
          Sign Up / Login
        </Link>
      ) : (
        <div className="flex flex-col gap-2">
          <Link to="/editprofile" className="block text-lg font-medium text-black hover:text-gray-600" onClick={() => setMenuOpen(false)}>
            My Profile
          </Link>
          <Link to="/orderhistory" className="block text-lg font-medium text-black hover:text-gray-600" onClick={() => setMenuOpen(false)}>
            Orders
          </Link>
          <Link to="/wishlist" className="block text-lg font-medium text-black hover:text-gray-600" onClick={() => setMenuOpen(false)}>
            Wishlist
          </Link>
          <button
            onClick={() => { logout(); setMenuOpen(false); }}
            className="text-left block text-lg font-medium text-black hover:text-gray-600"
          >
            Logout
          </button>
        </div>
      )}
    </motion.div>
  )}
</AnimatePresence>

    </header>
  );
};

export default Header;
