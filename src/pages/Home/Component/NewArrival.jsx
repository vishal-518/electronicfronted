import React from "react";
import { motion } from "framer-motion";

const NewArrival = () => {
    const items = [
        {
            id: 1,
            title: "PlayStation 5",
            desc: "Black and White version of the PS5 coming out on sale.",
            image: "https://img.freepik.com/free-photo/view-3d-vr-gaming-set_23-2151005781.jpg",
        },
        {
            id: 2,
            title: "Headphones",
            desc: "Wireless headphones with minimalist design.",
            image: "https://img.freepik.com/free-photo/headphones-with-minimalist-monochrome-background_23-2150763313.jpg",
        },
        {
            id: 3,
            title: "Smartphone",
            desc: "Latest smartphone with sleek design.",
            image: "https://img.freepik.com/free-photo/smartphone-device-with-minimalist-monochrome-background_23-2150763310.jpg"
        },
        {
            id: 4,
            title: "Wireless Mouse & Keyboard",
            desc: "Ergonomic wireless mouse and keyboard combo.",
            image: "https://img.freepik.com/free-photo/wireless-mouse-keyboard_1260-15.jpg",
        },
    ];

    const leftAnimation = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    };

    const rightAnimation = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    };

    return (
        <section className="my-10 container mx-auto px-4 ">
            <div className="mb-6">
                <span className="text-red-500 text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-5 bg-red-500 rounded"></span>
                    Featured
                </span>
                <h2 className="text-2xl font-bold mt-1 text-gray-900">New Arrival</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                {/* Left Big Card */}
                <motion.div
                    className="relative rounded-lg overflow-hidden group h-[300px] md:h-[500px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    variants={leftAnimation}
                >
                    <img
                        src={items[0].image}
                        alt={items[0].title}
                        className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute bottom-4 left-4 text-white z-10 transition-transform duration-500 md:group-hover:scale-110">
                        <h3 className="text-lg font-semibold">{items[0].title}</h3>
                        <p className="text-sm mb-2">{items[0].desc}</p>
                        <button className="bg-white text-black px-4 py-1 text-sm rounded hover:bg-gray-200">
                            Shop Now
                        </button>
                    </div>
                </motion.div>

                {/* Right Side Small Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.slice(1).map((item) => (
                        <motion.div
                            key={item.id}
                            className="relative rounded-lg overflow-hidden group h-[240px]"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false }}
                            variants={rightAnimation}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/25"></div>
                            <div className="absolute bottom-4 left-4 text-white z-10 transition-transform duration-500 md:group-hover:scale-110">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-sm mb-2">{item.desc}</p>
                                <button className="bg-white text-black px-4 py-1 text-sm rounded hover:bg-gray-200">
                                    Shop Now
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrival;
