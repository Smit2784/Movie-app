import React, { useState } from "react";
import { Tag, Ticket, Zap, Clock, Check } from "lucide-react";

const LatestOffers = () => {
    const [copiedCode, setCopiedCode] = useState(null);

    const offers = [
        {
            id: 1,
            title: "50% Off on Weekend Premiere",
            description:
                "Get flat 50% discount on tickets for all blockbuster movies playing this weekend.",
            code: "WEEKEND50",
            icon: <Ticket className="text-purple-600 w-8 h-8" />,
            bgColor: "bg-linear-to-r from-purple-500 to-indigo-500",
            iconBg: "bg-purple-100",
            validUntil: "Valid till Sunday, 11:59 PM",
        },
        {
            id: 2,
            title: "Buy 1 Get 1 Free on Snacks",
            description:
                "Pre-book your snacks directly from the app and get a combo meal absolutely free.",
            code: "SNACKBOGO",
            icon: <Zap className="text-orange-600 w-8 h-8" />,
            bgColor: "bg-linear-to-r from-orange-400 to-red-500",
            iconBg: "bg-orange-100",
            validUntil: "Valid on all days",
        },
        {
            id: 3,
            title: "Early Bird Discount",
            description:
                "Book morning shows before 11 AM and get an instant 20% off on your total booking value.",
            code: "EARLY20",
            icon: <Clock className="text-blue-600 w-8 h-8" />,
            bgColor: "bg-linear-to-r from-cyan-400 to-blue-500",
            iconBg: "bg-blue-100",
            validUntil: "Valid for morning shows only",
        },
    ];

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50">
            <div className="bg-linear-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
                <div className="container mx-auto px-6 text-center animate-fade-in-up">
                    <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight flex justify-center items-center gap-4">
                        <Tag className="text-pink-400 w-10 h-10 lg:w-12 lg:h-12" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400">
                            Latest Offers
                        </span>
                    </h1>
                    <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Exclusive deals curated just for you. Apply the promo
                        code during checkout to unlock these amazing discounts.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offers.map((offer, index) => (
                        <div
                            key={offer.id}
                            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 border border-gray-100 flex flex-col"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div
                                className={`h-2 w-full ${offer.bgColor}`}
                            ></div>

                            <div className="p-8 flex flex-col grow">
                                <div className="flex justify-between items-start mb-6">
                                    <div
                                        className={`p-4 rounded-2xl ${offer.iconBg} shadow-inner`}
                                    >
                                        {offer.icon}
                                    </div>
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 uppercase tracking-wider shadow-sm">
                                        {offer.validUntil}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                                    {offer.title}
                                </h3>
                                <p className="text-gray-600 mb-10 grow font-medium leading-relaxed">
                                    {offer.description}
                                </p>
                                <div className="mt-auto">
                                    <div className="relative p-1 rounded-2xl bg-gray-50 border border-gray-200">
                                        <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl shadow-sm">
                                            <div className="font-mono font-bold text-lg tracking-widest text-gray-800">
                                                {offer.code}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleCopyCode(offer.code)
                                                }
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                                                    copiedCode === offer.code
                                                        ? "bg-green-500 text-white"
                                                        : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
                                                }`}
                                            >
                                                {copiedCode === offer.code ? (
                                                    <>
                                                        <Check size={16} />{" "}
                                                        Copied!
                                                    </>
                                                ) : (
                                                    "Copy Code"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center px-6">
                    <div className="inline-flex flex-col items-center justify-center p-8 rounded-3xl bg-white shadow-xl max-w-2xl border border-gray-100">
                        <div className="w-16 h-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-full mb-6"></div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            More surprises on the way!
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Keep checking this space for festival specials,
                            early access passes, and exclusive member discounts.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default LatestOffers;
