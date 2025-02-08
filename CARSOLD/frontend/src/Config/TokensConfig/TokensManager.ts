import React from "react";
import {useFetchCsrf, useRefreshJwt, useTrackUserActivity} from "./TokensUtil.ts";

const TokensManager: React.FC = () => {
    useFetchCsrf();
    useRefreshJwt();
    useTrackUserActivity();
    return null;
}

export default TokensManager;