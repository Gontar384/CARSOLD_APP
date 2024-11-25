import {useEffect, useState} from "react";

//footer component, changes its position if there is lowerBar (mobile)
function Footer({lowerBar}: { lowerBar: boolean }) {

    //state defining window size
    const [isWide, setIsWide] = useState<boolean>(window.innerWidth >= 640);

    //checks window size, which defines if there will be margin bottom under the footer
    useEffect(() => {
        const handleResize = () => setIsWide(window.innerWidth >= 640);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize)

    }, [])

    return (
        <div className={`flex flex-col justify-center items-center w-full bg-lowLime shadow-top mt-10
         xs:mt-12 sm:mt-14 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28 3xl:mt-32 
         text-[10px] xs:text-xs 2xl:text-base 3xl:text-lg p-2 xs:p-[10px] 2xl:p-[14px]
         ${lowerBar && !isWide ? "mb-10 xs:mb-11" : ""}`}>
            <div className="flex flex-row gap-[2px]">
                <p>Give feedback:</p>
                <p className="font-bold">carsold384@gmail.com</p>
            </div>
            <p className="mt-1 xs:mt-[6px] 2xl:mt-2">All rights reserved &copy;</p>
        </div>
    )
}

export default Footer