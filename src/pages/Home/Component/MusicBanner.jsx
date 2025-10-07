import React, { useState, useEffect } from "react";
import Speaker from '../../../assets/Speaker.png'
import { motion } from "framer-motion";

const MusicBanner = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 5,
        hours: 23,
        minutes: 59,
        seconds: 35,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { days, hours, minutes, seconds } = prev;

                if (seconds > 0) return { ...prev, seconds: seconds - 1 };
                if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
                if (hours > 0)
                    return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
                if (days > 0)
                    return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };

                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="bg-black text-white rounded-md overflow-hidden my-12">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center px-3 md:px-12 py-10 gap-8">
                {/* Left Content */}
                <div>
                    <p className="text-green-500 font-semibold mb-3">Categories</p>
                    <h2 className="text-3xl font-bold leading-snug mb-6">
                        Enhance Your <br /> Music Experience
                    </h2>

                    {/* Countdown */}
                    <div className="flex gap-4 mb-6 flex-wrap">
                        <div className="bg-white text-black rounded-full px-4 py-3 text-center min-w-[70px]">
                            <p className="font-bold text-lg">
                                {String(timeLeft.days).padStart(2, "0")}
                            </p>
                            <span className="text-xs">Days</span>
                        </div>
                        <div className="bg-white text-black rounded-full px-4 py-3 text-center min-w-[70px]">
                            <p className="font-bold text-lg">
                                {String(timeLeft.hours).padStart(2, "0")}
                            </p>
                            <span className="text-xs">Hours</span>
                        </div>
                        <div className="bg-white text-black rounded-full px-4 py-3 text-center min-w-[70px]">
                            <p className="font-bold text-lg">
                                {String(timeLeft.minutes).padStart(2, "0")}
                            </p>
                            <span className="text-xs">Minutes</span>
                        </div>
                        <div className="bg-white text-black rounded-full px-4 py-3 text-center min-w-[70px]">
                            <p className="font-bold text-lg">
                                {String(timeLeft.seconds).padStart(2, "0")}
                            </p>
                            <span className="text-xs">Seconds</span>
                        </div>
                    </div>

                    {/* Button */}
                    <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold">
                        Buy Now!
                    </button>
                </div>

                {/* Right Image */}
                    <div className="flex justify-center">
                        <img
                            src={Speaker}
                            alt="Speaker"
                            className="w-full max-w-[500px] object-contain"
                        />
                    </div>
            </div>
        </section>
    );
};

export default MusicBanner;
