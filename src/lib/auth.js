import axios from "axios";
import { API_IP } from "../App";
import Cookie from 'js-cookie'

export const registerUser = (username, email, password) => {
    if (typeof window === "undefined") {
        return;
    }
    return new Promise((resolve, reject) => {
    axios
        .post(`${API_IP}/auth/local/register`, { username, email, password })
        .then((res) => {
            Cookie.set("token", res.data.jwt);

            resolve(res);
        })
        .catch((error) => {
            reject(error);
        });
    });
};
export const login = (identifier, password) => {
    if (typeof window === "undefined") {
        return;
    }

    return new Promise((resolve, reject) => {
        axios
            .post(`${API_IP}/auth/local/`, { identifier, password })
            .then((res) => {
                Cookie.set("token", res.data.jwt);

                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
        });
};
export const logout = () => {
    Cookie.remove("token");
    delete window.__user;

    window.localStorage.setItem("logout", Date.now());
};