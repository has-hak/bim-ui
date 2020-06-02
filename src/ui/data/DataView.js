import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import CompilationTable from "./CompilationTable";
import ResourcesTable from "./ResourcesTable";
import MaterialsTable from "./MaterialsTable";
import WorkforcesTable from "./WorkforcesTable";
import MachinesTable from "./MachinesTable";
import {withStyles} from "@material-ui/core";
import {getMessages} from "../../infrastructure/LanguagesSystem";

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    drawer: {}
});

class DataView extends React.Component {

    messagesSubscription;

    state = {
        messages: {}
    }

    componentDidMount() {
        this.messagesSubscription = getMessages().subscribe(messages => {
            this.setState({messages: messages})
        });
    }

    componentWillUnmount() {
        this.messagesSubscription.unsubscribe();
    }

    render() {
        const props = this.props;
        const {classes, match} = props;

        const tabUrls = this.buildTabUrls(match.url)
        const tabIndex = tabUrls.indexOf(window.location.pathname);

        if (tabIndex === -1) {
            return (<Redirect to={`${match.url}/compilations`}/>);
        }

        return (
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={tabIndex}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                    >
                        <Tab label={this.state.messages['compilations']}
                             onClick={() => props.history.push(tabUrls[0])}/>
                        <Tab label={this.state.messages['resources']}
                             onClick={() => props.history.push(tabUrls[1])}/>
                        <Tab label={this.state.messages['workforces']}
                             onClick={() => props.history.push(tabUrls[2])}/>
                        <Tab label={this.state.messages['machines']}
                             onClick={() => props.history.push(tabUrls[3])}/>
                        <Tab label={this.state.messages['materials']}
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

    getCurrentTabIndex(parentUrl) {
        const tabUrls = this.buildTabUrls(parentUrl);
        return tabUrls.indexOf(window.location.pathname);
    }

    buildTabUrls(parentUrl) {
        return [`${parentUrl}/compilations`, `${parentUrl}/resources`, `${parentUrl}/workforces`, `${parentUrl}/machines`, `${parentUrl}/materials`];
    }
}

export default withRouter(withStyles(useStyles)(DataView));
