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

export const addCalandarEvents = async (payload) => {
    try {
        const response = await axiosInstance.post(`/microsoft/calendar/`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const updateCalandarEvents = async (query, payload) => {
    try {
        const response = await axiosInstance.patch(`/microsoft/calendar/?event_id=${query}`, payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};