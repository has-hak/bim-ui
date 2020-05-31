import * as axios from "axios";
import UserContext from "./UserContext";
import {signInRouting} from "./Router";

function doRequest(requestCallback) {
    const requestPromise = requestCallback(axios)
    if (!requestPromise) {
        throw new Error("Undefined returned from request callback");
    }

    return requestPromise.catch(error => {
        if (error.response) {
            if (error.response.status === 401) {
                UserContext.signed = false;
                window.location.href = signInRouting;
            }
        }
        throw error;
    })


}

export default {doRequest: doRequest};
