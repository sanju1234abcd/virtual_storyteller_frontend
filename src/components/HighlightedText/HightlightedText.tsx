import React from "react";

const HoverHighlightText : React.FC<{ text: string }> = ({ text }) => {
  return (
    <p className="text-gray-100 leading-relaxed">
      {text.split(" ").map((word, index) => (
        <span
          key={index}
          className="opacity-40 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
};

export default HoverHighlightText;
