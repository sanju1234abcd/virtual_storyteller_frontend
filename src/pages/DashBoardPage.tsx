import React, { useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { User, BookOpen, CheckCircle, XCircle, LogOut, Home, Plus } from "lucide-react";
import Lottie from "lottie-react";
import wavingHand from "@/assets/Waving hand.json"
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "@/AppContext";


type UserData = {
  name: string;
  email: string;
  storyLimitPerDay: number;
  storyCreateRemaining: number;
  storyCreatedToday: number;
  totalStoryCreated: number;
};

const DashBoardPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>({
    name: "",
    email: "",
    storyLimitPerDay: 0,
    storyCreateRemaining: 0,
    storyCreatedToday: 0,
    totalStoryCreated: 0
  });

  const {userId} = useContext(AppContext)

  const navigate = useNavigate()

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async() => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/logout`,{method:"POST",credentials:"include"});
      const result = await response.json();
      if(result.success){
        document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;sameSite=Lax;Secure'
        toast.success("Logout successful!");
        navigate("/")
      }
      else{
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error logging out.please try again later");
    }
  }

  // GSAP animations
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    }
  }, []);

  //branding gsap 
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8, y: -20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = document.cookie.split("=")[1];
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/current`,{method:"POST",
          headers:{
          "Content-Type": "application/json",
        },
        body:JSON.stringify({token : token})
      });
        const result = await response.json();
        if(result.success){
        const fetchData: UserData = {
          name: result.user.name,
          email: result.user.email,
          storyLimitPerDay: 6,
          storyCreateRemaining: result.user.storyLimit.remaining,
          storyCreatedToday : 6 - result.user.storyLimit.remaining,
          totalStoryCreated: result.user.totalStoryCreated,
        };
        setUserData(fetchData);
      }else {
        throw new Error(result.message);
      }
      } catch (error) {
        console.error("Failed to fetch user data", error);
        toast.error("Failed to fetch user data . please try again");
      }
    };

    fetchUserData();
  }, []);

  if(userData && userId){

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white p-6">
      {/* branding */}
      <div ref={logoRef} className="flex flex-col items-center gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-wide flex items-center gap-2">
          <span className="text-purple-600">Story</span>
          <span className="text-pink-500">Sphere</span>
        </h1>
        <p className="text-gray-500 text-sm">
          Your personal AI storytelling dashboard ✨
        </p>
      </div>
      <div
        ref={containerRef}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-8 border border-white/20"
      >
        {/* Profile Section */}
        <div className="flex items-center justify-center flex-wrap gap-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-4 rounded-2xl shadow-lg">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 flex items-center justify-center font-bold text-lg">
            {userData.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold">{userData.name}</h2>
            <p className="text-sm text-gray-300">{userData.email}</p>
          </div>
        </div>

        {/* Welcome */}
        <h2 className="text-2xl font-semibold flex items-center gap-2">
            Welcome back, {userData.name}
            <Lottie animationData={wavingHand} loop={true} className="w-10 h-10" />
        </h2>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-purple-500/30 hover:border-purple-400/70 transition-all duration-300 shadow-md hover:shadow-purple-500/30">
            <User className="text-purple-400 group-hover:scale-110 transition" />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-semibold">{userData.email}</p>
            </div>
          </div>

          <div className="group flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-pink-500/30 hover:border-pink-400/70 transition-all duration-300 shadow-md hover:shadow-pink-500/30">
            <BookOpen className="text-pink-400 group-hover:scale-110 transition" />
            <div>
              <p className="text-sm text-gray-400">Daily Limit</p>
              <p
                
                className="font-semibold"
              >
                {userData.storyLimitPerDay}
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-green-500/30 hover:border-green-400/70 transition-all duration-300 shadow-md hover:shadow-green-500/30">
            <CheckCircle className="text-green-400 group-hover:scale-110 transition" />
            <div>
              <p className="text-sm text-gray-400">Created Today</p>
              <p
                
                className="font-semibold"
              >
                {userData.storyCreatedToday}
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-red-500/30 hover:border-red-400/70 transition-all duration-300 shadow-md hover:shadow-red-500/30">
            <XCircle className="text-red-400 group-hover:scale-110 transition" />
            <div>
              <p className="text-sm text-gray-400">Remaining Today</p>
              <p
                
                className="font-semibold"
              >
                {userData.storyCreateRemaining}
              </p>
            </div>
          </div>
        </div>

        {/* Total Stories */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 rounded-2xl text-center border border-white/20 shadow-lg">
          <p className="text-sm text-gray-300">Total Stories Created</p>
          <p
            className="text-4xl font-extrabold text-purple-400 drop-shadow-lg"
          >
            {userData.totalStoryCreated}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-1 sm:gap-6 pt-4">
          <button
            onClick={() => {navigate('/')}}
            className="flex items-center gap-2 px-3 sm:px-6 py-3 scale-70 sm:scale-100 rounded-2xl bg-purple-600 hover:bg-purple-700 transition text-lg font-semibold shadow-md hover:shadow-purple-500/40"
          >
            <Home size={20} /> Home
          </button>
          <button
            onClick={() => {navigate('/create')}}
            className="flex items-center gap-2 px-3 sm:px-6 py-3 scale-70 sm:scale-100 rounded-2xl bg-pink-600 hover:bg-pink-700 transition text-lg font-semibold shadow-md hover:shadow-pink-500/40"
          >
            <Plus size={20} /> Create
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-6 py-3 scale-70 sm:scale-100 rounded-2xl bg-red-600 hover:bg-red-700 transition text-lg font-semibold shadow-md hover:shadow-red-500/40"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
      
    </div>
  );

  }
  else{
    toast.error("User not logged in . please login first");
    return <Navigate to ={'/signin'}/>
  }
};

export default DashBoardPage;
