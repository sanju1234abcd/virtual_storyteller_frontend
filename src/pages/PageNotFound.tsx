import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate background gradient
    if (bgRef.current) {
      gsap.fromTo(
        bgRef.current,
        { backgroundPosition: "0% 50%" },
        {
          backgroundPosition: "100% 50%",
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: "linear",
        }
      );
    }

    // Animate "404" text
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { scale: 0.9, opacity: 0.7 },
        {
          scale: 1.05,
          opacity: 1,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        }
      );
    }
  }, []);

  return (
    <div
      ref={bgRef}
      className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white px-4"
      style={{ backgroundSize: "400% 400%" }}
    >
      <h1
        ref={textRef}
        className="text-8xl font-extrabold mb-6 drop-shadow-lg"
      >
        404
      </h1>

      <p className="text-2xl font-semibold mb-2">
        Oops! Looks like you’re lost in the StorySphere 🌌
      </p>
      <p className="text-lg text-gray-200 mb-10 max-w-xl">
        The page you’re looking for doesn’t exist or has been moved.  
        But don’t worry — every good story finds its way back home. ✨
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
