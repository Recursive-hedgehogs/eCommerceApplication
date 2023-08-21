export const validateEmail = (s: string): string | null => {
    const hasNoSpaces = /^\S+$/.test(s);
    if (!hasNoSpaces) {
        return 'Email should not contain spaces';
    }

    const hasAtSymbol = /@/.test(s);
    if (!hasAtSymbol) {
        return "Email should contain an '@' symbol";
    }

    const hasValidDomain = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/.test(s.split('@')[1]);
    if (!hasValidDomain) {
        return 'Invalid domain in the email address';
    }

    // If all checks passed, return null to indicate no error
    return null;
};

export const validatePassword = (password: string): string | null => {
    const minLength = 8;
    if (password.length < minLength) {
        return `Password should be at least ${minLength} characters long`;
    }

    const hasUppercase = /[A-Z]/.test(password);
    if (!hasUppercase) {
        return 'Password should contain at least one uppercase letter';
    }

    const hasLowercase = /[a-z]/.test(password);
    if (!hasLowercase) {
        return 'Password should contain at least one lowercase letter';
    }

    const hasDigit = /\d/.test(password);
    if (!hasDigit) {
        return 'Password should contain at least one digit';
    }

    const hasSpecialCharacter = /[!@#$%^&*]/.test(password);
    if (!hasSpecialCharacter) {
        return 'Password should contain at least one special character';
    }

    const hasNoWhitespace = /^\S+$/.test(password);
    if (!hasNoWhitespace) {
        return 'Password should not contain whitespaces';
    }

    // If all checks passed, return null to indicate no error
    return null;
};

export const validateName = (userName: string): string | null => {
    const hasValidCharacters = /^[A-Za-zА-Яа-яЁё]+$/.test(userName);
    const hasAtLeastOneCharacter = userName.length > 0;
    if (!hasAtLeastOneCharacter) {
        return 'Name should contain at least one character';
    } else if (!hasValidCharacters) {
        return 'Name should only contain letters';
    }
    // If all checks passed, return null to indicate no error
    return null;
};

export const validateDateOfBirth = (dateBirth: string): string | null => {
    const currentDate = new Date();
    const inputDate = new Date(dateBirth);

    // Calculate the user's age in years
    const ageInMilliseconds = currentDate.getTime() - inputDate.getTime();
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

    // Check if the input is a valid date
    if (ageInYears > 110) {
        return 'Invalid date';
    }

    const minAge = 13;
    if (ageInYears < minAge) {
        return `You must be at least ${minAge} years old`;
    }

    // If all checks passed, return null to indicate no error
    return null;
};

export const validatePostalCode = (code: string): string | null => {
    const validPattern = /^[0-9-]+$/;

    if (!validPattern.test(code)) {
        return 'Postal code should contain only digits and dashes';
    }

    return null;
};
