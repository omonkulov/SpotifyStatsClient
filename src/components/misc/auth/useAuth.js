import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';


const cookies = new Cookies();

export default function useAuth(code) {

    const [accessToken, setAccessToken] = useState();

    //Login
    useEffect(() => {
        if (code === undefined) return;
        console.log("\t Login Request was sent");
        axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/login', {
            code,
        }).then(res => {
            setAccessToken(res.data.accessToken);
            cookies.set('token', res.data.accessToken);
            cookies.set('refresh', res.data.refreshToken);
            cookies.set('expires', res.data.expiresIn);
            cookies.set('started', new Date().getSeconds());
            window.history.pushState({}, null, '/dashboard');
        }).catch((e) => {//redirect user to back to login page when token expires
            console.log("Login error:  LOGOUT USER WHEN THE TOKEN EXPIRES" + e);
        })
    }, [code])


    return accessToken;
}

