import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import CompilationTable from "./CompilationTable";
import ResourcesTable from "./ResourcesTable";
import MaterialsTable from "./MaterialsTable";
import WorkforcesTable from "./WorkforcesTable";
import MachinesTable from "./MachinesTable";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

function DataView(props) {
    const match = props.match;
    const classes = useStyles();

    const tabUrls = [`${match.url}/compilations`, `${match.url}/resources`, `${match.url}/workforces`, `${match.url}/machines`, `${match.url}/materials`]
    const tabIndex = tabUrls.indexOf(window.location.pathname);

    const [value, setValue] = React.useState(tabIndex === -1 ? 0 : tabIndex);

    if (tabIndex === -1) {
        return (<Redirect to={tabUrls[0]}/>);
    }


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="Compilations"
                         onClick={() => props.history.push(tabUrls[0])}/>
                    <Tab label="Resources"
                         onClick={() => props.history.push(tabUrls[1])}/>
                    <Tab label="Workforces"
                         onClick={() => props.history.push(tabUrls[2])}/>
                    <Tab label="Machines"
                         onClick={() => props.history.push(tabUrls[3])}/>
                    <Tab label="Materials"
                         onClick={() => props.history.push(tabUrls[4])}/>
                </Tabs>
            </AppBar>
            <Switch>
                <Route path={`${match.path}/compilations`}>
                    <CompilationTable/>
                </Route>
                <Route path={`${match.path}/resources`}>
                    <ResourcesTable/>
                </Route>
                <Route path={`${match.path}/workforces`}>
                    <WorkforcesTable/>
                </Route>
                <Route path={`${match.path}/machines`}>
                    <MachinesTable/>
                </Route>
                <Route path={`${match.path}/materials`}>
                    <MaterialsTable/>
                </Route>
            </Switch>
        </div>
    );
}

export default withRouter(DataView);
