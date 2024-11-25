import {useFetchCsrf, useRefreshJwt, useTrackUserActivity} from "./TokenUtil.tsx";
import React from "react";

//manages csrf fetch, jwt refreshing and tracks user activity, used in 'App' component
const TokenManager: React.FC = () => {
    useFetchCsrf();
    useRefreshJwt();
    useTrackUserActivity();
    return null;
}

export default TokenManager;