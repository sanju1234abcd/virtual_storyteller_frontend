import React, { useContext } from "react";
import { Home, BookOpen, Mic, CircleUserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "@/AppContext";

const DockNavbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "saved stories", icon: BookOpen, path: "/history" },
    { name: "Create", icon: Mic, path: "/storyType" },
    { name: "Profile", icon: CircleUserRound, path: "/dashboard" },
  ];

  const {userId} = useContext(AppContext)
  

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-[9999] ${(( location.pathname === "/history" || location.pathname === "/storyType" || location.pathname === "/dashboard") && userId) ? "" : "hidden"} bg-[#0c1247] h-16 flex justify-around items-center shadow-lg rounded-t-2xl sm:hidden`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.name}
            to={item.path}
            className="flex flex-col items-center justify-center"
          >
            <Icon
              size={ isActive ? 25 : 20 }
              strokeWidth={isActive ? 3 : 1.8}
              className="transition-colors text-white"
            />
            <span
              className="transition-colors text-white"
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default DockNavbar;
