import React from "react";
import {useButton} from "../../../../../../CustomHooks/useButton.ts";
import {useLanguage} from "../../../../../../GlobalProviders/Language/useLanguage.ts";

interface MyOfferButtonProps {
    label: string;
    onClick: () => void;
}

const MyOfferButton: React.FC<MyOfferButtonProps> = ({ label, onClick }) => {
    const {buttonColor, bindHoverHandlers} = useButton();
    const {t} = useLanguage();

    return (
      <button className={`flex justify-center items-center text-sm m:text-base w-14 m:w-16 h-[23px] m:h-[25px]
      border border-black border-opacity-50 rounded ${buttonColor ? "text-black" : "text-white"}
      ${label === t("smallOfferDisplay2") ? "bg-darkLime" : "bg-coolRed"}`}
              onClick={onClick} {...bindHoverHandlers()}>
          {label}
      </button>
  )
};

export default MyOfferButton