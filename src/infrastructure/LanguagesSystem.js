import HttpClient from "./HttpClient";
import {BACKEND_URL} from "../Static";
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {map, switchMap} from "rxjs/operators";

const languagesSubject = new BehaviorSubject([]);
const messagesSubject = new BehaviorSubject({});

const currentLanguage = new ReplaySubject(1);

HttpClient.doRequest(axios => axios.get(`${BACKEND_URL}/api/languages`)
    .then((response) => {
        const responseLanguages = response.data;
        languagesSubject.next(responseLanguages);
        if (responseLanguages.length !== 0) {
            changeCurrentLanguage(responseLanguages[0].id);
        }
    }));


HttpClient.doRequest(axios => axios.get(`${BACKEND_URL}/api/languages/messages`)
    .then((response) => {
        const messages = {};
        response.data.forEach((message) => {
            messages[message.id] = message.values;
        })
        messagesSubject.next(messages);
    }));

export function getMessage(messageId, languageId) {
    messagesSubject.asObservable().pipe(map(messages => {
        return (messages[messageId] && messages[messageId][languageId]) || `Missing message [${messageId}]`;
    }));
}

export function getMessages(messageIds, languageId) {
    return messagesSubject.asObservable().pipe(map(messages => {
        const requiredMessages = {};
        messageIds.forEach(messageId => requiredMessages[messageId] = (messages[messageId] && messages[messageId][languageId]) || `Missing message [${messageId}]`);
        return requiredMessages;
    }));
}

export function getCurrentLanguage() {
    return languagesSubject.asObservable().pipe(switchMap(() => currentLanguage.asObservable()));
}

export function getLanguages() {
    return languagesSubject.asObservable();
}

export function changeCurrentLanguage(languageId) {
    const languages = languagesSubject.getValue();
    const language = languages.find(language => language.id === languageId);
    if (!language) {
        throw new Error("Invalid language id: " + languageId);
    }
    currentLanguage.next(language);
}
