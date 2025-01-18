// Logout checks if you have the specific keys stored in your local storage. 
// If you have then deletes them and redirects to login page.
export function logout () {
    if (localStorage.getItem('role') !== null || localStorage.getItem('email') !== null) {
        localStorage.removeItem('role')
        localStorage.getItem('email')
        window.location.href = '/'
    }
}

export function calculateAge(birthdate) {
    // Split the input string into day, month, and year
    const [day, month, year] = birthdate.split('/').map(Number);
    
    // Create a Date object from the parsed components
    const birthDate = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript

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
    return text.length > 250 ? text.substring(0, 250) + "..." : text;
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

export function convertDateFormat(dateStr) {
    if (dateStr === undefined || dateStr === null) {
        return '';
    }
    // Split the input string into parts
    const [year, month, day] = dateStr.split("-");

    // Return the date in DD/MM/YYYY format
    return `${day}/${month}/${year}`;
}

export function handleScrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function FixedLengthText({ text, length }) {
    // Calculate padding for centering
    const totalPadding = Math.max(length - text.length, 0);
    const paddingStart = Math.floor(totalPadding / 2); // Left padding
    const paddingEnd = totalPadding - paddingStart;   // Right padding
  
    // Create the padded text
    const centeredText = " ".repeat(paddingStart) + text + " ".repeat(paddingEnd);
  
    return (
      <div
        style={{
          whiteSpace: "pre",
          textAlign: "center", // Align within the container
        }}
      >
        {centeredText}
      </div>
    );
};
  