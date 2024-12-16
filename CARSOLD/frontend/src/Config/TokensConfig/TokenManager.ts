import React from "react";
import {useFetchCsrf, useRefreshJwt, useTrackUserActivity} from "./TokenUtil.ts";

const TokenManager: React.FC = () => {
    useFetchCsrf();
    useRefreshJwt();
    useTrackUserActivity();
    return null;
}

export default TokenManager;
