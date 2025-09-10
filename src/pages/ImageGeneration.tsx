import { useContext, useState } from "react";
import {
  User,
  Mountain,
  Sparkles,
  Rocket,
  Clapperboard,
  Image as ImageIcon,
  Download,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { AppContext } from "@/AppContext";
import { Navigate } from "react-router-dom";

const categories = [
  { name: "Portrait", icon: <User size={16} />, key: "portrait" },
  { name: "Landscape", icon: <Mountain size={16} />, key: "landscape" },
  { name: "Fantasy", icon: <Sparkles size={16} />, key: "fantasy" },
  { name: "Sci-Fi", icon: <Rocket size={16} />, key: "scifi" },
  { name: "Anime", icon: <Clapperboard size={16} />, key: "anime" },
];

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {userId} = useContext(AppContext)

  const handleCategoryClick = (cat: string) => {
    setPrompt(
      `A stunning ${cat} themed AI artwork, ultra detailed, cinematic lighting`
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setInputImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const generateImage = async () => {

  try {
    setLoading(true);
    setGeneratedImg(null);

    if (inputImage) {
      // --- FLOW 1: Use Gemini for multimodal (text + image) ---
      const genAI = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_KEY,
      });

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            resolve((reader.result as string).split(",")[1]);
          } else reject("Failed to read file");
        };
        reader.readAsDataURL(inputImage);
      });

      const contents: any[] = [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: inputImage.type,
                data: base64,
              },
            },
          ],
        },
      ];

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents,
        // force both text + image since Gemini 2.0 requires it
        config: { responseModalities: ["TEXT", "IMAGE"] } as any,
      });

      const parts = response?.candidates?.[0]?.content?.parts || [];
      let dataUri: string | null = null;
      for (const part of parts) {
        if (part.inlineData) {
          dataUri = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (dataUri) setGeneratedImg(dataUri);
      else toast.error("No image generated. Try again.");
    } else {
      // --- FLOW 2: Use A4F for pure text-to-image ---
      const client2 = new OpenAI({
        baseURL: "https://api.a4f.co/v1",
        apiKey: import.meta.env.VITE_A4F_KEY_2,
        dangerouslyAllowBrowser: true,
      });

      const client = new OpenAI({
        baseURL: "https://api.a4f.co/v1",
        apiKey: import.meta.env.VITE_A4F_KEY,
        dangerouslyAllowBrowser: true,
      });

      let image_url = "";

      const response: any = await client2.images.generate({
        model: "provider-4/imagen-4", // or provider-2/FLUX.1-kontext-max
        prompt : prompt,
        n: 1,
        size: "1024x1024",
      });

      if (!response.data[0] || !response.data[0].url) {
        const response2: any = await client.images.generate({
        model: "provider-4/imagen-4", // or provider-2/FLUX.1-kontext-max
        prompt : prompt,
        n: 1,
        size: "1024x1024",
      });
        if(!response2.data[0].url){
          toast.error("No image generated from A4F API.");
        }else{
          image_url = response2.data[0].url;
        }  
      }else{
        image_url = response.data[0].url;
      }

      // fetch + convert to base64
      const fetchAndConvertToBase64 = async (url: string) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const base64Image = await fetchAndConvertToBase64(image_url);
      setGeneratedImg(base64Image);
    }

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
    toast.success("image generated !")
  }
  } catch (error) {
    console.error("Error generating image:", error);
    toast.error("Error generating image.");
  } finally {
    setLoading(false);
  }
};


