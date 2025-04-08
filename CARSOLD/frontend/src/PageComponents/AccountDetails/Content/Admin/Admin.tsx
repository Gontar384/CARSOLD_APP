import React, {useEffect, useState} from "react";
import {useUserInfo} from "../../../../CustomHooks/useUserInfo.ts";
import {useNavigate} from "react-router-dom";
import {fetchReports} from "../../../../ApiCalls/Services/OfferService.ts";
import {SelectedReason} from "../../../OfferDisplay/BigContainer/OfferDetails/Admin/ReportOffer.tsx";

const Admin: React.FC = () => {
    const {handleCheckAdmin} = useUserInfo();
    const navigate = useNavigate();
    const [reports, setReports] = useState<SelectedReason[]>([]);

    useEffect(() => {
        const manageCheckAdmin = async () => {
            const isAdmin = await handleCheckAdmin();
            if (!isAdmin) {
                navigate("/details/myOffers");
            } else {
                const response = await fetchReports();
                setReports(response.data);
            }
        };
        manageCheckAdmin();
    }, []);

    return (
        <div>test</div>
    )
};

export default Admin