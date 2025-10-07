import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "../Layout/AppLayout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact";
import Signup from "../Auth/Signup";
import EditProfile from "../pages/EditProfile";
import Cart from "../pages/Cart";
import WishlistPage from "../pages/WishlistPage";
import ProductPage from "../pages/ProductPage";
import Page404 from "../pages/Page404";
import ScrollToTop from "../pages/Home/Component/ScrollToTop";
import Paymentway from "../pages/Paymentway";
import OrderSuccess from "../pages/OrderSuccess";
import Orderhistory from "../pages/Orderhistory";
import Forgetpassword from "../Auth/Forgetpassword";

import AdminLayout from "../Layout/AdminLayout";
import Homedash from "../Adminpanel/Homedash";
import AddProduct from "../Adminpanel/AddProduct";
import Ordertracking from "../Adminpanel/Ordertracking";
import Users from "../Adminpanel/Users";
import ShowProduct from "../Adminpanel/ShowProduct";
import ProtectedRoute from "../Components/ProtectedRoute";
import AdminContact from "../Adminpanel/AdminContact";
import BeComeSeller from "../pages/BeComeSeller";

const AppRoutes = () => {
    return (
        <>
            <Routes>
                {/* Normal User Layout */}
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forget" element={<Forgetpassword />} />
                    <Route path="/editprofile" element={<EditProfile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/product" element={<ProductPage />} />
                    <Route path="/pay" element={<Paymentway />} />
                    <Route path="/ordersuccess" element={<OrderSuccess />} />
                    <Route path="/orderhistory" element={<Orderhistory />} />
                    <Route path="/seller" element={<BeComeSeller />} />
                    <Route path="*" element={<Page404 />} />
                </Route>

                {/* Admin Layout (Protected) */}
                <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<Homedash />} />
                    <Route path="dashboard" element={<Homedash />} />
                    <Route path="addproduct" element={<AddProduct />} />
                    <Route path="contact-user" element={<AdminContact/>} />
                    <Route path="users" element={<Users />} />
                    <Route path="showproduct" element={<ShowProduct />} />
                    <Route path="ordertracking" element={<Ordertracking />} />
                </Route>
            </Routes>
            <ScrollToTop />
        </>
    );
};

export default AppRoutes;
