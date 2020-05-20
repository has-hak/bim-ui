import {Redirect} from "react-router-dom";
import React from "react";

const signInRouting = "/sign-in";
const signUpRouting = "/sign-up";
const defaultRouting = "/main";

function redirectionToDefault() {
    return <Redirect to={defaultRouting}/>;
}

export default {
    defaultRouting: defaultRouting,
    signInRouting: signInRouting,
    signUpRouting: signUpRouting,
    redirectionToDefault: redirectionToDefault
};
