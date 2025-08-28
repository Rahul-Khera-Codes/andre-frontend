import axiosInstance from "./axiosInstance";

export const getAllEvents = async () => {
    try {
        const response = await axiosInstance.get(`/microsoft/dashboard/`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
