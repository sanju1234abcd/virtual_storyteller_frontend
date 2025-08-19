import React,{ useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import audioUrl from "@/assets/loop.mp3";


export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(false);

  // State to hold the height of the volume lines. Now with 4 lines.
  const [lineHeights, setLineHeights] = useState([20, 20, 20, 20]);
  
  // State to track if the animation is currently running
  const [isPlaying, setIsPlaying] = useState(false);

  // Ref to get direct access to the audio element
  const audioRef = useRef<HTMLAudioElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  // useEffect hook to handle the volumn animation
  useEffect(() => {
    let animationInterval : any;

    if (isPlaying) {
      // Start the audio playback
      if (audioRef.current) {
        audioRef.current.play();
      }
      animationInterval = setInterval(() => {
        // Generate new, smoothed heights for each of the four lines
        setLineHeights(currentHeights => 
          currentHeights.map(() => {
            // Generate a random target height between 5px and 40px
            const randomHeight = Math.floor(Math.random() * 35) + 5;
            return randomHeight;
          })
        );
      }, 100); // Decreased the interval time to make the changes more frequent and smoother
    } else {
      // If not playing, stop the interval and reset the lines to a base height
      setLineHeights([20, 20, 20, 20]);
    }

    // Cleanup function to stop the interval when the component unmounts or state changes
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset audio to the beginning
      }
    };
  }, [isPlaying]); // This effect now depends on the `isPlaying` state

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit h-[8.5dvh] fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-5000 pr-8 pl-8 py-2  items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <a
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              `relative dark:text-neutral-50 items-center ${(navItem.name)} flex space-x-1 text-neutral-50 dark:hover:text-neutral-300 hover:text-neutral-300`
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-md">{navItem.name}</span>
          </a>
        ))}
        {/* Visual volume lines container */}
        <div className="flex items-end justify-center h-[70%] scale-75 space-x-1" onClick={()=>{ setIsPlaying((prev)=> !prev)}}>
          {lineHeights.map((height, index) => (
            <div
              key={index}
              className="w-1 rounded-full bg-neutral-300 transition-all duration-200 ease-in-out"
              style={{height:`${height}px`}}
            ></div>
          ))}
          {/* The audio element, hidden from view but controlled by the script */}
        {/* The 'loop' attribute makes the audio play over and over */}
        <audio ref={audioRef} src={audioUrl} preload="auto" loop className="hidden"></audio>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
