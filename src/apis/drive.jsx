import axiosInstance from "./axiosInstance";

export const getDriveLists = async (path = "") => {
    try {
        const response = await axiosInstance.get(`/microsoft/onedrive/${path}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
