import axiosInstance from "./axiosInstance";


export const summarizeFiles = async (payload, query = "") => {
    try {
        const response = await axiosInstance.post(`/microsoft/summarize/${query}`, payload, {
            headers: {
                'Content-Type': query ? 'application/json' : 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getChatHistory = async (payload = "") => {
    try {
        const response = await axiosInstance.get(`/microsoft/ai/chatbot/history/${payload}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const deleteChatHistory = async (payload = "") => {
    try {
        const response = await axiosInstance.delete(`/microsoft/ai/chatbot/history/${payload}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};