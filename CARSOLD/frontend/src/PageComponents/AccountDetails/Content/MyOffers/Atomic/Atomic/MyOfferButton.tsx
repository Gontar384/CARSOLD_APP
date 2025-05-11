import React from "react";
import {useButton} from "../../../../../../CustomHooks/useButton.ts";

interface MyOfferButtonProps {
    label: "Edit" | "Delete";
    onClick: () => void;
}

const MyOfferButton: React.FC<MyOfferButtonProps> = ({ label, onClick }) => {
    const {buttonColor, bindHoverHandlers} = useButton();

    return (
      <button className={`flex justify-center items-center text-sm m:text-base w-14 m:w-16 h-[23px] m:h-[25px]
      border border-black border-opacity-50 rounded ${buttonColor ? "text-black" : "text-white"}
      ${label === "Edit" ? "bg-darkLime" : "bg-coolRed"}`}
              onClick={onClick} {...bindHoverHandlers()}>
          {label}
      </button>
  )
};

export default MyOfferButton