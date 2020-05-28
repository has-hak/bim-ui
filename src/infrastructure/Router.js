import {Redirect} from "react-router-dom";
import React from "react";

export const signInRouting = "/sign-in";
export const signUpRouting = "/sign-up";
export const defaultRouting = "/main";
export const dataImportRouting = "/main/data-import";

export function redirectionToDefault() {
    return <Redirect to={defaultRouting}/>;
}
