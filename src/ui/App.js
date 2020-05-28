import {Route, Switch, withRouter} from "react-router-dom";
import React, {Fragment} from "react";
import SignIn from "./sign/SignIn";
import Main from "./Main";
import SignUp from "./sign/SignUp";
import LanguageSwitch from "./LanguageSwitch";
import {redirectionToDefault} from "../infrastructure/Router";

class App extends React.Component {

    render() {
        return (
            <Fragment>
                <LanguageSwitch/>
                <Switch>
                    <Route path="/sign-up">
                        <SignUp/>
                    </Route>
                    <Route path="/sign-in">
                        <SignIn/>
                    </Route>
                    <Route path="/main">
                        <Main/>
                    </Route>
                    <Route path='*' exact={true}>
                        {redirectionToDefault()}
                    </Route>
                </Switch>
            </Fragment>
        )
    }
}


export default withRouter(App)
