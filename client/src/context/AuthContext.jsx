import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const savedUser = localStorage.getItem('userInfo');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Session Verification Lifecycle (Optional: Keep for token expiry checks)
        const savedUser = localStorage.getItem('userInfo');
        if (savedUser) {
            setUserInfo(JSON.parse(savedUser));
        }
    }, []);

    const login = (data) => {
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUserInfo(data);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
