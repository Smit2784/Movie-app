import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Database, Globe } from "lucide-react";

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (    
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12 border border-gray-100 relative">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="relative z-10 text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-full mb-6">
                        <Shield className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Your privacy is important to us. Here's a transparent
                        look at how we collect, use, and protect your data.
                    </p>
                    <div className="mt-4 text-sm text-gray-400 font-medium">
                        Last Updated: October 2026
                    </div>
                </div>

                <div className="relative z-10 space-y-10 text-gray-700 leading-relaxed font-light">
                    {/* Section 1 */}
                    <section>
                        <div className="flex items-center mb-4">
                            <Eye className="h-6 w-6 text-indigo-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                1. Information We Collect
                            </h2>
                        </div>
                        <p className="mb-4">
                            When you use MovieTix, we collect information that
                            you voluntarily provide to us, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>
                                <strong>Account Information:</strong> Name,
                                email address, phone number, and password when
                                you register.
                            </li>
                            <li>
                                <strong>Booking Details:</strong> Information
                                related to your movie reservations, seat
                                selections, and showtimes.
                            </li>
                            <li>
                                <strong>Payment Information:</strong> We do not
                                store full credit card numbers. Secure payment
                                processors handle transactions.
                            </li>
                            <li>
                                <strong>Communications:</strong> Any feedback,
                                support requests, or emails you send us.
                            </li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <div className="flex items-center mb-4">
                            <Database className="h-6 w-6 text-indigo-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                2. How We Use Your Data
                            </h2>
                        </div>
                        <p className="mb-4">
                            We use the collected information for various
                            purposes, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>To provide and maintain our Service.</li>
                            <li>
                                To notify you about changes to our Service or
                                your bookings.
                            </li>
                            <li>
                                To allow you to participate in interactive
                                features of our Service.
                            </li>
                            <li>To provide customer support.</li>
                            <li>
                                To send you transactional emails (like booking
                                confirmations and password reset OTPs).
                            </li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <div className="flex items-center mb-4">
                            <Lock className="h-6 w-6 text-indigo-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                3. Data Security
                            </h2>
                        </div>
                        <p>
                            We value your trust in providing us your Personal
                            Information, thus we are striving to use
                            commercially acceptable means of protecting it. But
                            remember that no method of transmission over the
                            internet, or method of electronic storage is 100%
                            secure and reliable, and we cannot guarantee its
                            absolute security. We encrypt sensitive data like
                            passwords and use industry-standard security
                            measures.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <div className="flex items-center mb-4">
                            <Globe className="h-6 w-6 text-indigo-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                4. Third-Party Services
                            </h2>
                        </div>
                        <p>
                            We employ third-party companies and individuals to
                            facilitate our Service, to provide the Service on
                            our behalf, to perform Service-related services or
                            to assist us in analyzing how our Service is used.
                            These third parties have access to your Personal
                            Information only to perform these tasks on our
                            behalf and are obligated not to disclose or use it
                            for any other purpose.
                        </p>
                    </section>

                    <hr className="my-8 border-gray-100" />

                    <div className="bg-indigo-50 rounded-2xl p-6 md:p-8 text-center">
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">
                            Questions about our Privacy Policy?
                        </h3>
                        <p className="text-indigo-700 mb-6">
                            If you have any questions or suggestions, do not
                            hesitate to contact us.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
