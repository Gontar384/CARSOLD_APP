import React from "react";

interface SectionProps {
    title: string;
    content: string[];
}

const Section: React.FC<SectionProps> = ({title, content}) => (

    <div className="mt-4 m:mt-6">
        <h3 className="text-xl m:text-2xl font-bold">{title}</h3>
        <div className="text-base m:text-xl mt-2 m:mt-3">
            {content.map((text, index) => (
                <p key={index} className={`mt-1 m:mt-2 ${text.includes("@gmail.com") && "font-bold"}`}>
                    {text}
                </p>
            ))}
        </div>
    </div>
);

export default Section