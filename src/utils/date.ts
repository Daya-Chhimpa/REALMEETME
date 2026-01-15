export const calculateAge = (dob: string | number | Date | undefined): number | string => {
    if (!dob) return '';

    // If age is already a number (and small enough to be an age, not a timestamp)
    if (typeof dob === 'number') {
        if (dob < 150) return dob;
        // Treat as timestamp
        dob = new Date(dob);
    }

    const birthDate = new Date(dob);
    // Check for invalid date
    if (isNaN(birthDate.getTime())) {
        // If it's a string calculate might have failed, just return it as is or 0
        return dob.toString();
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};
