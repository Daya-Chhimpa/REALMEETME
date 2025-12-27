import * as Yup from 'yup';

export const sendOtpSchema = Yup.object().shape({
    mobile: Yup.string()
        .matches(/^(\+91)?[0-9]{10}$/, 'Mobile number must be valid')
        .required('Mobile number is required'),
});

export const verifyOtpSchema = Yup.object().shape({
    mobile: Yup.string()
        .matches(/^(\+91)?[0-9]{10}$/, 'Mobile number must be valid')
        .required('Mobile number is required'),
    otp: Yup.string()
        .length(6, 'OTP must be 6 digits')
        .required('OTP is required'),
});

export const loginSchema = Yup.object().shape({
    mobile: Yup.string()
        .matches(/^(\+91)?[0-9]{10}$/, 'Mobile number must be valid')
        .required('Mobile number is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    otp: Yup.string()
        .length(6, 'OTP must be 6 digits')
        // Making otp optional here initially as login usually doesn't need it unless 2FA But screenshot had it.
        // I'll leave it as non-required if the user might proceed without it or handle it in logic.
        // Actually validation should be strict to the API requirement. If API requires it, it's required.
        // However, UX typically asks for password OR otp. Screenshot shows all 3. I will make it required if the user intends to send all 3.
        // Let's assume for this specific API, if the user fills it, we validate.
        .required('OTP is required'),
});

export const registerSchema = Yup.object().shape({
    mobile: Yup.string()
        .matches(/^(\+91)?[0-9]{10}$/, 'Mobile number must be valid')
        .required('Mobile number is required'),
    name: Yup.string().required('Name is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.string().required('Date of Birth is required'),
    images: Yup.array().of(Yup.string().url('Invalid image URL')),
});
