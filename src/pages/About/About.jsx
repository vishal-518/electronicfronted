import React from "react";
import StatsSection from "../../pages/About/Component/StatsSection";
import TeamSlider from "./Component/TeamSlider";
import Features from "./Component/Features";

export default function About() {
  return (

    <>
      <div className="flex flex-col md:flex-row items-center gap-8 px-8 py-16">
        {/* Left Text Section */}
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Launched in 2015, Exclusive is South Asia's premier online shopping
            marketplace with an active presence in Bangladesh. Supported by wide
            range of tailored marketing, data and service solutions, Exclusive has
            10,500 sellers and 300 brands and serves 3 millions customers across
            the region.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Exclusive has more than 1 Million products to offer, growing at a very
            fast. Exclusive offers a diverse assortment in categories ranging from
            consumer.
          </p>
        </div>

        {/* Right Image Section */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://img.freepik.com/free-photo/front-view-couple-talking-real-estate-agent_23-2150322109.jpg?t=st=1755876047~exp=1755879647~hmac=835c31c87956ee4db13001b33ea803003c920bc87abf28cf8041e94658ce4f22&w=1480" // replace with your actual image
            alt="Happy customers shopping"
            className="rounded-lg shadow-md"
          />
        </div>

      </div>
      <StatsSection />
      <TeamSlider/>
      <Features/>
      
    </>
  );
}
