import React from "react";
import LoadingPicAnimation from "./LoadingPicAnimation.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

const ImageDisplayLoader: React.FC = () => {

    const {isMobile} = useUtil();

    return (
      <div className="absolute inset-0 w-full h-full bg-black bg-opacity-20 z-50">
          <LoadingPicAnimation size={isMobile ? 60 : 100}/>
      </div>
    );
};

export default ImageDisplayLoader