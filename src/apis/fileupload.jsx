import axiosInstance from "./axiosInstance";


export const summarizeFiles = async (payload) => {
    try {
        const response = await axiosInstance.post(`/microsoft/summarize/`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};