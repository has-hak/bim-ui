import * as axios from "axios";
import Router from "./Router";
import UserContext from "./UserContext";

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
                window.location.href = Router.signInRouting;
            }
        }
        console.log(error);
    })


}

export default {doRequest: doRequest};
