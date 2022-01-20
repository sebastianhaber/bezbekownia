import axios from "axios";
import { API_IP } from "../App";
import Cookie from 'js-cookie'
import Cookies from "js-cookie";

export const registerUser = (username, email, password) => {
    if (typeof window === "undefined") {
        return;
    }
    return new Promise((resolve, reject) => {
    axios
        .post(`${API_IP}/auth/local/register`, { username, email, password })
        .then((res) => {
            Cookies.set("token", res.data.jwt, {
                path: "/",
                expires: 3600*1000,
                // secure: true,
            });

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
            .post(`/auth/local/`, { identifier, password })
            .then((res) => {
                Cookies.set("token", res.data.jwt, {
                    path: "/",
                    expires: 3600*1000,
                    // secure: true,
                });
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
export const deleteComment = (id) => {
    if (typeof window === "undefined") {
        return;
    }
    const token = Cookie.get("token");

    return new Promise((resolve, reject) => {
        axios
            .delete(`${API_IP}/comments/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                resolve(res);
                return true;
            })
            .catch((error) => {
                reject(error);
            });
        });
};
export const postComment = (id, message) => {
    if (typeof window === "undefined") {
        return;
    }
    const token = Cookie.get("token");
    return new Promise((resolve, reject) => {
        axios
            .post(`${API_IP}/posts/${id}/comment`, {
                message: message
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
        });
};
export const addLike = (postId, userId) => {
    if (typeof window === "undefined") {
        return;
    }
    const token = Cookie.get("token");
    return new Promise((resolve, reject) => {
        axios
            .post(`${API_IP}/likes`, {
                post: postId,
                user: userId,
                value: 1
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
        });
};
export const removeLike = (likeId) => {
    if (typeof window === "undefined") {
        return;
    }
    const token = Cookie.get("token");

    return new Promise((resolve, reject) => {
        axios
            .delete(`${API_IP}/likes/${likeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
        });
};