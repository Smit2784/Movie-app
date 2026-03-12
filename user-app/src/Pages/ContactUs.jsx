import React, { useState } from "react";
import { MapPin } from "lucide-react";
import {
    validateName,
    validateEmail,
    validateMinLength,
} from "../utils/validation";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error for the field being edited
        if (fieldErrors[e.target.name]) {
            setFieldErrors({
                ...fieldErrors,
                [e.target.name]: null,
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        const nameError = validateName(formData.name);
        if (nameError) {
            errors.name = nameError;
            isValid = false;
        }

        const emailError = validateEmail(formData.email);
        if (emailError) {
            errors.email = emailError;
            isValid = false;
        }

        const messageError = validateMinLength(formData.message, 10, "Message");
        if (messageError) {
            errors.message = messageError;
            isValid = false;
        }

        if (formData.subject === "") {
            errors.subject = "Please select a subject";
            isValid = false;
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            alert(
                "Thank you for contacting us! We'll get back to you within 24 hours.",
            );
            setFormData({ name: "", email: "", subject: "", message: "" });
            setFieldErrors({});
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50">
            <div className="bg-linear-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400">
                            Contact Us
                        </span>
                    </h1>
                    <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        We're here to help! Reach out to us for any questions,
                        feedback, or support regarding your movie booking
                        experience.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Send us a Message
                            </h2>
                            <p className="text-gray-600">
                                Fill out the form below and we'll get back to
                                you as soon as possible.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border-2 ${fieldErrors.name ? "border-red-500" : "border-gray-200"} rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-300`}
                                        placeholder="Enter your full name"
                                    />
                                    {fieldErrors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {fieldErrors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border-2 ${fieldErrors.email ? "border-red-500" : "border-gray-200"} rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-300`}
                                        placeholder="Enter your email"
                                    />
                                    {fieldErrors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {fieldErrors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border-2 ${fieldErrors.subject ? "border-red-500" : "border-gray-200"} rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-300`}
                                >
                                    <option value="">Select a subject</option>
                                    <option value="booking-support">
                                        Booking Support
                                    </option>
                                    <option value="technical-issue">
                                        Technical Issue
                                    </option>
                                    <option value="payment-inquiry">
                                        Payment Inquiry
                                    </option>
                                    <option value="feedback">Feedback</option>
                                    <option value="partnership">
                                        Partnership
                                    </option>
                                    <option value="other">Other</option>
                                </select>
                                {fieldErrors.subject && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {fieldErrors.subject}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    rows="6"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border-2 ${fieldErrors.message ? "border-red-500" : "border-gray-200"} rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-300 resize-none`}
                                    placeholder="Type your message here..."
                                ></textarea>
                                {fieldErrors.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {fieldErrors.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    "Send Message"
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl shadow-2xl p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                Get in Touch
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-purple-100 p-3 rounded-xl">
                                        <MapPin className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            Our Office
                                        </h4>
                                        <p className="text-gray-600">
                                            123 Movie Street
                                            <br />
                                            Entertainment District
                                            <br />
                                            Surat, Gujarat 395007
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-blue-100 p-3 rounded-xl">
                                        <div className="h-6 w-6 text-blue-600 flex items-center justify-center font-bold">
                                            📧
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            Email Us
                                        </h4>
                                        <p className="text-gray-600">
                                            support@movietix.com
                                            <br />
                                            bookings@movietix.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-green-100 p-3 rounded-xl">
                                        <div className="h-6 w-6 text-green-600 flex items-center justify-center font-bold">
                                            📞
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            Call Us
                                        </h4>
                                        <p className="text-gray-600">
                                            +91 98765 43210
                                            <br />
                                            +91 98765 43211
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-linear-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
                            <h3 className="text-xl font-bold mb-4">
                                Quick Response Guarantee
                            </h3>
                            <p className="text-purple-100">
                                We typically respond to all inquiries within{" "}
                                <strong>24 hours</strong>. For urgent matters,
                                call our helpline for immediate assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
