import {BACKEND_URL} from "../Static";
import * as axios from "axios";
import Router from "./Router";

const context = {
    signed: false
}

function register(data) {
    axios.post(`${BACKEND_URL}/api/registration`, data).then(response => {
        if (response.status === 200) {
            window.location.href = Router.signInRouting;
        }
    });
}

function login(credentials) {
    fetch(`${BACKEND_URL}/api/login`, {
        credentials: 'include',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    }).then(response => {
        if (response.status === 200) {
            context.signed = true;
            window.location.href = Router.defaultRouting;
        }
    });
}

function logout() {
    return axios.post(`${BACKEND_URL}/api/logout`)
        .catch(() => {
        })
        .then(() => {
            context.signed = false;
            window.location.href = Router.signInRouting;
        })
}

context.register = register
context.login = login
context.logout = logout

export default context;
