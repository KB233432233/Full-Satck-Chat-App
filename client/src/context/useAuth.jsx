import { createContext, useContext } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = (({ children }) => {

    const authentication = () => {
        return localStorage.getItem('user') !== null;
    }
    const guest = () => {
        return localStorage.getItem('user') === null;
    }
    const Logout = () => {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('user');
    }

    const setUser = newProfile => {
        let user = JSON.parse(localStorage.getItem('user'));
        newProfile.token = user;
        localStorage.setItem('user', JSON.stringify(newProfile));
    }

    return (
        <AuthContext.Provider value={{ authentication, guest, Logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
});

export const useAuth = () => {
    return useContext(AuthContext);
}
export const getToken = () => {
    let user = JSON.parse(localStorage.getItem('user'));
    return user !== null ? user.token : '';
}