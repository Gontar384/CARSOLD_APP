import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faMessage} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../../GlobalProviders/Auth/useAuth.ts";

interface OfferButtonProps {
    permission: boolean;
    id: number | null;
}

const OfferButton: React.FC<OfferButtonProps> = ({ permission, id }) => {

  const {buttonColor, handleStart, handleEnd} = useButton();
  const {isMobile} = useUtil();
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();
  const handleSendMessage = () => {
    if (!isAuthenticated) {
        navigate("/authenticate/login");
        return;
    }
  };

  return (
      <div className="flex justify-center w-full">
          <button className={`flex flex-row items-center justify-center gap-2 m:gap-3 bg-lime border border-gray-600 rounded-lg w-48 h-11 m:w-56 m:h-12 
          ${buttonColor && "brightness-[97%] shadow"}`}
          onMouseEnter={!isMobile ? handleStart : undefined}
          onMouseLeave={!isMobile ? handleEnd : undefined}
          onTouchStart={isMobile ? handleStart : undefined}
          onTouchEnd={isMobile ? handleEnd : undefined}
          onClick={permission ? () => navigate(`/modifyingOffer/${id}`) : handleSendMessage}>
              <FontAwesomeIcon icon={permission ? faGear : faMessage} className="text-2xl m:text-3xl text-gray-600"/>
              <p className="text-xl m:text-2xl text-gray-600">{permission ? "Edit offer" : "Send message"}</p>
          </button>
      </div>
  )
};

export default OfferButton