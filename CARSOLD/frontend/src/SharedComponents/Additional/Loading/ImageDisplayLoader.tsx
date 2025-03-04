import React from "react";
import LoadingPicAnimation from "./LoadingPicAnimation.tsx";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const ImageDisplayLoader: React.FC = () => {

    const {isMobile} = useUtil();

    return (
      <div className="absolute inset-0 w-full h-full z-50 bg-gray-100">
          <LoadingPicAnimation size={isMobile ? 60 : 100}/>
      </div>
    );
};

export default ImageDisplayLoader