import axiosInstance from "./axiosInstance";

export const getAutomateEmails = async (filter, page, limit, sort) => {
    try {
        const response = await axiosInstance.get(`/microsoft/get/mails/?filter=${filter}&page=${page}&page_size=${limit}&sort=${sort}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const draftAutomateEmails = async (payload) => {
    try {
        const response = await axiosInstance.post(`/microsoft/get/mails/`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};