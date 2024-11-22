import NavBar from "../NavBar/NavBar.tsx";
import {ReactElement, useState} from "react";
import Footer from "../NavBar/Footer.tsx";

function TermsOfUse(): ReactElement {

    const [lowerBar, setLowerBar] = useState<boolean>(false);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar setLowerBar={setLowerBar}/>
            <div className="flex-grow flex flex-col items-center">
                <div className="flex flex-col w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12 2xl:w-8/12 3xl:max-w-[1250px] bg-lowLime mt-14 xs:mt-16 sm:mt-[68px] xl:mt-20 2xl:mt-24 3xl:mt-28
                 p-4 xs:pt-5 xl:p-6 2xl:p-7 3xl:p-8 rounded-sm">
                    <h1 className="text-xl xs:text-[22px] xl:text-2xl 2xl:text-[26px] 3xl:text-[28px] text-center font-bold">Terms
                        of use</h1>
                    <div className="text-left">
                        <h3 className="text-lg xs:text-xl xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px] mt-3 xs:mt-4 xl:mt-5 2xl:mt-6 3xl:mt-7 font-bold">1.
                            General</h3>
                        <div className="text-sm xs:text-base xl:text-lg 2xl:text-xl 3xl:text-[22px]">
                            <p>1.1 CARSOLD is a platform where users can post car offers, search for vehicles, and
                                contact other users.</p>
                            <p>1.2 These Terms of Use govern your access and use of our website and services.</p>
                            <p>1.3 By registering or using the platform, you agree to these Terms.</p>
                        </div>
                        <h3 className="text-lg xs:text-xl xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px] mt-1 xs:mt-2 xl:mt-3 2xl:mt-4 3xl:mt-5 font-bold">2.
                            User Accounts</h3>
                        <div className="text-sm xs:text-base xl:text-lg 2xl:text-xl 3xl:text-[22px]">
                            <p>2.1 You must create an account to post offers or contact other users.</p>
                            <p>2.2 You are responsible for maintaining the confidentiality of your account
                                credentials.</p>
                            <p>2.3 CARSOLD reserves the right to suspend or terminate accounts for violations of these
                                Terms or fraudulent activity.</p>
                        </div>
                        <h3 className="text-lg xs:text-xl xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px] mt-1 xs:mt-2 xl:mt-3 2xl:mt-4 3xl:mt-5 font-bold"> 3.
                            Posting Offers</h3>
                        <div className="text-sm xs:text-base xl:text-lg 2xl:text-xl 3xl:text-[22px]">
                            <p>3.1 Users can post offers to sell vehicles. All information provided must be accurate and
                                up-to-date.</p>
                            <p>3.2 Misleading or fraudulent postings are strictly prohibited.</p>
                            <p>3.3 CARSOLD is not responsible for the accuracy of user-provided information.</p>
                        </div>
                        <h3 className="text-lg xs:text-xl xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px] mt-1 xs:mt-2 xl:mt-3 2xl:mt-4 3xl:mt-5 font-bold">4.
                            Buying and Selling</h3>
                        <div className="text-sm xs:text-base xl:text-lg 2xl:text-xl 3xl:text-[22px]">
                            <p>4.1 CARSOLD does not directly participate in transactions between buyers and sellers.</p>
                            <p>4.2 Users are responsible for verifying the authenticity and condition of vehicles before
                                completing a transaction.</p>
                            <p>4.3 Disputes arising from transactions are solely between the involved parties.</p>
                        </div>
                        <h3 className="text-lg xs:text-xl xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px] mt-1 xs:mt-2 xl:mt-3 2xl:mt-4 3xl:mt-5 font-bold">5.
                            Prohibited Activities</h3>
                        <div className="text-sm xs:text-base xl:text-lg 2xl:text-xl 3xl:text-[22px]">
                            <p>You agree not to:</p>
                            <p>5.1 Post false, misleading, or offensive content.</p>
                            <p>5.2 Use the platform for illegal activities or scams.</p>
                            <p>5.3 Interfere with the functionality of the platform or harm other users.</p>
                        </div>
                        <h3 className="text-lg xs:text-xl xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px] mt-1 xs:mt-2 xl:mt-3 2xl:mt-4 3xl:mt-5 font-bold">6.
                            Content and Intellectual Property</h3>
                        <div className="text-sm xs:text-base xl:text-lg 2xl:text-xl 3xl:text-[22px]">
                            <p>6.1 By posting content, you grant CARSOLD a non-exclusive license to display and share
                                your content.</p>
                            <p>6.2 Users must not post copyrighted materials without proper authorization.</p>
                        </div>
                        <h3 className="text-lg xs:text-xl xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px] mt-1 xs:mt-2 xl:mt-3 2xl:mt-4 3xl:mt-5 font-bold">7.
                            Limitation of Liability</h3>
                        <div className="text-sm xs:text-base xl:text-lg 2xl:text-xl 3xl:text-[22px]">
                            <p>7.1 CARSOLD is not responsible for the quality, safety, or legality of vehicles
                                listed.</p>
                            <p>7.2 We are not liable for any loss, damages, or disputes resulting from transactions.</p>
                        </div>
                        <h3 className="text-lg xs:text-xl xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px] mt-1 xs:mt-2 xl:mt-3 2xl:mt-4 3xl:mt-5 font-bold">8.
                            Termination</h3>
                        <div className="text-sm xs:text-base xl:text-lg 2xl:text-xl 3xl:text-[22px]">
                            <p>8.1 We reserve the right to terminate or restrict access to the platform for violations
                                of these Terms.</p>
                            <p>8.2 Users may delete their accounts at any time.</p>
                        </div>
                        <h3 className="text-lg xs:text-xl xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px] mt-1 xs:mt-2 xl:mt-3 2xl:mt-4 3xl:mt-5 font-bold">9.
                            Changes to Terms</h3>
                        <div className="text-sm xs:text-base xl:text-lg 2xl:text-xl 3xl:text-[22px]">
                            <p>9.1 CARSOLD reserves the right to update these Terms at any time.</p>
                            <p>9.2 Continued use of the platform after changes constitutes acceptance of the updated
                                Terms.</p>
                        </div>
                        <h3 className="text-lg xs:text-xl xl:text-[22px] 2xl:text-[24px] 3xl:text-[26px] mt-3 xs:mt-4 xl:mt-5 2xl:mt-6 3xl:mt-7 font-bold">Contact
                            Us</h3>
                        <div className="text-sm xs:text-base xl:text-lg 2xl:text-xl 3xl:text-[22px]">
                            <p>For questions or support, please contact us at:</p>
                            <p>carsold384@gmail.com</p>
                            <p className="mt-4 xs:mt-5 xl:mt-6 2xl:mt-7 3xl:mt-8">By using CARSOLD, you acknowledge that
                                you have read, understood, and agree to these Terms of use.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer lowerBar={lowerBar}/>
        </div>
    )
}

export default TermsOfUse;