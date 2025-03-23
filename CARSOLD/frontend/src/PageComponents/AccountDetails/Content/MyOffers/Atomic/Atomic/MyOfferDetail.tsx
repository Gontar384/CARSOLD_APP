import React from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface MyOfferDetailProps {
    icon: IconProp;
    label: "Views" | "Follows";
    count: number;
}

const MyOfferDetail: React.FC<MyOfferDetailProps> = ({ icon, label, count }) => {
  return (
      <div className="flex flex-row items-center gap-1">
          <FontAwesomeIcon icon={icon} className=""/>
          <p className="text-sm m:text-base">{label}</p>
          <p className="text-sm m:text-base">{count}</p>
      </div>
  )
};

export default MyOfferDetail