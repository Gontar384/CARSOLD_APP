import React from "react";
import {useButton} from "../../../../../../CustomHooks/useButton.ts";
import {Link} from "react-router-dom";

interface PartButtonProps {
    title: "Login" | "Register";
    path: "login" | "register"
}

const PartButton: React.FC<PartButtonProps> = ({title, path}) => {
    const {buttonColor, bindHoverHandlers} = useButton();

    return (
        <Link to={`/authenticate/${path}`} className={`${buttonColor ? "text-white" : "text-black"}`}
              {...bindHoverHandlers()}>
            {title}
        </Link>
    )
}

export default PartButton