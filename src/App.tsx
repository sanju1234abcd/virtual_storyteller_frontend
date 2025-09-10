import './App.css'
import { Route, Routes, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from './pages/SignInPage';
import { BookOpenText, HomeIcon, User, UserPlus } from 'lucide-react';
import { FloatingNav } from './components/ui/floating-navbar';
import VerifyPage from './pages/VerifyPage';
import PromptCollecterPage from './pages/PromptCollecter';
import StoryTellingPage from './pages/StoryTellingPage';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from './AppContext';
import DashBoardPage from './pages/DashBoardPage';
import PageNotFound from './pages/PageNotFound';
import StoryHistory from './pages/StoryHistory';
import VoiceGenerationPage from './pages/VoiceGenerationPage';
import LoadingPage from './pages/LoadingPage';
import DockNavbar from './components/DockNavbar';
import StoryTypePage from './pages/StoryTypePage';
import ImageGeneration from './pages/ImageGeneration';
import Lottie from 'lottie-react';
import profileBoy from "@/assets/profile_boy.json"


function App() {

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <HomeIcon />,
    },
    {
      name: "Sign-in",
      link: "/signin",
      icon: <UserPlus />,
    },
    {
      name: "Create",
      link: "/create",
      icon: (
        <BookOpenText />
      ),
    },
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: (
        <User />
      ),
    }
  ];

  const [loading,setLoading] = useState(true)
  const { userId , setUserId} = useContext(AppContext)

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const navigate = useNavigate();

  useEffect(()=>{
    (async()=>{
      try{
        setLoading(true)
        const token = document.cookie.split("=")[1];
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/current`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
        },
       body: JSON.stringify({token:token})
      });
      const result = await response.json();
      if(result.success){
        setUserId(result.user._id);
      }
    }catch(err){
      setUserId("")
    }finally{
      setLoading(false)
    }
    })()
    
  },[])

  // Starry background
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
  
      let width = window.innerWidth;
      let height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
  
      type Star = { x: number; y: number; radius: number; speed: number };
      let stars: Star[] = [];
  
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5,
          speed: Math.random() * 0.5 + 0.05,
        });
      }
  
      const drawStars = () => {
        ctx.clearRect(0, 0, width, height);
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
          if (star.y > height) {
            star.y = 0;
            star.x = Math.random() * width;
          }
        });
      };
  
      let animationFrameId: number;
      const animate = () => {
        drawStars();
        updateStars();
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();
  
      const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      };
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
      };
    }, []);


  return (
    <div className='relative h-full w-screen bg-gradient-to-br from-[#0a1a2f] via-[#2b2e4a] to-[#000000]'>
      <FloatingNav navItems={navItems} className='bg-white/20 hidden md:flex backdrop-blur-md border border-white/30 shadow-lg hover:scale-115 hover:border-0.5 hover:border-gray-300 transition-all duration-300' />
      {/* Star background */}
      <canvas
        ref={canvasRef}
        className={`fixed top-0 left-0 w-screen h-screen z-20 pointer-events-none ${loading ? "hidden" : ""}`}
      />
      {/*user show*/}
      {userId && 
      <div className="fixed top-1 right-2 z-50 h-fit w-fit flex items-center justify-center rounded-full scale-65 sm:scale-100">
        <Lottie title="go to dashboard" onClick={() => navigate("/dashboard")} animationData={profileBoy} loop={true} className="w-20 h-20 scale-150 cursor-pointer" />
      </div> }
     {!loading && 
     <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/storytelling" element={<StoryTellingPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/storyType" element={<StoryTypePage />} />
        <Route path="/create" element={<PromptCollecterPage />} />
        <Route path="/voice" element={<VoiceGenerationPage />} />
        <Route path="/dashboard" element={<DashBoardPage />} />
        <Route path="/history" element={<StoryHistory />} />
        <Route path="/image" element={<ImageGeneration />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      <DockNavbar />
      </>
      }
      {loading && <LoadingPage/>}
    </div>
  )
}

export default App
