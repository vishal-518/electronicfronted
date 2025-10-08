import React, { useEffect, useState } from "react";
import FleshSalesCart from "./Component/FlashSaleCard";
import BestSellingProducts from "./Component/BestSellingProducts";
import MusicBanner from "./Component/MusicBanner";
import NewArrival from "./Component/NewArrival";
import ServiceInfo from "./Component/ServiceInfo";
import Slider from "./Component/Slider";
import BrandSlider from "./Component/BrandSlider";
import Filtercatogray from "./Component/Filtercatogray";
import ExploreMoreProduct from "./Component/ExploreMoreProduct";
import Signup from "../../Auth/Signup";
import { RxCross2 } from "react-icons/rx";
import Sidebar from "./Component/Siderbar";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedUser = JSON.parse(localStorage.getItem("token"));
      if (!storedUser || storedUser.length === 0) {
        setShowLogin(true);
      } else {
        setShowLogin(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden ">

        <Sidebar />
        <Slider />


      <div className="lg:ml-64">

        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative w-[95%] sm:w-[85%] md:w-[70%] lg:w-[55%] xl:w-[80%] bg-white rounded-2xl shadow-2xl p-2 md:p-8 overflow-y-auto">
              <button
                className="absolute top-4 right-4 cursor-pointer text-red-500 text-2xl md:text-3xl font-bold hover:text-red-700 transition"
                onClick={() => setShowLogin(false)}
              >
                <RxCross2 />
              </button>
              <Signup onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>
        )}
      </div>


        <div className="flex flex-col gap-10 p-2 sm:p-4 md:p-6 lg:p-8">
          <FleshSalesCart />
          <BrandSlider />
          <Filtercatogray />
          <BestSellingProducts />
          <MusicBanner />
          <ExploreMoreProduct />
          <NewArrival />
          <ServiceInfo />
        </div>
    </div>
  );
};

export default Home;
