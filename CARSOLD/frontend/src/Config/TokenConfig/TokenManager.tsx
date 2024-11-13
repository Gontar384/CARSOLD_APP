//manages csrf fetch, jwt refreshing and monitors user activity, used in 'App' component
import {useFetchCsrf, useRefreshJwt, useTrackUserActivity} from "./TokenUtil.tsx";

const TokenManager = () => {
    useFetchCsrf();
    useRefreshJwt();
    useTrackUserActivity();
    return null;
}

export default TokenManager;