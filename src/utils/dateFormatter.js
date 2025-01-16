export const formatDate = (dateString) => {
    try {
        const [day, month, year] = dateString.split('/');  
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; 
    } catch (error) {
        return null; // Return null if date is invalid
    }
};
