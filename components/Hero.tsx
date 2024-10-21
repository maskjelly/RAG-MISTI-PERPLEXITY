import Image from "next/image";
import { FC } from "react";
import desktopImg from "../public/desktop-screenshot.png";
import mobileImg from "../public/screenshot-mobile.png";
import InitialInputArea from "./InitialInputArea";
import { suggestions } from "@/utils/utils";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleChat: (messages?: { role: string; content: string }[]) => void;
  ageGroup: string;
  setAgeGroup: React.Dispatch<React.SetStateAction<string>>;
  handleInitialChat: () => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleChat,
  ageGroup,
  setAgeGroup,
  handleInitialChat,
}) => {
  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  return (
    <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center px-4 sm:mt-24">
      <h2 className="text-center text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
        Your Personal{" "}
        <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text font-bold text-transparent">
          AI Tutor
        </span>
      </h2>
      <div className="mt-8 w-full">
        <InitialInputArea
          promptValue={promptValue}
          handleInitialChat={handleInitialChat}
          setPromptValue={setPromptValue}
          handleChat={handleChat}
          ageGroup={ageGroup}
          setAgeGroup={setAgeGroup}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {suggestions.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClickSuggestion(item?.name)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-100 to-pink-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            <Image
              src={item.icon}
              alt={item.name}
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
};

export default Hero;
