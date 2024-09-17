// utils/dateUtils.js

/**
 * Format a date according to the specified format.
 * @param {Date} date - The date to format.
 * @param {string} format - The format to apply.
 * @returns {string} - The formatted date.
 */
const formatDate = (date, format) => {
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2); // Months are zero-based, so add 1
    const day = (`0${date.getDate()}`).slice(-2); // Ensure two digits for day

    switch (format) {
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'YYYY/MM/DD':
            return `${year}/${month}/${day}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'MM-DD-YYYY':
            return `${month}-${day}-${year}`;
        case 'DD-MM-YYYY':
            return `${day}-${month}-${year}`;
        case 'YYYY.MM.DD':
            return `${year}.${month}.${day}`;
        case 'DD.MM.YYYY':
            return `${day}.${month}.${year}`;
        default:
            return `${year}-${month}-${day}`; // Default format
    }
};

module.exports = { formatDate };
