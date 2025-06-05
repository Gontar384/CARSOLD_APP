import React from "react";

interface SectionProps {
    title: string;
    content: string[];
}

const Section: React.FC<SectionProps> = ({title, content}) => (

    <section className="mt-4 m:mt-6">
        <h2 className="text-xl m:text-2xl font-bold">{title}</h2>
        <ul className="text-base m:text-xl mt-2 m:mt-3 list-none">
            {content.map((text, index) => (
                <li key={index} className={`mt-1 m:mt-2 ${text.includes("@gmail.com") && "font-bold"}`}>
                    {text}
                </li>
            ))}
        </ul>
    </section>
);

export default Section