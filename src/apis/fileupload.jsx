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

export const getSummarizeFiles = async () => {
    try {
        const response = await axiosInstance.get(`/microsoft/summarize/`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};