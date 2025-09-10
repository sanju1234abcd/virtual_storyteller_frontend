import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Play, Pause, Download } from "lucide-react";
import { toast } from "sonner";
import { GoogleGenAI } from "@google/genai";
import { Link } from "react-router-dom";

const VoiceGenerationPage: React.FC = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("Female");
  const [customPrompt, setCustomPrompt] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLInputElement | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const textToVoice = async()=>{
    try{
    const ai = new GoogleGenAI({apiKey : import.meta.env.VITE_GEMINI_KEY})
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `${customPrompt ? `${customPrompt} : ` : "say this : "} ${text}` }]}],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: `${voice === 'Female' ? "kore" : "Charon"}`
            },
          },
        },
      },
    });

    // Get base64 audio data
      const base64Data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      function base64ToWavBlob(base64Data : any, sampleRate = 24000, numChannels = 1) {
  const bytes = atob(base64Data).split('').map(c => c.charCodeAt(0));
  const buffer = new ArrayBuffer(44 + bytes.length);
  const view = new DataView(buffer);

  // RIFF header
  function writeString(offset : any, str : any) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + bytes.length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true);   // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true); // Byte rate
  view.setUint16(32, numChannels * 2, true); // Block align
  view.setUint16(34, 16, true);  // Bits per sample
  writeString(36, 'data');
  view.setUint32(40, bytes.length, true);

  // Write PCM data
  for (let i = 0; i < bytes.length; i++) {
    view.setUint8(44 + i, bytes[i]);
  }

  return new Blob([view], { type: 'audio/wav' });
}

