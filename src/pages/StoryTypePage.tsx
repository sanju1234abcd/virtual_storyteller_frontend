import gsap from 'gsap';
import { ArrowRightIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const StoryTypePage : React.FC = () => {

  const logoRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  
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

    // type gsap
    useEffect(()=>{
      gsap.fromTo(
        ".type",
        { opacity: 0, scale: 0.8, y: -20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          stagger : 0.3,
          ease: "power3.out",
        }
      );
    },[]);

    if(window.innerWidth < 768){
      return (
    <div className='h-screen w-screen pt-12'>
      <div ref={logoRef} className="flex flex-col items-center gap-2 mb-8">
        <h1 className="text-2xl sm:text-3xl text-center font-lobster mb-0 sm:mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"> SWARN </h1>
        <p className="text-gray-300 text-md">
          Choose what you want to create
        </p>
      </div>
      <div className="w-full h-fit flex flex-col items-center justify-center gap-10 pb-20">
        <div className="type h-36 w-[80%] rounded-lg bg-gradient-to-br from-pink-400 via-pink-200 to-blue-400" onClick={()=> navigate("/create")}>
            <h3 className='text-2xl font-medium font-lobster flex justify-center gap-2 items-center text-center text-blue-900'> create story <ArrowRightIcon size={20} /> </h3>
            <p className="text-blue-700 text-md px-3 text-center font-medium"> let your imagination run wild , create wonderful stories from your imagination</p>
        </div>
        <div className="type h-36 w-[80%] rounded-lg bg-gradient-to-br from-pink-400 via-pink-200 to-blue-400" onClick={()=> navigate("/voice")}>
            <h3 className='text-2xl font-medium font-lobster flex justify-center gap-2 items-center text-center text-blue-900'> Narrate story <ArrowRightIcon size={20} /> </h3>
            <p className="text-blue-700 text-md px-3 text-center font-medium"> Have your own text ? let us narrate it in high quality voice , be it for social media content or your own stories</p>
        </div>
      </div>
    </div>
  )
}else{
  return <Navigate to="/create" />
}
  
}

export default StoryTypePage;