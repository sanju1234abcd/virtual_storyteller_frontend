import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SignInPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const fieldsRef = useRef<(HTMLInputElement | HTMLButtonElement | null)[]>([]);
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading,setLoading] = useState(false);
  const [signUpFormData, setSignUpFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [signInFormData, setSignInFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  const validateSignUp = () => {
      const nameRegex = /^[A-Za-z]+$/;
      const emailRegex = /\S+@\S+\.\S+/;
  
      if (!nameRegex.test(signUpFormData.firstName)) {
        toast("First name can only contain letters");
        return false;
      }
      if (!nameRegex.test(signUpFormData.lastName)) {
        toast("Last name can only contain letters");
        return false;
      }
      if (!emailRegex.test(signUpFormData.email)) {
        toast("Invalid email address");
        return false;
      }
      if (signUpFormData.password !== signUpFormData.confirmPassword) {
        toast("Passwords do not match");
        return false;
      }
      return true;
    };
  const handleSignUpSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateSignUp()) {
      setLoading(true)
      try{
      await fetch(`${import.meta.env.VITE_BASE_URL}/register`,{
        method:'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name : `${signUpFormData.firstName} ${signUpFormData.lastName}`, email : signUpFormData.email, password : signUpFormData.password })
      } ).then(async(response)=>{
        const result = await response.json();
        if(result.success){
          toast("Form submitted successfully!",{description:"now you will proceed to verification process"});
          navigate('/verify')
      setSignUpFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      console.log("Form Data:", signUpFormData);
        }
        else if(result.message === "Email already registered and verified" ){
          toast.error("Email already registered and verified");
        }
      })
      setLoading(false)
    }catch(error){
      toast.error("Error registering user . please try again")
      setLoading(false)
    }
    }
  };

  const handlesignInSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
    const emailRegex = /\S+@\S+\.\S+/;
    e.preventDefault();

    if (!emailRegex.test(signInFormData.email)) {
      toast("Invalid email address");
    }else{
      setLoading(true)
      try{
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/login`,{
        method:'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email : signInFormData.email, password : signInFormData.password }),
        credentials : "include"
      })

      const result = await response.json();
      const expirationTime = new Date(Date.now() + 15*24*60*60*1000);
      const expirationString = expirationTime.toUTCString();
      document.cookie = `token=${result.token};expires=${expirationString};path=/;sameSite=Lax;Secure`;
      console.log(document.cookie)
      if(result.success){
        toast.success("Form submitted successfully,signing you back");
        setSignInFormData({
          email: "",
          password: "",
        });
        navigate("/");
      }
      else{
        toast.error(result.message);
      }
    }catch(err){
      toast.error("Error logging in . please try again")
    }finally{
      setLoading(false)
    }
       
    }
  };


  // GSAP stagger effect for form fields
  useEffect(() => {
    if (fieldsRef.current.length > 0) {
      gsap.fromTo(
        fieldsRef.current,
        { opacity: 0, y: 20},
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.15,
          delay: 0.5,
          onComplete: () => {
          fieldsRef.current.forEach((el) => {
            if (el) gsap.set(el, { clearProps: "all" }); // Clears inline styles
          });
        }
        }
      );
    }
  }, [isSignUp]);

  // Starry background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let stars: { x: number; y: number; radius: number; speed: number }[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5,
      });
    }

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const updateStars = () => {
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
    };

    const animate = () => {
      drawStars();
      updateStars();
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Common input styles
  const inputClass =
    "px-4 py-2 rounded-lg bg-white/5 text-white placeholder-gray-300 border border-transparent " +
    "focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 " +
    "hover:shadow-[0_0_10px_rgba(168,85,247,0.8)]";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Stars Background */}
      <canvas ref={canvasRef} className="absolute z-2" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a2f]/80 to-black/80 z-0" />

      {/* Cube Container */}
      <div className="relative z-10 w-full max-w-md perspective h-screen flex justify-center">
        <div
          className={`relative flex items-center w-full transition-transform duration-700 transform-style-preserve-3d ${
            isSignUp ? "" : "rotate-y-180"
          }`}
        >
          {/* Sign Up Form */}
          <div
            ref={formRef}
            className="absolute scale-75 sm:scale-100 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg shadow-purple-500/20 backface-hidden"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-6 animate-pulse">
              ✨ Welcome to Storysphere ✨
            </h2>
            <p className="text-center text-gray-300 mb-8">
              Create your account and start telling magical stories.
            </p>
            <form className="space-y-4" onSubmit={handleSignUpSubmit}>
              <div className="flex space-x-4">
                <input
                  ref={(el) => {
                    fieldsRef.current[0] = el;
                  }}
                  type="text"
                  placeholder="First name"
                  className={`w-1/2 ${inputClass}`}
                  value={signUpFormData.firstName}
                  onChange={(e) => setSignUpFormData({ ...signUpFormData, firstName: e.target.value })}
                  required
                />
                <input
                  ref={(el) => {
                    fieldsRef.current[1] = el;
                  }}
                  type="text"
                  placeholder="Last name"
                  className={`w-1/2 ${inputClass}`}
                  value={signUpFormData.lastName}
                  onChange={(e) => setSignUpFormData({ ...signUpFormData, lastName: e.target.value })}
                  required
                />
              </div>
              <input
                ref={(el) => {
                  fieldsRef.current[2] = el;
                }}
                type="email"
                placeholder="Email address"
                className={`w-full ${inputClass}`}
                value={signUpFormData.email}
                onChange={(e) => setSignUpFormData({ ...signUpFormData, email: e.target.value })}
                required
              />
              <input
                ref={(el) => {
                  fieldsRef.current[3] = el;
                }}
                type="password"
                placeholder="Password"
                className={`w-full ${inputClass}`}
                value={signUpFormData.password}
                onChange={(e) => setSignUpFormData({ ...signUpFormData, password: e.target.value })}
                required
              />
              <input
                ref={(el) => {
                  fieldsRef.current[4] = el;
                }}
                type="password"
                placeholder="Confirm password"
                className={`w-full ${inputClass}`}
                value={signUpFormData.confirmPassword}
                onChange={(e) => setSignUpFormData({ ...signUpFormData, confirmPassword: e.target.value })}
                required
              />
              <button
                ref={(el) => {
                  fieldsRef.current[5] = el;
                }}
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg active:scale-95 cursor-pointer bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
              >
                Sign Up →
              </button>
            </form>
            <p className="text-center text-gray-400 mt-6 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                disabled={loading}
                className="text-purple-400 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Sign In Form */}
          <div className="absolute w-full scale-75 sm:scale-100 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg shadow-purple-500/20 backface-hidden rotate-y-180">
            <h2 className="text-3xl font-bold text-white text-center mb-6 animate-pulse">
              🔑 Welcome Back
            </h2>
            <p className="text-center text-gray-300 mb-8">
              Sign in to continue your storytelling adventure.
            </p>
            <form className="space-y-4" onSubmit={handlesignInSubmit}>
              <input
                type="email"
                placeholder="Email address"
                className={`w-full ${inputClass}`}
                value={signInFormData.email}
                onChange={(e) => setSignInFormData({ ...signInFormData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className={`w-full ${inputClass}`}
                value={signInFormData.password}
                onChange={(e) => setSignInFormData({ ...signInFormData, password: e.target.value })}
                required
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg active:scale-95 cursor-pointer bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
              >
                Sign In →
              </button>
            </form>
            <p className="text-center text-gray-400 mt-6 text-sm">
              Don’t have an account?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-purple-400 hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Tailwind utilities for cube rotation */}
      <style>
        {`
          .perspective {
            perspective: 1000px;
          }
          .transform-style-preserve-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
        `}
      </style>
    </div>
  );
};

export default SignInPage;
