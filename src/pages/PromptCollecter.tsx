import React, { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { toast } from "sonner";
import RotatingText from "@/components/RotatingText/RotatingText";
import { LoaderOne } from "@/components/ui/loader";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "@/AppContext";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import "./PromptCollector.css";

const MAX_PROMPT_LENGTH = 400;

function getStoryIdeas(lang: string) {

  const storyIdeas = {
    english: [
      "A lonely robot finds a diary from the future.",
      "A child discovers a door that appears only on rainy days.",
      "A letter arrives from someone who doesn’t exist.",
      "A cat keeps bringing home strange ancient coins.",
      "The sun forgets to rise for three days.",
      "A stranger knows your dreams before you do.",
      "An old train ticket takes you to another century.",
      "A clock starts ticking backward at midnight.",
      "Your reflection winks when you’re not looking.",
      "An island appears on maps but not in reality.",
      "A musician hears music only they can play.",
      "A forgotten phone booth connects to the past.",
      "A lighthouse flashes messages in Morse code.",
      "A town celebrates a festival no one remembers starting.",
      "A snowstorm arrives in the middle of summer.",
      "A book writes new chapters every night.",
      "A staircase appears where there was none before.",
      "A child befriends a cloud that follows them everywhere.",
      "A street changes its name every morning.",
      "A carnival appears only under a full moon.",
      "A mirror shows you your life in reverse.",
      "An old camera captures moments that never happened.",
      "A garden grows flowers that glow in the dark.",
      "An abandoned ship sails into the harbor with no crew.",
      "A tree whispers your name when you walk by.",
      "A key appears in your pocket every night.",
      "A map changes every time you look at it.",
      "An invisible friend insists they’re real.",
      "A storm freezes everything except you.",
      "A letter arrives from your future self.",
      "A cat speaks but only to you.",
      "A painting changes when no one is watching.",
      "A forgotten alley leads to another city.",
      "A vending machine dispenses strange objects.",
      "A shadow refuses to follow its owner.",
      "An ice cream truck plays music no one knows.",
      "A forgotten song starts playing on the wind.",
      "A road appears only at sunset.",
      "A doorbell rings, but no one is there — just a box.",
      "A staircase descends into endless darkness.",
      "A bird delivers tiny handwritten notes.",
      "A playground appears in an empty field overnight.",
      "A candle burns with a blue flame.",
      "A town wakes up to find the stars have vanished.",
      "An elevator stops at a floor that doesn’t exist.",
      "A clock in the park tells the wrong time — but it’s right tomorrow.",
      "A swing keeps moving with no wind.",
      "A fisherman catches a bottle with glowing water.",
      "An attic holds a box of moving photographs.",
      "A girl’s shadow begins to grow wings."
    ],
    bengali: [
      "একটি পুরনো ঘড়ি হঠাৎ উল্টো দিকে চলা শুরু করে।",
      "বৃষ্টির দিনে একটি গোপন দরজা দেখা যায়।",
      "একটি বিড়াল প্রতিদিন অদ্ভুত পুরনো মুদ্রা নিয়ে আসে।",
      "সূর্য তিনদিন ধরে ওঠেনি।",
      "আপনার ছায়া হঠাৎ আপনাকে ছেড়ে চলে যায়।",
      "একটি ফোন বুথ অতীতের সাথে কথা বলে।",
      "একটি বাতিঘর মর্স কোডে বার্তা পাঠায়।",
      "আপনার স্বপ্নে দেখা মানুষটি হঠাৎ বাস্তবে চলে আসে।",
      "একটি অচেনা শহর একদিনের জন্য মানচিত্রে দেখা যায়।",
      "একটি শিশুর আঁকা ছবি জীবন্ত হয়ে ওঠে।",
      "বরফে ঢাকা শহরে হঠাৎ বসন্ত চলে আসে।",
      "একটি চিঠি আসে আপনার ভবিষ্যৎ থেকে।",
      "একটি দরজা খুললেই ভিন্ন এক জগৎ দেখা যায়।",
      "একটি পুরনো রেডিও হারানো সুর বাজায়।",
      "একটি গাছ রাতে গান গায়।",
      "একটি পাখি প্রতিদিন একটি রহস্যময় নোট আনে।",
      "একটি অদ্ভুত দোকান শুধু পূর্ণিমায় খোলে।",
      "একটি নদী উল্টো দিকে বয়ে যায়।",
      "একটি আয়না আপনাকে অন্য জীবন দেখায়।",
      "একটি অদৃশ্য বন্ধু আপনার পাশে থাকে।",
      "একটি রঙিন মেঘ শুধু আপনাকে অনুসরণ করে।",
      "একটি কুকুর হঠাৎ কথা বলতে শুরু করে।",
      "একটি ছবি ধীরে ধীরে বদলাতে থাকে।",
      "একটি অচেনা গান বাতাসে বাজে।",
      "একটি শহর এক রাতের জন্য নিখোঁজ হয়।",
      "একটি সিঁড়ি আকাশে চলে যায়।",
      "একটি বই প্রতিদিন নতুন গল্প লেখে।",
      "একটি খালি ঘর থেকে হাসির শব্দ আসে।",
      "একটি সমুদ্রের পানি হঠাৎ লাল হয়ে যায়।",
      "একটি পাখি আকাশে উল্টো উড়ে।",
      "একটি গাছের পাতায় লেখা গল্প।",
      "একটি শিশুর স্বপ্ন বাস্তব হয়ে যায়।",
      "একটি চাবি প্রতিদিন আপনার পকেটে আসে।",
      "একটি নৌকা মাঝসমুদ্রে ভেসে আসে, কিন্তু কেউ নেই।",
      "একটি শহরের সব ঘড়ি একসাথে থেমে যায়।",
      "একটি জানালা দিয়ে শুধু অতীত দেখা যায়।",
      "একটি মোমবাতি নীল আলোয় জ্বলে।",
      "একটি ফুল রাতারাতি গান গায়।",
      "একটি কুয়াশা পুরো শহর ঢেকে দেয়।",
      "একটি পুরনো ট্রেন শুধু স্বপ্নে আসে।",
      "একটি গল্প শেষ হয় না।",
      "একটি মানুষ হঠাৎ উধাও হয়ে যায়।",
      "একটি গাছের নিচে লুকানো দরজা।",
      "একটি হাসি বাতাসে ভেসে থাকে।",
      "একটি ছায়া নিজের মতো হাঁটে।",
      "একটি আকাশে ভাসমান দ্বীপ।",
      "একটি নদীর জল মিষ্টি হয়ে যায়।"
    ],
    hindi: [
      "एक पुरानी घड़ी अचानक उल्टी दिशा में चलने लगती है।",
      "बारिश के दिन ही खुलने वाला एक रहस्यमय दरवाज़ा।",
      "एक बिल्ली रोज़ अजीब पुराने सिक्के लेकर आती है।",
      "सूरज तीन दिन तक नहीं निकलता।",
      "आपका साया अचानक गायब हो जाता है।",
      "एक फोन बूथ जो अतीत से जोड़ता है।",
      "एक लाइटहाउस जो मर्स कोड में संदेश भेजता है।",
      "आपके सपनों का व्यक्ति हकीकत में आ जाता है।",
      "एक अजनबी शहर जो सिर्फ एक दिन के लिए नक्शे पर आता है।",
      "एक बच्चे की बनाई ड्रॉइंग जीवित हो जाती है।",
      "एक बर्फीला तूफान गर्मियों में आता है।",
      "एक किताब हर रात नए अध्याय लिखती है।",
      "एक सीढ़ी अचानक आकाश में चली जाती है।",
      "एक अजीब दुकान केवल पूर्णिमा को खुलती है।",
      "एक नदी उल्टी दिशा में बहती है।",
      "एक आईना आपको दूसरा जीवन दिखाता है।",
      "एक अदृश्य दोस्त आपके साथ चलता है।",
      "एक रंगीन बादल केवल आपको फॉलो करता है।",
      "एक कुत्ता अचानक बोलने लगता है।",
      "एक पेंटिंग धीरे-धीरे बदलती है।",
      "एक भूला हुआ गीत हवा में बजता है।",
      "एक शहर एक रात के लिए गायब हो जाता है।",
      "एक कमरे से हंसी की आवाज आती है।",
      "एक समुद्र का पानी अचानक लाल हो जाता है।",
      "एक पक्षी आसमान में उल्टा उड़ता है।",
      "एक पेड़ की पत्तियों में लिखी कहानी।",
      "एक बच्चे का सपना सच हो जाता है।",
      "एक चाबी हर दिन आपकी जेब में आती है।",
      "एक नाव बीच समुद्र में आती है, लेकिन कोई नहीं।",
      "एक शहर की सभी घड़ियां एक साथ रुक जाती हैं।",
      "एक खिड़की केवल अतीत दिखाती है।",
      "एक मोमबत्ती नीली लौ में जलती है।",
      "एक फूल रात में गाता है।",
      "एक कोहरा पूरे शहर को ढक लेता है।",
      "एक पुरानी ट्रेन केवल सपनों में आती है।",
      "एक कहानी कभी खत्म नहीं होती।",
      "एक व्यक्ति अचानक गायब हो जाता है।",
      "एक पेड़ के नीचे छुपा हुआ दरवाज़ा।",
      "एक मुस्कान हवा में तैरती है।",
      "एक छाया अपने आप चलती है।",
      "आसमान में एक तैरता हुआ द्वीप।",
      "एक नदी का पानी मीठा हो जाता है।"
    ],
    french: [
      "Une vieille montre commence à tourner à l’envers.",
      "Une porte secrète apparaît seulement les jours de pluie.",
      "Un chat apporte chaque jour d’anciennes pièces étranges.",
      "Le soleil oublie de se lever pendant trois jours.",
      "Votre ombre disparaît soudainement.",
      "Une cabine téléphonique connecte au passé.",
      "Un phare envoie des messages en code Morse.",
      "La personne de vos rêves apparaît dans la réalité.",
      "Une ville inconnue apparaît sur les cartes pour un seul jour.",
      "Un dessin d’enfant prend vie.",
      "Une tempête de neige arrive en plein été.",
      "Un livre écrit de nouveaux chapitres chaque nuit.",
      "Un escalier apparaît là où il n’y en avait pas.",
      "Un magasin étrange ouvre seulement lors de la pleine lune.",
      "Une rivière coule à l’envers.",
      "Un miroir montre une autre vie.",
      "Un ami invisible marche à vos côtés.",
      "Un nuage coloré vous suit partout.",
      "Un chien se met soudainement à parler.",
      "Un tableau change quand personne ne le regarde.",
      "Une chanson oubliée joue dans le vent.",
      "Une ville disparaît pendant une nuit.",
      "Une pièce vide résonne de rires.",
      "L’eau de la mer devient rouge.",
      "Un oiseau vole à l’envers dans le ciel.",
      "Une histoire est écrite sur les feuilles d’un arbre.",
      "Le rêve d’un enfant devient réalité.",
      "Une clé apparaît chaque jour dans votre poche.",
      "Un bateau arrive au port sans équipage.",
      "Toutes les horloges d’une ville s’arrêtent en même temps.",
      "Une fenêtre ne montre que le passé.",
      "Une bougie brûle avec une flamme bleue.",
      "Une fleur chante la nuit.",
      "Un brouillard recouvre toute la ville.",
      "Un vieux train n’apparaît que dans les rêves.",
      "Une histoire qui ne se termine jamais.",
      "Une personne disparaît soudainement.",
      "Une porte cachée sous un arbre.",
      "Un sourire flotte dans l’air.",
      "Une ombre marche toute seule.",
      "Une île flotte dans le ciel.",
      "L’eau d’une rivière devient sucrée."
    ]
  };

  if (!storyIdeas[lang as keyof typeof storyIdeas]) {
    throw new Error("Language not supported. Use 'en', 'bn', 'hi', or 'fr'.");
  }

  // Return 5 random unique ideas
  return [...storyIdeas[lang as keyof typeof storyIdeas]]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
}


const languages = [
  { value: "english", label: " English" },
  { value: "bengali", label: " Bengali" },
  { value: "french", label: " French" },
  { value: "hindi", label: " Hindi" },
];

const voices = [
  { value: "male", label: " Male" },
  { value: "female", label: " Female" },
]

const voiceMapping: { [key: string]: { female: string; male: string } } = {
  melancholic: { female: "Callirrhoe", male: "Enceladus" },
  calm: { female: "Despina", male: "Iapetus" },
  soft: { female: "Erinome", male: "Umbriel" },
  bright: { female: "Zephyr", male: "Autonoe" },
  cheerful: { female: "Leda", male: "Fenrir" },
  firm: { female: "Kore", male: "Orus" },
  serious: { female: "Kore", male: "Charon" },
  informative: { female: "Callirrhoe", male: "Charon" },
  upbeat: { female: "Leda", male: "Puck" },
  energetic: { female: "Aoede", male: "Fenrir" },
  mysterious: { female: "Callirrhoe", male: "Enceladus" },
};

const PromptCollectorPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [saveToDb , setSavetoDb] = useState(false) ;

  const { userId,setStoryTitle,setStoryText,setThumbnailSrc,audioRef} = useContext(AppContext)

  const navigator = useNavigate();
  const location = useLocation();

  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("english");
  const [voice,setVoice] = useState("female")
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting,setSubmitting] = useState("submitting");

  // Animate content on mount
  useEffect(() => {
    if (!contentRef.current) return;

    // Elements to animate: heading, subtitle, all direct children of form (textarea, div container, button)
    const elems = [
      headingRef.current,
      subtitleRef.current,
      ...Array.from(formRef.current?.children || []),
    ].filter(Boolean);

    gsap.fromTo(
      elems,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        onComplete: () => {
          elems.forEach((el) => {
            if (el) gsap.set(el, { clearProps: "all" }); // Clear inline styles so button stays visible
          });
        },
      }
    );
  }, []);

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

  // Load suggestions when language changes
  useEffect(() => {
    setLoadingSuggestions(true);
    setSuggestions([]); // clear current suggestions quickly
    const timeout = setTimeout(() => {
      setSuggestions(getStoryIdeas(language) || []);
      setLoadingSuggestions(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [language]);

  function getVoiceFromTone(description : string = "", gender : string = "female") {
  const lower = description.toLowerCase();

  // Loop through keywords in mapping
  for (const keyword in voiceMapping) {
    if (lower.includes(keyword)) {
      if (gender === 'female' || gender === 'male') {
        return voiceMapping[keyword as keyof typeof voiceMapping][gender as keyof typeof voiceMapping[typeof keyword]];
      } else {
        // Handle invalid gender value
        console.error(`Invalid gender value: ${gender}`);
        return 'Zephyr'; // or some other default value
      }
    }
  }

  // Fallback if no keyword matched
  return gender === "female" ? "Kore" : "Charon";
}
// audio upload to cloud
  const uploadAudio = async (file : Blob) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'first_time_using_cloudinary');
  data.append('cloud_name', 'dxm27kskt'); // replace with your cloud name

  const res = await fetch('https://api.cloudinary.com/v1_1/dxm27kskt/video/upload', {
    method: 'POST',
    body: data
  });
  const json = await res.json();
  return json.url;
};

  const handleTextToStory = async()=>{

    const bettermentPrompt = `You are an expert prompt engineer for a storytelling AI.  
                              Your task is to take the user’s short or vague story idea and rewrite it into a highly detailed, production-ready prompt that will produce a vivid, emotionally engaging story with realistic dialogue.  

                              Rules:  
                              1. Keep the original idea’s core.  
                              2. Set a clear beginning, middle, and end.  
                              3. Specify a word count range (strictly between 1300 to 1500 words).  
                              4. Define the emotional arc (e.g., calm → fear → joy).  
                              5. Include vivid sensory details (sight, sound, touch, smell, taste).  
                              6. Require at least 30% of the story to be realistic character dialogue in quotes.  
                              7. Suggest pacing (short sentences for tension, longer for reflection).  
                              8. Define at least one emotional turning point.  
                              9. Maintain the genre if given, or pick one that fits.  
                              10. Use mostly common, everyday words — avoid overly advanced or complex words.  
                              11. Keep the genre same as the original or choose the best fit.  
                              12. The story language should be ${language}.  

                              User Idea: ${prompt} 
`
    const openai = new OpenAI({baseURL:"https://api.a4f.co/v1",apiKey:import.meta.env.VITE_A4F_KEY,dangerouslyAllowBrowser:true})

    // story text and title setting and thumbnail prompt and tone generation (arr[0] and arr[1])
    var arr: string[] = []
    var createdImage : any = null;
    try{
      await setTimeout(() => {
      setSubmitting(`prompt optimizing , ${Math.floor(Math.random() * (100 - 40 + 1)) + 40}%`)
    },1000);
    //betterment prompt
    const betterPrompt = await openai.chat.completions.create({
    model: "provider-6/gemini-2.5-flash-thinking",
    messages: [
      {
        "role": "user",
        "content": bettermentPrompt
      }
    ],
    
  });
  setSubmitting(`prompt optimized, now generating story`)

  await setTimeout(() => {
      setSubmitting(`creating story , ${Math.floor(Math.random() * (100 - 40 + 1)) + 40}%`)
  },10000);
  //create story
  const storyPrompt = await openai.chat.completions.create({
    model: "provider-6/gemini-2.5-flash-thinking", //provider-2/gpt-5-nano //provider-2/llama-4-maverick // provider-3/llama-3.3-70b //provider-3/deepseek-v3 
    messages: [
      {
        "role": "user",
        "content": `${betterPrompt.choices![0]!.message.content}, 1. Write it as if for a live dramatic narration, adding voice performance cues in parentheses, choose from them only:
                      - [angry] : Angry  
                      - [excited] : Excited  
                      - [worried] : Worried  
                      - [sarcastic] : Sarcastic  
                      - [hysterical] : Hysterical  
                      - [confident] : Confident  
                      - [scornful] : Scornful  
                      - [empathetic] : Empathetic
                      - [shouting] : Shouting  
                      - [whispering] : Whispering  
                      - [laughing] : Laughing  
                      - [sighing] : Sighing  
                      - [clears throat] : Clears throat  
                      - [speaking slowly] : Speaking Slowly  
                      - [short pause] : Short Pause   
                      - ............... : for pause (use more "." if required)                   
                    2. only provide small voice cues , do no set cues for environment, no background music narration
                    3. for voice cues and realistic dialogue , only use these cues with [] as given above
                    4. phonemes should be accurate
                    5. story language should be ${language} , keep this in mind specially
                    6. Output format (exactly this order, only provide these 4 things, separated by "||"):  
                      [THUMBNAIL_IDEA(provide a thumbnail prompt for the story)] || [provide a tone for the story, should be in english only] || [STORY_TITLE] || [STORY_TEXT( strictly between 900 - 1050 words , words should be in ${language} only, except for voice cues only)] ,provide these 4 things only, do not provide your thinking .
                    `
      }
    ],
    
  });

  if (storyPrompt.choices && storyPrompt.choices[0] && storyPrompt.choices[0].message.content) {
  const content = storyPrompt.choices[0].message.content;
  arr = content.split("||").map(item => item.trim());
  setStoryTitle(arr[2]);
  setStoryText(arr[3]);
  setSubmitting("story created, now generating thumbnail");
  }else{
    console.log("No content found in the response.");
    toast.error("something went wrong, try again later");
    setPrompt("");
    setLoading(false)
    return ;
  }
  }catch(error){
    console.log(error);
    arr = []
    toast.error("something went wrong, try again later");
    setPrompt("");
    setLoading(false)
    return ;
  }

  //creating image
    if( arr.length >= 4 && arr[0] && arr[0].trim() !== ""){
          try{
        const client = new OpenAI({baseURL:"https://api.a4f.co/v1",apiKey: import.meta.env.VITE_A4F_KEY,dangerouslyAllowBrowser:true})
        
        await setTimeout(() => {
          setSubmitting(`creating thumbnail , ${Math.floor(Math.random() * (100 - 40 + 1)) + 40}%`)
        },1000)

        const response : any = await client.images.generate({
          model : "provider-4/imagen-4", //provider-2/FLUX.1-kontext-max
          prompt: arr[0],
          n: 1,
          size: "1024x1024",
        });
    
        if(response.data[0].url === undefined) return ;
        
        const image_url = await response.data[0].url;
        // Fetch the image and convert to base64
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
        setThumbnailSrc(base64Image);
        createdImage = base64Image
        setSubmitting("thumbnail created, now generating voice");
      }catch(error){
        console.log("error generating image");
        toast.error("something went wrong, try again later");
        setPrompt("");
        setLoading(false)
        return ;
      }
    }else{
        console.log("error generating image");
        toast.error("something went wrong, try again later");
        setPrompt("");
        setLoading(false)
        return ;
    }

  // now most important , voice generation

  if( arr.length >= 4 && createdImage && arr[3] && arr[3].trim() !== "" && arr[1] && arr[1].trim() !== ""){
    const ai = new GoogleGenAI({apiKey : import.meta.env.VITE_GEMINI_KEY})
    try {
    const voice_name = getVoiceFromTone(arr[1], voice);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Narrate this story in a ${arr[1]} tone : ... ${arr[3]} ....` }]}],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voice_name
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
const wavBlob = base64ToWavBlob(base64Data);
// cloudinary approach ->
if(saveToDb){
try {
  setSubmitting(`uploading audio to cloud , ${Math.floor(Math.random() * (40 - 10 + 1)) + 10}%`)
  setTimeout(() => {
   setSubmitting(`uploading audio to cloud , ${Math.floor(Math.random() * (75 - 40 + 1)) + 40}%`)
  }, 35000);
  setTimeout(() => {
   setSubmitting(`uploading audio to cloud , ${Math.floor(Math.random() * (100 - 75 + 1)) + 75}%`)
  }, 70000);
  const storyAudioUrl = await uploadAudio(wavBlob);
  const audio = new Audio(storyAudioUrl);
  audioRef.current = audio;
  // saving story in db
  const storyResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/storyLinkSave`, {
    method: "POST",
    headers : {
      "Content-Type": "application/json",
    },
    body : JSON.stringify({userId : userId , link : storyAudioUrl , title : arr[2]})
  })
  const storyResult = await storyResponse.json();
  if(!storyResult.success){
    toast.error("error saving story link in db, unable to connect to cloud");
  }
  else{
    toast.success("story link saved in db")
  }
} catch (error) {
  toast.error("cloud uploading failed , unable to connect to cloud")
  const audioUrl = URL.createObjectURL(wavBlob);
  const audio = new Audio(audioUrl);
  audioRef.current = audio;
}
}
else{
  const audioUrl = URL.createObjectURL(wavBlob);
  const audio = new Audio(audioUrl);
  audioRef.current = audio;
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
    setPrompt("");
    setLoading(false);
    navigator('/storytelling')
  }
  } catch (error) {
      console.log("error generating voice");
      toast.error("something went wrong, try again later");
      setPrompt("");
      setLoading(false)
      return ;
    }
    
  }else{
      console.log("error generating voice");
      toast.error("something went wrong, try again later");
      setPrompt("");
      setLoading(false)
      return ;
    }
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    if (prompt.trim() === "") {
      toast.error("Please enter a prompt before submitting.");
      return;
    }
    toast.success(`Prompt submitted! Story language: ${language} . please do not close or navigate from this page`);

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
        await handleTextToStory();
      }else{
        toast.error("You have reached your story limit for the day.");
        setLoading(false);
        setPrompt("")
      }
    }

    
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

  if(userId){
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0a1a2f] via-[#2b2e4a] to-[#000000] overflow-auto flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Star background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen z-1 pointer-events-none"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-20 w-full max-w-5xl rounded-3xl p-4 sm:p-12"
      >
        <h1
          ref={headingRef}
          className="text-2xl md:text-4xl flex flex-wrap items-center justify-center gap-3 font-extrabold text-white mb-8 tracking-tight text-center select-none drop-shadow-lg"
        >
          💡 Share Your Story Ideas of 
            <RotatingText 
              texts={["Fantasy","Science Fiction","Mystery","Romance","Horror","Historical Fiction","Thriller","Adventure","Drama","Comedy"]}
              mainClassName="px-2 w-content sm:px-2 md:px-3 bg-cyan-200 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
        </h1>
        <p
          ref={subtitleRef}
          className="text-gray-300 text-sm md:text-xl mb-12 text-center max-w-3xl mx-auto"
        >
          Enter a prompt or story idea and select your story language. Click any
          suggestion to quickly use it.
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-8 max-w-4xl mx-auto"
          spellCheck={false}
        >
          <textarea
            placeholder="Write your prompt here..."
            maxLength={MAX_PROMPT_LENGTH}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className=" w-[90dvw] md:w-full min-h-[130px] rounded-xl bg-black/70 text-white placeholder-gray-400 px-6 py-4 text-sm sm:text-lg resize-none border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow shadow-md shadow-purple-900/50 hover:shadow-purple-600/70"
            spellCheck={false}
            required
            disabled = {loading}
          />

          <div className="flex items-center justify-between w-[90dvw] sm:max-w-xs sm:mx-auto sm:min-w-full sm:space-x-4">
            <div className="text-gray-300 self-start scale-60 sm:scale-100 select-none text-sm whitespace-nowrap">
              {prompt.length} / {MAX_PROMPT_LENGTH}
            </div>

            <div className="w-[60%] pr-0 sm:w-fit flex items-center justify-end-safe flex-wrap md:justify-between md:gap-3">
              <div className="flex items-center gap-2 scale-60 sm:scale-85">
              <label
                htmlFor="language"
                className="text-white font-semibold select-none whitespace-nowrap"
              >
                Story Language:
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-black/70 text-white rounded-lg px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                disabled = {loading}
              >
                {languages.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2 scale-60 sm:scale-85">
              <label
                htmlFor="language"
                className="text-white font-semibold select-none whitespace-nowrap"
              >
                Narrator voice:
              </label>
              <select
                id="voice"
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="bg-black/70 text-white rounded-lg px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                disabled = {loading}
              >
                {voices.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 scale-60 sm:scale-85">
              <div className="text-md text-white">save audio</div>
              <div className="check" title="enable this option when you want to save the audio as a link to retrieve later from history" >
                <input id="check" type="checkbox" onClick={()=> { setSavetoDb((prev)=> !prev) ; toast.info(`audio saving ${saveToDb ? "disabled" : "enabled (may take 2-3 minutes extra for cloud saving)"}`)}} disabled = {loading}/>
                <label htmlFor="check"></label>
              </div>
            </div>

            </div>

          </div>

          <button
            type="submit"
            className="w-[90dvw] sm:w-full text-sm md:text-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition text-white font-semibold rounded-xl px-3 md:px-10 py-2 md:py-5 shadow-lg shadow-pink-700/60 active:scale-95 select-none"
                disabled = {loading}
          >
            {loading ? <div className="flex items-center justify-center gap-1.5">{submitting} <LoaderOne /></div> : "Submit Prompt → "}
          </button>
        </form>

        <section className="mt-14 w-[80dvw] md:max-w-4xl md:mx-auto">
          <h2 className="text-white w-[60dvw] sm:w-fit text-xl md:text-3xl font-semibold mb-6 select-none">
            Suggestions for you
          </h2>
          {loadingSuggestions ? (
            <p className="text-purple-300 animate-pulse text-center text-lg">
              Loading suggestions...
            </p>
          ) : suggestions.length === 0 ? (
            <p className="text-gray-400 text-center select-none text-lg">
              No suggestions available.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suggestions.map((sugg, idx) => (
                <li
                  key={idx}
                  onClick={() => setPrompt(sugg)}
                  className="cursor-pointer w-[80dvw] md:w-fit rounded-xl bg-white/10 hover:bg-purple-700/70 duration-300 p-4 text-white text-sm md:text-lg transition select-text shadow-md shadow-purple-900/40"
                  title="Click to use this suggestion"
                >
                  {sugg}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
else{
  toast.error("You are not logged in . please log in first");
  return <Navigate to="/signin" />
}
};

export default PromptCollectorPage;
