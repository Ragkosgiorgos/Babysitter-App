// Logout checks if you have the specific keys stored in your local storage. 
// If you have then deletes them and redirects to login page.
export function logout () {
    if (localStorage.getItem('role') !== null || localStorage.getItem('email') !== null) {
        localStorage.removeItem('role')
        localStorage.getItem('email')
        window.location.href = '/'
    }
}

// Calculates the age based on birthdate
export function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
    return age;
};

// Returns the first 150 characters of a text and appends "..." at the end
export function TruncatedText (text) {
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
};

// Decapitalize the first letter of each word
export function decapitalizeWords(str) {
    if (str === undefined || str === null) {
        return '';
    }
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
        .join(" ");
}

// Capitalize the first letter of each word
export function capitalizeWords(str) {
    if (str === undefined || str === null) {
        return '';
    }
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
