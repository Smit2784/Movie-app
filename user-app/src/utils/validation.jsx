export const validateName = (name) => {
    // Check if name is empty
    if (!name || name.trim() === "") {
        return "Name is required";
    }

    // Check for length
    if (name.length < 2) {
        return "Name must be at least 2 characters long";
    }

    // Check for numbers
    if (/\d/.test(name)) {
        return "Name cannot contain numbers";
    }

    return null; // Valid
};

export const validatePhone = (phone) => {
    // Check if phone is empty
    if (!phone || phone.trim() === "") {
        return "Phone number is required";
    }

    // Check for 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return "Phone number must be exactly 10 digits";
    }

    // Check for all same numbers (e.g., 9999999999)
    if (/^(\d)\1+$/.test(phone)) {
        return "Phone number cannot be all same digits";
    }

    return null; // Valid
};

export const validateEmail = (email) => {
    // Check if email is empty
    if (!email || email.trim() === "") {
        return "Email is required";
    }

    // Standard email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address";
    }

    return null; // Valid
};

export const validatePassword = (password) => {
    // Check if password is empty
    if (!password || password === "") {
        return "Password is required";
    }

    // Check for length
    if (password.length < 6) {
        return "Password must be at least 6 characters long";
    }

    return null; // Valid
};

export const validateCardNumber = (number) => {
    // Check if card number is empty
    if (!number || number.trim() === "") {
        return "Card number is required";
    }

    // Remove spaces
    const cleanNumber = number.replace(/\s/g, "");

    // Check for 16 digits
    if (!/^\d{16}$/.test(cleanNumber)) {
        return "Card number must be 16 digits";
    }

    return null; // Valid
};

export const validateCVV = (cvv) => {
    // Check if CVV is empty
    if (!cvv || cvv.trim() === "") {
        return "CVV is required";
    }

    // Check for 3 or 4 digits
    if (!/^\d{3,4}$/.test(cvv)) {
        return "CVV must be 3 or 4 digits";
    }

    return null; // Valid
};

export const validateUPI = (upiId) => {
    // Check if UPI ID is empty
    if (!upiId || upiId.trim() === "") {
        return "UPI ID is required";
    }

    // Check for @ symbol
    if (!upiId.includes("@")) {
        return "Invalid UPI ID (must contain @)";
    }

    return null; // Valid
};

export const validateMinLength = (text, min, fieldName = "Field") => {
    if (!text || text.trim() === "") {
        return `${fieldName} is required`;
    }

    if (text.length < min) {
        return `${fieldName} must be at least ${min} characters long`;
    }

    return null;
};

export const validatePositiveNumber = (value, fieldName = "Field") => {
    if (value === "" || value === null || value === undefined) {
        return `${fieldName} is required`;
    }

    if (Number(value) < 0) {
        return `${fieldName} cannot be negative`;
    }

    return null;
};

export const validateExpiry = (expiry) => {
    if (!expiry || expiry.trim() === "") {
        return "Expiry date is required";
    }

    // Check format MM/YY
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) {
        return "Expiry must be in MM/YY format";
    }

    // Check if expired
    const [month, year] = expiry.split("/");
    const expDate = new Date(2000 + parseInt(year), parseInt(month));
    if (expDate < new Date()) {
        return "Card has expired";
    }

    return null;
};

export const validateCardholderName = (name) => {
    if (!name || name.trim() === "") {
        return "Cardholder name is required";
    }

    if (name.trim().length < 3) {
        return "Name must be at least 3 characters";
    }

    if (/\d/.test(name)) {
        return "Name cannot contain numbers";
    }

    return null;
};

export const validateBankSelection = (bank) => {
    if (!bank || bank === "") {
        return "Please select a bank";
    }
    return null;
};

export const validateAccountNumber = (accNum) => {
    if (!accNum || accNum.trim() === "") {
        return "Account number is required";
    }

    const clean = accNum.replace(/\s/g, "");
    if (!/^\d{9,18}$/.test(clean)) {
        return "Account number must be 9-18 digits";
    }

    return null;
};
