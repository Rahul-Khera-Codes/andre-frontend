import axiosInstance from "./axiosInstance";

export const getCalandarEvents = async () => {
    try {
        const response = await axiosInstance.get(`/microsoft/calendar/`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getCalandarEventsNotifications = async () => {
    try {
        const response = await axiosInstance.get(`/microsoft/calendar/notification/`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};