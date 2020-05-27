import React from "react";
import "./LanguageSwitch.css";
import {changeCurrentLanguage, getCurrentLanguage, getLanguages} from "../infrastructure/LanguagesSystem";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import LanguageIcon from '@material-ui/icons/Language';

export default class LanguageSwitch extends React.Component {

    destroy = new Subject();

    state = {
        languages: [],
        currentLanguage: {},
    }

    componentDidMount() {
        getLanguages().pipe(takeUntil(this.destroy)).subscribe(languages => {
            this.setState({languages: languages});

            getCurrentLanguage().pipe(takeUntil(this.destroy)).subscribe(currentLanguage => {
                this.setState({
                    currentLanguage: currentLanguage,
                })
            });
        });
    }


    componentWillUnmount() {
        this.destroy.next();
        this.destroy.complete();
    }

    render() {
        const options = this.state.languages.map(language => {
            return <li key={language.id}>
                <div onClick={() => changeCurrentLanguage(language.id)} className={language.name}/>
            </li>
        });

        return (
            <div className="languageSwitcher">
                <div className="lang">
                    <LanguageIcon fontSize={'large'}/>
                    <ul className="dropdown">
                        {options}
                    </ul>
                </div>
            </div>
        )
    }
}
