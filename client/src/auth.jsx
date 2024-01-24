import axios from 'axios';

const Auth = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = user.token;
}

export default Auth;