import './App.css'
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from './pages/SignInPage';
import { BookOpenText, HomeIcon, User, UserPlus } from 'lucide-react';
import { FloatingNav } from './components/ui/floating-navbar';
import VerifyPage from './pages/VerifyPage';
import PromptCollecterPage from './pages/PromptCollecter';
import StoryTellingPage from './pages/StoryTellingPage';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import DashBoardPage from './pages/DashBoardPage';
import PageNotFound from './pages/PageNotFound';


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
      link: "/storytelling",
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
  const {setUserId} = useContext(AppContext)

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


  return (
    <div className='h-full w-screen bg-gradient-to-br from-[#0a1a2f] via-[#2b2e4a] to-[#000000]'>
      <FloatingNav navItems={navItems} className='bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:scale-115 hover:border-0.5 hover:border-gray-300 transition-all duration-300' />
     {!loading && 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/storytelling" element={<StoryTellingPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/create" element={<PromptCollecterPage />} />
        <Route path="/dashboard" element={<DashBoardPage />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      }
    </div>
  )
}

export default App
