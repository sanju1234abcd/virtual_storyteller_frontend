import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerifyPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [code, setCode] = useState("");
  const [email,setEmail] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /\S+@\S+\.\S+/;
    if (!/^\d{6}$/.test(code)) {
      toast.error("Please enter a valid 6-digit verification code");
    }else if(!emailRegex.test(email)){
      toast.error("Please enter a valid email address");
    }
    else{
    toast.success("Verification code accepted! Proceeding...");
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: email, code: code }),
        credentials: "include"
      })
      const result = await response.json();
      if(result.success){
        toast.success("Verification successful! redirecting to login page...");
        setEmail("")
        setCode("")
        navigate("/signin")
      }else if(result.status != 500){
        toast.error(result.message);
      }
      else{
        toast.error("Verification failed. Please try again.");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    }finally{
      setLoading(false)
    }
    setLoading(false)
    }
  };

  // Starry background animation (same as your SignInPage)
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

  const inputClass =
    "px-4 py-2 rounded-lg bg-white/5 text-white placeholder-gray-300 border border-transparent " +
    "focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 " +
    "hover:shadow-[0_0_10px_rgba(168,85,247,0.8)]";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Stars Background */}
      <canvas ref={canvasRef} className="absolute z-2" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a2f]/80 to-black/80 z-0" />

      {/* Verification form */}
      <div className="relative z-10 w-full max-w-md scale-85 sm:scale-100 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg shadow-purple-500/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6 animate-pulse">
          🔒 Verify Your Account
        </h2>
        <p className="text-center text-gray-300 mb-8">
          Enter the 6-digit code sent to your email.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter verification code"
            className={`w-full ${inputClass} text-center tracking-widest text-lg font-mono`}
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} // only digits allowed
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            className={`w-full ${inputClass} text-center tracking-widest text-lg font-mono`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg active:scale-95 cursor-pointer bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
          >
            Verify →
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
