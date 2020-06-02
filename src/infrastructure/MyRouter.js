import {BrowserRouter, Redirect} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import React from "react";

export const history = createBrowserHistory();
export const signInRouting = "/sign-in";
export const signUpRouting = "/sign-up";
export const defaultRouting = "/main";

export function redirectionToDefault() {
    return <Redirect to={defaultRouting}/>;
}

export default class MyRouter extends BrowserRouter {
    history = history;
}