const handleGenerateImage = async () => {
  if (!prompt.trim() && !inputImage) {
    toast.warning("Please enter a description or upload an image.");
    return;
  }

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
            await generateImage();
          }else{
            toast.error("You have reached your story limit for the day.");
            setLoading(false);
            setPrompt("")
          }
        }else{
          toast.error("something went wrong while accessing your account");
            setLoading(false);
            setPrompt("")
        }
}

  const handleDownload = () => {
    if (!generatedImg) return;
    const link = document.createElement("a");
    link.href = generatedImg;
    link.download = "generated_image.png";
    link.click();
  };
  
  if(userId){
  return (
    <div className="pt-3">
      <h3 className="text-white text-3xl text-center font-lobster mt-5">SWARN</h3>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-3 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
        Create or Edit Your Image
      </h1>
      <div className="h-fit min-h-screen grid grid-cols-1 lg:grid-cols-5 gap-6 p-6 pt-2 items-center">
        {/* Left Section */}
        <div className="lg:col-span-2 flex items-center justify-center w-full">
          <div className="sm:shadow-lg sm:bg-gray-900/40 sm:backdrop-blur-md rounded-2xl shadow p-1 sm:p-3 md:p-5 text-white/80 w-full space-y-6">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              Describe Your Vision
            </h2>

            {/* Prompt + Image embed */}
            <div className="w-full min-h-32 p-2 rounded-md bg-gray-800 text-white border border-transparent focus-within:ring-2 focus-within:ring-purple-500 flex flex-col gap-2 relative">
              {/* Show uploaded image inline */}
              {previewUrl && (
                <div className="relative mt-2 w-[30%] sm:w-[36%] h-fit">
                  <img
                    src={previewUrl}
                    alt="Uploaded reference"
                    className="max-h-18 w-full sm:max-h-40 rounded-md border border-gray-600"
                  />
                  <button
                    onClick={() => {
                      setInputImage(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute -top-2 -right-2 bg-gray-900/70 rounded-full p-1 cursor-pointer"
                    disabled={loading}
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              )}
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A majestic dragon soaring through storm clouds..."
                className="flex-1 bg-transparent resize-none outline-none text-white placeholder:text-gray-400 min-h-[100px] overflow-auto scrollbar-none"
                disabled={loading}
              /> 

              {!previewUrl && (
                <label className="mt-2 flex items-center gap-1 cursor-pointer text-sm text-indigo-400 hover:text-indigo-500">
                  <ImageIcon size={18} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            <p className="text-sm mt-3 font-medium">Quick Categories:</p>
            <div className="flex flex-wrap gap-3 mt-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 text-sm text-violet-400 hover:bg-gray-700 transition ${loading ? "opacity-80" : ""}`}
                  disabled={loading}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={loading}
              className={`w-full mt-5 py-2 rounded-md text-white font-semibold transition ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90"
              }`}
            >
              {loading ? "Generating..." : "Generate Image"}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="sm:shadow-lg bg-gray-900/40 sm:backdrop-blur-md lg:col-span-3 rounded-2xl shadow flex items-center justify-center p-2 h-[90dvh] sm:h-[85%]">
          {loading ? (
            <div className="animate-pulse w-full h-full">
              <h3 className="text-xl text-white animate-pulse w-3/4 mx-auto text-start pb-4">Generating...</h3>
              <div className="w-3/4 h-3/4 bg-gray-200 rounded-lg mx-auto"></div>
            </div>
          ) : generatedImg ? (
            <div className="text-center w-full h-[100%] pt-1">
              <p className="font-medium text-lg mb-4 text-gray-300">
                ✅ Image Generated
              </p>
              <img
                src={generatedImg}
                alt="Generated AI"
                className="max-h-[80%] max-w-[95%] object-fill rounded-lg shadow mx-auto"
              />
              <button
                onClick={handleDownload}
                className="mt-4 mx-auto flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition"
              >
                <Download size={18} />
                Download
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <ImageIcon size={48} className="mx-auto mb-3 text-indigo-400" />
              <p className="font-medium text-lg">Ready to Create</p>
              <p className="text-sm">
                Enter a prompt, click generate to create your AI image . upload an image for editing or reference
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  }else{
  toast.error("You are not logged in . please log in first");
  return <Navigate to="/signin" />
}
}
