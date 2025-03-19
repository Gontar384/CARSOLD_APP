import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMessage} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

const SendMessageButton: React.FC = () => {

  const {buttonColor, handleStart, handleEnd} = useButton();
  const {isMobile} = useUtil();

  return (
      <div className="flex justify-center w-full">
          <button className={`flex flex-row items-center justify-evenly bg-white rounded-lg w-48 h-11 m:w-56 m:h-12 
          ${buttonColor && "brightness-[97%] shadow"}`}
          onMouseEnter={!isMobile ? handleStart : undefined}
          onMouseLeave={!isMobile ? handleEnd : undefined}
          onTouchStart={isMobile ? handleStart : undefined}
          onTouchEnd={isMobile ? handleEnd : undefined}>
              <FontAwesomeIcon icon={faMessage} className="text-2xl m:text-3xl text-gray-600"/>
              <p className="text-xl m:text-2xl text-gray-600">Send Message</p>
          </button>
      </div>
  )
};

export default SendMessageButton