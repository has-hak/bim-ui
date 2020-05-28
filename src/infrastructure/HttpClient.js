import * as axios from "axios";
import UserContext from "./UserContext";
import {signInRouting} from "./Router";

function doRequest(requestCallback) {
    const requestPromise = requestCallback(axios)
    if (!requestPromise) {
        throw new Error("Undefined returned from request callback");
    }

    requestPromise.catch
    (error => {
        if (error.response) {
            if (error.response.status === 401) {
                UserContext.signed = false;
                window.location.href = signInRouting;
            }
        }
        console.log(error);
    })


}

export default {doRequest: doRequest};
