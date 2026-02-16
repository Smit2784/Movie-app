import React, { useState } from "react";
import { useAuth } from "../Contexts/AuthProvider";
import { User, Lock, Save, ArrowLeft } from "lucide-react";
import { validateName, validatePassword } from "../utils/validation";

export const UpdateProfile = ({ onBack }) => {
    const { user, token, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
        setMessage(null);

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

        if (formData.password) {
            const passwordError = validatePassword(formData.password);
            if (passwordError) {
                errors.password = passwordError;
                isValid = false;
            }

            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
                isValid = false;
            }
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload = { name: formData.name };
            if (formData.password) {
                payload.password = formData.password;
            }

            const res = await fetch("http://localhost:5000/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                setMessage("Profile updated successfully!");
                updateUser({ name: formData.name });
                setFormData({ ...formData, password: "", confirmPassword: "" });
                setFieldErrors({});
            } else {
                setError(data.message || "Failed to update profile");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-purple-600 px-6 py-8 text-center relative">
                    <button
                        onClick={onBack}
                        className="absolute left-4 top-4 text-purple-200 hover:text-white transition"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500 mb-4 shadow-lg">
                        <User size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        Update Profile
                    </h2>
                    <p className="text-purple-200 mt-1">{user?.email}</p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center">
                            {message}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`pl-10 block w-full border ${fieldErrors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-purple-500 focus:border-purple-500 transition sm:text-sm p-2.5`}
                                placeholder="Your Name"
                            />
                        </div>
                        {fieldErrors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {fieldErrors.name}
                            </p>
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                            Change Password{" "}
                            <span className="text-xs font-normal normal-case">
                                (Optional)
                            </span>
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`pl-10 block w-full border ${fieldErrors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-purple-500 focus:border-purple-500 transition sm:text-sm p-2.5`}
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                                {fieldErrors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {fieldErrors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`pl-10 block w-full border ${fieldErrors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-purple-500 focus:border-purple-500 transition sm:text-sm p-2.5`}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                {fieldErrors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {fieldErrors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            "Updating..."
                        ) : (
                            <>
                                <Save size={18} className="mr-2" /> Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
