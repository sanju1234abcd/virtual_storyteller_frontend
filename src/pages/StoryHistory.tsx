import { useState, useEffect, useRef, useContext } from "react";
import { Music, Copy, Play, Pause } from "lucide-react";
import gsap from "gsap";
import { AppContext } from "@/AppContext";
import { toast } from "sonner";

interface Story {
  id: number;
  title: string;
  link: string;
}

export default function StoryHistory() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState<number[]>(Array(10).fill(0));

  const cardsRef = useRef<HTMLDivElement[]>([]);
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const logoRef = useRef<HTMLDivElement | null>(null);
  

  const {userId} = useContext(AppContext)

  // Fetch stories
  useEffect(() => {
    (async()=>{
    setLoading(true)
    try{
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/getStories`,{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId : userId
        })
      });
      const result = await response.json();
      if(result.success){
        setStories(result.stories);
      }
    }catch(err){
      console.log("error fetching saved stories : ",err)
    }finally{
      setLoading(false);
    }
    })()
    
  }, []);

  // Card entrance animation
  useEffect(() => {
    if (!loading && cardsRef.current.length > 0) {
      const tl = gsap.timeline({ onComplete: () =>{ tl.kill() ; return ; } });
      tl.fromTo(
        cardsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.2 }
      );
    }
  }, [loading]);

  // Update progress for each audio
  useEffect(() => {
    const listeners: Array<() => void> = [];
    audioRefs.current.forEach((audio, i) => {
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress((prev) => {
        const newProg = [...prev];
        newProg[i] = audio.duration ? audio.currentTime / audio.duration : 0;
        return newProg;
      });
    };

    const handlePlay = () => setPlayingIndex(i);
    const handlePause = () => {
      setPlayingIndex((current) => (current === i ? null : current));
    };

    const handleLoadedMetadata = () => {
      // Force update progress to refresh duration display
      setProgress((prev) => [...prev]);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  });

    return () => listeners.forEach((remove) => remove());
  }, [stories]);

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

        gsap.fromTo(".history-heading",
          { opacity: 0, scale: 0.8, y: -20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
          }
        );
      }
    }, []);

  const handlePlayPause = (index: number) => {
    const audio = audioRefs.current[index];
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      // Pause all other audios
      audioRefs.current.forEach((a, i) => {
        if (i !== index && a) a.pause();
      });
      // Highlight active card
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.to(card, {
          boxShadow:
            i === index
              ? "0 10px 30px rgba(255, 255, 255, 0.3)"
              : "0 5px 15px rgba(0,0,0,0.2)",
          duration: 0.3,
        });
      });
    } else {
      audio.pause();
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Audio link copied!");
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="h-screen overflow-x-scroll bg-gradient-to-b from-gray-900 via-purple-900 to-black p-8 font-sans flex flex-col items-center">
      {/* branding */}
      <div ref={logoRef} className="flex flex-col items-center gap-2 mb-8">
        <h1 className="text-4xl font-bold tracking-wide flex items-center gap-2">
          <span className="text-purple-600">Story</span>
          <span className="text-pink-500">Sphere</span>
        </h1>
        <p className="text-gray-500 text-sm">
          Your personal AI storytelling companion ✨
        </p>
      </div>
      <h2 className="text-2xl self-start pl-[5dvw] sm:pl-[12.5dvw] font-bold mb-8 text-start text-white history-heading">
        My Stories
      </h2>

      {loading ? (
        <p className="text-center text-purple-200 text-lg animate-pulse">
          Loading stories...
        </p>
      ) : (
        <div className="flex flex-col items-center gap-6 w-full">
          {stories.map((story, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl border border-purple-500 p-3 transition-all duration-300 shadow-md hover:shadow-white/50 flex flex-col gap-2 w-[90dvw] sm:w-[70dvw]"
            >
              {/* Title */}
              <div className="flex items-center gap-2 text-white font-semibold text-lg">
                <Music className="w-5 h-5" />
                {story.title}
              </div>

               {/* Custom Audio Player */}
<div className="flex items-center gap-4 mt-2 w-full">
  {/* Play/Pause */}
  <button
    onClick={() => handlePlayPause(index)}
    className="w-8 h-8 flex items-center justify-center bg-purple-600 hover:bg-purple-500 rounded-full transition-colors"
  >
    {playingIndex === index ? (
      <Pause className="w-4 h-4 text-white" />
    ) : (
      <Play className="w-4 h-4 text-white" />
    )}
  </button>

  {/* Progress + Time + Copy */}
  <div className="flex items-center gap-3 flex-1">
    {/* Progress bar */}
    <div
      className="h-2 bg-white/50 rounded cursor-pointer flex-1 relative"
      onClick={(e) => {
        const audio = audioRefs.current[index];
        if (!audio) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
      }}
    >
      <div
        className="h-full bg-purple-500 rounded"
        style={{ width: `${progress[index] * 100}%` }}
      />
    </div>

    {/* Current Time / Duration */}
    <span className="text-white text-sm w-20 text-right">
      {audioRefs.current[index]
        ? `${formatTime(audioRefs.current[index].currentTime)} / ${formatTime(
            audioRefs.current[index].duration
          )}`
        : "0:00 / 0:00"}
    </span>

    {/* Copy button */}
    <button
      className="flex items-center justify-center text-white p-1 hover:text-purple-400"
      onClick={() => copyLink(story.link)}
    >
      <Copy className="w-5 h-5" />
    </button>
  </div>

  {/* Hidden audio element */}
  <audio
    ref={(el) => {
      if (el) audioRefs.current[index] = el;
    }}
    src={story.link} // <-- Important: set the src
  />
</div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
