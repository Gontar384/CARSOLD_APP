import React from "react";

interface SectionProps {
    title: string;
    content: string[];
}

const Section: React.FC<SectionProps> = ({title, content}) => (
    <div className="mt-3 xs:mt-4 xl:mt-5 2xl:mt-6 3xl:mt-7">
        <h3 className="text-lg xs:text-xl xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px] font-bold">{title}</h3>
        <div className="text-sm xs:text-base xl:text-lg 2xl:text-xl 3xl:text-[22px]">
            {content.map((text, index) => (
                <p key={index} className="mt-1">
                    {text}
                </p>
            ))}
        </div>
    </div>
);

export default Section