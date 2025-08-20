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