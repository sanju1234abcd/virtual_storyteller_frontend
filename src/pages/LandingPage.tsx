import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import React, { useContext, useEffect, useRef } from "react";
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all";
import { UserPlus , ArrowRightIcon } from "lucide-react";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import GradientText from "@/components/GradientText/GradientText";
import HoverHighlightText from "@/components/HighlightedText/HightlightedText";
import { HeroParallax } from "@/components/ui/hero-parallax";
import exampleImage1 from "@/assets/example_1.png";
import exampleImage2 from "@/assets/example_2.png";
import exampleImage3 from "@/assets/example_3.png";
import exampleImage4 from "@/assets/example_4.png";
import exampleImage5 from "@/assets/example_5.png";
import exampleImage6 from "@/assets/example_6.png";
import exampleImage7 from "@/assets/example_7.png";

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { AppContext } from "@/AppContext";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import profileBoy from "@/assets/profile_boy.json"

gsap.registerPlugin(ScrollTrigger)

const LandingPage : React.FC = ()=> {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getStartedRef = useRef<HTMLButtonElement>(null);
  const signUpRef = useRef<HTMLButtonElement>(null);
  const featureRefs = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate()

  const {userId} = useContext(AppContext);


  const products = [
  {
    title: "prompt : his reflection winks at him in the mirror",
    link: "/create",
    thumbnail: exampleImage1,
  },
  {
    title: "prompt : a book that adds new stories each day",
    link: "/create",
    thumbnail: exampleImage5,
  },
  {
    title: "prompt : create a story of a detective solving brutal murder case in kolkata",
    link: "/create",
    thumbnail: exampleImage2,
  },
 
  {
    title: "prompt : his reflection winks at him in the mirror",
    link: "/create",
    thumbnail: exampleImage1,
  },
  {
    title: "",
    link: "/create",
    thumbnail: exampleImage3,
  },
  {
    title: "",
    link: "/create",
    thumbnail: exampleImage4,
  },
 
  {
    title: "prompt : suddenly sun forgets to rise for three days",
    link: "/create",
    thumbnail: exampleImage6,
  },
  {
    title: "prompt : a tree only speaks to you",
    link: "/create",
    thumbnail: exampleImage7,
  },
  {
    title: "prompt : his reflection winks at him in the mirror",
    link: "/create",
    thumbnail: exampleImage1,
  }
];
  const testimonials = [
    {
      quote:
        "I wrote a simple prompt, and the AI crafted a captivating story with amazing narration and visuals. Truly magical!",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "StorySphere transformed my ideas into immersive tales effortlessly. The voice narration feels so natural, I was hooked!",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The custom AI-generated illustrations bring every story to life. It’s like having a professional storyteller and artist in one.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Stunning visuals, emotional narration, and instant sharing — this app made my indie short feel cinematic.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "I typed a tiny prompt and got a fully narrated short with a gorgeous thumbnail — it sounded like a mini radio drama",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  useEffect(() => {
    //hero button gsap 
    gsap.set([getStartedRef.current, signUpRef.current], {
      opacity: 0,
    });

    //features gsap
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%", // when 80% of viewport height
            toggleActions: "play none none reverse",
          },
        }
      );
    }
    featureRefs.current.forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.2,
        scrollTrigger: {
          trigger: el,
          start: "top 80%", // animation starts when card is in viewport
          toggleActions: "play none none reverse",
        },
      });
      el.addEventListener("mouseenter", () => {
        gsap.to(el, { scale: 1.05, duration: 0.1 });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { scale: 1, duration: 0.1 });
      });
    });

    //testimonials gsap
    gsap.from(".test-h1",{
      opacity: 0,
      y: 50,
      duration: 0.8,
      scrollTrigger: {
        trigger: ".test-h1",
        start: "top 80%", // when 80% of viewport height
        toggleActions: "play none none reverse",
      }
    })

    //cta section gsap
    if (!ctaRef.current) return;

    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%", // when top of CTA hits 80% viewport height
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animation sequence
    gsap.to(getStartedRef.current, {
      opacity: 1,
      duration: 0.8,
      delay: 2.5,
      ease: "back.out(1.7)",
    });

    gsap.to(signUpRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      delay: 2.7,
      ease: "back.out(1.7)",
    });

    //sparticles
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; speedX: number; speedY: number }[] = [];
    let animationFrameId: number;

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const drawParticles = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.shadowColor = "white";
        ctx.shadowBlur = 10;
        ctx.fill();
      });
    };

    const updateParticles = () => {
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      });
    };

    const animate = () => {
      drawParticles();
      updateParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="relative w-screen h-full bg-gray-900 overflow-x-hidden">


    {/*user show*/}
      {userId && 
      <div className="fixed top-4 right-4 z-50 h-fit w-fit flex items-center justify-center rounded-full">
        <Lottie title="go to dashboard" onClick={() => navigate("/dashboard")} animationData={profileBoy} loop={true} className="w-20 h-20 scale-150 cursor-pointer" />
      </div> }
      

      {/* Sparkle Background */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen"></canvas>
      {/*content*/}
      
      <div className="relative z-10 text-white h-full">
        <section
          id="hero"
          className="flex flex-col items-center justify-center text-center py-20 h-screen"
        >
          
          <TypingAnimation className="text-6xl font-bold mb-6 drop-shadow-lg flex" duration={40}>✨ Storysphere ✨</TypingAnimation>
          
          <TextGenerateEffect className="text-xl max-w-2xl" startDelay={0.3} words="Your AI-powered magical storyteller. Create immersive tales with a single prompt."/>
          <div className="flex gap-6 mt-8">
            <button ref={getStartedRef} onClick={()=>{ navigate('/create')}} className="btn-get-started flex items-center justify-between gap-1 px-8 py-3 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg shadow-pink-500/40 hover:scale-105 transition-transform duration-300 hover:shadow-pink-400/60">
              ✨ Get Started <ArrowRightIcon size={20}/>
            </button>
            {!userId && 
            <button ref={signUpRef} onClick={()=>{ navigate("/signin")}} className="btn-sign-up px-8 py-3 flex gap-1 items-center rounded-full text-lg font-semibold text-pink-200 border border-pink-400/60 bg-transparent hover:bg-pink-400/10 transition-all duration-300 shadow-inner">
              <UserPlus size={20}/>Sign Up
            </button>
            }
          </div>

        </section>
        
        {/* Features Section */}
        <section className="flex-col items-center">
          <div
      ref={titleRef}
      className="text-center mb-12"
    >
      <h2 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
        🚀 Features You’ll Love
      </h2>
      <p className="text-lg text-gray-300 mt-3">
        Powerful, simple, and designed with you in mind.
      </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-20 max-w-6xl mx-auto">
          {[
  {
    title: "Interactive Narratives",
    desc: "Shape the story as it unfolds with dynamic AI prompts that adapt to your choices. From thrilling adventures to heartfelt dramas, you’re in control of every twist and turn, making each reading experience uniquely yours.",
  },
  {
    title: "Visual Magic",
    desc: "Every tale comes alive with a custom AI-generated cover illustration, tailored to match the mood and theme of your story. These vibrant, high-resolution artworks transform your narrative into a visual masterpiece worth sharing.",
  },
  {
    title: "Immersive Audio",
    desc: "Enjoy cinematic-quality narration with expressive voices and subtle background effects that draw you deeper into the story world. Whether you’re relaxing at home or on the go, it’s like having a personal storyteller by your side.",
  },
].map((f, i) => (
  <div
    key={i}
    ref={(el) => {
      if (el) featureRefs.current[i] = el;
    }}
    className="bg-white/10 p-6 rounded-xl backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300"
  >
    <h2 className="text-2xl font-bold mb-2">
      <GradientText colors={["#ffaa40", "#9c40ff", "#ffaa40"]} >
        {f.title}
      </GradientText>
    </h2>
    {/*<p className="text-gray-200 leading-relaxed">{f.desc}</p>*/}
    <HoverHighlightText text={f.desc} />
  </div>
))}

          </div>
        </section>

        {/* example showing section*/}

        <HeroParallax products={products}/>

        <div className="relative h-full max-w-screen">

        <h1 className="text-4xl font-bold text-white text-center mt-12 test-h1">hear what our users have to say</h1>

        <AnimatedTestimonials testimonials={testimonials}/>

        </div>

        <section
      ref={ctaRef}
      className="max-w-4xl w-fit mx-auto my-20 p-10 bg-transparent md:bg-purple-700 rounded-xl text-center text-white shadow-lg"
    >
      <h2 className="text-4xl font-bold mb-4">Ready to Bring Your Story to Life?</h2>
      <p className="mb-6 text-lg">
        Start creating immersive stories with just one prompt — AI-powered narration and stunning visuals included.
      </p>
      <button className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-full hover:bg-purple-100 transition" onClick={()=>{ navigate("/create")}}>
        Get Started for Free
      </button>
    </section>



      </div>
            

      
    </div>
  );
}

export default LandingPage
