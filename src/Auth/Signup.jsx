import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import * as jwt_decode from "jwt-decode"; 


export default function Signup() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  let navigative = useNavigate()


  const validate = () => {
    let newErrors = {};
    if (!isLogin && !otpSent && !formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!isLogin && !otpSent) {
      if (!formData.password) newErrors.password = "Password is required";
      else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password)) newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // navigator.geolocation.getCurrentPosition(
    //   async (pos) => {
    //     const updatedData = { ...formData, location: { lat: pos.coords.latitude, lng: pos.coords.longitude, }, };

      
    //   },
    //   (err) => {
    //     alert("Please allow location access!");
    //   }
    // );
      try {
          const { data } = await axios.post("http://localhost:5000/signup", formData);
          if (data.status === 200 || data.msg === "OTP sent") {
            setMessage("OTP sent to your email.");
            setOtpSent(true);
            setErrors({});
          } else {
            setErrors({ general: data.msg });
          }
        } catch (err) {
          setErrors({ general: "Server error." });
        }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:5000/verify-otp", {
        email: formData.email,
        otp,
      });

      if (data.msg === "successfull") {
        setMessage("Account created successfully! Please login.");
        setOtpSent(false);
        setFormData({ name: "", email: "", password: "" });
        setErrors({});
        setIsLogin(true);
      } else {
        setErrors({ otp: data.msg });
      }
    } catch (err) {
      setErrors({ general: "OTP is Invaild Please Fill correct OTP" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const { data } = await axios.post("http://localhost:5000/login", formData);
      if (data.status === 200) {
        localStorage.setItem("token", data.usertoken);
        localStorage.setItem("user", JSON.stringify(data.exitsuser));
        if (data.exitsuser.role === "admin") {
          navigative("/admin");  
        } else {
          navigative("/");       
        }
        setMessage("Logged in successfully!");
        setErrors({});
      } else {
        setErrors({ general: data.msg });
      }
    } catch (err) {
      setErrors({ general: "Server error. Try again later." });
    }
  };


  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { data } = await axios.post("http://localhost:5000/auth/google", {
        credential: credentialResponse.credential
      });

      if (data.status === 200) {
        localStorage.setItem("token", data.ustoken);
        setMessage("Logged in with Google!");
        navigative('/')
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId="85461286396-tvp0anihktqa7h5i4475emmek6hsmdia.apps.googleusercontent.com">
      <div className="flex flex-col md:flex-row m-auto h-[600px]">
        {/* Left side image */}
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center">
          <img
            src="https://img.freepik.com/premium-vector/secure-login-flat-style-design-vector-illustration-stock-illustration_357500-2157.jpg?w=2000"
            alt="Signup Illustration"
            className="w-full h-full"
          />
        </div>

        {/* Right side form */}
        <div className="w-full bg-white md:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl md:text-start text-center  font-bold text-gray-900 mb-4">
              {isLogin ? "Log in to your account" : otpSent ? "Enter OTP" : "Create an account"}
            </h2>

            {errors.general && <p className="text-red-500 text-sm mb-2">{errors.general}</p>}
            {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

            <form
              className="space-y-4"
              onSubmit={isLogin ? handleLogin : otpSent ? handleVerifyOtp : handleSignup}
            >
              {/* Signup fields */}
              {!isLogin && !otpSent && (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </>
              )}

              {/* OTP input */}
              {otpSent && !isLogin && (
                <>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                  {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
                </>
              )}

              {/* Login fields */}
              {isLogin && (
                <>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full  px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                  <Link to='/forget'>
                    <button className="text-blue-400 cursor-pointer  mb-3">Forget Password</button>
                  </Link>
                </>
              )}

              <button
                type="submit"
                className="w-full cursor-pointer bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 transition"
              >
                {isLogin ? "Log In" : otpSent ? "Verify OTP" : "Create Account"}
              </button>
            </form>

            {/* Google login button */}
            {!isLogin && !otpSent && (
              <div className="mt-4">
                <p className="text-center text-gray-500 mb-2">or</p>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => console.log('Login Failed')}
                />
              </div>
            )}

            {!otpSent && (
              <p className="mt-6 text-center text-gray-600">
                {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                    setFormData({ name: "", email: "", password: "" });
                    setMessage("");
                  }}
                  className="text-black font-medium hover:underline cursor-pointer"
                >
                  {isLogin ? "Create one" : "Log in"}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
