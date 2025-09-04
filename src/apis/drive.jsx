import axiosInstance from "./axiosInstance";

export const getDriveLists = async () => {
    try {
        const response = await axiosInstance.get(`/microsoft/onedrive/`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
