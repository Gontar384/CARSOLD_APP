import NavBar from "./NavBar/NavBar.tsx"
import Footer from "./Footer/Footer.tsx";
import React, {ReactNode} from "react";

interface LayOutProps {
    children: ReactNode
}

const LayOut: React.FC<LayOutProps> = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            <div className="flex-grow mt-20 xs:mt-24 sm:mt-20 lg:mt-[88px] xl:mt-24 2xl:mt-28 3xl:mt-32">
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default LayOut