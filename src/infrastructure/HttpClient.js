import * as axios from "axios";
import UserContext from "./UserContext";

function doRequest(requestCallback) {
    const requestPromise = requestCallback(axios)
    if (!requestPromise) {
        throw new Error("Undefined returned from request callback");
    }

    return requestPromise.then((value) => {
        return value;
    }).catch(error => {
        if (error.response) {
            if (error.response.status === 401) {
                UserContext.killUser();
            }
        }
        throw error;
    })


}

export default {doRequest: doRequest};
