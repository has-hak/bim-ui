import {Route, Switch, withRouter} from "react-router-dom";
import React from "react";
import SignIn from "./SignIn";
import Router from "./Router";
import Main from "./Main";
import SignUp from "./SignUp";

class App extends React.Component {

    state = {
        drawerOpen: true
    }

    render() {
        return (
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
        )
    }
}


export default withRouter(App)