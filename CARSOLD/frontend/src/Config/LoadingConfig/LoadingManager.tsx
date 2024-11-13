import { useLoading } from './LoadingProvider';
import LoadingScreen from './LoadingScreen';
import React from "react";  // Your loading screen component

const LoadingManager: React.FC = () => {
    const { isAppLoading } = useLoading();

    return isAppLoading ? <LoadingScreen /> : null;
};

export default LoadingManager;