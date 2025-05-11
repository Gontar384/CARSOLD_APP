import React from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import Section from "./Atomic/Section.tsx";

const TermsOfUse: React.FC = () => {

    document.title = "CARSOLD | Terms Of Use";

    return (
        <LayOut>
            <div className="flex flex-col items-center -mb-[200px] m:-mb-[100px]">
                <div className="flex flex-col w-11/12 max-w-[1200px] p-5 m:p-7 bg-lowLime border border-gray-300 rounded">
                    <h1 className="text-2xl m:text-3xl text-center font-bold">
                        Terms of Use
                    </h1>

                    <Section
                        title="1. General"
                        content={[
                            "1.1 CARSOLD is a platform where users can post car offers, search for vehicles, and contact other users.",
                            "1.2 These Terms of Use govern your access and use of our website and services.",
                            "1.3 By registering or using the platform, you agree to these Terms.",
                        ]}
                    />
                    <Section
                        title="2. User Accounts"
                        content={[
                            "2.1 You must create an account to post offers or contact other users.",
                            "2.2 You are responsible for maintaining the confidentiality of your account credentials.",
                            "2.3 CARSOLD reserves the right to suspend or terminate accounts for violations of these Terms or fraudulent activity.",
                        ]}
                    />
                    <Section
                        title="3. Posting Offers"
                        content={[
                            "3.1 Users can post offers to sell vehicles. All information provided must be accurate and up-to-date.",
                            "3.2 Misleading or fraudulent postings are strictly prohibited.",
                            "3.3 CARSOLD is not responsible for the accuracy of user-provided information.",
                        ]}
                    />
                    <Section
                        title="4. Buying and Selling"
                        content={[
                            "4.1 CARSOLD does not directly participate in transactions between buyers and sellers.",
                            "4.2 Users are responsible for verifying the authenticity and condition of vehicles before completing a transaction.",
                            "4.3 Disputes arising from transactions are solely between the involved parties.",
                        ]}
                    />
                    <Section
                        title="5. Prohibited Activities"
                        content={[
                            "You agree not to:",
                            "5.1 Post false, misleading, or offensive content.",
                            "5.2 Use the platform for illegal activities or scams.",
                            "5.3 Interfere with the functionality of the platform or harm other users.",
                        ]}
                    />
                    <Section
                        title="6. Content and Intellectual Property"
                        content={[
                            "6.1 By posting content, you grant CARSOLD a non-exclusive license to display and share your content.",
                            "6.2 Users must not post copyrighted materials without proper authorization.",
                        ]}
                    />
                    <Section
                        title="7. Limitation of Liability"
                        content={[
                            "7.1 CARSOLD is not responsible for the quality, safety, or legality of vehicles listed.",
                            "7.2 We are not liable for any loss, damages, or disputes resulting from transactions.",
                        ]}
                    />
                    <Section
                        title="8. Termination"
                        content={[
                            "8.1 We reserve the right to terminate or restrict access to the platform for violations of these Terms.",
                            "8.2 Users may delete their accounts at any time.",
                        ]}
                    />
                    <Section
                        title="9. Changes to Terms"
                        content={[
                            "9.1 CARSOLD reserves the right to update these Terms at any time.",
                            "9.2 Continued use of the platform after changes constitutes acceptance of the updated Terms.",
                        ]}
                    />
                    <Section
                        title="Contact Us"
                        content={[
                            "For questions or support, please contact us at:",
                            "carsold384@gmail.com",
                            "By using CARSOLD, you acknowledge that you have read, understood, and agree to these Terms of use.",
                        ]}
                    />
                </div>
            </div>
        </LayOut>
    )
}

export default TermsOfUse