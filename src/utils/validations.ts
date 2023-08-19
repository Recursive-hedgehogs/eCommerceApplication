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
