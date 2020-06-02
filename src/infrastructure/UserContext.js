import {BACKEND_URL} from "../Static";
import * as axios from "axios";
import {defaultRouting, history, signInRouting} from "./MyRouter";
import {BehaviorSubject, combineLatest} from "rxjs";
import HttpClient from "./HttpClient";
import {changeCurrentLanguage, getCurrentLanguage, getLanguages} from "./LanguagesSystem";
import User from "./User";
import {take} from "rxjs/operators";

const currentUser = new BehaviorSubject(User.getGuest());

function register(data) {
    axios.post(`${BACKEND_URL}/api/registration`, data).then(response => {
        if (response.status === 200) {
            history.push(signInRouting);
        }
    });
}

function login(credentials) {
    fetch(`${BACKEND_URL}/api/login`, {
        credentials: 'include',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    }).then(() => fetchUser()).then(() => history.push(defaultRouting));
}

function logout() {
    fetch(`${BACKEND_URL}/api/logout`, {
        method: 'post',
    }).then(() => {
        currentUser.next(User.getGuest());
        history.push(signInRouting);
    });
}

function killUser() {
    history.push(signInRouting);
    currentUser.next(User.getGuest());
}

function listenCurrentUser() {
    return currentUser.asObservable();
}

function getCurrentUser() {
    return listenCurrentUser().pipe(take(1));
}

function fetchUser() {
    return HttpClient.doRequest(axios => axios.get(`${BACKEND_URL}/api/users/me`)
        .then((response) => {
            const user = response.data;
            currentUser.next(new User(user.id, user.email, user.name, user.roles, user.preferences));
        }));
}

setTimeout(() => fetchUser(), 10);

combineLatest([listenCurrentUser(), getLanguages()]).subscribe(([currentUser, languages]) => {
    if (currentUser.isReal()) {
        changeCurrentLanguage(currentUser.preferences.languageId);
    }
})

combineLatest([listenCurrentUser(), getCurrentLanguage()]).subscribe(([currentUser, language]) => {
    if (currentUser.isReal()) {
        HttpClient.doRequest(axios => axios.put(`${BACKEND_URL}/api/users/me/preferences`, {languageId: language.id}));
    }
})

export default {
    register: register,
    login: login,
    logout: logout,
    listenCurrentUser: listenCurrentUser,
    getCurrentUser: getCurrentUser,
    killUser : killUser
};

