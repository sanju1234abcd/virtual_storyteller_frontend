import { createContext, useState, type ReactNode , useRef } from "react";
import projectAudio from "./assets/project_audio.wav"

interface AppContextType {
  userId : string;
  setUserId : (userId : string) => void;
  storyText: string;
  setStoryText: (story: string) => void;
  storyTitle: string;
  setStoryTitle: (story: string) => void;
  thumbnailSrc: string;
  setThumbnailSrc: (thumbnail: string) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const AppContext = createContext<AppContextType>({
  userId: "",
  setUserId: () => {},
  storyText: "",
  setStoryText: () => {},
  storyTitle: "",
  setStoryTitle: () => {},
  thumbnailSrc: "",
  setThumbnailSrc: () => {},
  audioRef: {current : new Audio()},
})

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userId,setUserId] = useState("")
  const [storyText, setStoryText] = useState("here is a sample audio story as you have not created a story");
  const [storyTitle, setStoryTitle] = useState("sample story");
  const [thumbnailSrc,setThumbnailSrc] = useState("https://plus.unsplash.com/premium_photo-1754759085778-bce7a7178f07?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
  const audioRef = useRef<HTMLAudioElement>(new Audio(projectAudio));
  return (
    <AppContext.Provider value={{ userId,setUserId,storyText,setStoryText, storyTitle, setStoryTitle, thumbnailSrc, setThumbnailSrc, audioRef}}>
      {children}
    </AppContext.Provider>
  );
};
