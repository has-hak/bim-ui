import {Route, Switch, withRouter} from "react-router-dom";
import React, {Fragment} from "react";
import SignIn from "./sign/SignIn";
import Router from "../infrastructure/Router";
import Main from "./Main";
import SignUp from "./sign/SignUp";
import LanguageSwitch from "./LanguageSwitch";

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
                        {Router.redirectionToDefault()}
                    </Route>
                </Switch>
            </Fragment>
        )
    }
}


export default withRouter(App)
