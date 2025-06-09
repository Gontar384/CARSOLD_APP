import React, {useEffect} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import Section from "./Atomic/Section.tsx";
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";

const TermsOfUse: React.FC = () => {
    const {t} = useLanguage();

    useEffect(() => {
        document.title = `CARSOLD | ${t("tabTitle13")}`;
    }, [t]);

    return (
        <LayOut>
            <div className="flex flex-col items-center -mb-[200px] m:-mb-[100px]">
                <div className={`flex flex-col w-full max-w-[1300px] p-5 m:p-7 bg-lowLime 
                border-y xl:border-2 border-gray-300 xl:rounded`}>
                    <h1 className="text-2xl m:text-3xl text-center font-bold">
                        {t("termsOfUse1")}
                    </h1>
                    <Section title={t("termsOfUse2")}
                             content={[t("termsOfUse3"), t("termsOfUse4"), t("termsOfUse5")]}/>
                    <Section title={t("termsOfUse6")}
                             content={[t("termsOfUse7"), t("termsOfUse8"), t("termsOfUse9")]}/>
                    <Section title={t("termsOfUse10")}
                             content={[t("termsOfUse11"), t("termsOfUse12"), t("termsOfUse13")]}/>
                    <Section title={t("termsOfUse14")}
                             content={[t("termsOfUse15"), t("termsOfUse16"), t("termsOfUse17")]}/>
                    <Section title={t("termsOfUse18")}
                             content={[t("termsOfUse19"), t("termsOfUse20"), t("termsOfUse21"), t("termsOfUse22")]}/>
                    <Section title={t("termsOfUse23")}
                             content={[t("termsOfUse24"), t("termsOfUse25")]}/>
                    <Section title={t("termsOfUse26")}
                             content={[t("termsOfUse27"), t("termsOfUse28")]}/>
                    <Section title={t("termsOfUse29")}
                             content={[t("termsOfUse30"), t("termsOfUse31")]}/>
                    <Section title={t("termsOfUse32")}
                             content={[t("termsOfUse33"), t("termsOfUse34")]}/>
                    <Section title={t("termsOfUse35")}
                             content={[t("termsOfUse36"), import.meta.env.VITE_CONTACT_EMAIL, t("termsOfUse38"),]}/>
                </div>
            </div>
        </LayOut>
    )
}

export default TermsOfUse