import axiosInstance from '../utils/axiosInterceptor';


export const PostPayment = async (payload) => {
    try {
        // Send the POST request using axiosInstance
        const response = await axiosInstance.post('/api/V1/PostCustomerLoanPayment', payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response;
    } catch (error) {
        console.error("Error occurred during the payment request:", error);
        throw error;
    }
}

