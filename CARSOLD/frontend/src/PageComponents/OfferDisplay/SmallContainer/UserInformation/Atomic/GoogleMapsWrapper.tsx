import React from "react";
import {LoadScript} from "@react-google-maps/api";

interface GoogleMapsWrapperProps {
    children: React.ReactNode;
}

const GoogleMapsWrapper: React.FC<GoogleMapsWrapperProps> = ({ children }) => {
    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_MAPS_APIKEY}>
            {children}
        </LoadScript>
    );
};

export default GoogleMapsWrapper;