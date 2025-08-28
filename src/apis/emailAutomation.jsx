import axiosInstance from "./axiosInstance";

export const getAutomateEmails = async (data) => {
    try {
        const response = await axiosInstance.get(`/microsoft/get/mails/?filter=${data}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const draftAutomateEmails = async (payload) => {
    try {
        const response = await axiosInstance.post(`/microsoft/get/mails/`,payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};