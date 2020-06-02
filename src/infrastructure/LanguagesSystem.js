import HttpClient from "./HttpClient";
import {BACKEND_URL} from "../Static";
import {combineLatest, ReplaySubject} from "rxjs";
import {map, switchMap, take} from "rxjs/operators";

const languagesSubject = new ReplaySubject(1);
const messagesSubject = new ReplaySubject(1);

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
    languagesSubject.pipe(take(1)).subscribe(languages => {
        const language = languages.find(language => language.id === languageId);
        if (language) {
            currentLanguage.next(language);
        } else {
            console.warn("Invalid language id: " + languageId);
        }
    });
}
