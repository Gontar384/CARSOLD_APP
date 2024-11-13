//manages csrf fetch, jwt refreshing and monitors user activity, used in 'App' component
import {useFetchCsrf, useRefreshJwt, useTrackUserActivity} from "./TokenUtil.tsx";
import React from "react";

const TokenManager: React.FC = () => {
    useFetchCsrf();
    useRefreshJwt();
    useTrackUserActivity();
    return null;
}

export default TokenManager;