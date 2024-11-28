import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faMagnifyingGlass, faPlus} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../GlobalProviders/UtilProvider.tsx";

//manages loading 'line' display when authentication process goes on
const LoadingAuthScreen: React.FC = () => {

    //global state to define proper loading screen
    const {isWide} = useUtil();

    return (
        <> {/*clean navbar*/}
            {isWide ? (
                <div className="flex flex-row items-center justify-evenly fixed left-0 top-0 right-0
                     w-full h-9 lg:h-10 xl:h-12 2xl:h-[52px] 3xl:h-14 shadow-bottom bg-lime z-40">
                    <div className="flex flex-row justify-center text-2xl lg:text-3xl xl:text-4xl
                         2xl:text-[44px] 3xl:text-[50px]">
                        <p className="text-white">CAR</p>
                        <p className="text-black">$</p>
                        <p className="text-white">OLD</p>
                    </div>
                    <div className="flex justify-center relative">
                        <FontAwesomeIcon icon={faMagnifyingGlass}
                                         className="absolute top-[5px] lg:top-[5px] xl:top-[5px] 2xl:top-[6px] 3xl:top-[7px] left-[8px]
                                         lg:left-[9px] xl:left-xs 2xl:left-sm 3xl:left-lg text-[16px] lg:text-[20px] xl:text-[25px] 2xl:text-[31px] 3xl:text-[34px] z-30"/>
                        <div className="w-64 lg:w-72 xl:w-80 2xl:w-96 3xl:w-[450px] h-6 lg:h-7 xl:h-8
                                 2xl:h-10 3xl:h-11 p-1 lg:p-[6px] text-base lg:text-[19px] xl:text-2xl 2xl:text-[25px] 3xl:text-[32px] border border-solid 
                                 border-black relative z-20 bg-lime rounded-full"/>
                    </div>
                    <div className="flex flex-row items-center p-[1px] gap-1 border-2 border-solid border-black
                         cursor-pointer">
                        <FontAwesomeIcon icon={faPlus}
                                         className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl"/>
                        <p className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl whitespace-nowrap">Add Offer</p>
                    </div>
                    <div className="min-w-[142px] lg:min-w-[178px] xl:min-w-[213px] 2xl:min-w-[268px] 3xl:min-w-[322px] h-6 lg:h-7 xl:h-8 2xl:h-9 3xl:h-10
                                     bg-darkLime animate-pulse rounded-sm"></div>
                </div>
            ) : (
                <div
                    className="flex flex-row items-center h-7 xs:h-8 fixed left-0 top-0 right-0 bg-lime shadow-bottom z-40">
                    <button className="w-1/12 text-base xs:text-xl">
                        <FontAwesomeIcon icon={faBars}/>
                    </button>
                    <button className="flex flex-row justify-center w-5/12 text-xl xs:text-2xl">
                        <p className="text-white">CAR</p>
                        <p className="text-black">$</p>
                        <p className="text-white">OLD</p>
                    </button>
                    <div className="relative flex justify-center w-6/12 max-w-[210px] xs:max-w-[250px] pr-1">
                        <FontAwesomeIcon icon={faMagnifyingGlass}
                                         className={`absolute top-1 xs:top-[5px] left-2 text-[13px] xs:text-[16px] z-30`}/>
                        <div className={`w-full h-5 xs:h-6 p-[2px] text-xs xs:text-base border border-solid
                                 border-black z-20 bg-lime rounded-full`}/>
                    </div>
                </div>
            )}
            {/*animated loading line*/}
            <div className="relative w-full h-[2px] xs:h-[3px] 2xl:h-1
                 mt-7 xs:mt-8 sm:mt-9 lg:mt-10 xl:mt-12 2xl:mt-[52px] 3xl:mt-14
                 bg-gray-400 overflow-hidden z-50">
                <div className="absolute h-full bg-black animate-grow"></div>
            </div>
        </>
    );
};

export default LoadingAuthScreen;