// Usage in React
    if (base64Data) {
      const wavBlob = base64ToWavBlob(base64Data);
      const url = URL.createObjectURL(wavBlob);
      //now reducing story limit
        const token = document.cookie.split("=")[1];
        const response2 = await fetch(`${import.meta.env.VITE_BASE_URL}/story`, {
          method: "POST",
          headers : {
            "Content-Type": "application/json",
          },
          body : JSON.stringify({ token : token })
        })
        const result2 = await response2.json();
        if(result2.success){
          setAudioUrl(url);
        }else{
          toast.error("something went wrong while accessing your account");
        }
    }
  }catch(error){
    console.error(error);
    toast.error("An error occurred while generating voice.");
  }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAudioUrl(null);
    if (!text.trim()) {
      toast.warning("Please enter some text to generate voice.");
      setLoading(false)
      return;
    }else{
      const token = document.cookie.split("=")[1];
    
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/current`, {
          method: "POST",
          headers : {
            "Content-Type": "application/json",
          },
          body : JSON.stringify({ token : token })
        })
    
        const result = await response.json();
    
        if(result.success){
          if(result.user.storyLimit.remaining >=1){
            toast.success("voice generated started . please wait for completion .")
            await textToVoice();
            setLoading(false)
          }else{
            toast.error("You have reached your story limit for the day.");
            setLoading(false);
            setText("")
          }
        }else{
          toast.error("something went wrong while accessing your account");
            setLoading(false);
            setText("")
        }
    }
  }
  // Format mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    if (progressRef.current) {
      progressRef.current.value = (
        (audioRef.current.currentTime / audioRef.current.duration) *
        100
      ).toString();
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = seekTime;
  };

  // Browser refresh/close warning
      useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
          if (loading) {
            e.preventDefault();
            e.returnValue = "";
          }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
      }, [loading,location.pathname]);

  return (
    <div
      ref={containerRef}
      className="relative h-fit flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1a2f] via-[#2b2e4a] to-[#000000] text-white px-4 py-6"
    >
      <h1 className="text-3xl text-center font-lobster mb-0 sm:mb-4 text-white"> SWARN </h1>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 mt-4 text-center">
        🎙️ <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Create Your Custom Narration</span>
      </h1>
        {window.innerWidth > 768 &&
      <p className="text-sm sm:text-lg w-[80%] sm:w-[90%] text-center text-white/60 mb-2">
          Convert your text into lifelike speech with customizable narration styles . be it for your youtube shorts or an audiobook for your own story with a whopping 10000 characters limit"
      </p>
        }
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        {/* Left Column (Form) */}
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-2xl sm:shadow-lg sm:bg-gray-900/40 sm:backdrop-blur-md w-full md:w-[70%] space-y-4"
        >
          <div className="flex justify-end">
            <a
              href="/example.txt"
              download="example_narration.txt"
              className="text-sm text-blue-400 hover:underline"
            >
              📄 Download narration guidelines
            </a>
          </div>

          <div>
            <label className="font-medium block mb-1 text-sm sm:text-md">
              Custom Narration Prompt:
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => e.target.value.length <= 100 && setCustomPrompt(e.target.value)}
              placeholder='e.g. "say this in a cheerful manner"'
              className="w-full h-15 p-3 rounded-lg bg-gray-800 placeholder:text-[2.4dvh] sm:placeholder:text-md text-white outline-none resize-none border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow shadow-md shadow-purple-900/50 hover:shadow-purple-600/70"
            />
            <div className="w-full flex items-center justify-between space-x-4">
              <p className="text-sm text-gray-400">{customPrompt.length} / 100</p>
            </div>
          </div>

          <label className="font-medium block mb-1 text-sm sm:text-md">Text :</label>
          <textarea
            value={text}
            onChange={(e) =>
              e.target.value.length <= 10000 && setText(e.target.value)
            }
            placeholder="Write your text here..."
            className="w-full h-80 md:h-32 p-3 rounded-lg bg-gray-800 placeholder:text-[2.4dvh] sm:placeholder:text-md text-white outline-none resize-none border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow shadow-md shadow-purple-900/50 hover:shadow-purple-600/70"
            required
          />
          <p className="w-full text-xs sm:text-[2.5dvh] text-start py-0 text-white/50 hidden sm:block">want to create story from your idea ? <Link to="/create" className={`text-pink-500 hover:text-pink-600 ${loading ? "pointer-events-none" : ""}`}>click here</Link></p>

          <div className="w-full flex items-center justify-between space-x-4">
            <p className="text-sm text-gray-400">{text.length} / 10000</p>
            <div className="flex items-center gap-2">
              <label className="font-light text-sm sm:text-block sm:font-medium">Narrator Voice:</label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="bg-gray-800 p-2 rounded-lg scale-90 sm:scale-100"
              >
                <option>Female</option>
                <option>Male</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              "Generate Voice"
            )}
          </button>
        </form>

        {/* Right Column (Voice Output with Custom Player) */}
        <div className="w-full md:w-[30%] flex flex-col items-center">
          {loading ? (
            <div className="w-full p-4 bg-gray-800 rounded-xl animate-pulse">
              <div className="h-5 w-1/2 bg-gray-700 rounded mb-3"></div>
              <div className="h-10 w-full bg-gray-700 rounded"></div>
            </div>
          ) : audioUrl ? (
            <div className="w-full p-4 bg-gray-800 rounded-xl">
              <h2 className="mb-3 font-semibold">🔊 Your Generated Voice:</h2>

              <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                hidden
              />

              {/* Custom Player UI */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg hover:scale-105 transition"
                >
                  {isPlaying ? <Pause /> : <Play />}
                </button>

                <div className="flex-1 flex flex-col">
                  <input
                    ref={progressRef}
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="0"
                    onChange={handleSeek}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                {/* ✅ Download Button */}
        <a
          href={audioUrl}
          download="generated_voice.wav"
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition shadow-lg"
        >
          <Download className="w-5 h-5 text-white" />
        </a>
              </div>
            </div>
          ) : (
            <div className="w-full p-4 bg-gray-800/40 rounded-xl text-center text-gray-400">
              No voice generated yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceGenerationPage;
