import React, { useEffect, useState } from 'react';
import FleshSalesCart from './Component/FlashSaleCard';
import BestSellingProducts from './Component/BestSellingProducts';
import MusicBanner from './Component/MusicBanner';
import NewArrival from './Component/NewArrival';
import ServiceInfo from './Component/ServiceInfo';
import Slider from './Component/Slider';
import BrandSlider from './Component/BrandSlider';
import Filtercatogray from './Component/Filtercatogray';
import ExploreMoreProduct from './Component/ExploreMoreProduct';
import Signup from '../../Auth/Signup';
import { RxCross2 } from 'react-icons/rx';
import Sidebar from './Component/Siderbar';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedUser = JSON.parse(localStorage.getItem('token'));
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
    <div className="relative">
      <Sidebar />
      <Slider />

      {showLogin && (
        <div className="fixed border inset-0 z-50 flex items-center justify-center bg-opacity-30  overflow-auto backdrop-brightness-50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4 md:mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              <div className="flex justify-end p-3">
              <button
                className="text-red-500 cursor-pointer text-2xl md:text-3xl font-bold hover:text-red-700 transition"
                onClick={() => setShowLogin(false)}
              >
                <RxCross2 />
              </button>
            </div>
              <Signup onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>
        </div>
      )}

      <FleshSalesCart />
      <BrandSlider />
      <Filtercatogray />
      <BestSellingProducts />
      <MusicBanner />
      <ExploreMoreProduct />
      <NewArrival />
      <ServiceInfo />
    </div>
  );
};

export default Home;
