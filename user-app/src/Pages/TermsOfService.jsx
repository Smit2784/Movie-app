import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12 border border-gray-100 relative">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="relative z-10 text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-6">
                        <FileText className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Please read these terms carefully before using our movie
                        booking platform.
                    </p>
                    <div className="mt-4 text-sm text-gray-400 font-medium">
                        Last Updated: October 2026
                    </div>
                </div>

                <div className="relative z-10 space-y-10 text-gray-700 leading-relaxed font-light">
                    <section>
                        <div className="flex items-center mb-4">
                            <CheckCircle className="h-6 w-6 text-blue-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                1. Acceptance of Terms
                            </h2>
                        </div>
                        <p>
                            By accessing and using MovieTix (the "Service"), you
                            accept and agree to be bound by the terms and
                            provision of this agreement. In addition, when using
                            these particular services, you shall be subject to
                            any posted guidelines or rules applicable to such
                            services.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center mb-4">
                            <AlertCircle className="h-6 w-6 text-blue-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                2. User Accounts
                            </h2>
                        </div>
                        <p className="mb-4">
                            To use certain features of the Service (e.g.,
                            booking tickets), you must register for an account.
                            You agree to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>
                                Provide accurate, current, and complete
                                information as prompted by the registration
                                form.
                            </li>
                            <li>
                                Maintain and promptly update your information to
                                keep it accurate and complete.
                            </li>
                            <li>
                                Maintain the security of your password and
                                identification.
                            </li>
                            <li>
                                Accept all responsibility for any and all
                                activities that occur under your account.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center mb-4">
                            <CheckCircle className="h-6 w-6 text-blue-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                3. Bookings and Payments
                            </h2>
                        </div>
                        <p className="mb-4">
                            All ticket bookings are subject to availability. By
                            completing a booking, you agree to pay the total
                            amount specified, including any applicable taxes or
                            convenience fees.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>
                                Tickets purchased are non-transferable unless
                                explicitly stated.
                            </li>
                            <li>
                                Cancellations and refunds are subject to our
                                refund policy and the policies of the respective
                                theaters.
                            </li>
                            <li>
                                We reserve the right to cancel any booking if
                                fraudulent activity is suspected.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center mb-4">
                            <AlertCircle className="h-6 w-6 text-blue-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                4. Prohibited Conduct
                            </h2>
                        </div>
                        <p className="mb-4">
                            You agree not to use the Service to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>
                                Violate any local, state, national, or
                                international law.
                            </li>
                            <li>
                                Interfere with or disrupt the Service or servers
                                or networks connected to the Service.
                            </li>
                            <li>
                                Attempt to gain unauthorized access to our
                                computer systems or engage in any activity that
                                disrupts, diminishes the quality of, interferes
                                with the performance of, or impairs the
                                functionality of, the Service.
                            </li>
                            <li>
                                Resell tickets acquired through the Service
                                without authorization.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center mb-4">
                            <HelpCircle className="h-6 w-6 text-blue-500 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                5. Modifications to Service
                            </h2>
                        </div>
                        <p>
                            MovieTix reserves the right at any time and from
                            time to time to modify or discontinue, temporarily
                            or permanently, the Service (or any part thereof)
                            with or without notice. You agree that MovieTix
                            shall not be liable to you or to any third party for
                            any modification, suspension, or discontinuance of
                            the Service.
                        </p>
                    </section>

                    <hr className="my-8 border-gray-100" />

                    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 text-center border border-gray-200">
                        <p className="text-gray-600 mb-0">
                            These Terms of Service constitute the entire
                            agreement between you and MovieTix. If you have any
                            questions, please {" "}
                            <Link
                                to="/contact"
                                className="text-blue-600 hover:underline font-semibold"
                            >
                                Contact Us
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
