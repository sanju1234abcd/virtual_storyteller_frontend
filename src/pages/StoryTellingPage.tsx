import React, { useState, useRef, useEffect, useContext } from "react";
import { Play, Pause, StopCircle, RotateCcw } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { LoaderOne } from "@/components/ui/loader";
import { AppContext } from "@/AppContext";

gsap.registerPlugin(ScrollTrigger);

const StoryTellingPage: React.FC = () => {
  const { userId, storyText, storyTitle, thumbnailSrc, audioRef} = useContext(AppContext);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTextOnImage, setShowTextOnImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);

  const navigator = useNavigate();
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // GSAP animations
  useEffect(() => {
    if (containerRef.current && controlsRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(containerRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 });
      tl.fromTo(controlsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, "<0.5");
    }
  }, [loading]);

  useEffect(() => {
    if (!buttonsRef.current) return;
    gsap.fromTo(buttonsRef.current, { opacity: 0, y: 60 }, {
      opacity: 1, y: 0, duration: 1,
      scrollTrigger: { trigger: buttonsRef.current, start: "top 90%" }
    });
  }, []);

  // Audio setup
  useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return; // ✅ Prevent null access

  const handleMetadata = () => setDuration(audio.duration);
  const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
  const handleEnded = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
  };

  // ✅ Attach listeners
  audio.addEventListener("loadedmetadata", handleMetadata);
  audio.addEventListener("timeupdate", handleTimeUpdate);
  audio.addEventListener("ended", handleEnded);

  // ✅ Optionally load metadata right away
  audio.load();

  return () => {
    // ✅ Remove listeners
    audio.removeEventListener("loadedmetadata", handleMetadata);
    audio.removeEventListener("timeupdate", handleTimeUpdate);
    audio.removeEventListener("ended", handleEnded);

    // ✅ Cleanup audio source if you want to fully reset
    audio.pause();
    audio.src = "";
  };
}, []);


  const handlePlayPause = () => {
    if (!audioRef || !audioRef.current) return;
    if (isPlaying && !isPaused) {
      audioRef.current.pause();
      setIsPaused(true);
    } else if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.currentTime = currentTime;
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
    setIsPaused(false);
  };

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleDownloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([storyText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${storyTitle.toLowerCase().replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Story downloaded!");
  };

  const handleDownloadAudio = () => {
    if (!audioRef.current) return;
    const element = document.createElement("a");
    element.href = audioRef.current.src;
    element.download = `${storyTitle.toLowerCase().replace(/\s+/g, "_")}.mp3`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Audio downloaded!");
  }

  // Navigation warning
  const handleNavigation = (path: string) => {
    if (storyTitle !== "sample story") {
      setNextLocation(path);
      setShowConfirm(true);
    } else {
      navigator(path);
    }
  };

  const confirmNavigation = () => {
    setShowConfirm(false);
    if (nextLocation) navigator(nextLocation);
  };

  const cancelNavigation = () => {
    setShowConfirm(false);
    setNextLocation(null);
  };

  // Browser refresh/close warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (storyTitle !== "sample story") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [storyTitle]);

  if(userId){

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-gradient-to-br from-[#0a1a2f]/80 to-black/80 flex flex-col items-center justify-start p-8 pb-20">
      {loading && (
        <div className="fixed gap-2.5 text-3xl text-white inset-0 z-[9999] bg-black bg-opacity-60 flex items-center justify-center flex-wrap select-none pointer-events-auto">
          checking audio, please wait<LoaderOne/>
        </div>
      )}
      <h1 className="text-2xl text-center font-lobster mb-0 sm:mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"> SWARN </h1>

      <h3 className="text-white/80 text-sm md:text-xl mb-6 font-semibold select-none drop-shadow-lg w-[90%] md:w-[70%]">
        Story created, enjoy the adventure (navigating to other pages can hamper/corrupt your audio file,so please stay on this page or download audio to listen later)
      </h3>

      <div ref={containerRef} className="relative z-20 flex flex-col items-center justify-center w-full max-w-3xl h-[80vh] p-2 sm:p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-lg shadow-purple-600/40 select-none">
        <div className="relative w-full h-full rounded-3xl overflow-hidden cursor-pointer shadow-2xl" onClick={() => setShowTextOnImage(!showTextOnImage)}>
          {!showTextOnImage && (
            <h1 className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 text-white text-sm md:text-lg lg:text-2xl font-extrabold drop-shadow-lg text-center px-6 select-text max-w-[90%] break-words">
              {storyTitle}
            </h1>
          )}

          <img src={thumbnailSrc} alt="Story thumbnail" className={`w-full h-full object-cover transition-opacity duration-500 ${showTextOnImage ? "opacity-25" : "opacity-100"}`} />

          {showTextOnImage && (
            <div className="absolute inset-0 p-8 overflow-auto text-white whitespace-pre-wrap text-md md:text-xl leading-relaxed bg-black/60 rounded-3xl pb-[18dvh]">
              {storyText}
            </div>
          )}

          {/* Audio controls */}
          <div ref={controlsRef} className="absolute bottom-2 md:bottom-6 left-0 right-0 flex flex-col items-center space-y-1 md:space-y-3 z-30 px-6 opacity-0">
            <div className="flex space-x-3 md:space-x-8">
              <button onClick={(e) => { e.stopPropagation(); handlePlayPause(); }} className="flex items-center justify-center w-12 h-12 scale-60 sm:scale-70 md:scale-100 bg-purple-600 rounded-full hover:bg-purple-700 text-white shadow-lg transition">
                {isPlaying && !isPaused ? <Pause size={window.innerWidth < 640 ? 15 : 32} /> : <Play size={window.innerWidth < 640 ? 15 : 32} />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleStop(); }} className="flex items-center justify-center w-12 h-12 scale-60 sm:scale-70 md:scale-100 bg-purple-600 rounded-full hover:bg-purple-700 text-white shadow-lg transition">
                <StopCircle size={window.innerWidth < 640 ? 15 : 32} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleRestart(); }} className="flex items-center justify-center w-12 h-12 scale-60 sm:scale-70 md:scale-100 bg-purple-600 rounded-full hover:bg-purple-700 text-white shadow-lg transition">
                <RotateCcw size={window.innerWidth < 640 ? 15 : 32} />
              </button>
            </div>
            <div className="flex items-center justify-center space-x-4 w-fit md:w-full bg-black/70 p-2 rounded-full">
              <span className="text-white text-sm">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={(e) => {
                  e.stopPropagation();
                  if (audioRef.current) audioRef.current.currentTime = Number(e.target.value);
                }}
                className="flex-1"
              />
              <span className="text-white text-sm">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button onClick={handleDownloadText} className="mt-6 w-30 sm:w-48 text-xs sm:text-lg py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg transition">
            Download Story Text
          </button>
          <button onClick={handleDownloadAudio} className="mt-6 w-30 sm:w-48 text-xs sm:text-lg py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg transition">
            Download Audio
          </button>
        </div>
      </div>

      <div ref={buttonsRef} className="mt-10 flex gap-8 justify-center w-full max-w-3xl flex-wrap">
        <button onClick={() => handleNavigation("/create")} className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg transition">
          Create Another Story
        </button>
        <button onClick={() => handleNavigation("/")} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg transition">
          Home
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="mb-4">Are you sure you want to leave? Your story progress will be lost.</p>
            <div className="flex gap-4 justify-center">
              <button onClick={confirmNavigation} className="px-4 py-2 bg-green-500 text-white rounded">Yes</button>
              <button onClick={cancelNavigation} className="px-4 py-2 bg-red-500 text-white rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}else{
  return <Navigate to = "/signin" />
}
};

export default StoryTellingPage;
