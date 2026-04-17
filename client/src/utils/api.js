import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // This works because of the proxy in vite.config.js
});

// Add Interceptor to attach token to every request
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add Interceptor to handle Token Failures (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Only logout if the request was to a sensitive endpoint or if we're sure the session is dead
            const isAuthRequest = error.config.url.includes('/users/profile') || error.config.url.includes('/orders');
            if (isAuthRequest) {
                localStorage.removeItem('userInfo');
                // No window.location.href here to let components handle it gracefully or redirect via useEffect
            }
        }
        return Promise.reject(error);
    }
);

export default api;
