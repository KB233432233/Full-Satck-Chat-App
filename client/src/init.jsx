import axios from "axios";

const init = () => {
    let user = JSON.parse(localStorage.getItem('user'));
    axios.defaults.headers.common['Authorization'] = user !== null ? user.token : '';
}

export default init;