import React from 'react';
import {Route, Switch, withRouter} from "react-router-dom";
import CompilationForm from "./CompilationForm";
import ResourceForm from "./ResourceForm";
import WorkforceForm from "./WorkforceForm";
import MachineForm from "./MachineForm";
import MaterialForm from "./MaterialForm";
import Menu from "./Menu";

function DataImport(props) {
    const match = props.match;

    return (
        <Switch>
            <Route path={`${match.path}`} exact={true}>
                <Menu/>
            </Route>
            <Route path={`${match.path}/compilations`}>
                <CompilationForm/>
            </Route>
            <Route path={`${match.path}/resources`}>
                <ResourceForm/>
            </Route>
            <Route path={`${match.path}/workforces`}>
                <WorkforceForm/>
            </Route>
            <Route path={`${match.path}/machines`}>
                <MachineForm/>
            </Route>
            <Route path={`${match.path}/materials`}>
                <MaterialForm/>
            </Route>
        </Switch>
    );
}

export default withRouter(DataImport)
