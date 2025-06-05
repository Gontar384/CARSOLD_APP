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
            <main className="flex-grow mt-24 m:mt-28 mb-[500px]">
                {children}
            </main>
            <Footer/>
        </div>
    )
}

export default LayOut