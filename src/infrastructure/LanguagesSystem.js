import HttpClient from "./HttpClient";
import {BACKEND_URL} from "../Static";
import {BehaviorSubject, combineLatest, ReplaySubject} from "rxjs";
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
        Object.freeze(messages);
        messagesSubject.next(messages);
    }));

export function getMessage(messageId, languageId) {
    messagesSubject.asObservable().pipe(map(messages => {
        return (messages[messageId] && messages[messageId][languageId]) || `Missing message [${messageId}]`;
    }));
}

export function getCurrentLanguage() {
    return languagesSubject.asObservable().pipe(switchMap(() => currentLanguage.asObservable()));
}

export function getLanguages() {
    return languagesSubject.asObservable();
}

export function getMessages() {
    return combineLatest([getCurrentLanguage(), messagesSubject.asObservable()]).pipe(map(([currentLanguage, messages]) => {
        const currentLanguageMessages = {};
        Object.keys(messages).forEach(messageId => currentLanguageMessages[messageId] = (messages[messageId] && messages[messageId][currentLanguage.id]) || `Missing message [${messageId}]`);
        return currentLanguageMessages;
    }));
}

export function changeCurrentLanguage(languageId) {
    const languages = languagesSubject.getValue();
    const language = languages.find(language => language.id === languageId);
    if (!language) {
        throw new Error("Invalid language id: " + languageId);
    }
    currentLanguage.next(language);
}
