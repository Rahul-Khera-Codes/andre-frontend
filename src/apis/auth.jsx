import axiosInstance from "./axiosInstance";

export const authLogin = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/v1/auth/login", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const authRegister = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/v1/auth/register", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const authPasswordChange = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/v1/auth/password-change", payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};
