import {Route, Switch, withRouter} from "react-router-dom";
import React from "react";
import DataView from "./DataView";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import StorageIcon from '@material-ui/icons/Storage';
import DescriptionIcon from '@material-ui/icons/Description';
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import OutlayForm from "./OutlayForm";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import UserContext from "./UserContext";

class Main extends React.Component {

    state = {
        drawerOpen: true
    }

    render() {
        const {classes, match} = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: this.state.drawerOpen,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={() => this.setState({drawerOpen: true})}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: this.state.drawerOpen,
                            })}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <div>
                            <Button aria-controls="simple-menu" aria-haspopup="true" variant="contained"
                                    color="secondary" onClick={UserContext.logout}>
                                Logout
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: this.state.drawerOpen,
                        [classes.drawerClose]: !this.state.drawerOpen,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: this.state.drawerOpen,
                            [classes.drawerClose]: !this.state.drawerOpen,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={() => this.setState({drawerOpen: false})}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        <ListItem button key={'Data View'}
                                  onClick={() => this.props.history.push(`${match.url}/data-view`)}>
                            <ListItemIcon><StorageIcon/></ListItemIcon>
                            <ListItemText primary={'Data View'}/>
                        </ListItem>
                        <ListItem button key={'Outlay Calculation'}
                                  onClick={() => this.props.history.push(`${match.url}/outlay-form`)}>
                            <ListItemIcon><DescriptionIcon/></ListItemIcon>
                            <ListItemText primary={'Outlay Calculation'}/>
                        </ListItem>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>

                    <Switch>
                        <Route path={`${match.path}/data-view`}>
                            <DataView/>
                        </Route>
                        <Route path={`${match.path}/outlay-form`}>
                            <OutlayForm/>
                        </Route>
                    </Switch>
                </main>
            </div>
        )
    }
}

const drawerWidth = 240;

const useStyles = (theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
});

export default withRouter(withStyles(useStyles)(Main))
